import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { User } from "@/types/User";

// Define the AppState type
interface AppState {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loggedInUser: string | null;
  loginUser: string | null;
  fetchLoggedInUser: () => Promise<void>;
}

// Create Context
const AppStateContext = createContext<AppState | undefined>(undefined);

// Create Provider Component
export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [loginUser, setLoginUser] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
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

  const fetchLoggedInUser = async (): Promise<void> => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      if (user) {
        toast.error("Authentication error. Please login again.", {
          theme: isDarkMode ? "dark" : "light",
        });
      }
      setUser(null);
      return;
    }

    try {
      const { data } = await axios.get("http://localhost:8000/users/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLoggedInUser(data.role);
      setLoginUser(data._id);
      setUser(data);
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
      if (user) {
        toast.error("Session expired. Please login again.", {
          theme: isDarkMode ? "dark" : "light",
        });
      }
      localStorage.removeItem("authToken");
      setUser(null);
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        user,
        setUser,
        loggedInUser,
        loginUser,
        fetchLoggedInUser,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

// Create Custom Hook to Access Context
// eslint-disable-next-line react-refresh/only-export-components
export const useAppState = (): AppState => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
