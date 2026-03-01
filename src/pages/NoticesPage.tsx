import { useState, useEffect } from "react";
import NoticeItem from "../components/notices/NoticeItem";
import { useMockData } from "../context/MockDataContext";
import Pagination from "../components/common/Pagination";

const NoticesPage = () => {
  const { notices } = useMockData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  const filteredNotices = notices
    .filter((notice) => {
      return (
        (filter === "all" || notice.category === filter) &&
        notice.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(
    indexOfFirstNotice,
    indexOfLastNotice,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">
        Notices
      </h1>
      <div className="max-w-4xl mx-auto mb-4">
        <input
          type="text"
          placeholder="Search notices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          aria-label="Search notices"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          aria-label="Filter notices"
        >
          <option value="all">All</option>
          <option value="maintenance">Maintenance</option>
          <option value="events">Events</option>
          <option value="updates">Updates</option>
        </select>
      </div>
      <div className="max-w-4xl mx-auto">
        {currentNotices.map((notice) => (
          <NoticeItem
            key={notice.id}
            title={notice.title}
            date={notice.date}
            description={notice.description || notice.content}
            type={(notice.type as any) || "updates"}
            onClick={() => alert(`Viewing details for: ${notice.title}`)}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default NoticesPage;
