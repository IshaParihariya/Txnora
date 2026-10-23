
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { acceptInvitation } from "../services/userApi";

export default function AcceptInvite() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Each invitation automatically supplies its own token.
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            setError("Invitation link is missing its token.");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await acceptInvitation({
                token,
                password,
                confirmPassword,
            });

            setSuccess("Your account is activated! Redirecting to login...");

            setTimeout(() => {
                navigate("/", { replace: true });
            }, 1500);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to accept invitation. The link may have expired or already been used."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-wide text-[#4F5580]">
                        ◈ TXNORA
                    </h1>
                    <p className="mt-2 text-xs font-medium tracking-[0.2em] text-gray-400">
                        SECURE TEAM ACCESS
                    </p>
                </div>

                <h2 className="text-2xl font-semibold text-gray-900">
                    Accept your invitation
                </h2>
                <p className="mt-2 mb-6 text-sm text-gray-500">
                    Create a password to activate your Txnora account.
                </p>

                {!token ? (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        Invalid invitation link. Please use the link from your invitation email.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Create password
                            </label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#4F5580] focus:ring-2 focus:ring-[#4F5580]/20"
                                placeholder="At least 8 characters"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Confirm password
                            </label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#4F5580] focus:ring-2 focus:ring-[#4F5580]/20"
                                placeholder="Re-enter your password"
                            />
                        </div>

                        {error && (
                            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || Boolean(success)}
                            className="w-full rounded-lg bg-[#4F5580] px-4 py-3 font-medium text-white transition hover:bg-[#41476C] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Activating account..." : "Activate account"}
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-xs text-gray-400">
                    Secure invitation · Use your link within its validity period.
                </p>
            </div>
        </div>
    );
}
