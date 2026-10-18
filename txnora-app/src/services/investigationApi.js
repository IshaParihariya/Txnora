import api from "./api";

export const getInvestigation = async (transactionId) => {

    const response = await api.get(
        `/api/investigations/${transactionId}`
    );

    return response.data;
};