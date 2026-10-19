import { useEffect, useMemo, useState } from "react";

import { getCurrentUser } from "../services/userApi";

import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    XCircle,
    AlertCircle,
    RefreshCw
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { getAllTransactions } from "../services/transactionApi";


const Dashboard = () => {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeFilter, setActiveFilter] = useState("ALL");

    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);


    // ==================================================
    // FETCH TRANSACTIONS
    // ==================================================

    const fetchTransactions = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAllTransactions();

            setTransactions(data);

        } catch (error) {

            console.error(
                "Failed to fetch transactions:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load transactions."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchTransactions();

    }, []);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Failed to fetch current user:",
                    error.response?.data || error.message
                );
            } finally {
                setUserLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);


    // ==================================================
    // TRANSACTION COUNTS
    // ==================================================

    const totalTransactions = transactions.length;


    const settledTransactions = transactions.filter(
        (transaction) =>
            transaction.status === "SETTLED"
    ).length;


    const processingTransactions = transactions.filter(
        (transaction) =>
            transaction.status === "INITIATED" ||
            transaction.status === "PROCESSING" ||
            transaction.status === "AUTHORIZED"
    ).length;


    const settlementPendingTransactions = transactions.filter(
        (transaction) =>
            transaction.status === "SETTLEMENT_PENDING"
    ).length;


    const failedTransactions = transactions.filter(
        (transaction) =>
            transaction.status === "FAILED"
    ).length;


    // ==================================================
    // SUCCESS / FAILURE RATE
    // ==================================================

    const successRate =
        totalTransactions > 0
            ? (
                (settledTransactions / totalTransactions) * 100
            ).toFixed(1)
            : "0.0";


    const failureRate =
        totalTransactions > 0
            ? (
                (failedTransactions / totalTransactions) * 100
            ).toFixed(1)
            : "0.0";


    // ==================================================
    // TOTAL TRANSACTION VALUE
    // ==================================================

    const totalTransactionValue = useMemo(() => {

        return transactions.reduce(
            (total, transaction) => {

                return total + Number(
                    transaction.amount || 0
                );

            },
            0
        );

    }, [transactions]);


    // ==================================================
    // FORMAT AMOUNT
    // ==================================================

    const formatAmount = (
        amount,
        currency = "INR"
    ) => {

        try {

            return new Intl.NumberFormat(
                "en-IN",
                {
                    style: "currency",
                    currency: currency,
                    maximumFractionDigits: 2
                }
            ).format(amount);

        } catch {

            return `${currency} ${amount}`;

        }

    };


    // ==================================================
    // RECENT TRANSACTIONS
    // ==================================================

    const recentTransactions = useMemo(() => {

        const sortedTransactions = [
            ...transactions
        ].sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );


        if (activeFilter === "FAILED") {

            return sortedTransactions
                .filter(
                    (transaction) =>
                        transaction.status === "FAILED"
                )
                .slice(0, 8);

        }


        if (activeFilter === "PENDING") {

            return sortedTransactions
                .filter(
                    (transaction) =>
                        transaction.status === "INITIATED" ||
                        transaction.status === "PROCESSING" ||
                        transaction.status === "AUTHORIZED" ||
                        transaction.status === "SETTLEMENT_PENDING"
                )
                .slice(0, 8);

        }


        return sortedTransactions.slice(0, 8);

    }, [
        transactions,
        activeFilter
    ]);


    // ==================================================
    // STATUS STYLE
    // ==================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "SETTLED":

                return "text-[#4F8076] bg-[#4F8076]/10";


            case "INITIATED":
            case "PROCESSING":
            case "AUTHORIZED":

                return "text-[#92713A] bg-[#92713A]/10";


            case "SETTLEMENT_PENDING":

                return "text-[#556A8A] bg-[#556A8A]/10";


            case "FAILED":

                return "text-[#9B5555] bg-[#9B5555]/10";


            default:

                return "text-[#68717A] bg-[#68717A]/10";

        }

    };


    // ==================================================
    // STATUS LABEL
    // ==================================================

    const getStatusLabel = (status) => {

        switch (status) {

            case "SETTLED":
                return "Settled";

            case "INITIATED":
                return "Initiated";

            case "PROCESSING":
                return "Processing";

            case "AUTHORIZED":
                return "Authorized";

            case "SETTLEMENT_PENDING":
                return "Settlement Pending";

            case "FAILED":
                return "Failed";

            default:
                return status || "Unknown";

        }

    };


    // ==================================================
    // RELATIVE TIME
    // ==================================================

    const getRelativeTime = (date) => {

        if (!date) {
            return "-";
        }


        const created = new Date(date);
        const now = new Date();

        const difference = Math.floor(
            (now - created) / 1000
        );


        if (difference < 0) {
            return "Just now";
        }


        if (difference < 60) {

            return `${difference}s ago`;

        }


        const minutes = Math.floor(
            difference / 60
        );


        if (minutes < 60) {

            return `${minutes}m ago`;

        }


        const hours = Math.floor(
            minutes / 60
        );


        if (hours < 24) {

            return `${hours}h ago`;

        }


        const days = Math.floor(
            hours / 24
        );


        return `${days}d ago`;

    };


    // ==================================================
    // ACTIVITY DATA
    // LAST 8 HOURS
    // ==================================================

    const activityData = useMemo(() => {

        const now = new Date();

        const hours = [];


        for (let i = 7; i >= 0; i--) {

            const hourDate = new Date(now);

            hourDate.setMinutes(0, 0, 0);

            hourDate.setHours(
                now.getHours() - i
            );


            hours.push({
                date: hourDate,
                label: hourDate.toLocaleTimeString(
                    [],
                    {
                        hour: "numeric"
                    }
                ),
                count: 0
            });

        }


        transactions.forEach(
            (transaction) => {

                if (!transaction.createdAt) {
                    return;
                }


                const transactionDate =
                    new Date(
                        transaction.createdAt
                    );


                hours.forEach(
                    (hour) => {

                        if (
                            transactionDate.getFullYear() ===
                                hour.date.getFullYear() &&

                            transactionDate.getMonth() ===
                                hour.date.getMonth() &&

                            transactionDate.getDate() ===
                                hour.date.getDate() &&

                            transactionDate.getHours() ===
                                hour.date.getHours()
                        ) {

                            hour.count++;

                        }

                    }
                );

            }
        );


        return hours;

    }, [transactions]);


    const maxActivity = Math.max(
        ...activityData.map(
            (item) => item.count
        ),
        1
    );


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className="min-h-screen bg-[#F7F8FA]">

            <Navbar
                user={user}
                onMenuClick={() => {
                    // Connect your existing mobile sidebar toggle here if available.
                }}
            />

            <Sidebar />


            <main className="ml-[240px]">

                <div className="
                    mx-auto
                    max-w-[1500px]
                    px-8
                    py-7
                ">


                    {/* ================================= */}
                    {/* HEADER */}
                    {/* ================================= */}

                    <div className="
                        flex
                        items-start
                        justify-between
                        mb-7
                    ">

                        <div>

                            <h1 className="
                                text-[25px]
                                font-semibold
                                text-[#20242A]
                            ">
                                Dashboard
                            </h1>


                            <p className="
                                text-sm
                                text-[#68717A]
                                mt-1
                            ">
                                Real-time transaction overview
                            </p>

                        </div>


                        <div className="
                            flex
                            items-center
                            gap-4
                        ">

                            <span className="
                                text-xs
                                text-[#68717A]
                            ">

                                {loading
                                    ? "Loading..."
                                    : `Updated ${new Date().toLocaleTimeString(
                                        [],
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        }
                                    )}`
                                }

                            </span>


                            <button
                                onClick={fetchTransactions}
                                disabled={loading}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    border
                                    border-[#DDE2E4]
                                    bg-white
                                    px-3
                                    py-2
                                    text-xs
                                    text-[#4D6573]
                                    hover:bg-[#F7F8F8]
                                    disabled:opacity-50
                                "
                            >

                                <RefreshCw
                                    size={14}
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh

                            </button>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* ERROR */}
                    {/* ================================= */}

                    {error && (

                        <div className="
                            mb-6
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            border
                            border-[#E8CACA]
                            bg-[#FFF8F8]
                            px-4
                            py-3
                            text-sm
                            text-[#9B5555]
                        ">

                            <AlertCircle size={17} />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* ================================= */}
                    {/* KPI CARDS */}
                    {/* ================================= */}

                    <div className="
                        grid
                        grid-cols-5
                        gap-4
                        mb-7
                    ">


                        {/* TOTAL */}

                        <div className="
                            bg-white
                            border
                            border-[#E2E5E9]
                            rounded-lg
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <p className="
                                    text-[12px]
                                    font-medium
                                    text-[#68717A]
                                ">
                                    Total Transactions
                                </p>


                                <ArrowUpRight
                                    size={17}
                                    className="text-[#4F5580]"
                                />

                            </div>


                            <p className="
                                text-[27px]
                                font-semibold
                                text-[#20242A]
                                mt-3
                            ">
                                {loading
                                    ? "—"
                                    : totalTransactions
                                }
                            </p>


                            <p className="
                                text-xs
                                mt-1
                                text-[#68717A]
                            ">

                                {loading
                                    ? "Loading..."
                                    : formatAmount(
                                        totalTransactionValue
                                    )
                                }

                            </p>

                        </div>


                        {/* SETTLED */}

                        <div className="
                            bg-white
                            border
                            border-[#E2E5E9]
                            rounded-lg
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <p className="
                                    text-[12px]
                                    font-medium
                                    text-[#68717A]
                                ">
                                    Settled
                                </p>


                                <CheckCircle2
                                    size={17}
                                    className="text-[#4F8076]"
                                />

                            </div>


                            <p className="
                                text-[27px]
                                font-semibold
                                text-[#20242A]
                                mt-3
                            ">
                                {loading
                                    ? "—"
                                    : settledTransactions
                                }
                            </p>


                            <p className="
                                text-xs
                                mt-1
                                text-[#4F8076]
                            ">
                                {successRate}% of transactions
                            </p>

                        </div>


                        {/* PROCESSING */}

                        <div className="
                            bg-white
                            border
                            border-[#E2E5E9]
                            rounded-lg
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <p className="
                                    text-[12px]
                                    font-medium
                                    text-[#68717A]
                                ">
                                    Processing
                                </p>


                                <Clock3
                                    size={17}
                                    className="text-[#92713A]"
                                />

                            </div>


                            <p className="
                                text-[27px]
                                font-semibold
                                text-[#20242A]
                                mt-3
                            ">
                                {loading
                                    ? "—"
                                    : processingTransactions
                                }
                            </p>


                            <p className="
                                text-xs
                                mt-1
                                text-[#92713A]
                            ">
                                Initiated · Processing · Authorized
                            </p>

                        </div>


                        {/* FAILED */}

                        <div className="
                            bg-white
                            border
                            border-[#E2E5E9]
                            rounded-lg
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <p className="
                                    text-[12px]
                                    font-medium
                                    text-[#68717A]
                                ">
                                    Failed
                                </p>


                                <XCircle
                                    size={17}
                                    className="text-[#9B5555]"
                                />

                            </div>


                            <p className="
                                text-[27px]
                                font-semibold
                                text-[#20242A]
                                mt-3
                            ">
                                {loading
                                    ? "—"
                                    : failedTransactions
                                }
                            </p>


                            <p className="
                                text-xs
                                mt-1
                                text-[#9B5555]
                            ">
                                {failureRate}% of transactions
                            </p>

                        </div>


                        {/* SETTLEMENT PENDING */}

                        <div className="
                            bg-white
                            border
                            border-[#E2E5E9]
                            rounded-lg
                            p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <p className="
                                    text-[12px]
                                    font-medium
                                    text-[#68717A]
                                ">
                                    Settlement Pending
                                </p>


                                <Clock3
                                    size={17}
                                    className="text-[#556A8A]"
                                />

                            </div>


                            <p className="
                                text-[27px]
                                font-semibold
                                text-[#20242A]
                                mt-3
                            ">
                                {loading
                                    ? "—"
                                    : settlementPendingTransactions
                                }
                            </p>


                            <p className="
                                text-xs
                                mt-1
                                text-[#556A8A]
                            ">
                                Awaiting settlement
                            </p>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* MAIN CONTENT */}
                    {/* ================================= */}

                    <div className="
                        grid
                        grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]
                        gap-6
                    ">


                        {/* ================================= */}
                        {/* LEFT COLUMN */}
                        {/* ================================= */}

                        <div className="space-y-6">


                            {/* RECENT TRANSACTIONS */}

                            <section className="
                                bg-white
                                border
                                border-[#E2E5E9]
                                rounded-lg
                                overflow-hidden
                            ">


                                <div className="
                                    px-5
                                    py-4
                                    border-b
                                    border-[#E7E9EC]
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <div>

                                        <h2 className="
                                            text-[15px]
                                            font-semibold
                                            text-[#20242A]
                                        ">
                                            Recent Transactions
                                        </h2>


                                        <p className="
                                            text-xs
                                            text-[#68717A]
                                            mt-1
                                        ">
                                            Latest transactions from the backend
                                        </p>

                                    </div>


                                    <button className="
                                        text-xs
                                        font-medium
                                        text-[#4F5580]
                                        hover:underline
                                    ">
                                        View all →
                                    </button>

                                </div>


                                {/* FILTER TABS */}

                                <div className="px-5 pt-4">

                                    <div className="
                                        inline-flex
                                        bg-[#F4F5F7]
                                        rounded-lg
                                        p-1
                                    ">

                                        {[
                                            "ALL",
                                            "PENDING",
                                            "FAILED"
                                        ].map(
                                            (filter) => (

                                                <button
                                                    key={filter}
                                                    onClick={() =>
                                                        setActiveFilter(
                                                            filter
                                                        )
                                                    }
                                                    className={`
                                                        px-4
                                                        py-1.5
                                                        text-xs
                                                        rounded-md
                                                        transition
                                                        ${
                                                            activeFilter ===
                                                            filter
                                                                ? "bg-white text-[#4F5580] shadow-sm font-medium"
                                                                : "text-[#68717A]"
                                                        }
                                                    `}
                                                >

                                                    {filter === "ALL"
                                                        ? "All"
                                                        : filter ===
                                                            "PENDING"
                                                            ? "Pending"
                                                            : "Failed"
                                                    }

                                                </button>

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* TABLE */}

                                <div className="
                                    overflow-x-auto
                                    mt-3
                                ">

                                    <table className="w-full">

                                        <thead>

                                            <tr className="
                                                border-b
                                                border-[#E7E9EC]
                                            ">

                                                <th className="
                                                    text-left
                                                    px-5
                                                    py-3
                                                    text-[11px]
                                                    font-medium
                                                    text-[#68717A]
                                                ">
                                                    TRANSACTION ID
                                                </th>


                                                <th className="
                                                    text-left
                                                    px-3
                                                    py-3
                                                    text-[11px]
                                                    font-medium
                                                    text-[#68717A]
                                                ">
                                                    TIME
                                                </th>


                                                <th className="
                                                    text-left
                                                    px-3
                                                    py-3
                                                    text-[11px]
                                                    font-medium
                                                    text-[#68717A]
                                                ">
                                                    USER
                                                </th>


                                                <th className="
                                                    text-left
                                                    px-3
                                                    py-3
                                                    text-[11px]
                                                    font-medium
                                                    text-[#68717A]
                                                ">
                                                    MERCHANT
                                                </th>


                                                <th className="
                                                    text-right
                                                    px-3
                                                    py-3
                                                    text-[11px]
                                                    font-medium
                                                    text-[#68717A]
                                                ">
                                                    AMOUNT
                                                </th>


                                                <th className="
                                                    text-left
                                                    px-5
                                                    py-3
                                                    text-[11px]
                                                    font-medium
                                                    text-[#68717A]
                                                ">
                                                    STATUS
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {/* LOADING */}

                                            {loading && (

                                                <tr>

                                                    <td
                                                        colSpan="6"
                                                        className="
                                                            px-5
                                                            py-10
                                                            text-center
                                                            text-sm
                                                            text-[#68717A]
                                                        "
                                                    >
                                                        Loading transactions...
                                                    </td>

                                                </tr>

                                            )}


                                            {/* DATA */}

                                            {!loading &&
                                                recentTransactions.map(
                                                    (transaction) => (

                                                        <tr
                                                            key={
                                                                transaction.id
                                                            }
                                                            className="
                                                                border-b
                                                                border-[#F0F1F3]
                                                                hover:bg-[#F8F9FA]
                                                                cursor-pointer
                                                                transition
                                                            "
                                                        >

                                                            <td className="
                                                                px-5
                                                                py-3.5
                                                            ">

                                                                <span className="
                                                                    font-mono
                                                                    text-xs
                                                                    text-[#4D6573]
                                                                ">
                                                                    {
                                                                        transaction.id
                                                                    }
                                                                </span>

                                                            </td>


                                                            <td className="
                                                                px-3
                                                                py-3.5
                                                                text-xs
                                                                text-[#68717A]
                                                            ">
                                                                {
                                                                    getRelativeTime(
                                                                        transaction.createdAt
                                                                    )
                                                                }
                                                            </td>


                                                            <td className="
                                                                px-3
                                                                py-3.5
                                                                font-mono
                                                                text-xs
                                                                text-[#68717A]
                                                            ">
                                                                {
                                                                    transaction.userId
                                                                }
                                                            </td>


                                                            <td className="
                                                                px-3
                                                                py-3.5
                                                                font-mono
                                                                text-xs
                                                                text-[#68717A]
                                                            ">
                                                                {
                                                                    transaction.merchantId
                                                                }
                                                            </td>


                                                            <td className="
                                                                px-3
                                                                py-3.5
                                                                text-right
                                                                text-xs
                                                                font-medium
                                                                text-[#20242A]
                                                            ">
                                                                {
                                                                    formatAmount(
                                                                        transaction.amount,
                                                                        transaction.currency
                                                                    )
                                                                }
                                                            </td>


                                                            <td className="
                                                                px-5
                                                                py-3.5
                                                            ">

                                                                <span className={`
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    px-2.5
                                                                    py-1
                                                                    rounded-full
                                                                    text-[10px]
                                                                    font-medium
                                                                    ${getStatusClass(
                                                                        transaction.status
                                                                    )}
                                                                `}>

                                                                    <span className="
                                                                        w-1.5
                                                                        h-1.5
                                                                        rounded-full
                                                                        bg-current
                                                                    " />

                                                                    {
                                                                        getStatusLabel(
                                                                            transaction.status
                                                                        )
                                                                    }

                                                                </span>

                                                            </td>

                                                        </tr>

                                                    )
                                                )
                                            }


                                            {/* EMPTY */}

                                            {!loading &&
                                                recentTransactions.length ===
                                                    0 && (

                                                    <tr>

                                                        <td
                                                            colSpan="6"
                                                            className="
                                                                px-5
                                                                py-10
                                                                text-center
                                                                text-sm
                                                                text-[#68717A]
                                                            "
                                                        >
                                                            No transactions found.
                                                        </td>

                                                    </tr>

                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>

                            </section>


                            {/* ================================= */}
                            {/* ACTIVITY */}
                            {/* ================================= */}

                            <section className="
                                bg-white
                                border
                                border-[#E2E5E9]
                                rounded-lg
                                p-5
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    mb-6
                                ">

                                    <div>

                                        <h2 className="
                                            text-[15px]
                                            font-semibold
                                            text-[#20242A]
                                        ">
                                            Transaction Activity
                                        </h2>


                                        <p className="
                                            text-xs
                                            text-[#68717A]
                                            mt-1
                                        ">
                                            Transactions created during the last 8 hours
                                        </p>

                                    </div>

                                </div>


                                <div className="
                                    h-[190px]
                                    flex
                                    items-end
                                    gap-5
                                    px-4
                                    border-b
                                    border-[#E7E9EC]
                                ">

                                    {activityData.map(
                                        (item, index) => (

                                            <div
                                                key={index}
                                                className="
                                                    flex-1
                                                    flex
                                                    items-end
                                                    justify-center
                                                    h-full
                                                "
                                            >

                                                <div
                                                    className="
                                                        w-full
                                                        max-w-[42px]
                                                        bg-[#556A8A]/80
                                                        rounded-t-md
                                                        transition-all
                                                    "
                                                    style={{
                                                        height:
                                                            item.count > 0
                                                                ? `${Math.max(
                                                                    (
                                                                        item.count /
                                                                        maxActivity
                                                                    ) * 100,
                                                                    5
                                                                )}%`
                                                                : "0%"
                                                    }}
                                                    title={`${item.count} transactions`}
                                                />

                                            </div>

                                        )
                                    )}

                                </div>


                                <div className="
                                    flex
                                    justify-between
                                    px-4
                                    pt-3
                                ">

                                    {activityData.map(
                                        (item, index) => (

                                            <span
                                                key={index}
                                                className="
                                                    text-[10px]
                                                    text-[#68717A]
                                                "
                                            >
                                                {item.label}
                                            </span>

                                        )
                                    )}

                                </div>

                            </section>

                        </div>


                        {/* ================================= */}
                        {/* RIGHT COLUMN */}
                        {/* ================================= */}

                        <div className="space-y-6">


                            {/* NEEDS ATTENTION */}

                            <section className="
                                bg-white
                                border
                                border-[#E2E5E9]
                                rounded-lg
                                overflow-hidden
                            ">

                                <div className="
                                    px-5
                                    py-4
                                    border-b
                                    border-[#E7E9EC]
                                ">

                                    <h2 className="
                                        text-[15px]
                                        font-semibold
                                        text-[#20242A]
                                    ">
                                        Needs Attention
                                    </h2>


                                    <p className="
                                        text-xs
                                        text-[#68717A]
                                        mt-1
                                    ">
                                        Current transaction states
                                    </p>

                                </div>


                                {/* FAILED */}

                                <div className="
                                    px-5
                                    py-4
                                    border-b
                                    border-[#F0F1F3]
                                ">

                                    <div className="flex gap-3">

                                        <span className="
                                            mt-1.5
                                            w-2
                                            h-2
                                            rounded-full
                                            bg-[#9B5555]
                                            shrink-0
                                        " />


                                        <div>

                                            <p className="
                                                text-xs
                                                font-medium
                                                text-[#20242A]
                                            ">
                                                Failed transactions
                                            </p>


                                            <p className="
                                                text-[11px]
                                                text-[#68717A]
                                                mt-1
                                            ">
                                                {failedTransactions} failed transaction
                                                {failedTransactions !== 1
                                                    ? "s"
                                                    : ""
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* PROCESSING */}

                                <div className="
                                    px-5
                                    py-4
                                    border-b
                                    border-[#F0F1F3]
                                ">

                                    <div className="flex gap-3">

                                        <span className="
                                            mt-1.5
                                            w-2
                                            h-2
                                            rounded-full
                                            bg-[#92713A]
                                            shrink-0
                                        " />


                                        <div>

                                            <p className="
                                                text-xs
                                                font-medium
                                                text-[#20242A]
                                            ">
                                                Transactions in processing
                                            </p>


                                            <p className="
                                                text-[11px]
                                                text-[#68717A]
                                                mt-1
                                            ">
                                                {processingTransactions} transaction
                                                {processingTransactions !== 1
                                                    ? "s"
                                                    : ""
                                                } in workflow
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* SETTLEMENT PENDING */}

                                <div className="
                                    px-5
                                    py-4
                                ">

                                    <div className="flex gap-3">

                                        <span className="
                                            mt-1.5
                                            w-2
                                            h-2
                                            rounded-full
                                            bg-[#556A8A]
                                            shrink-0
                                        " />


                                        <div>

                                            <p className="
                                                text-xs
                                                font-medium
                                                text-[#20242A]
                                            ">
                                                Settlement pending
                                            </p>


                                            <p className="
                                                text-[11px]
                                                text-[#68717A]
                                                mt-1
                                            ">
                                                {settlementPendingTransactions} transaction
                                                {settlementPendingTransactions !== 1
                                                    ? "s"
                                                    : ""
                                                } awaiting settlement
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* ================================= */}
                            {/* STATUS DISTRIBUTION */}
                            {/* ================================= */}

                            <section className="
                                bg-white
                                border
                                border-[#E2E5E9]
                                rounded-lg
                                p-5
                            ">

                                <h2 className="
                                    text-[15px]
                                    font-semibold
                                    text-[#20242A]
                                ">
                                    Transaction Status
                                </h2>


                                <p className="
                                    text-xs
                                    text-[#68717A]
                                    mt-1
                                    mb-5
                                ">
                                    Current distribution
                                </p>


                                <div className="space-y-4">


                                    {/* SETTLED */}

                                    <div>

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            mb-1.5
                                        ">

                                            <span className="
                                                text-[11px]
                                                text-[#4D6573]
                                            ">
                                                Settled
                                            </span>


                                            <span className="
                                                text-[11px]
                                                font-medium
                                                text-[#20242A]
                                            ">
                                                {settledTransactions}
                                            </span>

                                        </div>


                                        <div className="
                                            w-full
                                            h-1.5
                                            bg-[#EEF0F2]
                                            rounded-full
                                        ">

                                            <div
                                                className="
                                                    h-full
                                                    bg-[#4F8076]
                                                    rounded-full
                                                "
                                                style={{
                                                    width:
                                                        totalTransactions
                                                            ? `${(
                                                                settledTransactions /
                                                                totalTransactions
                                                            ) * 100}%`
                                                            : "0%"
                                                }}
                                            />

                                        </div>

                                    </div>


                                    {/* PROCESSING */}

                                    <div>

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            mb-1.5
                                        ">

                                            <span className="
                                                text-[11px]
                                                text-[#4D6573]
                                            ">
                                                Processing
                                            </span>


                                            <span className="
                                                text-[11px]
                                                font-medium
                                                text-[#20242A]
                                            ">
                                                {processingTransactions}
                                            </span>

                                        </div>


                                        <div className="
                                            w-full
                                            h-1.5
                                            bg-[#EEF0F2]
                                            rounded-full
                                        ">

                                            <div
                                                className="
                                                    h-full
                                                    bg-[#92713A]
                                                    rounded-full
                                                "
                                                style={{
                                                    width:
                                                        totalTransactions
                                                            ? `${(
                                                                processingTransactions /
                                                                totalTransactions
                                                            ) * 100}%`
                                                            : "0%"
                                                }}
                                            />

                                        </div>

                                    </div>


                                    {/* FAILED */}

                                    <div>

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            mb-1.5
                                        ">

                                            <span className="
                                                text-[11px]
                                                text-[#4D6573]
                                            ">
                                                Failed
                                            </span>


                                            <span className="
                                                text-[11px]
                                                font-medium
                                                text-[#20242A]
                                            ">
                                                {failedTransactions}
                                            </span>

                                        </div>


                                        <div className="
                                            w-full
                                            h-1.5
                                            bg-[#EEF0F2]
                                            rounded-full
                                        ">

                                            <div
                                                className="
                                                    h-full
                                                    bg-[#9B5555]
                                                    rounded-full
                                                "
                                                style={{
                                                    width:
                                                        totalTransactions
                                                            ? `${(
                                                                failedTransactions /
                                                                totalTransactions
                                                            ) * 100}%`
                                                            : "0%"
                                                }}
                                            />

                                        </div>

                                    </div>


                                    {/* SETTLEMENT PENDING */}

                                    <div>

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            mb-1.5
                                        ">

                                            <span className="
                                                text-[11px]
                                                text-[#4D6573]
                                            ">
                                                Settlement Pending
                                            </span>


                                            <span className="
                                                text-[11px]
                                                font-medium
                                                text-[#20242A]
                                            ">
                                                {settlementPendingTransactions}
                                            </span>

                                        </div>


                                        <div className="
                                            w-full
                                            h-1.5
                                            bg-[#EEF0F2]
                                            rounded-full
                                        ">

                                            <div
                                                className="
                                                    h-full
                                                    bg-[#556A8A]
                                                    rounded-full
                                                "
                                                style={{
                                                    width:
                                                        totalTransactions
                                                            ? `${(
                                                                settlementPendingTransactions /
                                                                totalTransactions
                                                            ) * 100}%`
                                                            : "0%"
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>

                            </section>

                        </div>

                    </div>

                </div>

            </main>


            <Footer />

        </div>

    );

};


export default Dashboard;