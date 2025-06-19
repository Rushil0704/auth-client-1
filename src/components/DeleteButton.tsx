/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";

interface DeleteAccountButtonProps {
  userId: string | null;
}

const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({
  userId,
}) => {
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

  if (!userId) return null;
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Unauthorized - No token found", {
          position: "top-right",
          theme: isDarkMode ? "dark" : "light",
        });
        return;
      }

      const response = await fetch(`http://localhost:8000/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: { message: string } = await response.json();

      if (response.ok) {
        localStorage.removeItem("authToken");
        toast.success("Account deleted successfully!", {
          position: "top-right",
          theme: isDarkMode ? "dark" : "light",
        });
        window.location.href = "/signup";
      } else {
        toast.error(data.message, {
          position: "top-right",
          theme: isDarkMode ? "dark" : "light",
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error deleting account. Please try again.", {
        position: "top-right",
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };

  return (
    <div>
      {/* Delete Button */}
      <button
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-gray-100"
        onClick={() => setShowConfirm(true)}
      >
        <Trash className="h-4 w-4" /> Your Account Delete
      </button>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowConfirm(false)} // Close when clicking outside
        >
          <div
            className="pointer-events-auto rounded-lg bg-white p-6 text-start shadow-lg dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="mb-4 text-lg font-semibold dark:text-white">
              Confirm Delete
            </h2>
            <p className="mb-4 font-normal dark:text-gray-300">
              Are you sure you want to delete your account?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="rounded-lg bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={deleteAccount}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DeleteAccountButton;
