import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import About from "./components/home/About";
import Features from "./components/home/Features";
import ChatWidget from "./components/chat/ChatWidget";
import Footer from "./components/layout/Footer";
import ManagerDashboard from "./pages/ManagerDashboard";

import RoomsPage from "./pages/RoomsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import NoticesPage from "./pages/NoticesPage";
import PaymentPage from "./pages/PaymentPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PageTransition from "./components/layout/PageTransition";
import { MockDataProvider } from "./context/MockDataContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Hero />
              <About />
              <Features />
            </PageTransition>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRole="manager">
              <PageTransition>
                <ManagerDashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute allowedRole="student">
              <PageTransition>
                <RoomsPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute allowedRole="student">
              <PageTransition>
                <ComplaintsPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices"
          element={
            <ProtectedRoute allowedRole="student">
              <PageTransition>
                <NoticesPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRole="student">
              <PageTransition>
                <PaymentPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <SignupPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <MockDataProvider>
      <Router>
        <div className="min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-100 via-indigo-50 to-pink-100 animate-gradient-blur" />

          <div className="relative z-10 flex flex-col min-h-screen text-gray-800">
            <Navbar />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>
            <ChatWidget />
            <Footer />
          </div>
        </div>
      </Router>
    </MockDataProvider>
  );
}

export default App;
