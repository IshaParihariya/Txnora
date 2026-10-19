import { useState } from "react";

import {
    Search,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock3,
    AlertCircle
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { getInvestigation } from "../services/investigationApi";


const Investigations = () => {

    const [transactionId, setTransactionId] = useState("");

    const [investigation, setInvestigation] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // ============================================
    // INVESTIGATE TRANSACTION
    // ============================================

    const handleInvestigate = async (event) => {

        event.preventDefault();

        const id = transactionId.trim();

        if (!id) {

            setError("Please enter a transaction ID.");

            return;
        }


        try {

            setLoading(true);

            setError("");

            setInvestigation(null);


            const data = await getInvestigation(id);

            setInvestigation(data);

        } catch (error) {

            console.error(
                "Failed to investigate transaction:",
                error
            );


            if (error.response?.status === 404) {

                setError(
                    "Transaction investigation could not be found."
                );

            } else {

                setError(
                    error.response?.data?.message ||
                    "Unable to investigate this transaction."
                );

            }

        } finally {

            setLoading(false);

        }

    };


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

        if (!status) {
            return "Unknown";
        }

        return status
            .toLowerCase()
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (letter) => letter.toUpperCase()
            );

    };


    // ============================================
    // STATUS COLORS
    // ============================================

    const getStatusClass = (status) => {

        switch (status) {

            case "SETTLED":

                return {
                    badge: "bg-[#4F8076]/10 text-[#4F8076]",
                    dot: "bg-[#4F8076]"
                };


            case "FAILED":

                return {
                    badge: "bg-[#9B5555]/10 text-[#9B5555]",
                    dot: "bg-[#9B5555]"
                };


            case "INITIATED":
            case "PROCESSING":
            case "AUTHORIZED":

                return {
                    badge: "bg-[#92713A]/10 text-[#92713A]",
                    dot: "bg-[#92713A]"
                };


            case "SETTLEMENT_PENDING":

                return {
                    badge: "bg-[#556A8A]/10 text-[#556A8A]",
                    dot: "bg-[#556A8A]"
                };


            default:

                return {
                    badge: "bg-[#68717A]/10 text-[#68717A]",
                    dot: "bg-[#68717A]"
                };

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
                    {/* PAGE HEADER */}
                    {/* ================================= */}

                    <div className="mb-7">

                        <h1 className="
                            text-[25px]
                            font-semibold
                            text-[#20242A]
                        ">
                            Investigations
                        </h1>


                        <p className="
                            mt-1
                            text-sm
                            text-[#68717A]
                        ">
                            Investigate a transaction and review its history and risk evaluation
                        </p>

                    </div>


                    {/* ================================= */}
                    {/* SEARCH */}
                    {/* ================================= */}

                    <section className="
                        mb-6
                        rounded-lg
                        border
                        border-[#E2E5E9]
                        bg-white
                        p-5
                    ">

                        <div className="mb-3">

                            <h2 className="
                                text-[15px]
                                font-semibold
                                text-[#20242A]
                            ">
                                Transaction Investigation
                            </h2>


                            <p className="
                                mt-1
                                text-xs
                                text-[#68717A]
                            ">
                                Enter a transaction ID to retrieve its complete investigation data.
                            </p>

                        </div>


                        <form
                            onSubmit={handleInvestigate}
                            className="
                                flex
                                gap-3
                            "
                        >

                            <div className="
                                relative
                                w-full
                                max-w-[600px]
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
                                    value={transactionId}
                                    onChange={(event) =>
                                        setTransactionId(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter transaction ID"
                                    className="
                                        h-10
                                        w-full
                                        rounded-md
                                        border
                                        border-[#DDE2E4]
                                        bg-[#F7F8F8]
                                        pl-9
                                        pr-3
                                        font-mono
                                        text-sm
                                        text-[#20242A]
                                        outline-none
                                        placeholder:font-sans
                                        placeholder:text-[#68717A]
                                        focus:border-[#55858A]
                                        focus:bg-white
                                    "
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    flex
                                    h-10
                                    items-center
                                    gap-2
                                    rounded-md
                                    bg-[#4F5580]
                                    px-5
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-[#444A72]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >

                                {loading ? (

                                    <RefreshCw
                                        size={15}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <Search size={15} />

                                )}

                                {loading
                                    ? "Investigating..."
                                    : "Investigate"
                                }

                            </button>

                        </form>

                    </section>


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
                    {/* EMPTY STATE */}
                    {/* ================================= */}

                    {!investigation &&
                        !loading &&
                        !error && (

                            <section className="
                            rounded-lg
                            border
                            border-[#E2E5E9]
                            bg-white
                            px-6
                            py-16
                            text-center
                        ">

                                <Search
                                    size={30}
                                    strokeWidth={1.5}
                                    className="
                                    mx-auto
                                    mb-4
                                    text-[#68717A]
                                "
                                />


                                <h2 className="
                                text-[16px]
                                font-semibold
                                text-[#20242A]
                            ">
                                    No transaction selected
                                </h2>


                                <p className="
                                mx-auto
                                mt-2
                                max-w-[450px]
                                text-sm
                                text-[#68717A]
                            ">
                                    Enter a transaction ID above to review
                                    its transaction details, status history,
                                    and risk evaluation results.
                                </p>

                            </section>

                        )}


                    {/* ================================= */}
                    {/* INVESTIGATION RESULT */}
                    {/* ================================= */}

                    {investigation && (

                        <div className="space-y-6">


                            {/* ================================= */}
                            {/* TRANSACTION */}
                            {/* ================================= */}

                            <section className="
                                overflow-hidden
                                rounded-lg
                                border
                                border-[#E2E5E9]
                                bg-white
                            ">

                                <div className="
                                    border-b
                                    border-[#E7E9EC]
                                    px-5
                                    py-4
                                ">

                                    <h2 className="
                                        text-[15px]
                                        font-semibold
                                        text-[#20242A]
                                    ">
                                        Transaction Details
                                    </h2>


                                    <p className="
                                        mt-1
                                        text-xs
                                        text-[#68717A]
                                    ">
                                        Core transaction information
                                    </p>

                                </div>


                                <div className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    xl:grid-cols-4
                                    gap-x-8
                                    gap-y-6
                                    p-5
                                ">


                                    {/* TRANSACTION ID */}

                                    <div>

                                        <p className="
                                            mb-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-[#68717A]
                                        ">
                                            Transaction ID
                                        </p>


                                        <p className="
                                            break-all
                                            font-mono
                                            text-xs
                                            text-[#20242A]
                                        ">
                                            {
                                                investigation.transaction?.id
                                            }
                                        </p>

                                    </div>


                                    {/* USER */}

                                    <div>

                                        <p className="
                                            mb-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-[#68717A]
                                        ">
                                            User ID
                                        </p>


                                        <p className="
                                            font-mono
                                            text-xs
                                            text-[#20242A]
                                        ">
                                            {
                                                investigation.transaction?.userId
                                            }
                                        </p>

                                    </div>


                                    {/* MERCHANT */}

                                    <div>

                                        <p className="
                                            mb-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-[#68717A]
                                        ">
                                            Merchant ID
                                        </p>


                                        <p className="
                                            break-all
                                            font-mono
                                            text-xs
                                            text-[#20242A]
                                        ">
                                            {
                                                investigation.transaction?.merchantId
                                            }
                                        </p>

                                    </div>


                                    {/* STATUS */}

                                    <div>

                                        <p className="
                                            mb-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-[#68717A]
                                        ">
                                            Status
                                        </p>


                                        {(() => {

                                            const style =
                                                getStatusClass(
                                                    investigation
                                                        .transaction
                                                        ?.status
                                                );

                                            return (

                                                <span className={`
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    rounded-full
                                                    px-2.5
                                                    py-1
                                                    text-[10px]
                                                    font-medium
                                                    ${style.badge}
                                                `}>

                                                    <span className={`
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full
                                                        ${style.dot}
                                                    `} />

                                                    {
                                                        getStatusLabel(
                                                            investigation
                                                                .transaction
                                                                ?.status
                                                        )
                                                    }

                                                </span>

                                            );

                                        })()}

                                    </div>


                                    {/* AMOUNT */}

                                    <div>

                                        <p className="
                                            mb-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-[#68717A]
                                        ">
                                            Amount
                                        </p>


                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-[#20242A]
                                        ">
                                            {
                                                formatAmount(
                                                    investigation
                                                        .transaction
                                                        ?.amount,

                                                    investigation
                                                        .transaction
                                                        ?.currency
                                                )
                                            }
                                        </p>

                                    </div>


                                    {/* CURRENCY */}

                                    <div>

                                        <p className="
                                            mb-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-[#68717A]
                                        ">
                                            Currency
                                        </p>


                                        <p className="
                                            text-xs
                                            text-[#20242A]
                                        ">
                                            {
                                                investigation
                                                    .transaction
                                                    ?.currency || "-"
                                            }
                                        </p>

                                    </div>


                                    {/* CREATED */}

                                    <div>

                                        <p className="
                                            mb-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-[#68717A]
                                        ">
                                            Created At
                                        </p>


                                        <p className="
                                            text-xs
                                            text-[#20242A]
                                        ">
                                            {
                                                formatDate(
                                                    investigation
                                                        .transaction
                                                        ?.createdAt
                                                )
                                            }
                                        </p>

                                    </div>


                                    {/* UPDATED */}

                                    <div>

                                        <p className="
                                            mb-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-[#68717A]
                                        ">
                                            Updated At
                                        </p>


                                        <p className="
                                            text-xs
                                            text-[#20242A]
                                        ">
                                            {
                                                formatDate(
                                                    investigation
                                                        .transaction
                                                        ?.updatedAt
                                                )
                                            }
                                        </p>

                                    </div>

                                </div>

                            </section>


                            {/* ================================= */}
                            {/* FAILURE SUMMARY - FAILED TRANSACTIONS ONLY */}
                            {investigation.transaction?.status === "FAILED" && (
                                <section
                                    role="alert"
                                    className="rounded-lg border border-[#E8CACA] bg-[#FFF8F8] p-5"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9B5555]/10">
                                            <AlertCircle size={18} className="text-[#9B5555]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-[15px] font-semibold text-[#873F3F]">
                                                Transaction Failed
                                            </h2>
                                            <p className="mt-1 text-sm leading-5 text-[#7D5555]">
                                                {investigation.failureReason || investigation.failureRule
                                                    ? "The transaction was marked as failed. Review the recorded failure details below."
                                                    : "The transaction was marked as failed, but the backend has not provided a specific failure reason."}
                                            </p>
                                            {(investigation.failureReason || investigation.failureRule) && (
                                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                    {investigation.failureReason && (
                                                        <div className="rounded-md border border-[#E8D6D6] bg-white p-3">
                                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8A6262]">Failure reason</p>
                                                            <p className="mt-1 break-words text-sm text-[#20242A]">{investigation.failureReason}</p>
                                                        </div>
                                                    )}
                                                    {investigation.failureRule && (
                                                        <div className="rounded-md border border-[#E8D6D6] bg-white p-3">
                                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8A6262]">Failure rule</p>
                                                            <p className="mt-1 break-words font-mono text-sm text-[#20242A]">{investigation.failureRule}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {!investigation.failureReason && !investigation.failureRule && (
                                                <p className="mt-3 text-xs text-[#8A6262]">
                                                    No recorded failure metadata is available. Check the backend logs to identify the cause.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* STATUS HISTORY */}
                            {/* ================================= */}

                            <section className="
                                rounded-lg
                                border
                                border-[#E2E5E9]
                                bg-white
                                p-5
                            ">

                                <div className="mb-6">

                                    <h2 className="
                                        text-[15px]
                                        font-semibold
                                        text-[#20242A]
                                    ">
                                        Status History
                                    </h2>


                                    <p className="
                                        mt-1
                                        text-xs
                                        text-[#68717A]
                                    ">
                                        Transaction lifecycle
                                    </p>

                                </div>


                                {investigation
                                    .transactionHistory
                                    ?.statusHistory
                                    ?.length > 0 ? (

                                    <div className="
                                        relative
                                        ml-2
                                    ">

                                        {/* vertical line */}

                                        <div className="
                                            absolute
                                            left-[7px]
                                            top-2
                                            bottom-2
                                            w-px
                                            bg-[#DDE2E4]
                                        " />


                                        <div className="
                                            space-y-6
                                        ">

                                            {[
                                                ...investigation
                                                    .transactionHistory
                                                    .statusHistory
                                            ]
                                                .sort(
                                                    (a, b) =>
                                                        new Date(
                                                            a.timestamp
                                                        ) -
                                                        new Date(
                                                            b.timestamp
                                                        )
                                                )
                                                .map(
                                                    (
                                                        history,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={`${history.status}-${history.timestamp}-${index}`}
                                                            className="
                                                                relative
                                                                flex
                                                                items-start
                                                                gap-4
                                                            "
                                                        >

                                                            {/* DOT */}

                                                            <div className="
                                                                relative
                                                                z-10
                                                                mt-0.5
                                                                h-4
                                                                w-4
                                                                shrink-0
                                                                rounded-full
                                                                border-4
                                                                border-white
                                                                bg-[#4F5580]
                                                                ring-1
                                                                ring-[#DDE2E4]
                                                            " />


                                                            <div className="
                                                                flex
                                                                w-full
                                                                items-start
                                                                justify-between
                                                                gap-4
                                                            ">

                                                                <div>

                                                                    <p className="
                                                                        text-sm
                                                                        font-medium
                                                                        text-[#20242A]
                                                                    ">
                                                                        {
                                                                            getStatusLabel(
                                                                                history.status
                                                                            )
                                                                        }
                                                                    </p>


                                                                    <p className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-[#68717A]
                                                                    ">
                                                                        Transaction entered this status
                                                                    </p>

                                                                </div>


                                                                <span className="
                                                                    shrink-0
                                                                    text-xs
                                                                    text-[#68717A]
                                                                ">
                                                                    {
                                                                        formatDate(
                                                                            history.timestamp
                                                                        )
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    )
                                                )
                                            }

                                        </div>

                                    </div>

                                ) : (

                                    <p className="
                                        py-6
                                        text-center
                                        text-sm
                                        text-[#68717A]
                                    ">
                                        No status history available.
                                    </p>

                                )}

                            </section>


                            {/* ================================= */}
                            {/* RISK EVALUATION */}
                            {/* ================================= */}

                            <section className="
                                overflow-hidden
                                rounded-lg
                                border
                                border-[#E2E5E9]
                                bg-white
                            ">

                                <div className="
                                    border-b
                                    border-[#E7E9EC]
                                    px-5
                                    py-4
                                ">

                                    <h2 className="
                                        text-[15px]
                                        font-semibold
                                        text-[#20242A]
                                    ">
                                        Risk Evaluation
                                    </h2>


                                    <p className="
                                        mt-1
                                        text-xs
                                        text-[#68717A]
                                    ">
                                        Risk evaluation results associated with this transaction
                                    </p>

                                </div>


                                {investigation
                                    .riskEvaluationResults
                                    ?.length > 0 ? (

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
                                                    RULE
                                                </th>


                                                <th className="
                                                        px-3
                                                        py-3
                                                        text-left
                                                        text-[11px]
                                                        font-medium
                                                        text-[#68717A]
                                                    ">
                                                    RESULT
                                                </th>


                                                <th className="
                                                        px-3
                                                        py-3
                                                        text-left
                                                        text-[11px]
                                                        font-medium
                                                        text-[#68717A]
                                                    ">
                                                    REASON
                                                </th>


                                                <th className="
                                                        px-5
                                                        py-3
                                                        text-left
                                                        text-[11px]
                                                        font-medium
                                                        text-[#68717A]
                                                    ">
                                                    RESULT ID
                                                </th>

                                            </tr>

                                            </thead>


                                            <tbody>

                                            {investigation
                                                .riskEvaluationResults
                                                .map(
                                                    (
                                                        result,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={
                                                                result.id ||
                                                                index
                                                            }
                                                            className="
                                                                    border-b
                                                                    border-[#F0F1F3]
                                                                "
                                                        >

                                                            {/* RULE */}

                                                            <td className="
                                                                    px-5
                                                                    py-4
                                                                ">

                                                                    <span className="
                                                                        font-mono
                                                                        text-xs
                                                                        text-[#4D6573]
                                                                    ">
                                                                        {
                                                                            result.rule ||
                                                                            "-"
                                                                        }
                                                                    </span>

                                                            </td>


                                                            {/* APPROVED */}

                                                            <td className="
                                                                    px-3
                                                                    py-4
                                                                ">

                                                                {result.approved ? (

                                                                    <span className="
                                                                            inline-flex
                                                                            items-center
                                                                            gap-1.5
                                                                            rounded-full
                                                                            bg-[#4F8076]/10
                                                                            px-2.5
                                                                            py-1
                                                                            text-[10px]
                                                                            font-medium
                                                                            text-[#4F8076]
                                                                        ">

                                                                            <CheckCircle2
                                                                                size={12}
                                                                            />

                                                                            Approved

                                                                        </span>

                                                                ) : (

                                                                    <span className="
                                                                            inline-flex
                                                                            items-center
                                                                            gap-1.5
                                                                            rounded-full
                                                                            bg-[#9B5555]/10
                                                                            px-2.5
                                                                            py-1
                                                                            text-[10px]
                                                                            font-medium
                                                                            text-[#9B5555]
                                                                        ">

                                                                            <XCircle
                                                                                size={12}
                                                                            />

                                                                            Rejected

                                                                        </span>

                                                                )}

                                                            </td>


                                                            {/* REASON */}

                                                            <td className="
                                                                    px-3
                                                                    py-4
                                                                ">

                                                                <p className="
                                                                        max-w-[500px]
                                                                        text-xs
                                                                        leading-5
                                                                        text-[#4D6573]
                                                                    ">
                                                                    {
                                                                        result.reason ||
                                                                        "-"
                                                                    }
                                                                </p>

                                                            </td>


                                                            {/* ID */}

                                                            <td className="
                                                                    px-5
                                                                    py-4
                                                                ">

                                                                    <span className="
                                                                        break-all
                                                                        font-mono
                                                                        text-[10px]
                                                                        text-[#68717A]
                                                                    ">
                                                                        {
                                                                            result.id ||
                                                                            "-"
                                                                        }
                                                                    </span>

                                                            </td>

                                                        </tr>

                                                    )
                                                )
                                            }

                                            </tbody>

                                        </table>

                                    </div>

                                ) : (

                                    <div className="
                                        px-5
                                        py-10
                                        text-center
                                    ">

                                        <Clock3
                                            size={22}
                                            className="
                                                mx-auto
                                                mb-3
                                                text-[#68717A]
                                            "
                                        />

                                        <p className="
                                            text-sm
                                            text-[#68717A]
                                        ">
                                            No risk evaluation results found.
                                        </p>

                                    </div>

                                )}

                            </section>

                        </div>

                    )}

                </div>

            </main>


            <Footer />

        </div>

    );

};

export default Investigations;
