import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle } from "lucide-react";

interface Complaint {
  id: number;
  title: string;
  status: "Pending" | "In Progress" | "Resolved";
  date: string;
  priority: "Low" | "Medium" | "High";
  category?: string;
  location?: string;
  description?: string;
  comments?: Array<{
    id: number;
    text: string;
    date: string;
    user: string;
  }>;
}

const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 1,
      title: "Leaking pipe in washroom",
      status: "Pending",
      date: "2024-03-15",
      priority: "High",
      category: "Plumbing",
      location: "Block A, Floor 2",
      description: "Water leaking from sink pipe causing floor damage",
      comments: [
        {
          id: 1,
          text: "Maintenance team has been notified",
          date: "2024-03-15",
          user: "Admin",
        },
      ],
    },
    {
      id: 2,
      title: "Noisy environment at night",
      status: "Resolved",
      date: "2024-03-14",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Broken window in room 105",
      status: "In Progress",
      date: "2024-03-13",
      priority: "High",
    },
  ]);

  const [newComplaint, setNewComplaint] = useState("");
  const [priority, setPriority] = useState<Complaint["priority"]>("Medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || complaint.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaint.trim()) return;

    const newEntry: Complaint = {
      id: complaints.length + 1,
      title: newComplaint,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      priority,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      location,
      description,
      comments: [],
    };
    setComplaints([newEntry, ...complaints]);
    setIsSubmitted(true);
    resetForm();
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const resetForm = () => {
    setNewComplaint("");
    setPriority("Medium");
    setSelectedCategory("all");
    setLocation("");
    setDescription("");
  };

  const getStatusColor = (status: Complaint["status"]) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24 border border-indigo-100">
            <div className="bg-indigo-600 p-6 text-white text-center">
              <h2 className="text-xl font-bold">Submit a Complaint</h2>
              <p className="text-indigo-100 text-sm mt-1">
                We'll help you fix it.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 text-center bg-green-50 rounded-xl"
                  >
                    <AlertCircle
                      className="text-green-600 mx-auto mb-4"
                      size={48}
                    />
                    <h3 className="text-green-800 font-bold text-lg">
                      Sent Successfully!
                    </h3>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <motion.div variants={itemVariants} className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Complaint Title
                      </label>
                      <input
                        type="text"
                        value={newComplaint}
                        onChange={(e) => setNewComplaint(e.target.value)}
                        className="w-full p-3 bg-gray-50 border rounded-xl"
                        placeholder="e.g. WiFi not working"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full p-3 bg-gray-50 border rounded-xl"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg"
                    >
                      Submit Complaint
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredComplaints.map((c) => (
              <motion.div
                key={c.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {c.date} • {c.category || "General"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(c.status)}`}
                  >
                    {c.status}
                  </span>
                </div>
                {c.description && (
                  <p className="mt-4 text-gray-600 text-sm leading-relaxed italic">
                    "{c.description}"
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;
