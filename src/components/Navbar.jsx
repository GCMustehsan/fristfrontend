import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activePage, setActivePage] = useState("/");
  const [idToken, setIdToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Simulate fetching ID token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    setIdToken(token);
    setActivePage(location.pathname);
  }, [location]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    navigate("/signin");
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/design", label: "Design Tool" },
  ];

  return (
    <nav className="sticky top-0 z-50 px-4 lg:px-6 h-14 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link to="/" className="text-xl font-bold dark:text-white">
          Frist'OX Studio
        </Link>
      </div>

      {/* Hamburger Icon for Small Screens */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isOpen ? (
            <FiX className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          ) : (
            <FiMenu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          )}
        </button>
      </div>

      {/* Links and Profile */}
      <div
        className={`lg:flex items-center justify-center space-x-4 ${
          isOpen ? "flex" : "hidden"
        } lg:flex flex-row lg:flex-row absolute lg:static top-14 left-0 w-full lg:w-auto bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent border-b lg:border-none border-gray-200 dark:border-gray-800`}
      >
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`block lg:inline text-sm font-medium py-2 lg:py-0 px-4 lg:px-2 ${
              activePage === item.to
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="block lg:inline p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 mx-4 lg:mx-0"
        >
          {darkMode ? (
            <FiSun className="w-5 h-5 text-gray-200" />
          ) : (
            <FiMoon className="w-5 h-5 text-gray-700" />
          )}
        </button>

        {/* Profile Section */}
        {idToken ? (
          <div className="relative">
            {/* Profile Icon */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FaUserCircle className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              <span className="hidden lg:inline text-sm font-medium dark:text-gray-200">
                {localStorage.getItem("name") || "User"}
              </span>
            </button>
            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                {/* <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setProfileOpen(false)}
                >
                  Profile
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Sign In and Sign Up Buttons if not authenticated
          <>
            <Link
              to="/signin"
              className="block lg:inline px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mx-4 lg:mx-0"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="block lg:inline px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 mx-4 lg:mx-0"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
