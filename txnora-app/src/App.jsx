
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";
import Investigations from "./pages/Investigations";
import Users from "./pages/Users";
import Invitations from "./pages/Invitations";
import SettingsPage from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoutes";
import AdminRoute from "./components/AdminRoute";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/transactions"
                    element={<Transactions />}
                />

                <Route
                    path="/investigations"
                    element={<Investigations />}
                />

               
<Route
    path="/users"
    element={
        <AdminRoute>
            <Users />
        </AdminRoute>
    }
/>

<Route
    path="/invitations"
    element={
        <AdminRoute>
            <Invitations />
        </AdminRoute>
    }
/>


                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
