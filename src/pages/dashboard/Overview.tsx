import { Users, Home, Bell, MessageSquare, ArrowUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Complaint, useMockData } from "../../context/MockDataContext";

interface OverviewProps {
  stats: {
    totalStudents: number;
    occupiedRooms: number;
    availableRooms: number;
    pendingComplaints: number;
    pendingApplications: number;
    totalNotices: number;
  };
  complaints: Complaint[];
}

const Overview: React.FC<OverviewProps> = ({ stats, complaints }) => {
  const { students } = useMockData();

  const deptCount = students.reduce(
    (acc, curr) => {
      acc[curr.department] = (acc[curr.department] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const deptData = Object.entries(deptCount).map(([name, count]) => ({
    name,
    count,
  }));

  const statusCount = complaints.reduce(
    (acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const statusData = Object.entries(statusCount).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.totalStudents}
              </h3>
              <span className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUp size={12} className="mr-1" />
                Active Capacity
              </span>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.occupiedRooms + stats.availableRooms}
              </h3>
              <span className="text-xs text-indigo-600 flex items-center mt-1">
                <ArrowUp size={12} className="mr-1" />
                Active Capacity
              </span>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Home className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Pending Applications</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.pendingApplications}
              </h3>
              <span className="text-xs text-orange-600 flex items-center mt-1">
                Action Required
              </span>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Home className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Active Notices</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.totalNotices}
              </h3>
              <span className="text-xs text-orange-600 flex items-center mt-1">
                <ArrowUp size={12} className="mr-1" />
                Current Term
              </span>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <MessageSquare className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Pending Issues</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.pendingComplaints}
              </h3>
              <span className="text-xs text-red-600 flex items-center mt-1">
                Action Required
              </span>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Bell className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Department */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Students by Department
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints By Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Complaints by Status
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Complaints
        </h3>
        <div className="space-y-4">
          {complaints.length > 0 ? (
            complaints.slice(0, 5).map((complaint) => (
              <div
                key={complaint.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${
                    complaint.priority.toLowerCase() === "high"
                      ? "bg-red-100"
                      : complaint.priority.toLowerCase() === "medium"
                        ? "bg-orange-100"
                        : "bg-green-100"
                  }`}
                >
                  <Bell
                    className={`${
                      complaint.priority.toLowerCase() === "high"
                        ? "text-red-600"
                        : complaint.priority.toLowerCase() === "medium"
                          ? "text-orange-600"
                          : "text-green-600"
                    }`}
                    size={20}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {complaint.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Room {complaint.roomNumber} - {complaint.studentName}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {complaint.createdAt || complaint.date}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent complaints
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
