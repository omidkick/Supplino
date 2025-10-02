# SUPPLINO

SUPPLINO is a modern **fullstack application** designed to provide a scalable and user-friendly platform for managing users, products, and orders. Built with **Next.js + Tailwind CSS** for the frontend and **Node.js + Express.js + MongoDB** for the backend, it offers role-based access and a responsive interface.

---

## 🚀 Technologies Used

### Frontend
- **Next.js** – Server-Side Rendering (SSR) and SEO optimization
- **Tailwind CSS** – Utility-first CSS framework for rapid UI development
- **React Hooks** – Functional components with state and lifecycle features

### Backend
- **Node.js** – JavaScript runtime for building scalable network applications
- **Express.js** – Web application framework for Node.js
- **MongoDB** – NoSQL database for flexible data storage

---

## ✨ Features

- **User Authentication**: Secure login and registration
- **Role-Based Dashboards**: Separate dashboards for admins and users
- **Product Management**: Add, edit, and delete products
- **Order Management**: Create and manage orders
- **Search and Filter**: Efficiently search and filter products
- **Responsive Design**: Optimized for mobile, tablet, and desktop views
- **Minimalist UI**: Clean and user-friendly interface

---

## 📂 Project Structure

/frontend # Next.js + Tailwind CSS
/backend # Node.js + Express.js
/database # MongoDB models and configuration

---

## 🛠 How to Use

# 1. Clone the repository
git clone https://github.com/omidkick/Supplino.git
cd Supplino


# 2. Install and run frontend
cd frontend
npm install
npm run dev
Open http://localhost:3000 in your browser

# 3. Install and run backend
cd backend
npm install
npm run dev
API runs on http://localhost:5000 (or your configured port)

# 4. Environment variables
Create a .env file in /backend with necessary variables:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key


📌 Future Improvements
JWT authentication
Online payment integration
Enhanced UI/UX with animations
Unit & integration tests

👨‍💻 Developer
Developed with ❤️ by Omid Jabbari
