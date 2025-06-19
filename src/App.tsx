import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/Users/LoginPage";
import SignupPage from "./pages/Users/SignupPage";
import Dashboard from "./pages/Dashboard";
import UpdateAccount from "./pages/Users/UpdateAccount";
import UserList from "./pages/Users/UserList";
import UserEdit from "./pages/Users/UserEdit";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePassword from "./pages/Users/ChangePassword";
import CategoryList from "./pages/categories/CategoryList";
import EditCategory from "./pages/categories/EditCategory";
import CreateCategory from "./pages/categories/CreateCategory";
import UploadTebi from "./components/UploadTebi";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-account" element={<UpdateAccount />} />
          <Route path="/users-list" element={<UserList />} />
          <Route path="/user-edit" element={<UserEdit />} />
          <Route path="/forgot-password" element={<ChangePassword />} />
          <Route path="/categories-list" element={<CategoryList />} />
          <Route path="/category-edit" element={<EditCategory />} />
          <Route path="/create-category" element={<CreateCategory />} />
          <Route path="/image-upload" element={<UploadTebi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
