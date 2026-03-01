import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Plus,
  Calendar,
  User,
  Pin,
  Edit,
  Trash2,
} from "lucide-react";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import { useMockData, Notice } from "../../context/MockDataContext";

const NoticeManagement: React.FC = () => {
  const { notices, addNotice, deleteNotice, toggleNoticePin, currentUser } =
    useMockData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showAddModal, setShowAddModal] = useState(false);

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, sortBy]);

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Meeting");
  const [newContent, setNewContent] = useState("");

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      alert("Please fill all fields");
      return;
    }
    addNotice({
      title: newTitle,
      category: newCategory,
      priority: "Normal",
      content: newContent,
      author: currentUser?.name || "Manager",
      isPinned: false,
    });
    setNewTitle("");
    setNewCategory("Meeting");
    setNewContent("");
    setShowAddModal(false);
  };

  const filteredNotices = notices
    .filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || n.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Secondary sort by date
      if (sortBy === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getCategoryColor = (category: Notice["category"]) => {
    switch (category) {
      case "Meeting":
        return "bg-blue-100 text-blue-800";
      case "Announcement":
        return "bg-green-100 text-green-800";
      case "Event":
        return "bg-purple-100 text-purple-800";
      case "Urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">
        <h2 className="text-2xl font-bold text-gray-800">Notice Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-semibold"
        >
          <Plus size={20} />
          Create New Notice
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Notices",
            value: notices.length,
            icon: Bell,
            color: "indigo",
          },
          {
            label: "Pinned",
            value: notices.filter((n) => n.isPinned).length,
            icon: Pin,
            color: "orange",
          },
          {
            label: "Upcoming Events",
            value: notices.filter((n) => n.category === "Event").length,
            icon: Calendar,
            color: "green",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 bg-${stat.color}-50 rounded-xl text-${stat.color}-600`}
              >
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Meeting">Meeting</option>
          <option value="Announcement">Announcement</option>
          <option value="Event">Event</option>
          <option value="Urgent">Urgent</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
        >
          <option value="newest">Sort by: Newest First</option>
          <option value="oldest">Sort by: Oldest First</option>
        </select>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {paginatedNotices.map((notice) => (
          <motion.div
            key={notice.id}
            variants={itemVariants}
            whileHover={{ x: 5 }}
            className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${notice.isPinned ? "border-indigo-500" : "border-transparent"} border border-gray-100`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => toggleNoticePin(notice.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pin
                      size={16}
                      className={
                        notice.isPinned
                          ? "text-indigo-500 fill-indigo-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                  <h3 className="text-lg font-bold text-gray-800">
                    {notice.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(notice.category)}`}
                  >
                    {notice.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {notice.content}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {notice.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={14} /> {notice.author}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteNotice(notice.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
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
        title="Create New Notice"
      >
        <form className="space-y-4" onSubmit={handleAddNotice}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Notice Title
            </label>
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
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Meeting">Meeting</option>
              <option value="Announcement">Announcement</option>
              <option value="Event">Event</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-3 border border-gray-100 rounded-xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Enter notice content"
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
              Post Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticeManagement;
