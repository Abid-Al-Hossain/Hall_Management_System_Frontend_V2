import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Search, MessageSquare, User, Home } from "lucide-react";
import { useMockData, RoomApplication } from "../../context/MockDataContext";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";

const RoomApplicationManagement: React.FC = () => {
  const { roomApplications, updateRoomApplicationStatus } = useMockData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedApp, setSelectedApp] = useState<RoomApplication | null>(null);
  const [actionType, setActionType] = useState<"Accepted" | "Rejected" | null>(
    null,
  );
  const [managerMessage, setManagerMessage] = useState("");

  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredApps = roomApplications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.roomNumber.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleAction = () => {
    if (selectedApp && actionType) {
      updateRoomApplicationStatus(selectedApp.id, actionType, managerMessage);
      setSelectedApp(null);
      setActionType(null);
      setManagerMessage("");
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Room Applications</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search student or room..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {paginatedApps.map((app) => (
            <motion.div
              key={app.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Home size={24} />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(app.status)}`}
                  >
                    {app.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    Room {app.roomNumber}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <User size={14} />
                    <span>{app.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <Clock size={14} />
                    <span>Applied on {app.appliedAt}</span>
                  </div>
                </div>

                {app.status === "Pending" ? (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setActionType("Accepted");
                      }}
                      className="flex-1 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setActionType("Rejected");
                      }}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-gray-50">
                    <p className="text-xs text-gray-400 mb-1 font-medium">
                      Resolution Message:
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      {app.message || "No message provided."}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {paginatedApps.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-300" size={32} />
          </div>
          <p className="text-gray-500 font-medium">
            No room applications found
          </p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={!!selectedApp && !!actionType}
        onClose={() => {
          setSelectedApp(null);
          setActionType(null);
        }}
        title={`${actionType} Application`}
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-600">
              Student:{" "}
              <span className="font-bold text-gray-800">
                {selectedApp?.studentName}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Room Request:{" "}
              <span className="font-bold text-gray-800">
                Room {selectedApp?.roomNumber}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MessageSquare size={16} />
              Message to Student
            </label>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none text-sm"
              placeholder={`Write a message for the student regarding their ${actionType?.toLowerCase()} application...`}
              value={managerMessage}
              onChange={(e) => setManagerMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setSelectedApp(null);
                setActionType(null);
              }}
              className="px-6 py-2 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              className={`px-8 py-2 text-white rounded-xl font-bold shadow-lg transition-all ${
                actionType === "Accepted"
                  ? "bg-green-600 shadow-green-100 hover:bg-green-700"
                  : "bg-red-600 shadow-red-100 hover:bg-red-700"
              }`}
            >
              Confirm {actionType}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoomApplicationManagement;
