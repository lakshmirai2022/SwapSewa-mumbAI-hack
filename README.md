# SwapSewa - Skill & Goods Bartering Platform

SwapSewa is a platform that enables users to barter skills and goods with each other. For example, if you know how to play carrom and want to learn chess, you can find someone who knows chess and wants to learn carrom, and you can exchange your skills.

## Features

- **Skill & Goods Exchange**: Barter your skills or goods with others
- **Match Algorithm**: Find the perfect match based on what you offer and what you need
- **Real-time Chat**: Communicate directly with potential barter partners
- **Video & Voice Calls**: Built-in call functionality for remote skill exchanges
- **Trust Score System**: Rating system to build a community of trusted users
- **Location-based Matching**: Find barter partners near you
- **Blockchain Integration**: Optional blockchain verification of completed trades

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time Communication**: Socket.io, WebRTC
- **Authentication**: JWT-based authentication
- **Blockchain**: Optional blockchain integration for trade verification

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

The API is organized around RESTful principles with the following main endpoints:

- `/api/auth`: Authentication endpoints (signup, login, etc.)
- `/api/users`: User profile endpoints
- `/api/matches`: Match discovery and management
- `/api/messages`: Chat and communication
- `/api/skills`: Skill management
 # SwapSewa
 
 SwapSewa is a full-stack web application designed to facilitate skill and service exchange within a trusted community. Users can offer, request, and trade skills or services, chat securely, and manage their exchanges with a modern, intuitive interface.
 
 ## Features
 - User authentication and onboarding
 - Skill and service listings (offerings/needs)
 - Real-time chat and messaging
 - Community dashboard and wallet
 - Admin dashboard for user and report management
 - Notifications and reporting system
 - Blockchain transaction model (for advanced use)
 - Responsive UI with Next.js and Tailwind CSS
 
 ## Tech Stack
 - **Frontend:** Next.js, React, Tailwind CSS
 - **Backend:** Node.js, Express, MongoDB (Mongoose)
 - **Real-time:** Socket.io
 - **Authentication:** JWT, NextAuth
 - **Deployment:** Vercel, Railway, Render
 
 ## Folder Structure
 ```
 swapsewa-full-main/
   app/                # Next.js app directory (frontend & API routes)
   backend/            # Express backend (API, models, controllers)
   components/         # Shared React components
   hooks/              # Custom React hooks
   lib/                # Utility libraries
   public/             # Static assets
   scripts/            # Helper scripts (e.g., commit timestamp)
   styles/             # Global styles
   test/               # Test projects and files
   tools/              # Developer tools
 ```
 
 ## Getting Started
 
 ### Prerequisites
 - Node.js (v18+ recommended)
 - npm or yarn
 - MongoDB instance (local or cloud)
 
 ### 1. Clone the Repository
 ```bash
 git clone https://github.com/lakshmir22/SwapSewa-mumbAI-hack.git
 cd swapsewa-full-main1/swapsewa-full-main
 ```
 
 ### 2. Install Dependencies
 ```bash
 npm install
 # or
 yarn install
 ```
 
 ### 3. Configure Environment Variables
 Copy `.env.example` to `.env` and fill in the required values:
 ```bash
 cp .env.example .env
 ```
 Set up:
 - `MONGODB_URI` (your MongoDB connection string)
 - `JWT_SECRET` (for backend auth)
 - `FRONTEND_URL` (e.g., http://localhost:3000)
 - Any other required keys
 
 ### 4. Run the Development Servers
 #### Frontend (Next.js)
 ```bash
 npm run dev
 # or
 yarn dev
 ```
 
 #### Backend (Express)
 ```bash
 cd backend
 npm install
 node server.js
 ```
 
 ### 5. Open in Browser
 Visit [http://localhost:3000](http://localhost:3000) to use the app.
 
 ## Deployment
 - **Frontend:** Deploy to Vercel (recommended)
 - **Backend:** Deploy to Railway, Render, or your preferred Node.js host
 - See `DEPLOYMENT.md` for detailed deployment instructions
 
 ## Contributing
 1. Fork the repository
 2. Create a new branch (`git checkout -b feature/your-feature`)
 3. Commit your changes (`git commit -m 'Add new feature'`)
 4. Push to your fork (`git push origin feature/your-feature`)
 5. Open a Pull Request
 
 ## License
 This project is licensed under the MIT License.
 
 ## Contact
 For questions or support, open an issue or contact [lakshmir22](https://github.com/lakshmir22).
