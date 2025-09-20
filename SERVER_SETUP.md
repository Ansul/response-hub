# Response Hub Server Setup

This document provides instructions for setting up the backend server with S3 integration for the Response Hub application.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **AWS Account** with S3 access
3. **AWS CLI** configured (optional, for easier setup)

## AWS S3 Setup

### 1. Create S3 Bucket

```bash
# Using AWS CLI
aws s3 mb s3://response-hub-data

# Or create through AWS Console
# Go to S3 → Create bucket → Name: response-hub-data
```

### 2. Configure Bucket Permissions

Create a bucket policy to allow public read access to Excel files:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::response-hub-data/*"
        }
    ]
}
```

### 3. Create IAM User

1. Go to AWS IAM Console
2. Create new user: `response-hub-server`
3. Attach policy: `AmazonS3FullAccess` (or create custom policy)
4. Generate access keys
5. Save the Access Key ID and Secret Access Key

## Server Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` with your AWS credentials:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=response-hub-data

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### Impacted Persons
- `GET /api/impacted-persons` - Get all persons
- `POST /api/impacted-persons` - Create new person
- `PUT /api/impacted-persons/:id` - Update person
- `DELETE /api/impacted-persons/:id` - Delete person
- `PUT /api/impacted-persons/bulk` - Sync all persons
- `GET /api/impacted-persons/excel` - Get Excel file URL

### News
- `GET /api/news` - Get all news
- `PUT /api/news/bulk` - Sync all news

### Issues
- `GET /api/issues` - Get all issues
- `PUT /api/issues/bulk` - Sync all issues

## Excel File Generation

The server automatically generates Excel files when data changes:

1. **File Location**: `s3://your-bucket/impacted-persons.xlsx`
2. **Format**: XLSX (Excel 2007+)
3. **Sheet Name**: "Impacted Persons"
4. **Columns**: All person fields (name, email, reason, airport, status, dateReported)

## Client Configuration

Update your React app's environment variables:

```env
# .env.local
REACT_APP_API_URL=http://localhost:3001/api
```

## Production Deployment

### 1. Environment Variables

Set production environment variables:

```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-domain.com
AWS_ACCESS_KEY_ID=your_production_key
AWS_SECRET_ACCESS_KEY=your_production_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=response-hub-data-prod
```

### 2. Process Management

Use PM2 for process management:

```bash
npm install -g pm2
pm2 start server.js --name "response-hub-server"
pm2 save
pm2 startup
```

### 3. Reverse Proxy

Configure Nginx or Apache to proxy requests to the Node.js server.

## Monitoring

### Health Check

Monitor server health:

```bash
curl http://localhost:3001/api/health
```

### Logs

Check server logs:

```bash
# PM2 logs
pm2 logs response-hub-server

# Direct logs
tail -f server.log
```

## Troubleshooting

### Common Issues

1. **S3 Access Denied**
   - Check IAM user permissions
   - Verify bucket policy
   - Confirm AWS credentials

2. **CORS Errors**
   - Update CORS_ORIGIN in .env
   - Check client URL matches server configuration

3. **Excel Generation Fails**
   - Verify S3 bucket exists
   - Check AWS credentials
   - Ensure bucket permissions allow uploads

### Debug Mode

Enable debug logging:

```env
NODE_ENV=development
DEBUG=response-hub:*
```

## Security Considerations

1. **AWS Credentials**: Store securely, never commit to version control
2. **CORS**: Restrict to known domains in production
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **HTTPS**: Use HTTPS in production
5. **Input Validation**: Server validates all input data

## Backup Strategy

1. **S3 Versioning**: Enable S3 bucket versioning
2. **Database Backup**: If using database, implement regular backups
3. **Configuration Backup**: Backup environment configuration

## Scaling

For high-traffic scenarios:

1. **Load Balancer**: Use AWS ALB or similar
2. **Multiple Instances**: Run multiple server instances
3. **Database**: Consider moving from in-memory to persistent database
4. **Caching**: Implement Redis for caching
5. **CDN**: Use CloudFront for S3 file distribution
