import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppState } from "@/hooks/authUserList";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAppState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.clear();

      setUser(null);
      toast.success("Logout successful!", {
        theme: isDarkMode ? "dark" : "light",
      });
      navigate("/login", { replace: true, state: { focusEmail: true } });
    } catch (error) {
      toast.error("Logout failed. Please try again.", {
        theme: isDarkMode ? "dark" : "light",
      });
      console.error("Error during logout", error);
    }
  };

  return (
    <div>
      {/* Logout Button */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="w-80 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold dark:text-white">
              Confirm Logout
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
