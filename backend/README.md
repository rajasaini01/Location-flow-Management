# Backend for Location Flow Management App

## Overview
This is the backend for the **Location Flow Management App**, built with Node.js and MongoDB. It provides APIs for authentication, address management, and other related functionalities.

---

## Project Structure

```plaintext
backend/
├── config/ 
    |--- dbConfig.js            # Database configuration (MongoDB)
├── controllers/        # API functions
│   ├── addressControllers.js  # APIs for address management
│   ├── authControllers.js     # Authentication APIs
├── middlewares/ 
    |---authenticaton.js       # JWT authentication middleware
├── models/             # Mongoose schema definitions
│   ├── user.js         # User schema
│                       # Address schema
├── routes/             # Route definitions
│   ├── authRoutes.js   # Authentication routes
│   ├── addressRoutes.js # Address routes
├── index.js            # Main file to start the backend server
└── package.json        # Dependencies and scripts



git clone https://github.com/your-username/location-flow-backend.git
cd location-flow-backend/backend


npm install


MONGO_URI=your-mongodb-connection-uri
JWT_SECRET=your-jwt-secret-key
PORT=5000

node index.js

