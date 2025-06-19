/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeClosed } from "lucide-react";
import { useAppState } from "@/hooks/authUserList";
import DarkModeButton from "@/components/DarkModeButton";

interface PasswordFormInputs {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const schema = yup.object().shape({
    currentPassword: yup
        .string()
        .matches(
            /[A-Z]/,
            "*Password must contain at least one uppercase letter."
        )
        .matches(
            /[a-z]/,
            "*Password must contain at least one lowercase letter."
        )
        .matches(/[0-9]/, "*Password must contain at least one number.")
        .matches(
            /[@$!%*?&#]/,
            "*Password must contain at least one special character."
        )
        .required("*Current password is required."),
    newPassword: yup
        .string()
        .min(8, "*Password must be at least 8 characters.")
        .matches(
            /[A-Z]/,
            "*Password must contain at least one uppercase letter."
        )
        .matches(
            /[a-z]/,
            "*Password must contain at least one lowercase letter."
        )
        .matches(/[0-9]/, "*Password must contain at least one number.")
        .matches(
            /[@$!%*?&#]/,
            "*Password must contain at least one special character."
        )
        .required("*Password is required."),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), undefined], "*Passwords must match.")
        .required("*Confirm password is required."),
});

const ChangePassword: React.FC = () => {
    const navigate = useNavigate();
    const { loginUser, fetchLoggedInUser } = useAppState();
    const API_URL = "http://localhost:8000/users/updatePassword";

    const [currentPassword, setCurrentPassword] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<boolean>(false);
    const hasFetched = useRef(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordFormInputs>({
        resolver: yupResolver(schema),
    });

    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains("dark")
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

    useEffect(() => {
        if (!loginUser && !hasFetched.current) {
            fetchLoggedInUser();
            hasFetched.current = true;
        }
    }, [loginUser, fetchLoggedInUser]);

    const onSubmit = async (data: PasswordFormInputs) => {
        if (!loginUser) {
            toast.error("User not found. Please log in again.", {
                theme: isDarkMode ? "dark" : "light",
            });
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Authentication error. Please login again.", {
                theme: isDarkMode ? "dark" : "light",
            });
            return;
        }

        try {
            await axios.put(
                `${API_URL}/${loginUser}`,
                {
                    oldPassword: data.currentPassword,
                    newPassword: data.newPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            toast.success("Password updated successfully!", {
                theme: isDarkMode ? "dark" : "light",
            });
            navigate("/dashboard");
        } catch (error: any) {
            if (error.status) {
                if (error.status === 403) {
                    toast.error("Password Invalid. Try again.", {
                        theme: isDarkMode ? "dark" : "light",
                    });
                } else if (error.status === 404) {
                    toast.error("Same password. Try again.", {
                        theme: isDarkMode ? "dark" : "light",
                    });
                } else {
                    toast.error(
                        "failed forget password. Please try again later.",
                        {
                            theme: isDarkMode ? "dark" : "light",
                        }
                    );
                }
            } else {
                toast.error("Network error. Please check your connection.", {
                    theme: isDarkMode ? "dark" : "light",
                });
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500 dark:from-gray-900 dark:to-gray-900">
            <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                <DarkModeButton />
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Forgot Password
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative mt-2">
                        <input
                            type={currentPassword ? "text" : "password"}
                            placeholder="Current Password"
                            {...register("currentPassword")}
                            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={() => setCurrentPassword(!currentPassword)}
                            className="absolute inset-y-0  right-2 flex items-center text-gray-500  dark:text-gray-300"
                        >
                            {currentPassword ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeClosed className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-red-500 text-sm">
                        {errors.currentPassword?.message}
                    </p>

                    <div className="relative mt-2">
                        <input
                            type={newPassword ? "text" : "password"}
                            placeholder="New Password"
                            {...register("newPassword")}
                            className="w-full p-2 mt-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={() => setNewPassword(!newPassword)}
                            className="absolute inset-y-0 top-2 right-2 flex items-center text-gray-500 dark:text-gray-300"
                        >
                            {newPassword ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeClosed className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-red-500 text-sm">
                        {errors.newPassword?.message}
                    </p>

                    <div className="relative mt-2">
                        <input
                            type={confirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            {...register("confirmPassword")}
                            className="w-full p-2 mt-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={() => setConfirmPassword(!confirmPassword)}
                            className="absolute inset-y-0 top-2 right-2 flex items-center text-gray-500 dark:text-gray-300"
                        >
                            {confirmPassword ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeClosed className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-red-500 text-sm">
                        {errors.confirmPassword?.message}
                    </p>

                    <div className="flex items-center justify-center gap-5 mt-4">
                        <span
                            className="text-white cursor-pointer bg-[#60a5fa] px-[11px] py-2 rounded"
                            onClick={() => navigate("/dashboard")}
                        >
                            Cancel
                        </span>
                        <button
                            type="submit"
                            className="bg-purple-500 text-white py-2 px-5 rounded"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
