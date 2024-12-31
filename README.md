# Location Flow Management App

This repository contains the **backend** and **frontend** for the Location Flow Management App, a platform for managing and locating addresses with Google Maps integration.

---

## Features
- **Backend**: Node.js, MongoDB for data management, and JWT for authentication.
- **Frontend**: React.js for user interface, Google Maps API for location visualization.

---

## Project Structure

### Backend
```plaintext
backend/
├── config/             # Database configuration (MongoDB)
├── controllers/        # API functions
├── middlewares/        # JWT authentication
├── models/             # Schema definitions
├── routes/             # Route definitions
├── index.js            # Entry point
├── package.json        # Dependencies and scripts

frontend/
├── public/
│   └── index.html         # Root HTML
├── src/
│   ├── components/        # Reusable components (e.g., AddressForm, Map)
│   ├── context/           # Context API for state management
│   ├── pages/             # Application pages (e.g., Home, Search)
│   ├── App.js             # Main app component
│   ├── Routes.js          # App routing
│   ├── index.js           # Entry point
└── └── Protected.js       # Route protection HOC
cd backend
npm install
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=3000
nodemon index.js
cd frontend
npm install
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
npm start
