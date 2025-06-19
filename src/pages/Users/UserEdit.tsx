/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import DarkModeButton from "@/components/DarkModeButton";

interface EditFormInputs {
    firstName: string;
    lastName: string;
    email: string;
}
const schema = yup.object().shape({
    firstName: yup
        .string()
        .min(3, "*First name must be at least 3 characters.")
        .max(50, "*First name cannot exceed 50 characters.")
        .required("*First name is required."),
    lastName: yup
        .string()
        .min(5, "*Last name must be at least 5 characters.")
        .max(50, "*Last name cannot exceed 50 characters.")
        .required("*Last name is required."),
    email: yup
        .string()
        .matches(
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
            "*Invalid email format."
        )
        .required("*Email is required."),
});

const UserEdit: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const API_URL = "http://localhost:8000/users";
    const user = location.state || {};
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
        formState: { errors },
    } = useForm<EditFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
        },
    });

    const onSubmit = async (data: EditFormInputs) => {
        try {
            await axios.put(`${API_URL}/${user._id}`, data);
            toast.success("User edited successfully!", {
                theme: isDarkMode ? "dark" : "light",
            });
            navigate("/users-list");
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.error(
                    "Email already exists. Please use a different email.",
                    {
                        theme: isDarkMode ? "dark" : "light",
                    }
                );
            } else {
                toast.error("Update failed. Try again.", {
                    theme: isDarkMode ? "dark" : "light",
                });
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-500 dark:from-gray-900  dark:to-gray-900">
            <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                <DarkModeButton />
            </div>
            <div className="bg-white dark:bg-gray-800 dark:text-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Edit User
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder="First Name"
                        {...register("firstName")}
                        className="w-full p-2 border bg-gray-100 dark:bg-gray-700 dark:text-white rounded"
                    />
                    <p className="text-red-500 text-sm">
                        {errors.firstName?.message}
                    </p>
                    <input
                        type="text"
                        placeholder="Last Name"
                        {...register("lastName")}
                        className="w-full p-2 mt-2 border bg-gray-100 dark:bg-gray-700 dark:text-white rounded"
                    />
                    <p className="text-red-500 text-sm">
                        {errors.lastName?.message}
                    </p>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full p-2 mt-2 border bg-gray-100 dark:bg-gray-700 dark:text-white rounded"
                    />
                    <p className="text-red-500 text-sm">
                        {errors.email?.message}
                    </p>
                    <div className="flex items-center justify-center gap-5 mt-2">
                        <span
                            className="text-white cursor-pointer bg-blue-500 dark:bg-blue-700 px-4 py-2 rounded"
                            onClick={() => navigate("/users-list")}
                        >
                            Cancel
                        </span>
                        <button
                            type="submit"
                            className="bg-purple-500 dark:bg-purple-700 text-white py-2 px-5 rounded"
                        >
                            Edit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEdit;
