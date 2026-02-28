import React, { useState } from "react";
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

interface Notice {
  id: number;
  title: string;
  content: string;
  category: "Meeting" | "Announcement" | "Event" | "Urgent";
  date: string;
  author: string;
  isPinned: boolean;
}

const NoticeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [notices] = useState<Notice[]>([
    {
      id: 1,
      title: "Monthly Hall Meeting",
      content:
        "All residents are required to attend the monthly hall meeting on March 25th at 7 PM in the common room.",
      category: "Meeting",
      date: "2024-03-20",
      author: "Hall Provost",
      isPinned: true,
    },
    {
      id: 2,
      title: "Water Supply Maintenance",
      content:
        "Water supply will be suspended for 2 hours (10 AM - 12 PM) on March 22nd due to tank cleaning.",
      category: "Announcement",
      date: "2024-03-19",
      author: "Maintenance Dept",
      isPinned: false,
    },
  ]);

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || n.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredNotices.map((notice) => (
          <motion.div
            key={notice.id}
            variants={itemVariants}
            whileHover={{ x: 5 }}
            className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${notice.isPinned ? "border-indigo-500" : "border-transparent"} border border-gray-100`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {notice.isPinned && (
                    <Pin size={16} className="text-indigo-500" />
                  )}
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
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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
        title="Create New Notice"
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Notice Title
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter title"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Meeting</option>
              <option>Announcement</option>
              <option>Event</option>
              <option>Urgent</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <textarea
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
