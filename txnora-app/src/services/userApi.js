import axios from "axios";
import api from "./api";

export const inviteUser = async (name, email) => {
    const response = await api.post(
        "/api/user/invite",
        null,
        {
            params: {
                name,
                email
            }
        }
    );

    return response.data;
};

export const acceptInvitation = async (
    token,
    password,
    confirmPassword
) => {
    const response = await axios.post(
        "http://localhost:8080/api/user/accept",
        {
            token,
            password,
            confirmPassword
        }
    );

    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get("/api/user/all");
    return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};