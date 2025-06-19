/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { BookOpenTextIcon, Edit, Plus, Search, Trash } from "lucide-react";
import Spinner from "@/components/Spinner";
import MiniSpinner from "@/components/MiniSpinner";
import MenuButton from "@/components/MenuButton";
import { Category } from "@/types/Category";
import { useAppState } from "@/hooks/authUserList";

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | false>(
    false,
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { loggedInUser } = useAppState();
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

  const fetchCategories = async (isFullPageLoad: boolean = false) => {
    if (isFullPageLoad) {
      setLoading(true);
    } else {
      setTableLoading(true);
    }

    setError(null);

    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await axios.get("http://localhost:8000/categories", {
        params,
        withCredentials: true,
      });

      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
      setTotalCategories(response.data.totalCategories);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    const delayFetch = setTimeout(() => {
      fetchCategories();
    }, 300);

    return () => clearTimeout(delayFetch);
  }, [searchTerm, currentPage]);

  const handleEdit = (category: Category) =>
    navigate("/category-edit", { state: category });

  const handleDelete = (categoryId: string) => setDeleteCategoryId(categoryId);

  const handleCreateCategory = () => {
    navigate("/create-category");
  };

  const confirmDelete = async () => {
    if (!deleteCategoryId) return;
    try {
      await axios.delete(
        `http://localhost:8000/categories/delete/${deleteCategoryId}`,
      );
      toast.success("Category deleted successfully!", {
        theme: isDarkMode ? "dark" : "light",
      });
      fetchCategories();
    } catch {
      toast.error("Failed to delete category. Please try again.", {
        theme: isDarkMode ? "dark" : "light",
      });
    } finally {
      setDeleteCategoryId(false);
    }
  };
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto h-screen overflow-auto bg-white p-6 dark:bg-gray-900">
      <div className="sticky -top-6 z-10 flex items-center justify-between rounded-md bg-white p-4 shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-semibold dark:text-white">
          All Categories
        </h1>
        <div className="flex items-center gap-4">
          <MenuButton />
        </div>
      </div>
      <div>
        <div className="flex justify-between border-b pb-4 pt-8 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search by Any Name..."
                className="w-80 rounded-lg border bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                  if (value === "") {
                    setSearchTerm("");
                  }
                }}
              />
              <button
                onClick={() => handleSearch()}
                className="-ml-8 text-gray-400 transition-all hover:text-blue-700 dark:hover:text-blue-500"
              >
                <Search className="h-6 w-6" />
              </button>
            </div>
            <div className="text-center text-gray-600 dark:text-gray-400">
              {
                <p className="flex items-center gap-3">
                  <BookOpenTextIcon />
                  <span>
                    <strong>{(currentPage - 1) * 10 + 1}</strong>-
                    <strong>
                      {Math.min(currentPage * 10, totalCategories)
                        ? Math.min(currentPage * 10, totalCategories)
                        : "1"}
                    </strong>{" "}
                    of{" "}
                    <strong>{totalCategories ? totalCategories : "1"}</strong>
                  </span>
                </p>
              }
            </div>
          </div>
          {loggedInUser === "admin" && (
            <div className="flex items-center gap-1 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
              <button onClick={handleCreateCategory}>Create Category</button>
              <Plus className="mt-1 h-5 w-5" />
            </div>
          )}
        </div>
        {error ? (
          <p className="py-4 text-center text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : categories.length === 0 ? (
          <p className="py-4 text-center text-gray-500 dark:text-gray-400">
            No categories found
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="px-2 py-6 dark:text-gray-200">Name</th>
                <th className="px-2 py-6 dark:text-gray-200">Description</th>
                <th className="px-2 py-6 dark:text-gray-200">Created Date</th>
                <th className="px-2 py-6 dark:text-gray-200">Updated Date</th>
                {loggedInUser === "admin" ? (
                  <th className="px-2 py-6 dark:text-gray-200">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {tableLoading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center">
                    <MiniSpinner />
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b text-center dark:border-gray-700"
                  >
                    <td className="px-2 py-4 dark:text-gray-300">
                      {category.name}
                    </td>
                    <td className="max-w-[340px] px-2 py-4 dark:text-gray-300">
                      {category.description}
                    </td>
                    <td className="px-2 py-4 dark:text-gray-300">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-4 dark:text-gray-300">
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </td>
                    <td>
                      {loggedInUser === "admin" ? (
                        <>
                          <button
                            onClick={() => handleEdit(category)}
                            className="mr-3"
                          >
                            <Edit className="h-4 w-4 text-black transition-all hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
                          </button>

                          <button onClick={() => handleDelete(category._id)}>
                            <Trash className="h-4 w-4 text-red-400 transition-all hover:text-red-600" />
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {deleteCategoryId && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={() => setDeleteCategoryId(false)}
        >
          <div
            className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold dark:text-white">
              Confirm Delete
            </h2>
            <p className="dark:text-gray-300">
              Are you sure you want to delete this user?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="mr-2 rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
                onClick={() => setDeleteCategoryId(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
