# FARMAR Backend API

Complete backend API for FARMAR - Complete Farming Management Application with secure authentication using Supabase.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Password Security**: Bcrypt hashing with salt rounds
- **Database Integration**: Supabase PostgreSQL database
- **Input Validation**: Comprehensive validation using Joi
- **Rate Limiting**: Protection against brute force attacks
- **CORS Security**: Configurable cross-origin resource sharing
- **Error Handling**: Comprehensive error handling and logging
- **API Documentation**: Well-documented endpoints

## 📋 Prerequisites

- Node.js (v18 or higher)
- Supabase account and project
- Environment variables configured

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables**
   Edit `.env` file with your values:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

4. **Database Setup**
   Run the migration in your Supabase SQL editor:
   ```sql
   -- Copy and paste the content from supabase/migrations/create_users_table.sql
   ```

5. **Start the Server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🔗 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "mobile": "9876543210",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User account created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "mobile": "9876543210",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "mobile": "9876543210",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "mobile": "9876543210",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET `/api/auth/profile`
Get user profile (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "mobile": "9876543210",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST `/api/auth/refresh-token`
Refresh JWT token (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

#### POST `/api/auth/logout`
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Health Check

#### GET `/health`
Check API health status.

**Response:**
```json
{
  "success": true,
  "message": "FARMAR Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## 🛡️ Security Features

### Password Security
- **Bcrypt Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, number, and special character

### JWT Authentication
- **Secure Tokens**: JWT tokens with configurable expiration
- **Token Verification**: Middleware to verify tokens on protected routes
- **Refresh Mechanism**: Token refresh endpoint for extended sessions

### Input Validation
- **Joi Validation**: Comprehensive input validation using Joi schemas
- **Sanitization**: XSS prevention through input sanitization
- **Mobile Number Validation**: Indian mobile number format validation

### Rate Limiting
- **Authentication Endpoints**: 5 requests per 15 minutes
- **General Endpoints**: 100 requests per 15 minutes
- **IP-based Limiting**: Protection against brute force attacks

### CORS Security
- **Configurable Origins**: Whitelist specific domains
- **Credential Support**: Secure cookie and header handling
- **Method Restrictions**: Limited HTTP methods

## 🗄️ Database Schema

### Users Table
```sql
users (
  id uuid PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  mobile text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'farmer',
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

### Constraints
- Mobile number must be 10 digits starting with 6-9
- Names must be 2-50 characters, letters only
- Unique mobile number constraint
- Role must be 'farmer' or 'admin'

## 🔧 Development

### Project Structure
```
server/
├── config/
│   └── database.js          # Supabase configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── validation.js       # Input validation middleware
├── routes/
│   └── auth.js             # Authentication routes
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── server.js              # Main server file
└── README.md              # This file
```

### Environment Variables
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for admin operations)
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend application URL for CORS

### Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
```

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET` (32+ characters)
3. Configure proper CORS origins
4. Set up SSL/HTTPS
5. Configure rate limiting for production load
6. Set up monitoring and logging
7. Regular security updates

### Environment Setup
Ensure all environment variables are properly set in your production environment.

## 🤝 Integration with Frontend

### Authentication Flow
1. User signs up/logs in through frontend
2. Backend validates credentials and returns JWT token
3. Frontend stores token securely (localStorage/sessionStorage)
4. Include token in Authorization header for protected requests
5. Backend verifies token and processes requests

### Error Handling
All API responses follow consistent format:
```json
{
  "success": boolean,
  "message": "string",
  "data": object,      // On success
  "errors": array      // On validation errors
}
```

## 📞 Support

For issues and questions:
1. Check the API documentation
2. Verify environment variables
3. Check Supabase connection
4. Review server logs for errors

## 🔄 Version History

- **v1.0.0**: Initial release with complete authentication system