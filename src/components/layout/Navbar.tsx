import React, { useState } from "react";
import {
  MessageSquare,
  Bell,
  Home,
  DollarSign,
  Menu,
  X,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthButtons from "../auth/AuthButtons";
import DashboardIcon from "../icons/DashboardIcon";
import { useMockData } from "../../context/MockDataContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, messages } = useMockData();
  const isManager = currentUser?.role === "manager";
  const isStudent = currentUser?.role === "student";

  const unreadCount = messages.filter(
    (m) => m.recipientId === currentUser?.id && !m.isRead,
  ).length;

  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 font-bold text-xl">
            Hall Management
          </Link>
          <div className="hidden md:flex space-x-8">
            {isManager && (
              <NavItem
                icon={<DashboardIcon size={20} />}
                text="Dashboard"
                route="/manager"
              />
            )}
            {isStudent && (
              <>
                <NavItem
                  icon={<Home size={20} />}
                  text="Rooms"
                  route="/rooms"
                />
                <NavItem
                  icon={<MessageSquare size={20} />}
                  text="Complain"
                  route="/complaints"
                />
                <NavItem
                  icon={<Bell size={20} />}
                  text="Notices"
                  route="/notices"
                />
                <NavItem
                  icon={
                    <div className="relative">
                      <Mail size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-indigo-600 font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  }
                  text="Inbox"
                  route="/inbox"
                />
                <NavItem
                  icon={<DollarSign size={20} />}
                  text="Payment"
                  route="/payment"
                />
              </>
            )}
          </div>
          <div className="hidden md:block">
            <AuthButtons />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-indigo-700 border-t border-indigo-500 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isManager && (
              <MobileNavItem
                icon={<DashboardIcon size={20} />}
                text="Dashboard"
                route="/manager"
              />
            )}
            {isStudent && (
              <>
                <MobileNavItem
                  icon={<Home size={20} />}
                  text="Rooms"
                  route="/rooms"
                />
                <MobileNavItem
                  icon={<MessageSquare size={20} />}
                  text="Complain"
                  route="/complaints"
                />
                <MobileNavItem
                  icon={<Bell size={20} />}
                  text="Notices"
                  route="/notices"
                />
                <MobileNavItem
                  icon={
                    <div className="relative">
                      <Mail size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-indigo-700 font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  }
                  text="Inbox"
                  route="/inbox"
                />
                <MobileNavItem
                  icon={<DollarSign size={20} />}
                  text="Payment"
                  route="/payment"
                />
              </>
            )}
            <div className="pt-4 flex flex-col space-y-2 border-t border-indigo-500 mt-4">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem = ({
  icon,
  text,
  route,
}: {
  icon: React.ReactNode;
  text: string;
  route: string;
}) => (
  <Link
    to={route}
    className="flex items-center space-x-1 hover:text-indigo-200 transition-colors duration-200"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

const MobileNavItem = ({
  icon,
  text,
  route,
}: {
  icon: React.ReactNode;
  text: string;
  route: string;
}) => (
  <Link
    to={route}
    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800 hover:text-white transition-colors duration-200"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;
