import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useMockData } from "../context/MockDataContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useMockData();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    const success = login(email, password);
    if (success) {
      // Find the user to check role, technically current user is updated in context but react might not see it mid-render for the redirect
      // For this simple mock, if login works we just send to manager if email has 'manager', else root
      if (email.includes("manager")) {
        navigate("/manager");
      } else {
        navigate("/");
      }
    } else {
      alert("Invalid credentials. Use manager@test.com or student@test.com");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">
          Login
        </h1>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <Mail className="ml-2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 block w-full p-2 border-none focus:ring-0"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <Lock className="ml-2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 block w-full p-2 border-none focus:ring-0"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
