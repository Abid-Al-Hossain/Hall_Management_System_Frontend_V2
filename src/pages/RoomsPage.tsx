import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMockData } from "../context/MockDataContext";
import RoomApplicationForm from "../components/rooms/RoomApplicationForm";
import Pagination from "../components/common/Pagination";

const RoomsPage = () => {
  const { rooms, currentUser, appliedRooms } = useMockData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "student") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("number");

  const sortedRooms = [...rooms].sort((a, b) => {
    if (sortBy === "status") {
      if (a.status === "Available" && b.status !== "Available") return -1;
      if (a.status !== "Available" && b.status === "Available") return 1;
      return a.number.localeCompare(b.number);
    }
    return a.number.localeCompare(b.number);
  });

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const totalPages = Math.ceil(sortedRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = sortedRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleApply = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
  };

  const closeForm = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rooms Page</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <p className="text-gray-600">
          Check room availability and apply for accommodation below.
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
        >
          <option value="number">Sort by: Room Number</option>
          <option value="status">Sort by: Available First</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedRooms.map((room) => (
          <div
            key={room.id}
            className={`p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full ${
              room.status === "Available"
                ? "bg-white border-green-200"
                : "bg-gray-50 border-gray-200 opacity-75"
            }`}
          >
            <div className="flex justify-between items-center mb-4 min-h-[36px]">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">Room {room.number}</h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                    room.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : room.status === "Maintenance"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {room.status}
                </span>
              </div>
              {room.status === "Available" &&
                !appliedRooms.includes(room.number) && (
                  <button
                    onClick={() => handleApply(room.number)}
                    className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
                  >
                    Apply
                  </button>
                )}
              {room.status === "Available" &&
                appliedRooms.includes(room.number) && (
                  <span className="px-4 py-1.5 bg-gray-100 text-gray-400 text-sm rounded-lg font-medium cursor-not-allowed border border-gray-200">
                    Applied
                  </span>
                )}
            </div>
            <div className="space-y-2 mt-4 text-gray-700 flex-grow">
              <p className="flex justify-between">
                <span>Floor:</span>{" "}
                <span className="font-medium">{room.floor}</span>
              </p>
              <p className="flex justify-between">
                <span>Type:</span>{" "}
                <span className="font-medium">{room.type}</span>
              </p>
              <p className="flex justify-between">
                <span>Capacity:</span>{" "}
                <span className="font-medium">
                  {room.occupied}/{room.capacity}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {selectedRoom && (
        <RoomApplicationForm roomNumber={selectedRoom} onClose={closeForm} />
      )}
    </div>
  );
};

export default RoomsPage;
