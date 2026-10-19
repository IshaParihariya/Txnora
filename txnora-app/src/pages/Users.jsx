
import { useEffect, useMemo, useState } from "react";
import {
    Search,
    RefreshCw,
    Users as UsersIcon,
    UserCheck,
    Clock3
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { getAllUsers } from "../services/userApi";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch actual user records from the backend.
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllUsers();

            // Handle an unexpected response without showing fake counts.
            if (!Array.isArray(data)) {
                throw new Error("Unexpected users API response.");
            }

            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);

            if (err.response?.status === 403) {
                setError("You are not authorized to view users.");
            } else {
                setError("Unable to load users. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Only ACTIVE records represent registered accounts
    // in the current backend invitation workflow.
    const registeredUsers = useMemo(
        () => users.filter(user => user.status === "ACTIVE"),
        [users]
    );

    // Pending invitation records are stored as PENDING users
    // by the existing backend.
    const pendingInvitations = useMemo(
        () => users.filter(user => user.status === "PENDING"),
        [users]
    );

    // Search and filter only registered accounts.
    const filteredUsers = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return registeredUsers.filter(user => {
            const matchesSearch =
                (user.name ?? "").toLowerCase().includes(searchText) ||
                (user.email ?? "").toLowerCase().includes(searchText) ||
                String(user.id ?? user._id ?? "")
                    .toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "ALL" ||
                user.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [registeredUsers, search, statusFilter]);

    const getStatusStyle = (status) => {
        if (status === "ACTIVE") {
            return "bg-emerald-50 text-emerald-700 border border-emerald-200";
        }

        return "bg-gray-100 text-gray-600 border border-gray-200";
    };

    const getRoleStyle = (role) => {
        if (role === "ADMIN") {
            return "bg-indigo-50 text-indigo-700 border border-indigo-200";
        }

        return "bg-slate-50 text-slate-600 border border-slate-200";
    };

    return (
        <div className="min-h-screen bg-[#f7f8fa] text-[#20242A]">
            <Navbar />
            <Sidebar />

            <main className="lg:ml-[240px] pt-14 min-h-[calc(100vh-56px)]">
                <div className="px-6 py-6">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold">
                                Users
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Manage registered accounts and access within Txnora
                            </p>
                        </div>

                        <button
                            onClick={fetchUsers}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                        {/* REGISTERED USERS */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Registered Users
                                    </p>
                                    <p className="text-2xl font-semibold mt-2">
                                        {loading && users.length === 0
                                            ? "—"
                                            : registeredUsers.length}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Accounts that have been activated
                                    </p>
                                </div>

                                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                    <UsersIcon size={20} />
                                </div>
                            </div>
                        </div>

                        {/* ACTIVE USERS */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Active Users
                                    </p>
                                    <p className="text-2xl font-semibold mt-2">
                                        {loading && users.length === 0
                                            ? "—"
                                            : registeredUsers.length}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Accounts currently marked ACTIVE
                                    </p>
                                </div>

                                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                                    <UserCheck size={20} />
                                </div>
                            </div>
                        </div>

                        {/* PENDING INVITATIONS */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Pending Invitations
                                    </p>
                                    <p className="text-2xl font-semibold mt-2">
                                        {loading && users.length === 0
                                            ? "—"
                                            : pendingInvitations.length}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Invitations awaiting acceptance
                                    </p>
                                </div>

                                <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                                    <Clock3 size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH + STATUS FILTER */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by name, email or user ID..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#4F5580] focus:ring-1 focus:ring-[#4F5580]"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-[#4F5580]"
                            >
                                <option value="ALL">All Status</option>
                                <option value="ACTIVE">Active</option>
                            </select>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center justify-between gap-3">
                            <span>{error}</span>
                            <button
                                onClick={fetchUsers}
                                className="font-medium underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* USER DIRECTORY */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200">
                            <h2 className="font-semibold">
                                User Directory
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                {loading
                                    ? "Loading registered accounts..."
                                    : `${filteredUsers.length} registered user${filteredUsers.length !== 1 ? "s" : ""} shown`}
                            </p>
                        </div>

                        {loading ? (
                            <div className="py-16 text-center text-sm text-gray-500">
                                Loading users...
                            </div>
                        ) : error && users.length === 0 ? (
                            <div className="py-16 text-center text-sm text-gray-500">
                                User data could not be loaded.
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="py-16 text-center">
                                <UsersIcon
                                    size={30}
                                    className="mx-auto text-gray-300 mb-3"
                                />

                                <p className="text-sm font-medium text-gray-600">
                                    {registeredUsers.length === 0
                                        ? "No registered users yet"
                                        : "No users found"}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    {registeredUsers.length === 0
                                        ? "Users will appear here after they accept their invitation."
                                        : "Try changing your search."}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-5 py-3 font-medium text-gray-500">
                                                User
                                            </th>
                                            <th className="text-left px-5 py-3 font-medium text-gray-500">
                                                Email
                                            </th>
                                            <th className="text-left px-5 py-3 font-medium text-gray-500">
                                                Role
                                            </th>
                                            <th className="text-left px-5 py-3 font-medium text-gray-500">
                                                Status
                                            </th>
                                            <th className="text-left px-5 py-3 font-medium text-gray-500">
                                                User ID
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.map(user => {
                                            const userId = user.id ?? user._id;

                                            return (
                                                <tr
                                                    key={userId}
                                                    className="hover:bg-gray-50 transition"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-[#4F5580] text-white flex items-center justify-center text-sm font-medium">
                                                                {(user.name ?? "?")
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <span className="font-medium text-gray-800">
                                                                {user.name || "Unnamed user"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 text-gray-600">
                                                        {user.email || "—"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getRoleStyle(user.role)}`}
                                                        >
                                                            {user.role || "—"}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(user.status)}`}
                                                        >
                                                            {user.status || "UNKNOWN"}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-xs text-gray-400 font-mono">
                                                        {userId || "—"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Users;
