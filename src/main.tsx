import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppStateProvider } from "./hooks/authUserList";

const root = document.getElementById("root");

// Check stored theme on initial load
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark") {
    document.documentElement.classList.add("dark");
} else {
    document.documentElement.classList.remove("dark");
}

ReactDOM.createRoot(root!).render(
    <React.StrictMode>
        <AppStateProvider>
            <ToastContainer />
            <App />
        </AppStateProvider>
    </React.StrictMode>
);
