/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeClosed } from "lucide-react";
import DarkModeButton from "@/components/DarkModeButton";

interface SignupFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const schema = yup.object().shape({
    firstName: yup
        .string()
        .min(3, "*First name must be at least 3 characters.")
        .max(50, "*First name cannot exceed 50 characters.")
        .required("*First name is required."),
    lastName: yup
        .string()
        .min(3, "*Last name must be at least 3 characters.")
        .max(50, "*Last name cannot exceed 50 characters.")
        .required("*Last name is required."),
    email: yup
        .string()
        .matches(
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
            "*Invalid email format."
        )
        .required("*Email is required."),
    password: yup
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
        .oneOf([yup.ref("password"), undefined], "*Passwords must match.")
        .required("*Confirm password is required."),
});

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormInputs>({ resolver: yupResolver(schema) });

    const onSubmit = async (data: SignupFormInputs) => {
        try {
            await axios.post("http://localhost:8000/users/register", data);
            toast.success("Signup successful!", {
                theme: isDarkMode ? "dark" : "light",
            });
            navigate("/login");
        } catch (error: any) {
            toast.error(
                error.response?.status === 409
                    ? "Email already exists."
                    : "Signup failed. Try again.",
                {
                    theme: isDarkMode ? "dark" : "light",
                }
            );
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500 dark:from-gray-900  dark:to-gray-900 ">
            <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                <DarkModeButton />
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
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

                    <div className="relative mt-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...register("password")}
                            className="w-full p-2 border rounded pr-10 bg-gray-100 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300"
                        >
                            {showPassword ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeClosed className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-red-500 text-sm">
                        {errors.password?.message}
                    </p>

                    <div className="relative mt-2">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            {...register("confirmPassword")}
                            className="w-full p-2 border rounded pr-10 bg-gray-100 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300"
                        >
                            {showConfirmPassword ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeClosed className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-red-500 text-sm">
                        {errors.confirmPassword?.message}
                    </p>

                    <button
                        type="submit"
                        className="w-full bg-purple-500 text-white p-2 rounded mt-2"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Signup;
