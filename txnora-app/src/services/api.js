// Before React sends any request to my backend, automatically attach my JWT
// GET /api/transactions
// Authorization: Bearer eyJhbGciOiJIUzI1Ni...

// axios for public APIs. api for protected APIs

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;