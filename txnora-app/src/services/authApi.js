import axios from "axios";
import { jwtDecode } from "jwt-decode";

const handleLogin = async (email, password) => {
    try {

        const response = await axios.post(
            "http://localhost:8080/api/auth/login",
            {
                email,
                password
            }
        );

        const token=response.data;

        localStorage.setItem("token", token);

        //ROLE BASED

        const decodedToken = jwtDecode(token);

        localStorage.setItem("role", decodedToken.role);

        console.log("Logged in role:", decodedToken.role);

        console.log("Login successful");
        console.log("JWT:", response.data);

        return true;

    } catch (error) {

        console.log("Login failed");
        console.log(error);

        return false;
    }
};

export default handleLogin;