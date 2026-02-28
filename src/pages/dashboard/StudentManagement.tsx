import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  BookOpen,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
  Home,
} from "lucide-react";
import Modal from "../../components/common/Modal";

interface Student {
  id: number;
  name: string;
  studentId: string;
  photo: string;
  department: string;
  year: string;
  room: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  joinDate: string;
  status: "Active" | "Inactive" | "Alumni";
  paymentStatus: "Paid" | "Pending" | "Overdue";
  attendance: number;
}

const StudentManagement: React.FC = () => {
  const [searchTerm] = useState("");
  const [filterDepartment] = useState("all");
  const [filterYear] = useState("all");
  const [filterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data
  const students: Student[] = [
    {
      id: 1,
      name: "John Doe",
      studentId: "2024001",
      photo: "https://i.pravatar.cc/150?img=1",
      room: "101",
      department: "Computer Science",
      year: "3rd Year",
      email: "john.doe@university.edu",
      phone: "+880 1234-567890",
      guardianName: "Jane Doe",
      guardianPhone: "+880 1234-567891",
      address: "123 University Road, Dhaka",
      status: "Active",
      joinDate: "2022-01-15",
      paymentStatus: "Paid",
      attendance: 95,
    },
    {
      id: 2,
      name: "John Doe",
      studentId: "2024001",
      photo: "https://i.pravatar.cc/150?img=1",
      department: "CSE",
      year: "3rd",
      room: "A-502",
      email: "john@example.com",
      phone: "+880 1234567890",
      guardianName: "Jane Doe",
      guardianPhone: "+880 1987654321",
      address: "123 Main St, Dhaka",
      joinDate: "2022-01-15",
      status: "Active",
      paymentStatus: "Paid",
      attendance: 92,
    },
    // Add more student data...
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm);
    const matchesDept =
      filterDepartment === "all" || student.department === filterDepartment;
    const matchesYear = filterYear === "all" || student.year === filterYear;
    const matchesStatus =
      filterStatus === "all" || student.status === filterStatus;

    return matchesSearch && matchesDept && matchesYear && matchesStatus;
  });

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Alumni":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200"
          >
            <UserPlus size={20} />
            Add New Student
          </motion.button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Students",
            value: students.length,
            icon: Users,
            bgClass: "bg-indigo-100",
            textClass: "text-indigo-600",
          },
          {
            label: "Active Students",
            value: students.filter((s) => s.status === "Active").length,
            icon: CheckCircle,
            bgClass: "bg-green-100",
            textClass: "text-green-600",
          },
          {
            label: "Payment Due",
            value: students.filter((s) => s.paymentStatus === "Overdue").length,
            icon: AlertCircle,
            bgClass: "bg-red-100",
            textClass: "text-red-600",
          },
          {
            label: "Avg. Attendance",
            value: `${Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / (students.length || 1))}%`,
            icon: BookOpen,
            bgClass: "bg-blue-100",
            textClass: "text-blue-600",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <h3 className={"text-2xl font-bold mt-1 " + stat.textClass}>
                    {stat.value}
                  </h3>
                </div>
                <div className={"p-3 rounded-lg " + stat.bgClass}>
                  <Icon className={stat.textClass} size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Student Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredStudents.map((student) => (
          <motion.div
            key={student.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ID: {student.studentId}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs h-fit ${getStatusColor(student.status)}`}
                    >
                      {student.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen size={16} className="text-indigo-400" />
                  <span>
                    {student.department} - {student.year} Year
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home size={16} className="text-indigo-400" />
                  <span>Room {student.room}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="2024001"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Department
              </label>
              <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>CSE</option>
                <option>EEE</option>
                <option>ME</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            >
              Register Student
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentManagement;
