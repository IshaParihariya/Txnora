
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const handleLogin = async (email, password) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/auth/login`,
            { email, password }
        );

        const token = response.data;

        localStorage.setItem("token", token);

        const decodedToken = jwtDecode(token);
        localStorage.setItem("role", decodedToken.role);

        console.log("Login successful");
        return true;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        return false;
    }
};

export default handleLogin;
