# LearnSphere - Premium E-Learning Platform

LearnSphere is a modern, high-performance E-Learning platform featuring a stunning glassmorphic UI, high-speed custom video playback, and comprehensive course management capabilities.

![LearnSphere Hero Section](frontend/public/hero-preview.png) *(Note: Add your actual hero screenshot path here)*

## ✨ Key Features

### 🎨 Premium User Experience
- **Glassmorphic Design**: Sleek, modern interface using advanced CSS/Tailwind techniques.
- **Micro-animations**: Smooth transitions and interactive elements for a premium feel.
- **Redesigned Auth Pages**: High-conversion login and registration forms with real-time password validation.

### 📚 Course Management
- **Hybrid Video Support**: Seamless switching between YouTube embeds and local video hosting.
- **Course Tags & Filtering**: Organize and find content with a flexible tagging system.
- **Instructor Portal**: Specialized dashboards for course creators with analytics and attendee management.

### 🔐 Secure & Resilient
- **JWT Authentication**: Secure role-based access control (Learner, Instructor, Admin).
- **Graceful Error Handling**: Resilient backend architecture that stays alive during database connectivity challenges.
- **Auth-Aware Navigation**: Dynamic home redirection and navigation cleanup for logged-in users.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Zustand (State Management).
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT.
- **Emailing**: Nodemailer for system invitations and course updates.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (default: port 27017)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dineesh07/learnsphere.git
   cd learnsphere
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file based on the environment variables mentioned below
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/learnsphere
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

## 🤝 Contact
To become an instructor or inquire about collaborations, please contact us at [admin@learnsphere.com](mailto:admin@learnsphere.com).
