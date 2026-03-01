import React, { useState, useEffect } from "react";
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
  Search,
} from "lucide-react";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import { useMockData, Student } from "../../context/MockDataContext";

const StudentManagement: React.FC = () => {
  const { students, addStudent } = useMockData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showAddModal, setShowAddModal] = useState(false);

  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDepartment, filterYear, filterStatus, sortBy]);

  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");
  const [newDept, setNewDept] = useState("Computer Science");
  const [newYear, setNewYear] = useState("1st Year");

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newId) {
      alert("Please fill all required fields");
      return;
    }

    addStudent({
      name: newName,
      studentId: newId,
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random`,
      room: "TBD",
      department: newDept,
      year: newYear,
      email: `${newName.split(" ")[0].toLowerCase()}@university.edu`,
      phone: "+880 1XXXXXXXXX",
      guardianName: "Guardian Not Set",
      guardianPhone: "+880 1XXXXXXXXX",
      address: "Address Not Set",
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
      paymentStatus: "Pending",
      attendance: 100,
    });
    setNewName("");
    setNewId("");
    setNewDept("Computer Science");
    setNewYear("1st Year");
    setShowAddModal(false);
  };

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.includes(searchTerm);
      const matchesDept =
        filterDepartment === "all" || student.department === filterDepartment;
      const matchesYear = filterYear === "all" || student.year === filterYear;
      const matchesStatus =
        filterStatus === "all" || student.status === filterStatus;

      return matchesSearch && matchesDept && matchesYear && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "id") return a.studentId.localeCompare(b.studentId);
      if (sortBy === "attendance") return b.attendance - a.attendance;
      return 0;
    });

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">CSE</option>
              <option value="Electrical Eng">EEE</option>
              <option value="Mechanical Eng">ME</option>
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Alumni">Alumni</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="name">Sort by: Name</option>
              <option value="id">Sort by: Student ID</option>
              <option value="attendance">Sort by: High Attendance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {paginatedStudents.map((student) => (
          <motion.div
            key={student.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
          >
            <div className="p-6 flex flex-col flex-1">
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

              <div className="mt-4 space-y-3 flex-grow">
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

              <div className="mt-auto pt-6 flex justify-end gap-2">
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
      >
        <form className="space-y-4" onSubmit={handleAddStudent}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
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
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
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
              <select
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Computer Science">CSE</option>
                <option value="Electrical Eng">EEE</option>
                <option value="Mechanical Eng">ME</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <select
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
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
