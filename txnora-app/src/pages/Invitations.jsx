import { useEffect, useState } from "react";
import {
    MailPlus,
    Send,
    CheckCircle2,
    Clock3,
    RefreshCw
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import {
    inviteUser,
    getAllUsers
} from "../services/userApi";

const Invitations = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");


    // Fetch users
    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAllUsers();

            setUsers(data);

        } catch (err) {

            console.error("Failed to fetch users:", err);

            if (err.response?.status === 403) {
                setError(
                    "You are not authorized to view invitation information."
                );
            } else {
                setError("Unable to load invitation information.");
            }

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);


    // Send invitation
    const handleInvite = async (e) => {

        e.preventDefault();

        setSuccess("");
        setError("");

        if (!name.trim() || !email.trim()) {

            setError("Please enter both name and email.");

            return;
        }

        try {

            setSending(true);

            await inviteUser(
                name.trim(),
                email.trim()
            );

            setSuccess(
                `Invitation sent successfully to ${email.trim()}.`
            );

            setName("");
            setEmail("");

            // Refresh table
            await fetchUsers();

        } catch (err) {

            console.error("Failed to send invitation:", err);

            if (err.response?.status === 403) {

                setError(
                    "You are not authorized to send invitations."
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "Failed to send invitation."
                );

            }

        } finally {

            setSending(false);

        }
    };


    // Counts
    const totalUsers = users.length;

    const pendingUsers = users.filter(
        (user) => user.status === "PENDING"
    ).length;

    const acceptedUsers = users.filter(
        (user) => user.status === "ACTIVE"
    ).length;


    return (
        <div className="min-h-screen bg-[#f7f8fa] text-[#20242A]">

            <Navbar />

            <Sidebar />

            <main className="lg:ml-[240px] pt-14 min-h-[calc(100vh-56px)]">

                <div className="px-6 py-6">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-lg bg-[#eef0f7] flex items-center justify-center">

                                    <MailPlus
                                        size={20}
                                        className="text-[#4F5580]"
                                    />

                                </div>

                                <div>

                                    <h1 className="text-2xl font-semibold">
                                        Invitations
                                    </h1>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Manage employee invitations and account access
                                    </p>

                                </div>

                            </div>

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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                        {/* Total */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Total Users
                                    </p>

                                    <p className="text-2xl font-semibold mt-1">
                                        {totalUsers}
                                    </p>

                                </div>

                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">

                                    <MailPlus
                                        size={19}
                                        className="text-gray-500"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Pending */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Pending Invitations
                                    </p>

                                    <p className="text-2xl font-semibold mt-1">
                                        {pendingUsers}
                                    </p>

                                </div>

                                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">

                                    <Clock3
                                        size={19}
                                        className="text-amber-600"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Accepted */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Accepted
                                    </p>

                                    <p className="text-2xl font-semibold mt-1">
                                        {acceptedUsers}
                                    </p>

                                </div>

                                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">

                                    <CheckCircle2
                                        size={19}
                                        className="text-emerald-600"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* INVITE FORM */}
                    <div className="bg-white border border-gray-200 rounded-xl mb-6">

                        <div className="px-6 py-5 border-b border-gray-200">

                            <h2 className="font-semibold text-gray-800">
                                Send New Invitation
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Invite an employee to create a Txnora account.
                            </p>

                        </div>


                        <form
                            onSubmit={handleInvite}
                            className="p-6"
                        >

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Name */}
                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Enter full name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#4F5580] focus:ring-1 focus:ring-[#4F5580]"
                                    />

                                </div>


                                {/* Email */}
                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Work Email
                                    </label>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="employee@company.com"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#4F5580] focus:ring-1 focus:ring-[#4F5580]"
                                    />

                                </div>

                            </div>


                            {/* Messages */}
                            {success && (

                                <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">

                                    <CheckCircle2 size={18} />

                                    <p className="text-sm">
                                        {success}
                                    </p>

                                </div>

                            )}


                            {error && (

                                <div className="mt-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700">

                                    <p className="text-sm">
                                        {error}
                                    </p>

                                </div>

                            )}


                            <div className="mt-5">

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#4F5580] text-white text-sm font-medium hover:bg-[#43496f] transition disabled:opacity-50"
                                >

                                    <Send size={16} />

                                    {sending
                                        ? "Sending..."
                                        : "Send Invitation"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>


                    {/* INVITATION TABLE */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                        <div className="px-6 py-5 border-b border-gray-200">

                            <h2 className="font-semibold text-gray-800">
                                Invitation History
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Track invited users and their account status
                            </p>

                        </div>


                        {loading ? (

                            <div className="py-16 text-center text-sm text-gray-500">
                                Loading invitations...
                            </div>

                        ) : users.length === 0 ? (

                            <div className="py-16 text-center text-sm text-gray-500">
                                No invitations found.
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
                                                Invitation
                                            </th>

                                            <th className="text-left px-5 py-3 font-medium text-gray-500">
                                                Account Status
                                            </th>

                                            <th className="text-left px-5 py-3 font-medium text-gray-500">
                                                User ID
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-100">

                                        {users.map((user) => {

                                            const accepted =
                                                user.status === "ACTIVE";

                                            return (

                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-gray-50 transition"
                                                >

                                                    {/* USER */}
                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="w-9 h-9 rounded-full bg-[#4F5580] text-white flex items-center justify-center text-sm font-medium">

                                                                {user.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()}

                                                            </div>

                                                            <span className="font-medium text-gray-800">
                                                                {user.name}
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* EMAIL */}
                                                    <td className="px-5 py-4 text-gray-600">
                                                        {user.email}
                                                    </td>


                                                    {/* ROLE */}
                                                    <td className="px-5 py-4">

                                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">

                                                            {user.role}

                                                        </span>

                                                    </td>


                                                    {/* INVITATION */}
                                                    <td className="px-5 py-4">

                                                        {accepted ? (

                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">

                                                                <CheckCircle2 size={13} />

                                                                Accepted

                                                            </span>

                                                        ) : (

                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">

                                                                <Clock3 size={13} />

                                                                Pending

                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* ACCOUNT STATUS */}
                                                    <td className="px-5 py-4">

                                                        <span
                                                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                                                user.status === "ACTIVE"
                                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                                            }`}
                                                        >

                                                            {user.status}

                                                        </span>

                                                    </td>


                                                    {/* ID */}
                                                    <td className="px-5 py-4 text-xs text-gray-400 font-mono">

                                                        {user.id}

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

export default Invitations;