import React, { createContext, useContext, useState, ReactNode } from "react";

// Define Data Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: "student" | "manager";
}

export interface Room {
  id: number;
  number: string;
  floor: string;
  type: "Single" | "Double" | "Triple";
  capacity: number;
  occupied: number;
  status: "Available" | "Occupied" | "Maintenance";
  lastMaintenance: string;
  monthlyRent: number;
  facilities: string[];
  occupants?: {
    id: number;
    name: string;
    studentId: string;
  }[];
}

export interface Student {
  id: number;
  name: string;
  studentId: string;
  photo: string;
  department: string;
  year: string;
  room: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  joinDate: string;
  status: "Active" | "Inactive" | "Alumni";
  paymentStatus: "Paid" | "Pending" | "Overdue";
  attendance: number;
}

export interface Complaint {
  id: number;
  studentName: string;
  room: string;
  roomNumber?: string;
  title: string;
  category: string;
  description: string;
  status:
    | "Pending"
    | "In Progress"
    | "Resolved"
    | "pending"
    | "in-progress"
    | "resolved";
  priority: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  assignedTo?: string;
  comments: number | Array<any>;
}

export interface Payment {
  id: number;
  studentName: string;
  studentId: string;
  amount: string;
  purpose: string;
  date: string;
  method: string;
  status: "Completed" | "Pending" | "Failed";
}

export interface Notice {
  id: number;
  title: string;
  date: string;
  category: string;
  type?: string;
  priority: string;
  content: string;
  description?: string;
  author: string;
  isPinned?: boolean;
}

// Define Context State
interface MockDataContextType {
  currentUser: User | null;
  users: User[];
  rooms: Room[];
  students: Student[];
  complaints: Complaint[];
  payments: Payment[];
  notices: Notice[];
  login: (email: string, pass: string) => boolean;
  register: (email: string, pass: string, role?: "student" | "manager") => void;
  logout: () => void;
  addComplaint: (
    complaint: Omit<
      Complaint,
      "id" | "date" | "status" | "comments" | "createdAt"
    >,
  ) => void;
  updateComplaintStatus: (id: number, status: Complaint["status"]) => void;
  addPayment: (payment: Omit<Payment, "id" | "status" | "date">) => void;
  addNotice: (notice: Omit<Notice, "id" | "date">) => void;
  deleteNotice: (id: number) => void;
  addRoom: (room: Omit<Room, "id">) => void;
  addStudent: (student: Omit<Student, "id">) => void;
}

const MockDataContext = createContext<MockDataContextType | null>(null);

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context)
    throw new Error("useMockData must be used within a MockDataProvider");
  return context;
};

// Initial Mock Data Provider
export const MockDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initial Seed Data
  const [users, setUsers] = useState<User[]>([
    { id: 1, email: "manager@test.com", name: "Hall Manager", role: "manager" },
    { id: 2, email: "student@test.com", name: "John Doe", role: "student" },
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      number: "101",
      floor: "1st",
      type: "Double",
      capacity: 2,
      occupied: 2,
      status: "Occupied",
      lastMaintenance: "2024-02-15",
      monthlyRent: 5000,
      facilities: ["AC", "Attached Bathroom", "Balcony"],
      occupants: [
        { id: 1, name: "John Doe", studentId: "2024001" },
        { id: 2, name: "Jane Smith", studentId: "2024002" },
      ],
    },
  ]);

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "John Doe",
      studentId: "2024001",
      photo: "https://i.pravatar.cc/150?img=1",
      room: "101",
      department: "Computer Science",
      year: "3rd Year",
      email: "john.doe@university.edu",
      phone: "+880 1234-567890",
      guardianName: "Jane Doe",
      guardianPhone: "+880 1234-567891",
      address: "123 University Road, Dhaka",
      status: "Active",
      joinDate: "2022-01-15",
      paymentStatus: "Paid",
      attendance: 95,
    },
  ]);

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 1,
      studentName: "John Doe",
      room: "A-201",
      roomNumber: "A-201",
      title: "Leaking Pipe",
      category: "Maintenance",
      description: "Water leaking from the sink",
      status: "pending",
      priority: "high",
      date: "2024-03-20",
      createdAt: "2024-03-20",
      comments: 3,
    },
    {
      id: 2,
      studentName: "Jane Smith",
      room: "B-105",
      roomNumber: "B-105",
      title: "Broken Window",
      category: "Facility",
      description: "Window latch is broken",
      status: "in-progress",
      priority: "medium",
      date: "2024-03-19",
      createdAt: "2024-03-19",
      comments: 1,
    },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      studentName: "John Doe",
      studentId: "2024001",
      amount: "5000",
      purpose: "Hall Fee",
      date: "2024-03-20",
      method: "bKash",
      status: "Completed",
    },
    {
      id: 2,
      studentName: "Jane Smith",
      studentId: "2024002",
      amount: "3500",
      purpose: "Dining Fee",
      date: "2024-03-19",
      method: "Card",
      status: "Completed",
    },
  ]);

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: "Monthly Hall Meeting",
      content:
        "All residents are required to attend the monthly hall meeting on March 25th at 7 PM in the common room.",
      description:
        "All residents are required to attend the monthly hall meeting on March 25th at 7 PM in the common room.",
      category: "Meeting",
      type: "updates",
      priority: "High",
      date: "2024-03-20",
      author: "Hall Provost",
      isPinned: true,
    },
    {
      id: 2,
      title: "Water Supply Maintenance",
      content:
        "Water supply will be suspended for 2 hours (10 AM - 12 PM) on March 22nd due to tank cleaning.",
      description:
        "Water supply will be suspended for 2 hours (10 AM - 12 PM) on March 22nd due to tank cleaning.",
      category: "Announcement",
      type: "maintenance",
      priority: "High",
      date: "2024-03-19",
      author: "Maintenance Dept",
      isPinned: false,
    },
  ]);

  // Auth Actions
  const login = (email: string, pass: string) => {
    // Highly simplified mock check
    const user = users.find((u) => u.email === email);
    if (user && pass.length > 0) {
      // any pass works for now
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (
    email: string,
    _pass: string,
    role: "student" | "manager" = "student",
  ) => {
    const newUser: User = {
      id: Date.now(),
      email,
      name: email.split("@")[0],
      role,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser); // log them in automatically
  };

  const logout = () => setCurrentUser(null);

  // Data Actions
  const addComplaint = (
    c: Omit<Complaint, "id" | "date" | "status" | "comments" | "createdAt">,
  ) => {
    setComplaints((prev) => [
      {
        id: Date.now(),
        ...c,
        status: "pending",
        comments: 0,
        createdAt: new Date().toISOString().split("T")[0],
        date: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
  };

  const updateComplaintStatus = (id: number, status: Complaint["status"]) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  };

  const addPayment = (p: Omit<Payment, "id" | "status" | "date">) => {
    setPayments((prev) => [
      {
        id: Date.now(),
        ...p,
        status: "Completed",
        date: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
  };

  const addNotice = (n: Omit<Notice, "id" | "date">) => {
    setNotices((prev) => [
      {
        id: Date.now(),
        ...n,
        date: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
  };

  const deleteNotice = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const addRoom = (r: Omit<Room, "id">) => {
    setRooms((prev) => [{ id: Date.now(), ...r }, ...prev]);
  };

  const addStudent = (s: Omit<Student, "id">) => {
    setStudents((prev) => [{ id: Date.now(), ...s }, ...prev]);
  };

  return (
    <MockDataContext.Provider
      value={{
        currentUser,
        users,
        rooms,
        students,
        complaints,
        payments,
        notices,
        login,
        register,
        logout,
        addComplaint,
        updateComplaintStatus,
        addPayment,
        addNotice,
        deleteNotice,
        addRoom,
        addStudent,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};
