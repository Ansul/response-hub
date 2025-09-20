# Response Hub - Real-time Data Management System

A comprehensive React-based dashboard for monitoring critical issues and managing impacted persons with real-time server synchronization and S3 storage.

## 🚀 Features

### Core Functionality
- **Real-time Data Sync** - Automatic synchronization with server and other users
- **S3 Integration** - Excel files automatically generated and stored in AWS S3
- **Offline Support** - Works offline with local storage, syncs when online
- **CRUD Operations** - Full Create, Read, Update, Delete functionality
- **Data Persistence** - Changes saved locally and to server
- **Excel Export** - Download data as Excel files from S3

### User Interface
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Sticky Header** - Shrinks on scroll for better space utilization
- **Real-time Status** - Shows sync status and connection state
- **Interactive Tables** - Inline editing with validation
- **Search & Filter** - Advanced filtering and search capabilities
- **Modern UI** - Clean, professional interface with smooth animations

### Data Management
- **Impacted Persons Registry** - Manage person records with full details
- **Latest News Section** - Display and manage news updates
- **Issues Bulletin** - Track and categorize critical issues
- **Data Export** - Export to Excel or JSON formats
- **Bulk Operations** - Clear all data with confirmation

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **CSS3** with responsive design and animations
- **Local Storage** for offline data persistence
- **API Service** for server communication

### Backend (Node.js + Express)
- **Express.js** REST API server
- **AWS S3** integration for file storage
- **Excel Generation** using XLSX library
- **CORS** enabled for cross-origin requests
- **Error Handling** with comprehensive logging

### Data Flow
1. **Client** makes changes to data
2. **Local Storage** saves changes immediately
3. **API Service** syncs with server (if online)
4. **Server** processes and validates data
5. **S3** stores Excel file automatically
6. **Other Clients** receive updates in real-time

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- AWS Account with S3 access
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd responsehub
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run server:install
   ```

3. **Configure environment**
   ```bash
   # Copy server environment file
   cp server/env.example server/.env
   
   # Edit server/.env with your AWS credentials
   # See SERVER_SETUP.md for detailed instructions
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately
   npm start              # Frontend only
   npm run server:dev     # Backend only
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

#### Backend (server/.env)
```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=response-hub-data

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### AWS S3 Setup
1. Create S3 bucket: `response-hub-data`
2. Configure bucket permissions for public read access
3. Create IAM user with S3 access
4. Add credentials to server/.env

See [SERVER_SETUP.md](SERVER_SETUP.md) for detailed AWS configuration.

## 📱 Usage

### Managing Impacted Persons
1. **Add New Person** - Click "Add New" button
2. **Edit Records** - Click edit icon, make changes, save
3. **Delete Records** - Click delete icon, confirm
4. **Search/Filter** - Use search box and status filter
5. **Export Data** - Click "Export" to download Excel file

### Data Synchronization
- **Online Mode** - Changes sync automatically to server
- **Offline Mode** - Changes saved locally, sync when online
- **Status Indicators** - Shows sync status and connection state
- **Real-time Updates** - Other users see changes immediately

### Excel File Management
- **Automatic Generation** - Excel files created on data changes
- **S3 Storage** - Files stored in AWS S3 bucket
- **Public Access** - Excel files accessible via direct URL
- **Version Control** - Latest data always available

## 🚀 Deployment

### Production Build
```bash
npm run build:all
```

### Server Deployment
1. **Environment Setup** - Configure production environment variables
2. **Process Management** - Use PM2 for process management
3. **Reverse Proxy** - Configure Nginx or Apache
4. **SSL Certificate** - Enable HTTPS for security

### AWS Deployment
1. **EC2 Instance** - Deploy server to EC2
2. **S3 Bucket** - Configure production S3 bucket
3. **CloudFront** - Use CDN for file distribution
4. **Load Balancer** - Scale with multiple instances

## 🔒 Security

### Data Protection
- **Input Validation** - All data validated on server
- **Error Handling** - Comprehensive error management
- **CORS Configuration** - Restricted to known domains
- **HTTPS Support** - Secure data transmission

### AWS Security
- **IAM Roles** - Least privilege access
- **S3 Permissions** - Public read for Excel files only
- **Environment Variables** - Secure credential storage
- **Network Security** - VPC and security groups

## 📊 Monitoring

### Health Checks
- **API Health** - `/api/health` endpoint
- **S3 Connectivity** - Automatic S3 health checks
- **Data Sync Status** - Real-time sync monitoring
- **Error Logging** - Comprehensive error tracking

### Performance
- **Debounced Sync** - Prevents excessive API calls
- **Local Storage** - Fast offline access
- **Caching** - Efficient data management
- **Responsive Design** - Optimized for all devices

## 🛠️ Development

### Project Structure
```
responsehub/
├── src/                    # React frontend
│   ├── services/          # API service layer
│   ├── App.tsx           # Main application
│   └── App.css           # Styles
├── server/                # Node.js backend
│   ├── server.js         # Express server
│   ├── package.json      # Server dependencies
│   └── .env              # Server configuration
├── public/               # Static assets
└── build/               # Production build
```

### Available Scripts
```bash
npm start              # Start React development server
npm run build          # Build React app for production
npm run server         # Start Node.js server
npm run server:dev     # Start server in development mode
npm run dev            # Start both frontend and backend
npm run build:all      # Build everything for production
```

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/impacted-persons` - Get all persons
- `POST /api/impacted-persons` - Create person
- `PUT /api/impacted-persons/:id` - Update person
- `DELETE /api/impacted-persons/:id` - Delete person
- `PUT /api/impacted-persons/bulk` - Sync all persons
- `GET /api/impacted-persons/excel` - Get Excel file URL

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [SERVER_SETUP.md](SERVER_SETUP.md) for server configuration
- Review the API documentation above
- Check the browser console for error messages
- Verify AWS credentials and S3 bucket configuration

## 🔄 Version History

- **v1.0.0** - Initial release with basic functionality
- **v1.1.0** - Added server synchronization and S3 integration
- **v1.2.0** - Added real-time updates and offline support
- **v1.3.0** - Added Excel export and advanced data management

---

**Response Hub** - Real-time data management for critical situations.
