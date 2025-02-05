# Rhythm Planner - Musical Event Management System

A web application for managing musical events, built with React, Node.js, Express, and MongoDB.

## Features

- Create, read, update, and delete musical events
- Modern and responsive user interface
- Detailed event information including venue, artist, ticket price, and capacity
- Easy-to-use forms for event management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas connection)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rhythm-planner
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Configuration

1. Create a `.env` file in the backend directory:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rhythm-planner
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173` to access the application.

## API Endpoints

- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get a specific event
- POST `/api/events` - Create a new event
- PUT `/api/events/:id` - Update an event
- DELETE `/api/events/:id` - Delete an event

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Cors
  - Dotenv

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 