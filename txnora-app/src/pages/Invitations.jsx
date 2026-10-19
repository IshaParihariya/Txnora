
import { useEffect, useState } from "react";
import {
    MailPlus,
    Send,
    CheckCircle2,
    Clock3,
    RefreshCw,
    Users,
    Search,
    AlertCircle,
    UserRound,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import {
    inviteUser,
    getAllUsers,
} from "../services/userApi";

const Invitations = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // Fetch the existing backend records.
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllUsers();

            if (!Array.isArray(data)) {
                throw new Error("Unexpected user data received.");
            }

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

    // Preserve the existing invitation API and behavior.
    const handleInvite = async (e) => {
        e.preventDefault();

        setSuccess("");
        setError("");

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName || !trimmedEmail) {
            setError("Please enter both name and email.");
            return;
        }

        try {
            setSending(true);

            await inviteUser(trimmedName, trimmedEmail);

            setSuccess(
                `Invitation sent successfully to ${trimmedEmail}.`
            );

            setName("");
            setEmail("");

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

    // These counts are derived from the existing backend response.
    const totalInvitations = users.length;

    const pendingInvitations = users.filter(
        (user) => user.status === "PENDING"
    ).length;

    const acceptedInvitations = users.filter(
        (user) => user.status === "ACTIVE"
    ).length;

    const filteredUsers = users.filter((user) => {
        const query = search.trim().toLowerCase();

        if (!query) return true;

        return [
            user.name,
            user.email,
            user.role,
            user.status,
            user.id,
        ].some((value) =>
            String(value ?? "").toLowerCase().includes(query)
        );
    });

    const inputClass =
        "w-full rounded-lg border border-[#DDE2E4] bg-white px-3.5 py-3 " +
        "text-sm text-[#20242A] placeholder:text-[#9AA1AC] " +
        "outline-none transition focus:border-[#4F5580] " +
        "focus:ring-2 focus:ring-[#4F5580]/10 disabled:bg-gray-50";

    const stats = [
        {
            label: "Total Invitations",
            value: totalInvitations,
            description: "Records returned by the backend",
            icon: MailPlus,
            iconClass: "bg-slate-100 text-slate-600",
        },
        {
            label: "Pending Invitations",
            value: pendingInvitations,
            description: "Awaiting acceptance",
            icon: Clock3,
            iconClass: "bg-amber-50 text-amber-600",
        },
        {
            label: "Accepted",
            value: acceptedInvitations,
            description: "Accounts with ACTIVE status",
            icon: CheckCircle2,
            iconClass: "bg-emerald-50 text-emerald-600",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#20242A]">
            <Navbar />
            <Sidebar />

            <main className="min-h-[calc(100vh-56px)] pt-14 lg:ml-[240px]">
                <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-7">

                    {/* Page header */}
                    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4F5580]/10">
                                <MailPlus
                                    size={21}
                                    className="text-[#4F5580]"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-[#20242A]">
                                    Invitations
                                </h1>

                                <p className="mt-1 text-sm text-[#68717A]">
                                    Manage employee onboarding and account access.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={fetchUsers}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDE2E4] bg-white px-4 py-2.5 text-sm font-medium text-[#20242A] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                    </section>

                    {/* Feedback */}
                    {success && (
                        <div
                            role="status"
                            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-emerald-800"
                        >
                            <CheckCircle2
                                size={19}
                                className="mt-0.5 shrink-0"
                            />
                            <p className="text-sm">{success}</p>
                        </div>
                    )}

                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-red-700"
                        >
                            <AlertCircle
                                size={19}
                                className="mt-0.5 shrink-0"
                            />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Summary cards */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.label}
                                    className="rounded-xl border border-[#E3E6EC] bg-white p-5 transition-shadow hover:shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-[#68717A]">
                                                {stat.label}
                                            </p>

                                            <p className="mt-2 text-3xl font-semibold tracking-tight text-[#20242A]">
                                                {loading ? "—" : stat.value}
                                            </p>
                                        </div>

                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                                        >
                                            <Icon size={20} />
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-[#87909D]">
                                        {stat.description}
                                    </p>
                                </div>
                            );
                        })}
                    </section>

                    {/* New invitation form */}
                    <section className="overflow-hidden rounded-xl border border-[#E3E6EC] bg-white">
                        <div className="border-b border-[#E8EBF0] px-5 py-5 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F1F2F8]">
                                    <Send
                                        size={17}
                                        className="text-[#4F5580]"
                                    />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-[#20242A]">
                                        Send New Invitation
                                    </h2>
                                    <p className="mt-1 text-sm text-[#68717A]">
                                        Invite an employee to create a Txnora account.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={handleInvite}
                            className="space-y-5 p-5 sm:p-6"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="invite-name"
                                        className="mb-2 block text-sm font-medium text-[#343A46]"
                                    >
                                        Full Name
                                    </label>

                                    <input
                                        id="invite-name"
                                        type="text"
                                        autoComplete="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter full name"
                                        disabled={sending}
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="invite-email"
                                        className="mb-2 block text-sm font-medium text-[#343A46]"
                                    >
                                        Work Email
                                    </label>

                                    <input
                                        id="invite-email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="employee@company.com"
                                        disabled={sending}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-[#EEF0F3] pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs leading-5 text-[#87909D]">
                                    The invitation will be processed by Txnora's existing invitation service.
                                </p>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#4F5580] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#43496F] focus:outline-none focus:ring-2 focus:ring-[#4F5580]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {sending ? (
                                        <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Send size={16} />
                                    )}

                                    {sending ? "Sending..." : "Send Invitation"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Invitation history */}
                    <section className="overflow-hidden rounded-xl border border-[#E3E6EC] bg-white">
                        <div className="flex flex-col gap-4 border-b border-[#E8EBF0] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="font-semibold text-[#20242A]">
                                    Invitation History
                                </h2>

                                <p className="mt-1 text-sm text-[#68717A]">
                                    Track invitation and account statuses.
                                </p>
                            </div>

                            <div className="relative w-full lg:max-w-sm">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87909D]"
                                />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search name, email, role or ID..."
                                    aria-label="Search invitation history"
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </div>

                        <div className="border-b border-[#E8EBF0] px-5 py-3 sm:px-6">
                            <p className="text-xs text-[#68717A]">
                                {loading
                                    ? "Loading records..."
                                    : `${filteredUsers.length} of ${users.length} records shown`}
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                <RefreshCw
                                    size={24}
                                    className="animate-spin text-[#4F5580]"
                                />
                                <p className="mt-3 text-sm font-medium text-[#343A46]">
                                    Loading invitation records
                                </p>
                                <p className="mt-1 text-xs text-[#87909D]">
                                    Retrieving the latest backend data.
                                </p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1F2F8]">
                                    <MailPlus
                                        size={23}
                                        className="text-[#4F5580]"
                                    />
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-[#343A46]">
                                    No invitation records
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-[#87909D]">
                                    Invitation records will appear here when returned by the backend.
                                </p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="px-4 py-14 text-center">
                                <Search
                                    size={23}
                                    className="mx-auto text-[#A0A7B2]"
                                />
                                <p className="mt-3 text-sm font-medium text-[#343A46]">
                                    No matching records
                                </p>
                                <p className="mt-1 text-sm text-[#87909D]">
                                    Try another name, email, role, or ID.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="border-b border-[#E8EBF0] bg-[#F9FAFB]">
                                        <tr>
                                            {[
                                                "User",
                                                "Email",
                                                "Role",
                                                "Invitation Status",
                                                "Account Status",
                                                "User ID",
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#68717A]"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#EEF0F3]">
                                        {filteredUsers.map((user) => {
                                            const accepted =
                                                user.status === "ACTIVE";

                                            return (
                                                <tr
                                                    key={user.id}
                                                    className="transition-colors hover:bg-[#FAFBFC]"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF0F7] text-sm font-semibold text-[#4F5580]">
                                                                {user.name?.trim()
                                                                    ? user.name
                                                                          .trim()
                                                                          .charAt(0)
                                                                          .toUpperCase()
                                                                    : <UserRound size={16} />}
                                                            </div>

                                                            <span className="whitespace-nowrap font-medium text-[#20242A]">
                                                                {user.name || "—"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 text-[#596273]">
                                                        {user.email || "—"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span className="inline-flex rounded-full border border-[#DDE2E4] bg-[#F9FAFB] px-2.5 py-1 text-xs font-medium text-[#596273]">
                                                            {user.role || "—"}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${
                                                                accepted
                                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                                            }`}
                                                        >
                                                            {accepted ? (
                                                                <CheckCircle2 size={13} />
                                                            ) : (
                                                                <Clock3 size={13} />
                                                            )}

                                                            {accepted ? "Accepted" : "Pending"}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                                                                accepted
                                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                    : user.status === "PENDING"
                                                                      ? "border-amber-200 bg-amber-50 text-amber-700"
                                                                      : "border-[#DDE2E4] bg-[#F9FAFB] text-[#596273]"
                                                            }`}
                                                        >
                                                            {user.status || "Unknown"}
                                                        </span>
                                                    </td>

                                                    <td
                                                        className="max-w-[190px] truncate px-5 py-4 font-mono text-xs text-[#87909D]"
                                                        title={user.id || ""}
                                                    >
                                                        {user.id || "—"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Invitations;
