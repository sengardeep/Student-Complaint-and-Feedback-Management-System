# Complaint and Feedback Management System

A full-stack web application for managing college complaints and feedback built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### Student Features
- Register and login
- Submit complaints with categories (Academics, Hostel, Canteen, Infrastructure, Transport, Others)
- View all submitted complaints
- Track complaint status (Pending, In Progress, Resolved)
- Delete pending complaints
- View admin remarks on complaints

### Admin Features
- Login with admin credentials
- View all complaints from students
- Filter complaints by status and category
- Update complaint status
- Add admin remarks to complaints
- Dashboard with statistics (total, pending, in progress, resolved complaints)

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js and Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

## Installation

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or use MongoDB Atlas)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start MongoDB (if running locally):
```bash
# On Windows, MongoDB should be running as a service
# Or start it manually:
mongod
```

4. Create an admin user:
```bash
node createAdmin.js
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Default Admin Credentials

- Email: `admin@college.com`
- Password: `admin123`

## Usage

1. **Register as a Student**: Go to the register page and create a student account
2. **Login**: Use your credentials to login
3. **Submit Complaints**: Students can submit complaints with category, title, and description
4. **Admin Management**: Login as admin to view and manage all complaints
5. **Track Status**: Students can track the status of their complaints and view admin remarks

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new student
- POST `/api/auth/login` - Login (student or admin)

### Complaints (Student)
- POST `/api/complaints` - Create a new complaint
- GET `/api/complaints/my` - Get all complaints for logged-in student
- GET `/api/complaints/:id` - Get a specific complaint
- PUT `/api/complaints/:id` - Update a complaint (if pending)
- DELETE `/api/complaints/:id` - Delete a complaint (if pending)

### Admin
- GET `/api/complaints/admin/all` - Get all complaints (with optional filters)
- PUT `/api/complaints/admin/:id/status` - Update complaint status
- GET `/api/complaints/admin/stats/dashboard` - Get dashboard statistics

## Project Structure

```
Mini Project/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── complaints.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── createAdmin.js
│   ├── .env
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   └── index.css
    └── package.json
```

## Security Features

- Passwords are hashed using bcrypt before storing
- JWT tokens for authentication
- Protected routes for authenticated users
- Role-based access control (student vs admin)
- Input validation on both client and server

## Future Enhancements

- Email/SMS notifications
- Anonymous complaints
- File attachments
- Charts and graphs
- Mobile app with React Native
