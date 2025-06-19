/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeClosed } from "lucide-react";
import axios from "axios";
import DarkModeButton from "@/components/DarkModeButton";

interface LoginFormInputs {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      "*Invalid email format.",
    )
    .required("*Email is required."),
  password: yup
    .string()
    .min(8, "*Password must be at least 8 characters.")
    .matches(/[A-Z]/, "*Password must contain at least one uppercase letter.")
    .matches(/[a-z]/, "*Password must contain at least one lowercase letter.")
    .matches(/[0-9]/, "*Password must contain at least one number.")
    .matches(
      /[@$!%*?&#]/,
      "*Password must contain at least one special character.",
    )
    .required("*Password is required."),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const emailRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.focusEmail && emailRef.current) {
      emailRef.current.focus();
    }
  }, [location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/users/login",
        data,
      );
      localStorage.setItem("authToken", response.data.token);

      toast.success("Login successful!", {
        position: "top-right",
        theme: isDarkMode ? "dark" : "light",
      });
      navigate("/dashboard");
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Invalid Password. Please try again.", {
            position: "top-right",
            theme: isDarkMode ? "dark" : "light",
          });
        } else if (error.response.status === 401) {
          toast.error("Invalid Email. Please try again.", {
            position: "top-right",
            theme: isDarkMode ? "dark" : "light",
          });
        } else {
          toast.error("Login failed. Please try again later.", {
            position: "top-right",
            theme: isDarkMode ? "dark" : "light",
          });
        }
      } else {
        toast.error("Network error. Please check your connection.", {
          position: "top-right",
          theme: isDarkMode ? "dark" : "light",
        });
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 dark:from-gray-900 dark:to-gray-900">
      <div className="absolute right-4 top-4 rounded-full bg-gray-200 dark:bg-gray-700">
        <DarkModeButton />
      </div>
      <div className="w-96 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-center text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            ref={(e) => {
              register("email").ref(e);
              emailRef.current = e;
            }}
            className="w-full rounded border bg-gray-100 p-2 dark:bg-gray-700 dark:text-white"
          />
          <p className="text-sm text-red-500">{errors.email?.message}</p>

          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full rounded border bg-gray-100 p-2 pr-10 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300"
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeClosed className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-sm text-red-500">{errors.password?.message}</p>

          <button
            type="submit"
            className="mt-2 w-full rounded bg-purple-500 p-2 text-white"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="cursor-pointer text-blue-500"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
