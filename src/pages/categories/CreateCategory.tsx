import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import DarkModeButton from "@/components/DarkModeButton";

interface CategoryFormValues {
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

const CreateCategory = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: CategoryFormValues) => {
    console.log("Category Data:", data);
    // Add API call to create category here
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 dark:from-gray-900 dark:to-gray-900">
      <div className="absolute right-4 top-4 rounded-full bg-gray-200 dark:bg-gray-700">
        <DarkModeButton />
      </div>
      <div className="w-96 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-center text-2xl font-bold dark:text-white">
          Create Category
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Name"
            {...register("name", {
              required: "Category name is required",
            })}
            className="w-full rounded border bg-gray-100 p-2 dark:bg-gray-700 dark:text-white"
          />
          <p className="text-sm text-red-500">{errors.name?.message}</p>

          <textarea
            className="mt-2 max-h-[300px] min-h-[70px] w-full max-w-full rounded border bg-gray-100 p-2 dark:bg-gray-700 dark:text-white"
            placeholder="Description"
            {...register("description", {
              required: "Description is required",
            })}
          />
          <p className="-mt-2 text-sm text-red-500">
            {errors.description?.message}
          </p>

          <div className="mt-3 flex items-center justify-center gap-5">
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
