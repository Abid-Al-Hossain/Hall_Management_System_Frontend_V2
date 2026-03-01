import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  Users,
  Bell,
  Settings,
  Menu,
  X,
  Home,
  PieChart,
  AlertCircle,
} from "lucide-react";

import RoomManagement from "./dashboard/RoomManagement";
import StudentManagement from "./dashboard/StudentManagement";
import NoticeManagement from "./dashboard/NoticeManagement";
import ComplaintManagement from "./dashboard/ComplaintManagement";
import Overview from "./dashboard/Overview";
import { useMockData } from "../context/MockDataContext";

type DashboardSection =
  | "overview"
  | "rooms"
  | "students"
  | "notices"
  | "complaints"
  | "settings";

interface NavigationItem {
  id: DashboardSection;
  label: string;
  icon: any;
}

const ManagerDashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] =
    useState<DashboardSection>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const { students, rooms, notices, complaints } = useMockData();

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (
      path &&
      [
        "overview",
        "rooms",
        "students",
        "notices",
        "complaints",
        "settings",
      ].includes(path)
    ) {
      setSelectedSection(path as DashboardSection);
    }
  }, [location]);

  const navigationItems: NavigationItem[] = [
    { id: "overview", label: "Overview", icon: PieChart },
    { id: "rooms", label: "Room Management", icon: Home },
    { id: "students", label: "Student Management", icon: Users },
    { id: "notices", label: "Notice Management", icon: Bell },
    { id: "complaints", label: "Complaint Box", icon: AlertCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = {
    totalStudents: students.length,
    occupiedRooms: rooms.filter((r) => r.status === "Occupied").length,
    availableRooms: rooms.filter((r) => r.status === "Available").length,
    pendingComplaints: complaints.filter(
      (c) => c.status.toLowerCase() === "pending",
    ).length,
    totalNotices: notices.length,
    monthlyRevenue: 150000,
  };

  const renderSection = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {(() => {
            switch (selectedSection) {
              case "rooms":
                return <RoomManagement />;
              case "students":
                return <StudentManagement />;
              case "notices":
                return <NoticeManagement />;
              case "complaints":
                return <ComplaintManagement />;
              case "settings":
                return (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Settings
                    </h2>
                    <p className="mt-4 text-gray-600">
                      Settings are coming soon...
                    </p>
                  </div>
                );
              default:
                return (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      Dashboard Overview
                    </h2>
                    <Overview stats={stats} complaints={complaints} />
                  </div>
                );
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Side Navigation */}
      <div
        className={`
          fixed inset-y-0 left-0 w-64 bg-indigo-900 text-white p-4 z-30
          transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold">Hall Manager</h2>
          <button
            className="lg:hidden p-2 hover:bg-indigo-800 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {navigationItems.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedSection(id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${
                  selectedSection === id
                    ? "bg-white text-indigo-950 shadow-lg font-semibold"
                    : "text-indigo-100 hover:bg-indigo-800/50"
                }
              `}
            >
              <Icon size={20} />
              {label}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen relative overflow-x-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-20">
          <h2 className="font-bold text-indigo-900">Hall Manager</h2>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Content Area */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">{renderSection()}</div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
