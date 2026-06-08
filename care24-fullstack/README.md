# Care24 – Full Stack Setup Guide

## Project Structure
```
care24-fullstack/
├── backend/          ← Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── server.js
│   │   ├── models/       (User, Patient, Caregiver, Booking, CareNote)
│   │   ├── routes/       (auth, users, caregivers, bookings, services, carenotes, admin)
│   │   └── middleware/   (auth.js - JWT)
│   ├── .env
│   └── package.json
│
└── frontend/         ← React + Vite
    ├── src/
    │   ├── main.jsx
    │   ├── api.js            ← connects to backend
    │   ├── Care24LandingPage.jsx
    │   ├── Care24AuthPage.jsx
    │   ├── Care24ServicesPage.jsx
    │   ├── Care24BookingPage.jsx
    │   ├── Care24UserDashboard.jsx
    │   ├── Care24CaregiverDashboard.jsx
    │   └── Care24AdminDashboard.jsx
    ├── .env
    └── package.json
```

## Running Locally

### 1. Start Backend
```bash
cd backend
npm install
# Edit .env → set your MongoDB URI
npm run dev
# API runs at http://localhost:5000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

## Pages & Routes
| Page | URL |
|------|-----|
| Landing | http://localhost:5173/#/landing |
| Login/Register | http://localhost:5173/#/auth |
| Browse Caregivers | http://localhost:5173/#/services |
| Book a Service | http://localhost:5173/#/booking |
| User Dashboard | http://localhost:5173/#/dashboard |
| Caregiver Dashboard | http://localhost:5173/#/caregiver-dashboard |
| Admin Panel | http://localhost:5173/#/admin |

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user/caregiver |
| POST | /api/auth/login | Login |
| GET | /api/caregivers | Browse all caregivers |
| GET | /api/caregivers/me | Caregiver own profile |
| PUT | /api/caregivers/me | Update caregiver profile |
| PUT | /api/caregivers/availability | Toggle availability |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/my | User's bookings |
| GET | /api/bookings/caregiver | Caregiver's bookings |
| PUT | /api/bookings/:id/status | Update booking status |
| POST | /api/carenotes | Add care note |
| GET | /api/carenotes/:bookingId | Get care notes |
| GET | /api/admin/stats | Admin statistics |
| GET | /api/admin/pending-caregivers | Pending verifications |
| PUT | /api/admin/caregivers/:id/verify | Approve/reject caregiver |

## Deploy Frontend to GitHub Pages
```bash
cd frontend
npm run deploy
```
Live at: https://shree-maha.github.io/care24/
