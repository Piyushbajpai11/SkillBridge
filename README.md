# 🚀 SkillBridge – The Developer-First Freelance Marketplace

SkillBridge is a full-stack MERN-based freelance marketplace tailored for developers.  
It combines the best aspects of Upwork and LinkedIn, focusing on high-quality project collaboration, profile building, and talent showcasing.

---

## ✅ Features Implemented So Far

### 🔐 Authentication
- JWT-based user login and registration
- Auth context with persistent login across refresh
- Protected routes using React Router
- Logout support with session cleanup

### 👨‍💻 Dashboard & Profile
- Private user dashboard after login
- Secure profile fetching via backend token
- Auth-aware Navbar with conditional rendering

### 🌐 Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (stored in localStorage)
- **Routing:** React Router DOM v6+

---

## 📂 Folder Structure (simplified)

SkillBridge/
├── client/ # React frontend (Vite)
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ └── App.jsx
├── server/ # Node.js backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── server.js


---

## 🔮 Upcoming Super-Advanced Features

### 🎯 Phase 2: Core Freelancing Features
- Job posting & bidding system
- Project approval + milestone workflows
- Messaging system between clients and developers
- Notifications (in-app & optional email)

### 💼 Phase 3: Developer-Focused Additions
- Public developer portfolios with GitHub integration
- Skill endorsements + reviews from clients
- Live code testing or demo embedding (CodeSandbox-style)
- Leaderboard of top freelancers by reputation & rating

### 💳 Phase 4: Payments & Analytics
- Stripe or Razorpay integration for secure payments
- Admin dashboard with user & project metrics
- Time tracking for freelancers
- Payment protection & milestone escrow system

---

## 🛠️ Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/Piyushbajpai11/SkillBridge.git
cd SkillBridge

# Install backend
cd server
npm install

# Install frontend
cd ../client
npm install


npm run dev
