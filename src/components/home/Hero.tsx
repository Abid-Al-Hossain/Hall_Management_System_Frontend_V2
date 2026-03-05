import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DashboardIcon from "../icons/DashboardIcon";
import { useMockData } from "../../context/MockDataContext";

const Hero = () => {
  const { currentUser } = useMockData();
  const isManager = currentUser?.role === "manager";
  const isStudent = currentUser?.role === "student";

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] mix-blend-overlay opacity-20" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in-up">
            Welcome to Hall Management System
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100 animate-fade-in-up animation-delay-200">
            Streamline your hall management experience with our comprehensive
            digital solution. Access all services and information in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {isManager ? (
              <Link to="/manager" className="w-full sm:w-auto">
                <button className="group w-full flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105">
                  <DashboardIcon size={20} />
                  Access Dashboard
                  <ArrowRight
                    className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                    size={20}
                  />
                </button>
              </Link>
            ) : (
              <>
                <Link
                  to={isStudent ? "/rooms" : "/signup"}
                  className="w-full sm:w-auto"
                >
                  <button className="group w-full flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105">
                    {isStudent ? "View Rooms" : "Get Started"}
                    <ArrowRight
                      className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                      size={20}
                    />
                  </button>
                </Link>
                {isStudent && (
                  <Link to="/complaints" className="w-full sm:w-auto">
                    <button className="group w-full flex items-center justify-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105">
                      Submit Complaint
                      <ArrowRight
                        className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                        size={20}
                      />
                    </button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
              style={{
                animationDelay: `${i * 2}s`,
                transform: `translate(-50%, -50%) translate(${Math.sin(i) * 100}px, ${Math.cos(i) * 100}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
