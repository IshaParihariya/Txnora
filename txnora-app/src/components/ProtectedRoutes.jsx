import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) =>
{
    const token = localStorage.getItem("token");

    if (!token)
    {
        //Send the user to the login page
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;