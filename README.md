# Villa Health

Villa Health is a healthcare service management platform. It gives clinics a simple way to manage patients, specialists, and appointments in one place. It also handles secure payments for consultations.

This is an admin panel and a specialist panel built as one app, with different views based on the user's role.

## What it does

- Patients can register, book appointments with specialists, and pay for consultations.
- Specialists can manage their profile, set a consultation fee, and update the status of their appointments.
- Admins can approve new specialists, manage patient accounts, and see every appointment on the platform.

## Tech stack

**Backend**
- Node.js and Express.js for the REST API
- MongoDB with Mongoose for the database
- JSON Web Tokens (JWT) for authentication
- Role-based access control for admin, specialist, and patient roles
- Stripe for payment processing

**Frontend**
- React with React Router
- Tailwind CSS for styling
- Axios for API calls
- Vite as the build tool

## Project structure

```
villa-health/
  backend/     Express API, MongoDB models, auth, and payment logic
  frontend/    React admin panel and specialist panel
```

## Getting started

### Backend

```
cd backend
npm install
cp .env.example .env
```

Fill in your own values in `.env` (MongoDB URI, JWT secret, Stripe key), then run:

```
npm run dev
```

The API runs on `http://localhost:5000` by default.

### Frontend

```
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Core features

- **Authentication**: Secure sign up and login with hashed passwords and JWT tokens.
- **Role-based access**: Admins, specialists, and patients each see only what they need to see.
- **Appointment booking**: Patients pick a specialist and a time slot, then pay to confirm.
- **Payments**: Stripe handles the payment, and the appointment is marked as paid once it succeeds.
- **Specialist approval**: New specialists need admin approval before they appear to patients.

## Note on this project

This is a rebuilt, simplified version of a real platform I worked on as a full-stack developer. The original code belonged to a former employer, so this version is written from scratch with the same core features, to show how the system works.

## Author

Moosa Bilal
Full-Stack Software Engineer (MERN Stack)
