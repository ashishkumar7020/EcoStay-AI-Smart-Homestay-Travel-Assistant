# EcoStay AI - Smart Homestay & Travel Assistant

EcoStay AI is a full-stack prototype for an AI-powered homestay management and travel assistance platform. It helps homestay owners increase direct bookings, improve guest experiences, and provide personalized travel planning tools. Week 4 adds an Express REST API and connects the dashboard to live backend data.

## Tech Stack

- React.js
- Tailwind CSS
- React Router DOM
- Vite
- Node.js
- Express.js
- CORS
- dotenv

## Features

- Responsive Home page with Navbar, Hero, feature Cards, and Footer
- Additional routes for About, Dashboard, and Login
- Reusable component structure
- Mobile-friendly navigation menu
- Dashboard statistic cards connected to the Week 4 backend API
- Express REST API with booking CRUD, search, stats, CORS, validation, and error handling
- Non-functional login form UI for future authentication flow

## Week 4 Backend Decisions

The Week 4 core data model is `booking` because it connects directly to the EcoStay owner dashboard. A booking includes guest name, destination, check-in date, number of nights, booking status, sustainability score, and total amount.

The backend uses in-memory data as required for Week 4. It is intentionally small, but it includes validation, correct HTTP status codes, JSON responses, CORS configuration, and Express error handling middleware so it can move toward a database-backed Week 5 version later.

## Routes

- `/` - Home
- `/about` - About EcoStay AI
- `/dashboard` - Business Dashboard
- `/login` - Login page

## Folder Structure

```text
backend/
  server.js
  package.json
  .env.example
src/
  App.jsx
  main.jsx
  index.css
  components/
    Navbar.jsx
    Hero.jsx
    Card.jsx
    Footer.jsx
  pages/
    Home.jsx
    About.jsx
    Dashboard.jsx
    Login.jsx
```

## Run Locally

```bash
npm install
npm run dev
```

Open the local development URL shown in the terminal, usually:

```text
http://localhost:5173
```

The frontend reads the API base URL from `VITE_API_URL` when provided. If it is not set, it uses:

```text
http://localhost:5000/api
```

## How to run backend locally

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The API runs on:

```text
http://localhost:5000/api
```

## Environment Variables

Backend variables are documented in `backend/.env.example`.

```text
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
```

`.env` is intentionally ignored by Git.

## API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | `/api/health` | API health check | 200 |
| GET | `/api/bookings` | List all bookings | 200 |
| GET | `/api/bookings/:id` | Get one booking by id | 200 |
| GET | `/api/bookings/search?q=munnar` | Search bookings by guest, destination, or status | 200 |
| GET | `/api/bookings/stats` | Dashboard summary statistics | 200 |
| POST | `/api/bookings` | Create a booking | 201 |
| PUT | `/api/bookings/:id` | Update a booking | 200 |
| DELETE | `/api/bookings/:id` | Delete a booking | 204 |

Validation errors return `400`, missing bookings or routes return `404`, and unexpected server errors return `500`.

### Booking Payload

```json
{
  "guestName": "Test Guest",
  "destination": "Munnar, Kerala",
  "checkIn": "2026-08-01",
  "nights": 2,
  "status": "confirmed",
  "sustainabilityScore": 88,
  "totalAmount": 10000
}
```

`status` must be `confirmed`, `pending`, or `cancelled`. `checkIn` must use `YYYY-MM-DD` format.

## Week 4 Deliverables

- `W4_APICollection_TBI-26100170.json` includes saved Postman requests and example responses for the API endpoints.
- `W4_FrontendBackendConnection_TBI-26100170.pdf` includes screenshots of frontend data from the backend and a Network tab check showing successful API calls.

## Build

```bash
npm run build
```
