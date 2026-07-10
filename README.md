# Contact Management & COVID-19 Dashboard

A full-stack web application featuring secure user authentication, private contact management, and interactive COVID-19 statistics.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Redux Toolkit, TanStack Query, Recharts, React-Leaflet
- **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic, Python-jose, Bcrypt

---

## Project Structure
```
backend/
  app/
    routers/
      auth.py          # User registration and token generation
      contacts.py      # Contact CRUD operations
    database.py        # Database connection pool setup
    deps.py            # User authentication dependencies
    main.py            # Application entrypoint and configuration
    models.py          # SQLAlchemy schema mappings
    schemas.py         # Pydantic validation structures
    security.py        # Hashing and JWT utilities
  contacts.db          # SQLite database file
  requirements.txt     # Python dependencies
frontend/
  src/
    components/        # Layout and navigation wrappers
    hooks/             # COVID-19 data fetching hooks
    pages/             # CRUD, Charts, and Maps pages
    redux/             # Global authentication and contacts state
    services/          # Axios API client integrations
    App.tsx            # Main router and layout mounts
    main.tsx           # Providers and root renderers
  package.json         # Project manifests
  vite.config.ts       # Build and asset compilation setups
```

---

## Setup Instructions

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- Package manager: `pnpm` (recommended) or `npm`

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```
3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install package dependencies:
   ```bash
   pnpm install
   ```
3. Start the Vite development server:
   ```bash
   pnpm run dev
   ```
   The frontend application will be running at [http://localhost:5173/](http://localhost:5173/).

---

## Features Implemented
1. **User Authentication**: Token-based authentication using JWT. User profiles and credentials are stored securely in SQLite with hashed passwords.
2. **Contact Database**: Supports creating, reading, updating, and deleting contacts. All records are secured per user.
3. **Optimized Search**: Filters contact entries in real-time on both client and database levels. Matches specifically against full names.
4. **COVID-19 Charts**: Displays global pandemic metrics and charts historical case timelines over the past 120 days.
5. **Interactive Map**: Maps case distribution worldwide using a responsive Leaflet bubble-map layer.

---

## Deployment Configuration

When deploying the application to production platforms (such as Render, Vercel, or Heroku), configure the following environment variables:

### Backend Configuration
- `DATABASE_URL`: Connection string for the database (e.g., `postgresql://user:pass@host:port/db`). Defaults to a local SQLite database (`sqlite:///./contacts.db`).
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (e.g., `https://your-frontend-domain.com`).

### Frontend Configuration
- `VITE_API_URL`: URL to the deployed backend's API root (e.g., `https://your-backend-domain.com/api/v1`). Defaults to `http://localhost:8000/api/v1`.

