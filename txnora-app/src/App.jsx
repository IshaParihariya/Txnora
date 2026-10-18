import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Routes, Route } from "react-router-dom";
import Transactions from "./pages/Transactions";
import Investigations from "./pages/Investigations";
import Users from "./pages/Users";
import Invitations from "./pages/Invitations";


const App = () =>
{
    return (
        <div>
           <Routes>
               <Route path="/" element={<Login/>}/>
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
       element={
       <Transactions/>}
       />

       <Route
    path="/investigations"
    element={<Investigations />}
    />


    <Route path="/users" element={<Users />} />

     <Route path="/invitations" element={<Invitations />} />

           </Routes>
        </div>
    );
}

export default App