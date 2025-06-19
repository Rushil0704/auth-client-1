/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppState } from "@/hooks/authUserList";
import DarkModeButton from "@/components/DarkModeButton";

const API_URL = "http://localhost:8000/categories/edit";
const API_URL_CATEGORY = "http://localhost:8000/categories";

interface UpdateFormInputs {
  name: string;
  description: string;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .min(5, "*First name must be at least 3 characters.")
    .max(50, "*First name cannot exceed 50 characters.")
    .required("First name is required"),
  description: yup
    .string()
    .min(10, "*Last name must be at least 10 characters.")
    .max(100, "*Last name cannot exceed 100 characters.")
    .required("Last name is required"),
});

const EditCategory: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser, fetchLoggedInUser } = useAppState();
  const hasFetched = useRef(false);
  const location = useLocation();
  const categoty = location.state || {};
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

    const fetchCategoryData = async () => {
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
          `${API_URL_CATEGORY}/${categoty._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setValue("name", data.name || "");
        setValue("description", data.description || "");
      } catch (error) {
        toast.error("Error fetching user data.", {
          theme: isDarkMode ? "dark" : "light",
        });
      }
    };

    fetchCategoryData();
  }, [navigate, loginUser, setValue]);

  const onSubmit = async (formData: UpdateFormInputs) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authentication error. Please login again.", {
          theme: isDarkMode ? "dark" : "light",
        });
        return;
      }

      await axios.put(`${API_URL}/${categoty._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully!", {
        theme: isDarkMode ? "dark" : "light",
      });
      navigate("/categories-list");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Email already exists. Please use a different email.", {
          theme: isDarkMode ? "dark" : "light",
        });
      } else {
        toast.error("Update failed. Please try again.", {
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-center text-2xl font-bold dark:text-white">
            Edit Category
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full rounded border bg-gray-100 p-2 dark:bg-gray-700 dark:text-white"
          />
          <p className="text-sm text-red-500">{errors.name?.message}</p>

          <textarea
            className="mt-2 max-h-[300px] min-h-[70px] w-full max-w-full rounded border bg-gray-100 p-2 dark:bg-gray-700 dark:text-white"
            placeholder="Description"
            id="description"
            {...register("description")}
          />
          <p className="text-sm text-red-500">{errors.description?.message}</p>

          <div className="mt-2 flex items-center justify-center gap-5">
            <span
              className="cursor-pointer rounded bg-[#60a5fa] px-[11px] py-2 text-white"
              onClick={() => navigate("/categories-list")}
            >
              Cancel
            </span>
            <button
              type="submit"
              className="rounded bg-purple-500 px-5 py-2 text-white"
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
