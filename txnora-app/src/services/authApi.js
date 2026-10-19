
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const handleLogin = async (email, password) => {
    try {
        console.log("Attempting login:", API_BASE_URL);

        const response = await axios.post(
            `${API_BASE_URL}/api/auth/login`,
            { email, password }
        );

        const token = response.data;

        if (typeof token !== "string" || !token.trim()) {
            throw new Error("Backend did not return a valid JWT.");
        }

        const decodedToken = jwtDecode(token);

        localStorage.setItem("token", token);
        localStorage.setItem("role", decodedToken.role);

        console.log("Login successful. Role:", decodedToken.role);
        return true;

    } catch (error) {
        console.error("Login failed:", {
            message: error.message,
            status: error.response?.status,
            response: error.response?.data
        });

        alert(
            error.response?.status === 401
                ? "Invalid email or password."
                : error.response?.status === 403
                ? "Access forbidden. Check backend security and CORS."
                : "Login failed. Open browser DevTools Console for details."
        );

        return false;
    }
};

export default handleLogin;
