import { useEffect, useMemo, useState } from "react";

import {
    Search,
    RefreshCw,
    ArrowUpDown
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { getAllTransactions } from "../services/transactionApi";


const Transactions = () => {

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");


    // ============================================
    // FETCH TRANSACTIONS
    // ============================================

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


    // ============================================
    // FILTER TRANSACTIONS
    // ============================================

    const filteredTransactions = useMemo(() => {

        return transactions.filter(
            (transaction) => {

                const searchValue =
                    search.toLowerCase().trim();


                const matchesSearch =
                    !searchValue ||
                    transaction.id
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    transaction.userId
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    transaction.merchantId
                        ?.toLowerCase()
                        .includes(searchValue);


                const matchesStatus =
                    statusFilter === "ALL" ||
                    transaction.status === statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );

    }, [
        transactions,
        search,
        statusFilter
    ]);


    // ============================================
    // FORMAT AMOUNT
    // ============================================

    const formatAmount = (
        amount,
        currency = "INR"
    ) => {

        try {

            return new Intl.NumberFormat(
                "en-IN",
                {
                    style: "currency",
                    currency,
                    maximumFractionDigits: 2
                }
            ).format(amount);

        } catch {

            return `${currency} ${amount}`;

        }

    };


    // ============================================
    // FORMAT DATE
    // ============================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    // ============================================
    // STATUS LABEL
    // ============================================

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


    // ============================================
    // STATUS STYLE
    // ============================================

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


    return (

        <div className="min-h-screen bg-[#F7F8FA]">

            <Navbar />

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
                                Transactions
                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-[#68717A]
                            ">
                                Monitor and review transaction activity
                            </p>

                        </div>


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


                    {/* ================================= */}
                    {/* ERROR */}
                    {/* ================================= */}

                    {error && (

                        <div className="
                            mb-5
                            rounded-lg
                            border
                            border-[#E8CACA]
                            bg-[#FFF8F8]
                            px-4
                            py-3
                            text-sm
                            text-[#9B5555]
                        ">
                            {error}
                        </div>

                    )}


                    {/* ================================= */}
                    {/* FILTER BAR */}
                    {/* ================================= */}

                    <div className="
                        mb-5
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-lg
                        border
                        border-[#E2E5E9]
                        bg-white
                        p-4
                    ">


                        {/* SEARCH */}

                        <div className="
                            relative
                            w-full
                            max-w-[420px]
                        ">

                            <Search
                                size={16}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-[#68717A]
                                "
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="
                                    Search transaction ID, user or merchant
                                "
                                className="
                                    h-9
                                    w-full
                                    rounded-md
                                    border
                                    border-[#DDE2E4]
                                    bg-[#F7F8F8]
                                    pl-9
                                    pr-3
                                    text-sm
                                    text-[#20242A]
                                    outline-none
                                    placeholder:text-[#68717A]
                                    focus:border-[#55858A]
                                    focus:bg-white
                                "
                            />

                        </div>


                        {/* STATUS */}

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <span className="
                                text-xs
                                text-[#68717A]
                            ">
                                Status
                            </span>


                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                                className="
                                    h-9
                                    rounded-md
                                    border
                                    border-[#DDE2E4]
                                    bg-white
                                    px-3
                                    text-xs
                                    text-[#4D6573]
                                    outline-none
                                "
                            >

                                <option value="ALL">
                                    All
                                </option>

                                <option value="INITIATED">
                                    Initiated
                                </option>

                                <option value="PROCESSING">
                                    Processing
                                </option>

                                <option value="AUTHORIZED">
                                    Authorized
                                </option>

                                <option value="SETTLEMENT_PENDING">
                                    Settlement Pending
                                </option>

                                <option value="SETTLED">
                                    Settled
                                </option>

                                <option value="FAILED">
                                    Failed
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* TABLE */}
                    {/* ================================= */}

                    <section className="
                        overflow-hidden
                        rounded-lg
                        border
                        border-[#E2E5E9]
                        bg-white
                    ">


                        <div className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-[#E7E9EC]
                            px-5
                            py-4
                        ">

                            <div>

                                <h2 className="
                                    text-[15px]
                                    font-semibold
                                    text-[#20242A]
                                ">
                                    All Transactions
                                </h2>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-[#68717A]
                                ">
                                    {filteredTransactions.length} transaction
                                    {filteredTransactions.length !== 1
                                        ? "s"
                                        : ""
                                    }
                                </p>

                            </div>


                            <ArrowUpDown
                                size={16}
                                className="text-[#68717A]"
                            />

                        </div>


                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                    <tr className="
                                        border-b
                                        border-[#E7E9EC]
                                    ">

                                        <th className="
                                            px-5
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-medium
                                            text-[#68717A]
                                        ">
                                            TRANSACTION ID
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-medium
                                            text-[#68717A]
                                        ">
                                            USER
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-medium
                                            text-[#68717A]
                                        ">
                                            MERCHANT
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-right
                                            text-[11px]
                                            font-medium
                                            text-[#68717A]
                                        ">
                                            AMOUNT
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-medium
                                            text-[#68717A]
                                        ">
                                            STATUS
                                        </th>

                                        <th className="
                                            px-5
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-medium
                                            text-[#68717A]
                                        ">
                                            CREATED
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
                                                    py-12
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
                                        filteredTransactions.map(
                                            (transaction) => (

                                                <tr
                                                    key={transaction.id}
                                                    className="
                                                        border-b
                                                        border-[#F0F1F3]
                                                        transition
                                                        hover:bg-[#F8F9FA]
                                                    "
                                                >

                                                    <td className="
                                                        px-5
                                                        py-4
                                                    ">

                                                        <span className="
                                                            font-mono
                                                            text-xs
                                                            text-[#4D6573]
                                                        ">
                                                            {transaction.id}
                                                        </span>

                                                    </td>


                                                    <td className="
                                                        px-3
                                                        py-4
                                                    ">

                                                        <span className="
                                                            font-mono
                                                            text-xs
                                                            text-[#68717A]
                                                        ">
                                                            {transaction.userId}
                                                        </span>

                                                    </td>


                                                    <td className="
                                                        px-3
                                                        py-4
                                                    ">

                                                        <span className="
                                                            font-mono
                                                            text-xs
                                                            text-[#68717A]
                                                        ">
                                                            {transaction.merchantId}
                                                        </span>

                                                    </td>


                                                    <td className="
                                                        px-3
                                                        py-4
                                                        text-right
                                                    ">

                                                        <span className="
                                                            text-xs
                                                            font-medium
                                                            text-[#20242A]
                                                        ">
                                                            {formatAmount(
                                                                transaction.amount,
                                                                transaction.currency
                                                            )}
                                                        </span>

                                                    </td>


                                                    <td className="
                                                        px-3
                                                        py-4
                                                    ">

                                                        <span className={`
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            px-2.5
                                                            py-1
                                                            text-[10px]
                                                            font-medium
                                                            ${getStatusClass(
                                                                transaction.status
                                                            )}
                                                        `}>

                                                            <span className="
                                                                h-1.5
                                                                w-1.5
                                                                rounded-full
                                                                bg-current
                                                            " />

                                                            {getStatusLabel(
                                                                transaction.status
                                                            )}

                                                        </span>

                                                    </td>


                                                    <td className="
                                                        px-5
                                                        py-4
                                                    ">

                                                        <span className="
                                                            text-xs
                                                            text-[#68717A]
                                                        ">
                                                            {formatDate(
                                                                transaction.createdAt
                                                            )}
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )
                                    }


                                    {/* EMPTY */}

                                    {!loading &&
                                        filteredTransactions.length ===
                                            0 && (

                                            <tr>

                                                <td
                                                    colSpan="6"
                                                    className="
                                                        px-5
                                                        py-12
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
                    {/* FOOTER COUNT */}
                    {/* ================================= */}

                    <div className="
                        mt-4
                        flex
                        justify-between
                        text-xs
                        text-[#68717A]
                    ">

                        <span>
                            Showing {filteredTransactions.length} of{" "}
                            {transactions.length} transactions
                        </span>

                    </div>

                </div>

            </main>


            <Footer />

        </div>

    );

};


export default Transactions;