# Integrated Health Care Portal (IHCP)

A clean, modular, beginner-friendly full-stack healthcare web application for a college project.

**Tech stack**
- **Frontend**: HTML + CSS + Vanilla JavaScript (no frameworks)
- **Backend**: Node.js + Express
- **Database**: **MongoDB Atlas (cloud)** + Mongoose
- **Auth**: bcrypt password hashing + JWT (admin only for now)

## Folder structure

```
integrated-healthcare-portal/
  client/
    index.html
    patients.html
    doctors.html
    appointments.html
    consultations.html
    prescriptions.html
    admin.html
    css/
      style.css
    js/
      config.js
      api.js
      app.js
      patients.js
      doctors.js
      appointments.js
      consultations.js
      prescriptions.js
      admin.js
  server/
    server.js
    seed.js
    package.json
    .env.example
    config/
      db.js
    models/
      Patient.js
      Doctor.js
      Appointment.js
      Consultation.js
      Prescription.js
      User.js
    controllers/
      patientController.js
      doctorController.js
      appointmentController.js
      consultationController.js
      prescriptionController.js
      authController.js
    routes/
      patientRoutes.js
      doctorRoutes.js
      appointmentRoutes.js
      consultationRoutes.js
      prescriptionRoutes.js
      authRoutes.js
    middleware/
      authMiddleware.js
      roleMiddleware.js
  FILE_PLAN.md
  README.md
```

## Features

### Patient management (CRUD)
- Add patient
- View all patients
- View single patient
- Edit patient
- Delete patient

### Doctor management (CRUD)
- Add doctor
- View all doctors
- View specialization and availability
- Edit doctor
- Delete doctor

### Appointment management (CRUD + booking)
- Book appointment (select patient + doctor)
- Store: date, time, reason, status
- Status values: **pending**, **approved**, **completed**, **cancelled**
- View appointment list with patient + doctor names (populated)

### Consultation management (CRUD)
- Add consultation linked to an appointment
- Store: diagnosis, notes, follow-up date

### Prescription management (CRUD)
- Add prescription linked to a consultation
- Store: medicine name, dosage, instructions

### Authentication (admin only for now)
- Admin register/login
- Passwords hashed using bcrypt
- JWT used to protect admin dashboard API

### Dashboard (admin protected)
- Counts: patients, doctors, appointments, consultations, prescriptions
- Latest appointments list

## API base URL

Local development:
- Backend API: `http://127.0.0.1:5001/api`
- Frontend Live Server: `http://127.0.0.1:5500` or `http://localhost:5500`

Frontend config is in `client/js/config.js`:

```js
const API_BASE_URL = 'http://127.0.0.1:5001/api';
```

## Backend API routes

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Patients
- `GET /api/patients`
- `GET /api/patients/:id`
- `POST /api/patients`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

### Doctors
- `GET /api/doctors`
- `GET /api/doctors/:id`
- `POST /api/doctors`
- `PUT /api/doctors/:id`
- `DELETE /api/doctors/:id`

### Appointments
- `GET /api/appointments`
- `GET /api/appointments/:id`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

### Consultations
- `GET /api/consultations`
- `GET /api/consultations/:id`
- `POST /api/consultations`
- `PUT /api/consultations/:id`
- `DELETE /api/consultations/:id`

### Prescriptions
- `GET /api/prescriptions`
- `GET /api/prescriptions/:id`
- `POST /api/prescriptions`
- `PUT /api/prescriptions/:id`
- `DELETE /api/prescriptions/:id`

### Admin (protected)
- `GET /api/admin/dashboard` (requires `Authorization: Bearer <token>`)

## Environment variables

Copy the example file and fill it:

1) In `server/`, create `.env`:
- Copy from `server/.env.example`

`server/.env.example` contains:
```
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/healthcare_portal?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=
```

`CORS_ORIGINS` is optional. Use it to add extra allowed frontend origins (comma-separated), for example:
`CORS_ORIGINS=https://your-frontend-domain.com,https://your-project.vercel.app`

Note: any `*.vercel.app` origin is also allowed by default (so Vercel previews work).

## MongoDB Atlas setup (required for deployment)

1) Create a MongoDB Atlas account and create a **Free (M0)** cluster
2) Create a **Database User** (username + password)
3) Network Access → **IP Access List**
   - For local dev: add your current IP, or temporarily allow `0.0.0.0/0` (not recommended long-term)
   - For Render: you can start with `0.0.0.0/0`, then restrict later if you prefer
4) In Atlas → Connect → Drivers → copy your connection string and set it as `MONGO_URI` in `server/.env`
   - Keep the database name at the end as `healthcare_portal`

Example (do not paste this exact string; use your own):
`mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/healthcare_portal?retryWrites=true&w=majority`

## Seed 2 patients + 2 doctors

This project includes a seed script that inserts **2 patients** and **2 doctors** if the collections are empty.

From `server/`:
```bash
npm run seed
```

## Deployment notes (Render + Vercel)

### Backend on Render
- Create a new **Web Service**
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables in Render:
  - `PORT` (Render provides its own port in many cases; you can omit this)
  - `MONGO_URI` (MongoDB Atlas connection string)
  - `JWT_SECRET`
- Update CORS allow-list in `server/server.js` to include your Vercel frontend domain.

### Frontend on Vercel
- Deploy the `client/` folder as a static site
- Update `client/js/config.js`:
  - `API_BASE_URL = 'https://<your-render-backend-domain>/api'`

## Exact run steps (local)

### 1) Create MongoDB Atlas database
- Ensure your Atlas cluster is created
- Ensure IP access allows your current network
- Copy your Atlas connection string into `server/.env` as `MONGO_URI`

### 2) Run backend

Open a terminal in:
- `integrated-healthcare-portal/server`

Then:
```bash
npm install
copy .env.example .env
npm run seed
npm start
```

Backend should run on:
- `http://127.0.0.1:5001`

Test health route:
- `GET http://127.0.0.1:5001/api/health`

### 3) Open frontend with Live Server

1) Open the `integrated-healthcare-portal/client` folder in VS Code
2) Right-click `index.html` → **Open with Live Server**
3) Visit:
- `http://127.0.0.1:5500/client/index.html` (or similar)

Recommended demo flow:
- Seed patients/doctors → Book appointment → Add consultation → Add prescription → Admin login → Load dashboard

