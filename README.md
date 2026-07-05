# Hirely 

A SaaS application

Hirely is an AI-powered interview preparation platform. Upload your resume, describe yourself, and paste a job description — Hirely analyzes the match, generates a tailored interview report, and helps you prepare with a day-by-day plan.

## Features

- **Resume Parsing** — Extracts and reads resume content from PDF uploads
- **ATS Match Score** — Scores how well a resume aligns with a given job description
- **AI-Generated Interview Questions** — Technical and behavioral questions tailored to the role, with guidance on how to answer them
- **Skill Gap Analysis** — Identifies missing or weak skills, ranked by severity
- **Preparation Roadmap** — Day-wise plan to help candidates prepare effectively
- **AI-Tailored Resume Export** — Generates and downloads a job-tailored resume as a PDF
- **Authentication** — Secure session-based signup/login with saved report history per user

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- Passport.js (local strategy, session-based auth)
- Multer (file uploads)
- Puppeteer (PDF generation)

**AI**
- Google Gemini (via `@google/genai`)
- Zod (structured AI response schemas)

## Project Structure

```
Hirely/
├── Backend/
│   ├── model/          # Mongoose schemas (User, InterviewReport)
│   ├── utils/           # Error handling utilities
│   ├── aiService.js     # Gemini AI integration + PDF generation
│   ├── app.js            # Express app, routes, middleware
│   └── package.json
└── Frontend/
    └── Hirely/
        ├── src/
        │   ├── components/  # UI components
        │   ├── context/      # Auth context/provider
        │   └── pages/         # Route-level pages
        ├── netlify.toml
        └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local instance or MongoDB Atlas)
- A Google Gemini API key

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```
NODE_ENV=development
PORT=8000
MONGO_URL=<your MongoDB connection string>
SESSION_SECRET=<a long random string>
CLIENT_URL=http://localhost:5173
GOOGLE_GEN_API_KEY=<your Gemini API key>
```

Run the backend:

```bash
npm start
```

### Frontend Setup

```bash
cd Frontend/Hirely
npm install
```

Create a `.env` file in `Frontend/Hirely/`:

```
VITE_API_URL=http://localhost:8000
```

Run the frontend:

```bash
npm run dev
```

## Deployment

Hirely is designed to be deployed as two separate services:

- **Backend** → [Render](https://render.com)
  - Root directory: `Backend`
  - Build command: `npm install`
  - Start command: `npm start`
  - Environment variables: `NODE_ENV=production`, `MONGO_URL`, `SESSION_SECRET`, `CLIENT_URL`, `GOOGLE_GEN_API_KEY`

- **Frontend** → [Netlify](https://netlify.com)
  - Base directory: `Frontend/Hirely`
  - Build command: `npm run build`
  - Publish directory: `Frontend/Hirely/dist`
  - Environment variable: `VITE_API_URL` (set to the deployed Render backend URL)

A `netlify.toml` is included to handle client-side routing redirects for React Router.

## License

ISC