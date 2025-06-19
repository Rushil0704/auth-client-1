/* eslint-disable react-hooks/exhaustive-deps */
import { useAppState } from "../../hooks/authUserList";
import { BookOpenTextIcon, Edit, Trash } from "lucide-react";
import MenuButton from "@/components/MenuButton";
import Spinner from "@/components/Spinner";
import MiniSpinner from "@/components/MiniSpinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";

const UserList: React.FC = () => {
  const { loggedInUser, loginUser } = useAppState();

  const [filter, setFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [deleteUserId, setDeleteUserId] = useState<string | false>(false);
  const navigate = useNavigate();

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

  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (isFullPageLoad: boolean = false) => {
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

      if (filter !== "All") {
        params.role = filter;
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await axios.get("http://localhost:8000/users", {
        params,
        withCredentials: true,
      });

      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.totalUsers);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    const delayFetch = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayFetch);
  }, [searchTerm, filter, currentPage]);

  const handleEdit = (user: User) => navigate("/user-edit", { state: user });

  const handleDelete = (userId: string) => setDeleteUserId(userId);

  const confirmDelete = async () => {
    if (!deleteUserId) return;
    try {
      await axios.delete(`http://localhost:8000/users/delete/${deleteUserId}`);
      toast.success("User deleted successfully!", {
        theme: isDarkMode ? "dark" : "light",
      });
      fetchUsers();
    } catch {
      toast.error("Failed to delete user. Please try again.", {
        theme: isDarkMode ? "dark" : "light",
      });
    } finally {
      setDeleteUserId(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto h-screen overflow-auto bg-white p-6 dark:bg-gray-900">
      <div className="sticky -top-6 z-10 flex items-center justify-between rounded-md bg-white p-4 shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-semibold dark:text-white">All Users</h1>
        <div className="flex items-center gap-4">
          <MenuButton />
        </div>
      </div>

      <div>
        <div className="flex justify-between border-b pb-4 pt-8 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <select
              className="rounded-lg border bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All users</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>

            <input
              type="search"
              placeholder="Search by Any Name..."
              className="w-64 rounded-lg border bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />

            <div className="text-center text-gray-600 dark:text-gray-400">
              {
                <p className="flex items-center gap-3">
                  <BookOpenTextIcon />
                  <span>
                    <strong>{(currentPage - 1) * 10 + 1}</strong>-
                    <strong>
                      {Math.min(currentPage * 10, totalUsers)
                        ? Math.min(currentPage * 10, totalUsers)
                        : "1"}
                    </strong>{" "}
                    of <strong>{totalUsers ? totalUsers : "1"}</strong>
                  </span>
                </p>
              }
            </div>
          </div>
        </div>

        {error ? (
          <p className="py-4 text-center text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : users.length === 0 ? (
          <p className="py-4 text-center text-gray-500 dark:text-gray-400">
            No users found
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="px-2 py-6 dark:text-gray-200">First Name</th>
                <th className="px-2 py-6 dark:text-gray-200">Last Name</th>
                <th className="px-2 py-6 dark:text-gray-200">Email</th>
                <th className="px-2 py-6 dark:text-gray-200">Created Date</th>
                <th className="px-2 py-6 dark:text-gray-200">Updated Date</th>
                <th className="px-2 py-6 dark:text-gray-200">Role</th>
                <th className="px-2 py-6 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center">
                    <MiniSpinner />
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b text-center dark:border-gray-700"
                  >
                    <td className="px-2 py-4 dark:text-gray-300">
                      {user.firstName}
                    </td>
                    <td className="px-2 py-4 dark:text-gray-300">
                      {user.lastName}
                    </td>
                    <td className="px-2 py-4 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-2 py-4 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-4 dark:text-gray-300">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-4 dark:text-gray-300">
                      {user.role}
                    </td>
                    <td>
                      {loggedInUser === "user" && user.role !== "admin" ? (
                        <button
                          onClick={() => handleEdit(user)}
                          className="mr-3"
                        >
                          <Edit className="h-4 w-4 text-black transition-all hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
                        </button>
                      ) : null}

                      {loggedInUser === "admin" ? (
                        <button
                          onClick={() => handleEdit(user)}
                          className="mr-3"
                        >
                          <Edit className="h-4 w-4 text-black transition-all hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
                        </button>
                      ) : null}

                      {loggedInUser === "admin" && loginUser !== user._id ? (
                        <button onClick={() => handleDelete(user._id)}>
                          <Trash className="h-4 w-4 text-red-400 transition-all hover:text-red-600" />
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {deleteUserId && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={() => setDeleteUserId(false)}
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
                onClick={() => setDeleteUserId(false)}
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

export default UserList;
