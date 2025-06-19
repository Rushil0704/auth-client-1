import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const DarkModeButton: React.FC = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-3 text-gray-700 dark:text-gray-200"
    >
      {darkMode ? (
        <Moon className="h-5 w-5 text-neutral-400" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
      )}
    </button>
  );
};

export default DarkModeButton;
