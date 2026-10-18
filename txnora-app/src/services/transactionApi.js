import api from "./api";


export const getAllTransactions = async () => {

    const response = await api.get("/api/transactions");

    return response.data;
};


export const getTransactionById = async (id) => {

    const response = await api.get(`/api/transactions/${id}`);

    return response.data;
};


export const getTransactionsByUser = async (userId) => {

    const response = await api.get(
        `/api/transactions/user/${userId}`
    );

    return response.data;
};


export const getFailedTransactions = async () => {

    const response = await api.get(
        "/api/transactions/failed"
    );

    return response.data;
};