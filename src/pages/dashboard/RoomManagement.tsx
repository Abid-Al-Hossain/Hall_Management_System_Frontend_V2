import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building,
  Users,
  CheckCircle,
  AlertTriangle,
  Search,
  Plus,
  Settings,
  Edit,
  Trash2,
} from "lucide-react";
import Modal from "../../components/common/Modal";
import { useMockData } from "../../context/MockDataContext";

const RoomManagement: React.FC = () => {
  const { rooms } = useMockData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFloor = filterFloor === "all" || room.floor === filterFloor;
    const matchesType = filterType === "all" || room.type === filterType;
    const matchesStatus =
      filterStatus === "all" || room.status === filterStatus;
    return matchesSearch && matchesFloor && matchesType && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Room Management</h2>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
          >
            <Plus size={20} />
            Add New Room
          </motion.button>
          <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Rooms",
            value: rooms.length,
            icon: Building,
            color: "indigo",
            bgClass: "bg-indigo-100",
            textClass: "text-indigo-600",
          },
          {
            label: "Available Rooms",
            value: rooms.filter((r) => r.status === "Available").length,
            icon: CheckCircle,
            color: "green",
            bgClass: "bg-green-100",
            textClass: "text-green-600",
          },
          {
            label: "Under Maintenance",
            value: rooms.filter((r) => r.status === "Maintenance").length,
            icon: AlertTriangle,
            color: "orange",
            bgClass: "bg-orange-100",
            textClass: "text-orange-600",
          },
          {
            label: "Occupancy Rate",
            value: `${Math.round((rooms.reduce((acc, room) => acc + room.occupied, 0) / rooms.reduce((acc, room) => acc + room.capacity, 0)) * 100)}%`,
            icon: Users,
            color: "blue",
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
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Floors</option>
              {["1st", "2nd", "3rd"].map((f) => (
                <option key={f} value={f}>
                  {f} Floor
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              {["Single", "Double", "Triple"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              {["Available", "Occupied", "Maintenance"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Room Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRooms.map((room) => {
          const isAvailable = room.status === "Available";
          const isMaintenance = room.status === "Maintenance";

          return (
            <motion.div
              key={room.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={
                "bg-white rounded-2xl shadow-sm border overflow-hidden " +
                (isAvailable
                  ? "border-green-100"
                  : isMaintenance
                    ? "border-orange-100"
                    : "border-gray-100")
              }
            >
              <div
                className={
                  "p-4 border-b border-gray-100 flex justify-between items-center " +
                  (isAvailable
                    ? "bg-green-50"
                    : isMaintenance
                      ? "bg-orange-50"
                      : "bg-gray-50")
                }
              >
                <h3 className="text-xl font-bold text-gray-800">
                  Room {room.number}
                </h3>
                <span
                  className={
                    "px-3 py-1 rounded-full text-sm font-bold " +
                    (isAvailable
                      ? "bg-green-100 text-green-700"
                      : isMaintenance
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-200 text-gray-700")
                  }
                >
                  {room.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{room.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">
                    {room.occupied}/{room.capacity}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Rent:</span>
                  <span className="font-medium">৳{room.monthlyRent}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Facilities:</p>
                <div className="flex flex-wrap gap-2">
                  {room.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {facility}
                    </span>
                  ))}
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
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add New Room Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Room"
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Room Number
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. 101"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Floor</label>
              <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>1st Floor</option>
                <option>2nd Floor</option>
                <option>3rd Floor</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Room Type
              </label>
              <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>Single</option>
                <option>Double</option>
                <option>Triple</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Monthly Rent (৳)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. 5000"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Facilities (Comma separated)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="AC, Wifi, etc."
            />
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
              Add Room
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomManagement;
