import { useState } from "react";
import NoticeItem from "../components/notices/NoticeItem";
import { useMockData } from "../context/MockDataContext";

const NoticesPage = () => {
  const { notices } = useMockData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;

  const filteredNotices = notices.filter((notice) => {
    return (
      (filter === "all" || notice.type === filter) &&
      notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(
    indexOfFirstNotice,
    indexOfLastNotice,
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(filteredNotices.length / noticesPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 mx-1 rounded-md ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600"
              }`}
              aria-label={`Go to page ${i + 1}`}
            >
              {i + 1}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default NoticesPage;
