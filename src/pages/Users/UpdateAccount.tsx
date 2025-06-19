/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppState } from "@/hooks/authUserList";
import DarkModeButton from "@/components/DarkModeButton";

const API_URL = "http://localhost:8000/users/editProfile";
const API_URL_USER = "http://localhost:8000/users";

interface UpdateFormInputs {
    firstName: string;
    lastName: string;
    email: string;
}

const schema = yup.object().shape({
    firstName: yup
        .string()
        .min(3, "*First name must be at least 3 characters.")
        .max(50, "*First name cannot exceed 50 characters.")
        .required("First name is required"),
    lastName: yup
        .string()
        .min(3, "*Last name must be at least 3 characters.")
        .max(50, "*Last name cannot exceed 50 characters.")
        .required("Last name is required"),
    email: yup
        .string()
        .matches(
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
            "*Invalid email format."
        )
        .required("*Email is required."),
});

const UpdateAccount: React.FC = () => {
    const navigate = useNavigate();
    const { loginUser, fetchLoggedInUser } = useAppState();
    const hasFetched = useRef(false);

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

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<UpdateFormInputs>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (!loginUser) {
            fetchLoggedInUser();
        }
    }, [loginUser, fetchLoggedInUser]);

    useEffect(() => {
        if (hasFetched.current || !loginUser) return;
        hasFetched.current = true;

        const fetchUserData = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                toast.error("No authentication found. Please login.", {
                    theme: isDarkMode ? "dark" : "light",
                });
                navigate("/login");
                return;
            }

            try {
                const { data } = await axios.get(
                    `${API_URL_USER}/${loginUser}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setValue("firstName", data.firstName || "");
                setValue("lastName", data.lastName || "");
                setValue("email", data.email || "");
            } catch (error) {
                toast.error("Error fetching user data.", {
                    theme: isDarkMode ? "dark" : "light",
                });
            }
        };

        fetchUserData();
    }, [navigate, loginUser, setValue]);

    const onSubmit = async (formData: UpdateFormInputs) => {
        try {
            const token = localStorage.getItem("authToken");
            const userId = loginUser;

            if (!token) {
                toast.error("Authentication error. Please login again.", {
                    theme: isDarkMode ? "dark" : "light",
                });
                return;
            }

            await axios.put(`${API_URL}/${userId}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Profile updated successfully!", {
                theme: isDarkMode ? "dark" : "light",
            });
            navigate("/dashboard");
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.error(
                    "Email already exists. Please use a different email.",
                    {
                        theme: isDarkMode ? "dark" : "light",
                    }
                );
            } else {
                toast.error("Update failed. Please try again.", {
                    theme: isDarkMode ? "dark" : "light",
                });
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500 dark:from-gray-900  dark:to-gray-900 ">
            <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                <DarkModeButton />
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-center dark:text-white">
                        Edit Profile
                    </h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder="First Name"
                        {...register("firstName")}
                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-red-500 text-sm">
                        {errors.firstName?.message}
                    </p>

                    <input
                        type="text"
                        placeholder="Last Name"
                        {...register("lastName")}
                        className="w-full p-2 mt-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-red-500 text-sm">
                        {errors.lastName?.message}
                    </p>

                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full p-2 mt-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-red-500 text-sm">
                        {errors.email?.message}
                    </p>

                    <div className="flex items-center justify-center gap-5 mt-2">
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
                            Edit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateAccount;
