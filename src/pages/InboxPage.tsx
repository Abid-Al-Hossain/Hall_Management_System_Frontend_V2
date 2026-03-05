import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Trash2, Clock, Search, Info } from "lucide-react";
import { useMockData, Message } from "../context/MockDataContext";
import Pagination from "../components/common/Pagination";

const InboxPage: React.FC = () => {
  const { messages, currentUser, markMessageAsRead, deleteMessage } =
    useMockData();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const userMessages = messages.filter(
    (m) => m.recipientId === currentUser?.id,
  );

  const filteredMessages = userMessages.filter(
    (m) =>
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.senderName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleOpenMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      markMessageAsRead(msg.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Mail className="text-indigo-600" size={40} />
            My Inbox
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Stay updated with your applications and hall notifications.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
        {/* Message List */}
        <div
          className={`lg:col-span-5 space-y-3 ${selectedMessage ? "hidden lg:block" : "block"}`}
        >
          <AnimatePresence mode="popLayout">
            {paginatedMessages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  selectedMessage?.id === msg.id
                    ? "bg-indigo-50 border-indigo-200 shadow-indigo-100 shadow-lg"
                    : "bg-white border-transparent hover:border-gray-100 hover:shadow-md"
                } ${!msg.isRead ? "relative" : ""}`}
              >
                {!msg.isRead && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-600 rounded-full animate-pulse shadow-indigo-200 shadow" />
                )}
                <div className="flex gap-4">
                  <div
                    className={`p-3 rounded-xl h-fit ${msg.isRead ? "bg-gray-50 text-gray-400" : "bg-indigo-100 text-indigo-600"}`}
                  >
                    <Mail size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p
                        className={`text-sm ${msg.isRead ? "text-gray-400" : "text-indigo-600 font-bold"}`}
                      >
                        {msg.senderName}
                      </p>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {msg.sentAt.split(",")[0]}
                      </span>
                    </div>
                    <h3
                      className={`text-gray-800 truncate mb-1 ${msg.isRead ? "font-medium" : "font-black"}`}
                    >
                      {msg.subject}
                    </h3>
                    <p className="text-gray-500 font-medium text-xs line-clamp-1">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredMessages.length === 0 && (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-100">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-400 font-black text-xl">Empty Box</p>
              <p className="text-gray-400 text-sm mt-1">
                No messages found in your inbox.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Message Detail */}
        <div
          className={`lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 min-h-[500px] overflow-hidden flex flex-col ${!selectedMessage ? "hidden lg:flex items-center justify-center p-12 bg-gray-50/30" : "flex"}`}
        >
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full"
              >
                {/* Mobile Header */}
                <div className="lg:hidden p-4 border-b border-gray-50 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-1 text-gray-400">
                      <Mail size={16} />
                      <span className="text-xs font-bold font-sans">BACK</span>
                    </div>
                  </button>
                  <span className="font-bold text-gray-800">Back to Inbox</span>
                </div>

                <div className="p-8 md:p-10 flex-grow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-8 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100">
                        {selectedMessage.senderName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 lg:text-xl">
                          {selectedMessage.senderName}
                        </h4>
                        <p className="text-indigo-600 font-bold text-sm">
                          System Administrator
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm font-medium flex items-center justify-end gap-2">
                        <Clock size={16} />
                        {selectedMessage.sentAt}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                      {selectedMessage.subject}
                    </h2>
                    <div className="bg-indigo-50/30 p-8 rounded-3xl border border-indigo-100/50 min-h-[200px]">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg font-medium">
                        {selectedMessage.content}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 flex justify-end gap-4 border-t border-gray-100">
                  <button
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all text-sm group"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this message?",
                        )
                      ) {
                        deleteMessage(selectedMessage.id);
                        setSelectedMessage(null);
                      }
                    }}
                  >
                    <Trash2
                      size={18}
                      className="text-red-400 group-hover:text-red-600 transition-colors"
                    />
                    Delete Message
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
                  <Mail size={56} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                    Select a Message
                  </h3>
                  <p className="text-gray-500 font-medium max-w-xs mx-auto mt-2 leading-relaxed">
                    Click on a notification from your list to read the full
                    details of your application or updates.
                  </p>
                </div>
                <div className="pt-4">
                  <div className="flex items-center justify-center gap-2 text-indigo-600 bg-indigo-50/50 py-2 px-4 rounded-full w-fit mx-auto">
                    <Info size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Help tip: Unread messages have a blue dot
                    </span>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
