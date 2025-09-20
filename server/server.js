const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
const XLSX = require('xlsx');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'response-hub-data';

// In-memory storage for development (replace with database in production)
let impactedPersons = [];
let latestNews = [];
let currentIssues = [];

// Utility function to generate Excel file
const generateExcelFile = (data, sheetName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

// Utility function to upload to S3
const uploadToS3 = async (buffer, key, contentType) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read'
  };
  
  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

// API Routes

// Get all impacted persons
app.get('/api/impacted-persons', (req, res) => {
  res.json({
    success: true,
    data: impactedPersons,
    count: impactedPersons.length
  });
});

// Create new impacted person
app.post('/api/impacted-persons', (req, res) => {
  try {
    const newPerson = {
      id: Date.now(),
      ...req.body,
      dateReported: new Date().toISOString().split('T')[0]
    };
    
    impactedPersons.push(newPerson);
    
    // Generate and upload Excel file to S3
    generateAndUploadExcel();
    
    res.json({
      success: true,
      data: newPerson,
      message: 'Person added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding person',
      error: error.message
    });
  }
});

// Update impacted person
app.put('/api/impacted-persons/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const personIndex = impactedPersons.findIndex(p => p.id === id);
    
    if (personIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Person not found'
      });
    }
    
    impactedPersons[personIndex] = { ...impactedPersons[personIndex], ...req.body };
    
    // Generate and upload Excel file to S3
    generateAndUploadExcel();
    
    res.json({
      success: true,
      data: impactedPersons[personIndex],
      message: 'Person updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating person',
      error: error.message
    });
  }
});

// Delete impacted person
app.delete('/api/impacted-persons/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const personIndex = impactedPersons.findIndex(p => p.id === id);
    
    if (personIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Person not found'
      });
    }
    
    impactedPersons.splice(personIndex, 1);
    
    // Generate and upload Excel file to S3
    generateAndUploadExcel();
    
    res.json({
      success: true,
      message: 'Person deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting person',
      error: error.message
    });
  }
});

// Bulk update impacted persons (for client sync)
app.put('/api/impacted-persons/bulk', (req, res) => {
  try {
    const { persons } = req.body;
    
    if (!Array.isArray(persons)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format'
      });
    }
    
    impactedPersons = persons;
    
    // Generate and upload Excel file to S3
    generateAndUploadExcel();
    
    res.json({
      success: true,
      data: impactedPersons,
      message: 'Data synchronized successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error synchronizing data',
      error: error.message
    });
  }
});

// Get Excel file URL from S3
app.get('/api/impacted-persons/excel', (req, res) => {
  try {
    const key = 'impacted-persons.xlsx';
    const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    
    res.json({
      success: true,
      url: url,
      message: 'Excel file URL retrieved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting Excel file URL',
      error: error.message
    });
  }
});

// Generate and upload Excel file to S3
const generateAndUploadExcel = async () => {
  try {
    const excelBuffer = generateExcelFile(impactedPersons, 'Impacted Persons');
    const key = 'impacted-persons.xlsx';
    const url = await uploadToS3(excelBuffer, key, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    console.log('Excel file uploaded to S3:', url);
  } catch (error) {
    console.error('Error generating/uploading Excel file:', error);
  }
};

// Get all news
app.get('/api/news', (req, res) => {
  res.json({
    success: true,
    data: latestNews,
    count: latestNews.length
  });
});

// Update news
app.put('/api/news/bulk', (req, res) => {
  try {
    const { news } = req.body;
    
    if (!Array.isArray(news)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format'
      });
    }
    
    latestNews = news;
    
    res.json({
      success: true,
      data: latestNews,
      message: 'News synchronized successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error synchronizing news',
      error: error.message
    });
  }
});

// Get all issues
app.get('/api/issues', (req, res) => {
  res.json({
    success: true,
    data: currentIssues,
    count: currentIssues.length
  });
});

// Update issues
app.put('/api/issues/bulk', (req, res) => {
  try {
    const { issues } = req.body;
    
    if (!Array.isArray(issues)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format'
      });
    }
    
    currentIssues = issues;
    
    res.json({
      success: true,
      data: currentIssues,
      message: 'Issues synchronized successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error synchronizing issues',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});
