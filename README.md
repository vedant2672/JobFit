# JobFit - AI-Powered Career Intelligence Platform

JobFit is a MERN stack web application that helps students and fresh graduates understand how well their resume matches a specific job description using AI-powered analysis.

## Features

- **Resume Upload & Parsing**: Upload PDF resumes with automatic text extraction and skill analysis
- **AI-Powered Analysis**: Get detailed job fit analysis using OpenAI GPT
- **Job Fit Score**: Visual score indicator showing match percentage
- **Skills Matching**: Identify matched and missing skills
- **Strengths & Weaknesses**: Understand your competitive advantages
- **Recommended Projects**: Get project suggestions to improve your profile
- **Learning Roadmap**: Week-by-week plan to acquire missing skills
- **Analysis History**: Track all your previous analyses

## Tech Stack

### Frontend
- React.js with Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Hook Form
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB Atlas with Mongoose
- JWT Authentication
- bcrypt Password Hashing
- Multer for File Upload
- pdf-parse for PDF Text Extraction
- OpenAI API Integration

## Project Structure

```
JobFit/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route pages
│   │   ├── context/             # React Context (Auth)
│   │   ├── services/            # API service functions
│   │   ├── routes/              # Route configuration
│   │   └── utils/               # Helper functions
│   └── package.json
│
├── backend/                     # Express Backend
│   ├── config/                  # Database configuration
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   ├── controllers/             # Route handlers
│   ├── middleware/               # Custom middleware
│   ├── services/                # Business logic
│   └── server.js
│
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- OpenAI API key

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd JobFit
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Resume
- `POST /api/resume/upload` - Upload and parse resume (PDF only)
- `GET /api/resume` - Get all user resumes

### Analysis
- `POST /api/analysis` - Create new job fit analysis
- `GET /api/analysis/history` - Get analysis history
- `GET /api/analysis/:id` - Get specific analysis

### Profile
- `GET /api/profile` - Get user profile

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |

## Features in Detail

### 1. User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes for authenticated users

### 2. Resume Upload
- PDF-only upload with validation
- Automatic text extraction using pdf-parse
- AI-powered skill and experience extraction

### 3. AI Analysis Engine
- GPT-3.5/GPT-4 powered analysis
- Comprehensive job fit scoring
- Detailed skills gap analysis
- Personalized learning roadmap

### 4. Dashboard
- Overview of analysis statistics
- Recent analyses quick access
- Average and best score tracking

### 5. Analysis Results
- Circular score visualization
- Matched and missing skills badges
- Strengths and weaknesses breakdown
- Recommended projects list
- Week-by-week learning roadmap

## Error Handling

The application includes comprehensive error handling for:
- Invalid file uploads
- Empty form submissions
- Expired JWT tokens
- OpenAI API failures
- Network connectivity issues
- MongoDB connection problems

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@jobfit.com or create an issue in the repository.
