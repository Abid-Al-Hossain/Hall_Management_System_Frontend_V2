import { LogIn, UserPlus, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useMockData } from "../../context/MockDataContext";

const AuthButtons = () => {
  const { currentUser, logout, resetAllData } = useMockData();

  if (currentUser) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium hidden md:block text-indigo-100">
          Hello, {currentUser.name}
        </span>
        <button
          onClick={logout}
          className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-indigo-700 text-white hover:bg-indigo-800 transition-colors duration-200"
        >
          <span>Logout</span>
        </button>
        <button
          onClick={resetAllData}
          title="Reset All Demo Data"
          className="flex items-center space-x-1 p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center space-x-4">
      <Link
        to="/login"
        className="hover:text-indigo-200 transition-colors duration-200"
      >
        <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200">
          <span>Login</span>
        </button>
      </Link>
      <LogIn size={18} />
      <Link
        to="/signup"
        className="hover:text-indigo-200 transition-colors duration-200"
      >
        <button className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-indigo-700 text-white hover:bg-indigo-800 transition-colors duration-200">
          <UserPlus size={18} />
          <span>Sign Up</span>
        </button>
      </Link>
      <button
        onClick={resetAllData}
        title="Reset All Demo Data"
        className="flex items-center space-x-1 p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
      >
        <RefreshCw size={18} />
      </button>
    </div>
  );
};

export default AuthButtons;
