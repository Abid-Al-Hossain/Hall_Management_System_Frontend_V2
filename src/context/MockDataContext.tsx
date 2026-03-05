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

export interface RoomApplication {
  id: number;
  studentId: number;
  studentName: string;
  roomNumber: string;
  status: "Pending" | "Accepted" | "Rejected";
  appliedAt: string;
  message?: string; // Message from manager when accepted/rejected
}

export interface Message {
  id: number;
  recipientId: number; // Student's user id
  senderName: string; // Manager
  subject: string;
  content: string;
  isRead: boolean;
  sentAt: string;
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
  login: (email: string, pass: string, role: "student" | "manager") => boolean;
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
  deleteRoom: (id: number) => void;
  addStudent: (student: Omit<Student, "id">) => void;
  deleteStudent: (id: number) => void;
  deleteComplaint: (id: number) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  appliedRooms: string[];
  applyForRoom: (roomNumber: string) => void;
  roomApplications: RoomApplication[];
  addRoomApplication: (roomNumber: string) => void;
  updateRoomApplicationStatus: (
    id: number,
    status: "Accepted" | "Rejected",
    message: string,
  ) => void;
  messages: Message[];
  addMessage: (recipientId: number, subject: string, content: string) => void;
  markMessageAsRead: (id: number) => void;
  deleteMessage: (id: number) => void;
  resetAllData: () => void;
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
// --- LocalStorage Hook Helper ---
function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
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
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("hms_currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [roomApplications, setRoomApplications] = useLocalStorage<
    RoomApplication[]
  >("hms_room_applications", []);

  const [messages, setMessages] = useLocalStorage<Message[]>(
    "hms_messages",
    [],
  );

  // Sync auth state across tabs
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "hms_currentUser") {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        setCurrentUser(newUser);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Intentionally omitting useState for appliedRooms since it's converted below

  // Initial Seed Data
  const [users, setUsers] = useLocalStorage<User[]>("hms_users", [
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

  const [rooms, setRooms] = useLocalStorage<Room[]>("hms_rooms", generateRooms);
  const [students, setStudents] = useLocalStorage<Student[]>(
    "hms_students",
    generateStudents,
  );
  const [complaints, setComplaints] = useLocalStorage<Complaint[]>(
    "hms_complaints",
    generateComplaints,
  );
  const [payments, setPayments] = useLocalStorage<Payment[]>(
    "hms_payments",
    generatePayments,
  );
  const [notices, setNotices] = useLocalStorage<Notice[]>(
    "hms_notices",
    generateNotices,
  );
  const [appliedRooms, setAppliedRooms] = useLocalStorage<string[]>(
    "hms_appliedRooms",
    [],
  );

  const login = (email: string, pass: string, role: "student" | "manager") => {
    const user = users.find((u) => u.email === email && u.role === role);
    if (user && user.password === pass) {
      setCurrentUser(user);
      localStorage.setItem("hms_currentUser", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = (
    email: string,
    _pass: string,
    role: "student" | "manager" = "student",
  ) => {
    const newUserId = Date.now();
    const newUser: User = {
      id: newUserId,
      email,
      name: email.split("@")[0],
      role,
      password: _pass,
    };

    setUsers((prev) => [...prev, newUser]);

    // If it's a student, create a matching student profile
    if (role === "student") {
      const newStudent: Student = {
        id: newUserId, // Use same ID for linkage
        name: email.split("@")[0],
        studentId: `2024${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        photo: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=random`,
        room: "Pending", // Initial state
        department: "General",
        year: "1st Year",
        email: email,
        phone: "Not Set",
        guardianName: "Not Set",
        guardianPhone: "Not Set",
        address: "Not Set",
        status: "Active",
        joinDate: new Date().toISOString().split("T")[0],
        paymentStatus: "Pending",
        attendance: 0,
      };
      setStudents((prev) => [newStudent, ...prev]);
    }

    setCurrentUser(newUser); // log them in automatically
    localStorage.setItem("hms_currentUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("hms_currentUser");
  };

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

  const deleteRoom = (id: number) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const addStudent = (s: Omit<Student, "id">) => {
    setStudents((prev) => [{ id: Date.now(), ...s }, ...prev]);
  };

  const deleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const deleteComplaint = (id: number) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  };

  const applyForRoom = (roomNumber: string) => {
    setAppliedRooms((prev) => [...prev, roomNumber]);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem("hms_currentUser", JSON.stringify(updatedUser)); // Persist session update immediately

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u)),
    );

    // If student, synchronize matching student record
    if (currentUser.role === "student") {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === currentUser.id || s.email === currentUser.email
            ? {
                ...s,
                name: updates.name || s.name,
                email: updates.email || s.email,
              }
            : s,
        ),
      );
    }
  };

  const addRoomApplication = (roomNumber: string) => {
    if (!currentUser) return;
    const newApp: RoomApplication = {
      id: Date.now(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNumber: roomNumber,
      status: "Pending",
      appliedAt: new Date().toLocaleDateString(),
    };
    setRoomApplications((prev) => [newApp, ...prev]);
  };

  const updateRoomApplicationStatus = (
    id: number,
    status: "Accepted" | "Rejected",
    message: string,
  ) => {
    // Find the application in current state
    const application = roomApplications.find((a) => a.id === id);
    if (!application) return;

    // Update application status
    setRoomApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status, message } : app)),
    );

    // Send notification message to student
    addMessage(
      application.studentId,
      `Room Application ${status}: Room ${application.roomNumber}`,
      `Your application for Room ${application.roomNumber} has been ${status.toLowerCase()}.${message ? ` Message: ${message}` : ""}`,
    );

    // If accepted, update room occupancy and student record
    if (status === "Accepted") {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.number === application.roomNumber) {
            const newOccupied = Math.min(r.capacity, r.occupied + 1);
            return {
              ...r,
              occupied: newOccupied,
              status: newOccupied >= r.capacity ? "Occupied" : r.status,
            };
          }
          return r;
        }),
      );

      // Update student's room in the directory
      // We try to match by studentId (as User ID) or studentName as a fallback
      setStudents((prev) =>
        prev.map((s) =>
          s.id === application.studentId || s.name === application.studentName
            ? { ...s, room: application.roomNumber }
            : s,
        ),
      );
    }
  };

  const addMessage = (
    recipientId: number,
    subject: string,
    content: string,
  ) => {
    const newMessage: Message = {
      id: Date.now(),
      recipientId,
      senderName: "Hall Manager",
      subject,
      content,
      isRead: false,
      sentAt: new Date().toLocaleString(),
    };
    setMessages((prev) => [newMessage, ...prev]);
  };

  const markMessageAsRead = (id: number) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg)),
    );
  };

  const deleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const resetAllData = () => {
    localStorage.clear();
    window.location.href = "/";
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
        deleteComplaint,
        addPayment,
        addNotice,
        deleteNotice,
        toggleNoticePin,
        addRoom,
        deleteRoom,
        addStudent,
        deleteStudent,
        applyForRoom,
        updateUserProfile,
        roomApplications,
        addRoomApplication,
        updateRoomApplicationStatus,
        messages,
        addMessage,
        markMessageAsRead,
        deleteMessage,
        resetAllData,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};
