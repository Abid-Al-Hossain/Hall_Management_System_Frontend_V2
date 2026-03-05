import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Search,
  Plus,
  Clock,
  CheckCircle,
  MessageCircle,
  Users,
  Building,
  Download,
  RefreshCw,
  Wrench,
  Home,
} from "lucide-react";
import { useMockData } from "../../context/MockDataContext";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";

const ComplaintManagement: React.FC = () => {
  const { complaints, updateComplaintStatus, addComplaint, currentUser } =
    useMockData();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStatus, filterPriority, sortBy]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Maintenance");
  const [newDescription, setNewDescription] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("");

  const handleAddComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newRoomNumber) {
      alert("Please fill all fields");
      return;
    }

    addComplaint({
      studentName: currentUser?.name || "Manager",
      room: newRoomNumber,
      roomNumber: newRoomNumber,
      title: newTitle,
      description: newDescription,
      category: newCategory,
      priority: "medium",
    });

    setNewTitle("");
    setNewDescription("");
    setNewCategory("Maintenance");
    setNewRoomNumber("");
    setShowAddModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "maintenance":
        return Wrench;
      case "facility":
        return Building;
      case "roommate":
        return Users;
      case "room application":
        return Home;
      case "other":
      default:
        return AlertCircle;
    }
  };

  const filteredComplaints = complaints
    .filter((complaint) => {
      const matchesSearch = complaint.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || complaint.category === filterCategory;
      const matchesStatus =
        filterStatus === "all" || complaint.status === filterStatus;
      const matchesPriority =
        filterPriority === "all" || complaint.priority === filterPriority;
      return (
        matchesSearch && matchesCategory && matchesStatus && matchesPriority
      );
    })
    .sort((a, b) => {
      if (sortBy === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "priority") {
        const p: any = { high: 3, medium: 2, low: 1 };
        return (
          (p[b.priority.toLowerCase()] || 0) -
          (p[a.priority.toLowerCase()] || 0)
        );
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Complaint Management
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            New Complaint
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={20} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {complaints.length}
              </h3>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <AlertCircle className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {complaints.filter((c) => c.status === "pending").length}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {complaints.filter((c) => c.status === "in-progress").length}
              </h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Wrench className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {complaints.filter((c) => c.status === "resolved").length}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
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
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="maintenance">Maintenance</option>
              <option value="facility">Facility</option>
              <option value="roommate">Roommate</option>
              <option value="Room Application">Room Application</option>
              <option value="other">Other</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="priority">Sort by: Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {paginatedComplaints.map((complaint) => {
          const CategoryIcon = getCategoryIcon(complaint.category);
          return (
            <div
              key={complaint.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${getPriorityColor(complaint.priority)}`}
                  >
                    <CategoryIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {complaint.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {complaint.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            updateComplaintStatus(
                              complaint.id,
                              e.target.value as any,
                            )
                          }
                          className={`px-2 py-1 rounded-full text-xs font-semibold border-none cursor-pointer ${getStatusColor(complaint.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{complaint.studentName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building size={16} />
                        <span>Room {complaint.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{complaint.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        <span>{complaint.comments} comments</span>
                      </div>
                    </div>
                    {complaint.assignedTo && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Assigned to:{" "}
                          <span className="font-medium text-gray-800">
                            {complaint.assignedTo}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Complaint"
      >
        <form className="space-y-4" onSubmit={handleAddComplaint}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter title"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Room Number
            </label>
            <input
              type="text"
              value={newRoomNumber}
              onChange={(e) => setNewRoomNumber(e.target.value)}
              className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. 101"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Facility">Facility</option>
              <option value="Roommate">Roommate</option>
              <option value="Room Application">Room Application</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full p-3 border border-gray-100 rounded-xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Describe the issue"
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-6 py-2 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComplaintManagement;
