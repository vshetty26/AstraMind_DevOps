# AstraMind — Mission Control Dashboard

> **ITM Skills University | B.Tech CSE 2024–28 | DevOps Semester IV**
> Case Study 130: Project AstraMind – Interplanetary Research and Mission Analytics Platform

---

## 🚀 Project Overview

AstraMind is a full-stack **Mission Control Dashboard** for managing interplanetary space missions. Built with React, Node.js, Express, and MongoDB.

---

## 🗂️ Project Structure

```
AstraMind/
├── backend/
│   ├── models/Mission.js   # Mongoose schema
│   ├── server.js           # Express API server
│   ├── .env                # Environment variables (not committed)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/Layout.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Missions.jsx
    │   │   ├── Telemetry.jsx
    │   │   ├── Alerts.jsx
    │   │   └── Analytics.jsx
    │   ├── api.js
    │   └── App.jsx
    └── package.json
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Routing | React Router DOM |
| Charts | Recharts |
| HTTP Client | Axios |
| Backend | Node.js + Express 4 |
| Database | MongoDB + Mongoose |
| Dev Server | Nodemon |

---

## 🛠️ Setup & Run

### 1. Clone the Repository
```bash
git clone https://github.com/vshetty26/AstraMind_DevOps.git
cd AstraMind_DevOps
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/AstraMind
PORT=5001
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health check |
| GET | `/missions` | Get all missions |
| GET | `/missions/:id` | Get single mission |
| POST | `/missions` | Create mission |
| PUT | `/missions/:id` | Update mission |
| DELETE | `/missions/:id` | Delete mission |
| GET | `/stats` | Mission statistics |

---

## 📊 Features

- **Dashboard** — Stats cards, recent missions, system status
- **Missions** — Full CRUD with modal form, filter by status
- **Telemetry** — Live-updating metrics (battery, signal, temperature, velocity)
- **Alerts** — Critical/Warning/Info alerts with dismiss logic
- **Analytics** — Pie, Area, Bar charts using Recharts

---

## 📝 License

MIT — ITM Skills University DevOps Project
