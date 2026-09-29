# 🌱 AgriTrap AI-Powered Smart Insect Monitoring Dashboard

AgriTrap is an IoT-based sensor data collector and AI-powered agricultural advisory system designed to monitor insect presence/activity in fields.

## 🚀 Getting Started

### 1. Install Dependencies
Run installation at both roots:
```bash
# Frontend dependencies (Root folder)
npm install

# Backend dependencies (Server folder)
cd server
npm install
```

### 2. Configure environment variables
Create a `.env` file in the `server/` directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3001
```

### 3. Run the application

To start the backend proxy API:
```bash
cd server
npm start
```

To run the React frontend dashboard:
```bash
# In the root project folder
npm run dev
```

Open your browser at `http://localhost:5173`. Toggle the **Demo Mode** / **Live Mode** switch on the header to simulate the physical ESP32 trap or consume Firebase Firestore logs in real-time.
