import React, { createContext, useContext, useState, ReactNode } from "react";

// Define Data Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: "student" | "manager";
  password?: string;
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
  toggleNoticePin: (id: number) => void;
  addRoom: (room: Omit<Room, "id">) => void;
  addStudent: (student: Omit<Student, "id">) => void;
  appliedRooms: string[];
  applyForRoom: (roomNumber: string) => void;
}

const MockDataContext = createContext<MockDataContextType | null>(null);

// --- BULK MOCK DATA GENERATORS ---
const generateRooms = (): Room[] => {
  const rooms: Room[] = [];
  let idCounter = 1;
  ["1st", "2nd", "3rd", "4th", "5th"].forEach((floor) => {
    for (let i = 1; i <= 20; i++) {
      const capacity = Math.random() > 0.5 ? 2 : Math.random() > 0.5 ? 1 : 3;
      const occupied = Math.floor(Math.random() * (capacity + 1));
      const type =
        capacity === 1 ? "Single" : capacity === 2 ? "Double" : "Triple";
      rooms.push({
        id: idCounter++,
        number: `${floor.charAt(0)}${i.toString().padStart(2, "0")}`,
        floor: floor,
        type: type as "Single" | "Double" | "Triple",
        capacity,
        occupied,
        status:
          occupied === capacity
            ? "Occupied"
            : Math.random() > 0.1
              ? "Available"
              : "Maintenance",
        lastMaintenance: "2024-02-15",
        facilities: ["AC", "Attached Bathroom", "Balcony"],
      });
    }
  });
  return rooms;
};

const generateStudents = (): Student[] => {
  const students: Student[] = [];
  const depts = [
    "Computer Science",
    "Electrical Eng",
    "Mechanical Eng",
    "Civil Eng",
    "BBA",
  ];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Masters"];
  const statuses = ["Active", "Active", "Active", "Inactive", "Alumni"];
  for (let i = 1; i <= 250; i++) {
    students.push({
      id: i,
      name: `Student ${i}`,
      studentId: `2024${i.toString().padStart(3, "0")}`,
      photo: `https://ui-avatars.com/api/?name=Student+${i}&background=random`,
      room: `${Math.floor(Math.random() * 5 + 1)}${Math.floor(
        Math.random() * 20 + 1,
      )
        .toString()
        .padStart(2, "0")}`,
      department: depts[Math.floor(Math.random() * depts.length)],
      year: years[Math.floor(Math.random() * years.length)],
      email: `student${i}@university.edu`,
      phone: `+880 1234-${Math.floor(Math.random() * 900000 + 100000)}`,
      guardianName: `Guardian ${i}`,
      guardianPhone: `+880 1234-${Math.floor(Math.random() * 900000 + 100000)}`,
      address: `123 University Road, Dhaka`,
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      joinDate: "2022-01-15",
      paymentStatus:
        Math.random() > 0.8
          ? Math.random() > 0.5
            ? "Pending"
            : "Overdue"
          : "Paid",
      attendance: Math.floor(Math.random() * 40 + 60),
    });
  }
  return students;
};

const generateComplaints = (): Complaint[] => {
  const complaints: Complaint[] = [];
  const categories = ["Maintenance", "Facility", "Security", "Other"];
  const statuses = ["pending", "in-progress", "resolved"];
  const priorities = ["high", "medium", "low"];
  for (let i = 1; i <= 50; i++) {
    complaints.push({
      id: i,
      studentName: `Student ${(i % 250) + 1}`,
      room: `A-${Math.floor(Math.random() * 500 + 100)}`,
      roomNumber: `${Math.floor(Math.random() * 5 + 1)}0${Math.floor(Math.random() * 9 + 1)}`,
      title: `Issue Report #${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      description: "Detailed description of the complaint goes here.",
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      date: `2024-03-${Math.floor(Math.random() * 28 + 1)
        .toString()
        .padStart(2, "0")}`,
      createdAt: `2024-03-${Math.floor(Math.random() * 28 + 1)
        .toString()
        .padStart(2, "0")}`,
      comments: Math.floor(Math.random() * 5),
    });
  }
  return complaints;
};

const generatePayments = (): Payment[] => {
  const payments: Payment[] = [];
  for (let i = 1; i <= 150; i++) {
    payments.push({
      id: i,
      studentName: `Student ${i}`,
      studentId: `2024${i.toString().padStart(3, "0")}`,
      amount: Math.random() > 0.5 ? "5000" : "3500",
      purpose: Math.random() > 0.5 ? "Hall Fee" : "Dining Fee",
      date: `2024-03-${Math.floor(Math.random() * 28 + 1)
        .toString()
        .padStart(2, "0")}`,
      method: Math.random() > 0.5 ? "bKash" : "Card",
      status: "Completed",
    });
  }
  return payments;
};

const generateNotices = (): Notice[] => {
  const notices: Notice[] = [];
  for (let i = 1; i <= 20; i++) {
    notices.push({
      id: i,
      title: `Official Notice #${i}`,
      content:
        "This is a detailed content string for the notice. Please read carefully and act accordingly.",
      description: "A short preview description of the notice content.",
      category:
        i % 3 === 0 ? "Meeting" : i % 2 === 0 ? "Event" : "Announcement",
      type: "updates",
      priority: i % 5 === 0 ? "High" : "Normal",
      date: `2024-03-${Math.floor(Math.random() * 28 + 1)
        .toString()
        .padStart(2, "0")}`,
      author: "Manager",
      isPinned: i <= 3,
    });
  }
  return notices;
};
// ---------------------------------

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
  const [appliedRooms, setAppliedRooms] = useState<string[]>([]);

  // Initial Seed Data
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      email: "manager@test.com",
      name: "Hall Manager",
      role: "manager",
      password: "password123",
    },
    {
      id: 2,
      email: "student@test.com",
      name: "John Doe",
      role: "student",
      password: "password123",
    },
  ]);

  const [rooms, setRooms] = useState<Room[]>(generateRooms());
  const [students, setStudents] = useState<Student[]>(generateStudents());
  const [complaints, setComplaints] =
    useState<Complaint[]>(generateComplaints());
  const [payments, setPayments] = useState<Payment[]>(generatePayments());
  const [notices, setNotices] = useState<Notice[]>(generateNotices());

  const login = (email: string, pass: string) => {
    // Highly simplified mock check
    const user = users.find((u) => u.email === email);
    const validPassword = user?.password || "password123";
    if (user && pass === validPassword) {
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
      password: _pass,
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

  const toggleNoticePin = (id: number) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)),
    );
  };

  const addRoom = (r: Omit<Room, "id">) => {
    setRooms((prev) => [{ id: Date.now(), ...r }, ...prev]);
  };

  const addStudent = (s: Omit<Student, "id">) => {
    setStudents((prev) => [{ id: Date.now(), ...s }, ...prev]);
  };

  const applyForRoom = (roomNumber: string) => {
    if (!appliedRooms.includes(roomNumber)) {
      setAppliedRooms((prev) => [...prev, roomNumber]);
    }
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
        appliedRooms,
        login,
        register,
        logout,
        addComplaint,
        updateComplaintStatus,
        addPayment,
        addNotice,
        deleteNotice,
        toggleNoticePin,
        addRoom,
        addStudent,
        applyForRoom,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};
