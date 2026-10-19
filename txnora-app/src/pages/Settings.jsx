
import { useEffect, useState } from "react";
import {
  UserRound,
  ShieldCheck,
  ChevronRight,
  Shield,
  RefreshCw,
} from "lucide-react";
import { getCurrentUser } from "../services/userApi";

const sections = [
  { id: "profile", label: "My Profile", icon: UserRound },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const profile = await getCurrentUser();
      setUser(profile);
    } catch (err) {
      console.error("Failed to fetch current user:", err);

      setError(
        err.response?.status === 401
          ? "Your session has expired or is invalid. Please sign in again."
          : "Unable to load your profile. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const name = user?.name || "—";
  const email = user?.email || "—";
  const role = (user?.role || "—").replace(/^ROLE_/, "");
  const status = user?.status || "—";
  const userId = user?.id || "—";

  const inputClass =
    "mt-2 w-full rounded-lg border border-[#E3E6EC] " +
    "bg-[#F8F9FB] px-3.5 py-3 text-sm text-[#20242A] " +
    "outline-none cursor-default";

  return (
    <main className="min-h-full bg-[#F8F9FB] px-5 py-7 text-[#20242A] md:px-8">
      {/* Page heading */}
      <header className="mb-7 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] font-semibold tracking-[1.5px] text-[#68717A]">
            ACCOUNT MANAGEMENT
          </p>

          <h1 className="text-2xl font-semibold tracking-tight">
            Settings
          </h1>

          <p className="mt-2 text-sm text-[#68717A]">
            View your account information and security details.
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E9EAF2] font-semibold text-[#4F5580]">
          {loading ? (
            <UserRound size={22} />
          ) : (
            name !== "—" ? name.charAt(0).toUpperCase() : <UserRound size={22} />
          )}
        </div>
      </header>

      {/* Settings layout */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* Navigation */}
        <aside className="rounded-xl border border-[#E3E6EC] bg-white p-3">
          <p className="px-3 pb-3 pt-2 text-[10px] font-semibold tracking-[1.3px] text-[#68717A]">
            YOUR ACCOUNT
          </p>

          {sections.map((section) => {
            const Icon = section.icon;
            const active = activeSection === section.id;

            return (
              <button
                type="button"
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                  active
                    ? "bg-[#EFF0F6] font-semibold text-[#4F5580]"
                    : "text-[#556A8A] hover:bg-[#F5F6F9]"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />

                <span className="flex-1">{section.label}</span>

                {active && <ChevronRight size={16} />}
              </button>
            );
          })}
        </aside>

        {/* Content */}
        <section className="min-w-0 rounded-xl border border-[#E3E6EC] bg-white p-5 md:p-7">
          {/* Loading */}
          {loading && (
            <div className="flex min-h-52 flex-col items-center justify-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E3E6EC] border-t-[#4F5580]" />

              <p className="text-sm text-[#68717A]">
                Loading your account information...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex min-h-52 flex-col items-center justify-center text-center">
              <div className="rounded-full bg-red-50 p-4 text-red-600">
                <ShieldCheck size={26} />
              </div>

              <h2 className="mt-4 text-base font-semibold">
                Couldn't load your profile
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#68717A]">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchProfile}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4F5580] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#41476D]"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          )}

          {/* Actual profile and security data */}
          {!loading && !error && user && (
            <>
              {/* PROFILE */}
              {activeSection === "profile" && (
                <>
                  <div className="flex items-start justify-between gap-3 border-b border-[#E9EBF0] pb-5">
                    <div>
                      <h2 className="text-lg font-semibold">
                        My Profile
                      </h2>

                      <p className="mt-1.5 text-sm text-[#68717A]">
                        Your account information and assigned role.
                      </p>
                    </div>

                    <span className="rounded-md bg-[#F0F1F6] px-3 py-1.5 text-xs font-medium text-[#4F5580]">
                      Account
                    </span>
                  </div>

                  <div className="flex items-center gap-4 border-b border-[#E9EBF0] py-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E9EAF2] text-2xl font-semibold text-[#4F5580]">
                      {name !== "—" ? name.charAt(0).toUpperCase() : <UserRound size={26} />}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {name}
                      </h3>

                      <p className="mt-1 break-all text-sm text-[#68717A]">
                        {email}
                      </p>

                      <span className="mt-2 inline-block rounded-md bg-[#EEF0F8] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#4F5580]">
                        {role}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-[#556A8A]">
                        Full name
                      </label>

                      <input
                        className={inputClass}
                        value={name}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#556A8A]">
                        Work email
                      </label>

                      <input
                        className={inputClass}
                        value={email}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#556A8A]">
                        Assigned role
                      </label>

                      <input
                        className={inputClass}
                        value={role}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#556A8A]">
                        Account status
                      </label>

                      <input
                        className={inputClass}
                        value={status}
                        readOnly
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#556A8A]">
                        Account ID
                      </label>

                      <input
                        className={inputClass}
                        value={userId}
                        readOnly
                      />
                    </div>
                  </div>

                  <p className="mt-6 text-xs leading-5 text-[#68717A]">
                    Profile information is read-only. Contact your
                    administrator if your account details need updating.
                  </p>
                </>
              )}

              {/* SECURITY */}
              {activeSection === "security" && (
                <>
                  <div className="border-b border-[#E9EBF0] pb-5">
                    <h2 className="text-lg font-semibold">
                      Security
                    </h2>

                    <p className="mt-1.5 text-sm text-[#68717A]">
                      Review your authentication and account access.
                    </p>
                  </div>

                  <div className="mt-6 flex items-start gap-4 rounded-xl border border-[#E3E6EC] p-4">
                    <div className="rounded-lg bg-[#EFF0F6] p-3 text-[#4F5580]">
                      <ShieldCheck size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">
                        Authentication
                      </h3>

                      <p className="mt-1.5 text-sm leading-6 text-[#68717A]">
                        Txnora uses JSON Web Tokens (JWT) to authenticate
                        requests to protected backend endpoints.
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-xs text-[#556A8A]">
                        <Shield size={14} />
                        JWT-based authentication
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-4 rounded-xl border border-[#E3E6EC] p-4">
                    <div className="rounded-lg bg-[#F1F3F7] p-3 text-[#556A8A]">
                      <UserRound size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">
                        Role-based access
                      </h3>

                      <p className="mt-1.5 text-sm leading-6 text-[#68717A]">
                        Your assigned role determines which administrative
                        actions are available. The backend enforces access
                        permissions for protected endpoints.
                      </p>

                      <span className="mt-3 inline-block rounded-md bg-[#EFF0F6] px-2.5 py-1 text-xs font-semibold text-[#4F5580]">
                        {role}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-4 rounded-xl border border-[#E3E6EC] p-4">
                    <div className="rounded-lg bg-[#F1F3F7] p-3 text-[#556A8A]">
                      <Shield size={22} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">
                        Account status
                      </h3>

                      <p className="mt-1.5 text-sm leading-6 text-[#68717A]">
                        Your current account status is{" "}
                        <span className="font-semibold text-[#20242A]">
                          {status}
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-xs leading-5 text-[#68717A]">
                    Password changes, session revocation and multi-factor
                    authentication require dedicated backend support.
                  </p>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
