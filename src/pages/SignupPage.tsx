import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useMockData } from "../context/MockDataContext";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "manager">("student");
  const { register } = useMockData();
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    register(email, password, role);

    // The register function in context handles creating the student profile
    // Now we navigate based on the role
    if (role === "manager") {
      navigate("/manager");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">
          Sign Up
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "student" | "manager")
                }
                className="mt-1 block w-full p-2 border-none focus:ring-0 rounded-lg text-gray-700"
              >
                <option value="student">Student</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignup}
            className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
