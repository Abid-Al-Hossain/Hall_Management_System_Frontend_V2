# 🏢 Hall Management System (HMS) V2

A modern, high-performance Hall Management System built with **React**, **TypeScript**, and **Vite**. This application features a robust mock data engine, persistent sessions, role-based access control, and dynamic dashboards for both Managers and Students.

![Landing Page Mockup](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070)

---

## ✨ Key Features

### 🔐 Role-Based Access Control (RBAC)

- **Manager Dashboard**: Comprehensive tools for room allocation, student management, notices, and complaint tracking.
- **Student Portal**: Secure interface for room applications, viewing notices, and submitting complaints.
- **Protected Routes**: Secure navigation logic preventing unauthorized access to role-specific sections.

### 💾 Persistent State

- **Bypass Browser Rebuilds**: Uses `localStorage` to persist authentication and all application data (rooms, students, payments, etc.).
- **Intelligent Routing**: Hash-based URL persistence (`/#notices`, `/#rooms`) ensures you stay on the correct tab even after a hard refresh.

### 📊 Dynamic Dashboards & Data

- **Real-time Stats**: Auto-calculated occupancy and revenue charts.
- **Mock DB Engine**: Realistic data generation scripts for students and rooms.
- **Sorting & Pagination**: Efficient handling of large datasets with scalable pagination and multi-criteria sorting.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or higher)
- [npm](https://www.npmjs.com/) (v7.x or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Abid-Al-Hossain/Hall_Management_System_Frontend_V2.git
   cd Hall_Management_System_Frontend_V2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

### Build for Production

Create a production-ready bundle:

```bash
npm run build
```

---

## 🛠 Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
