import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000"; // Your backend URL
axios.defaults.withCredentials = true; // Allows sending and receiving cookies

export default axios;
