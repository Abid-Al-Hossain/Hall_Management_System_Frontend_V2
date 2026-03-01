import React, { useState } from "react";
import { MessageSquare, Bell, Home, DollarSign, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import AuthButtons from "../auth/AuthButtons";
import DashboardIcon from "../icons/DashboardIcon";
import { useMockData } from "../../context/MockDataContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useMockData();
  const isManager = currentUser?.role === "manager";
  const isStudent = currentUser?.role === "student";

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
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
        <div className="md:hidden">
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
                  icon={<DollarSign size={20} />}
                  text="Payment"
                  route="/payment"
                />
              </>
            )}
            <div className="pt-4 flex flex-col space-y-2">
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
    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 hover:text-white transition-colors duration-200"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;
