import React, { useState, useEffect } from "react";
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
import Pagination from "../../components/common/Pagination";
import { useMockData } from "../../context/MockDataContext";

const RoomManagement: React.FC = () => {
  const { rooms, addRoom, deleteRoom } = useMockData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("number");
  const [showAddModal, setShowAddModal] = useState(false);

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterFloor, filterType, filterStatus, sortBy]);

  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState("");
  const [newRoomType, setNewRoomType] = useState("Single");
  const [newRoomFacilities, setNewRoomFacilities] = useState("");

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber) {
      alert("Please fill required fields (Number)");
      return;
    }
    const capacity =
      newRoomType === "Single" ? 1 : newRoomType === "Double" ? 2 : 3;
    addRoom({
      number: newRoomNumber,
      floor: newRoomFloor,
      type: newRoomType as "Single" | "Double" | "Triple",
      capacity,
      occupied: 0,
      status: "Available",
      lastMaintenance: new Date().toISOString().split("T")[0],
      facilities: newRoomFacilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    });
    setNewRoomNumber("");
    setNewRoomFloor("");
    setNewRoomType("Single");
    setNewRoomFacilities("");
    setShowAddModal(false);
  };

  const filteredRooms = rooms
    .filter((room) => {
      const matchesSearch = room.number
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFloor = filterFloor === "all" || room.floor === filterFloor;
      const matchesType = filterType === "all" || room.type === filterType;
      const matchesStatus =
        filterStatus === "all" || room.status === filterStatus;
      return matchesSearch && matchesFloor && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "capacity") return b.capacity - a.capacity;
      if (sortBy === "status") {
        if (a.status === "Available" && b.status !== "Available") return -1;
        if (a.status !== "Available" && b.status === "Available") return 1;
        return a.number.localeCompare(b.number);
      }
      return a.number.localeCompare(b.number);
    });

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
              {Array.from(new Set(rooms.map((r) => r.floor)))
                .sort()
                .map((f) => (
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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="number">Sort by: Room Number</option>
              <option value="status">Sort by: Available First</option>
              <option value="capacity">Sort by: Highest Capacity</option>
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
        {paginatedRooms.map((room) => {
          const isAvailable = room.status === "Available";
          const isMaintenance = room.status === "Maintenance";

          return (
            <motion.div
              key={room.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={
                "bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col h-full " +
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

              <div className="space-y-3 flex-grow">
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

              <div className="mt-auto p-4 flex justify-end gap-2 bg-gray-50 border-t border-gray-100">
                <button
                  className="p-2 text-gray-400 cursor-not-allowed rounded"
                  title="Editing is disabled in mock preview"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this room?",
                      )
                    ) {
                      deleteRoom(room.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-white hover:shadow-sm rounded transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add New Room Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Room"
      >
        <form className="space-y-4" onSubmit={handleAddRoom}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Room Number
              </label>
              <input
                type="text"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. 101"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Floor</label>
              <input
                type="text"
                value={newRoomFloor}
                onChange={(e) => setNewRoomFloor(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. 6th, Ground, Annex"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Room Type
              </label>
              <select
                value={newRoomType}
                onChange={(e) => setNewRoomType(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Facilities (Comma separated)
            </label>
            <input
              type="text"
              value={newRoomFacilities}
              onChange={(e) => setNewRoomFacilities(e.target.value)}
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
