/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  LayoutDashboard,
  Users,
  Menu,
  PenTool,
  FileChartColumnIncreasingIcon,
  Upload,
} from "lucide-react";
import DeleteAccountButton from "@/components/DeleteButton";
import LogoutButton from "@/components/LogoutButton";
import { useAppState } from "@/hooks/authUserList";
import DarkModeButton from "./DarkModeButton";

const MenuButton: React.FC = () => {
  const { user, fetchLoggedInUser } = useAppState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const fetchCalled = useRef(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!fetchCalled.current && !user) {
      fetchCalled.current = true;
      fetchLoggedInUser();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="flex items-center gap-1" ref={menuRef}>
      <h2 className="pr-2.5 text-gray-800 dark:text-gray-200">
        {user?.firstName ? `${user.firstName} ${user.lastName}` : "Loading..."}
      </h2>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 z-10 mt-2 w-96 rounded-lg bg-white py-1 shadow-lg transition-all dark:bg-gray-800">
            <button
              onClick={() => {
                navigate("/dashboard");
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>

            <button
              onClick={() => {
                navigate("/categories-list");
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <FileChartColumnIncreasingIcon className="h-4 w-4" />
              Categories
            </button>

            <button
              onClick={() => {
                navigate("/users-list");
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Users className="h-4 w-4" />
              All Users
            </button>

            <button
              onClick={() => {
                navigate("/edit-account");
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Edit className="h-4 w-4" />
              Profile Edit
            </button>

            <button
              onClick={() => {
                navigate("/forgot-password");
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <PenTool className="h-4 w-4" />
              Forgot Password?
            </button>

            <button
              onClick={() => {
                navigate("/image-upload");
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Upload className="h-4 w-4" />
              Upload Logo
            </button>

            <DeleteAccountButton userId={user ? user._id : null} />
            <LogoutButton />
          </div>
        )}
      </div>
      <div className="rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
        <DarkModeButton />
      </div>
    </div>
  );
};

export default MenuButton;
