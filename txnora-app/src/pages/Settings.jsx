
import { useEffect, useState } from "react";
import {
  UserRound,
  ShieldCheck,
  ChevronRight,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";

import {
  getCurrentUser,
  changePassword,
} from "../services/userApi";

const sections = [
  {
    id: "profile",
    label: "Account",
    description: "Identity and assigned role",
    icon: UserRound,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and account access",
    icon: ShieldCheck,
  },
];

function PasswordField({
                         id,
                         label,
                         value,
                         onChange,
                         placeholder,
                         visible,
                         onToggle,
                         disabled,
                       }) {
  return (
      <div>
        <label
            htmlFor={id}
            className="block text-sm font-medium text-[#354052]"
        >
          {label}
        </label>

        <div className="relative mt-2">
          <input
              id={id}
              name={id}
              type={visible ? "text" : "password"}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              autoComplete={
                id === "currentPassword"
                    ? "current-password"
                    : "new-password"
              }
              disabled={disabled}
              required
              className="w-full rounded-lg border border-[#DDE2EA] bg-white px-3.5 py-3 pr-11 text-sm text-[#20242A] outline-none transition placeholder:text-[#9AA1AC] focus:border-[#4F5580] focus:ring-4 focus:ring-[#4F5580]/10 disabled:cursor-not-allowed disabled:bg-[#F8F9FB]"
          />

          <button
              type="button"
              onClick={onToggle}
              aria-label={
                visible
                    ? `Hide ${label.toLowerCase()}`
                    : `Show ${label.toLowerCase()}`
              }
              aria-pressed={visible}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#68717A] transition hover:text-[#4F5580] focus:outline-none focus:ring-2 focus:ring-[#4F5580]/30"
          >
            {visible ? (
                <EyeOff size={17} />
            ) : (
                <Eye size={17} />
            )}
          </button>
        </div>
      </div>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
      useState(false);
  const [showNewPassword, setShowNewPassword] =
      useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
      useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setProfileError("");

        const profile = await getCurrentUser();

        if (!cancelled) {
          setUser(profile);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);

        if (!cancelled) {
          setProfileError(
              error.response?.status === 401
                  ? "Your session has expired or is invalid. Please sign in again."
                  : "Unable to load your account information. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const name = user?.name || "";
  const email = user?.email || "";

  const rawRole = (
      user?.role ||
      localStorage.getItem("role") ||
      ""
  )
      .replace(/^ROLE_/, "")
      .toUpperCase();

  const roleLabel =
      rawRole === "ADMIN"
          ? "Administrator"
          : rawRole === "SUPPORT"
              ? "Support"
              : rawRole || "Not available";

  const resetPasswordMessages = () => {
    setPasswordError("");
    setPasswordMessage("");
  };

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    resetPasswordMessages();
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    resetPasswordMessages();

    if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
    ) {
      setPasswordError(
          "Complete all password fields to continue."
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
          "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
          "The new passwords do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
          "Your new password must be different from your current password."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordMessage(
          response?.message ||
          "Password changed successfully."
      );

      resetPasswordForm();
      setShowPasswordForm(true);

      setPasswordMessage(
          response?.message ||
          "Password changed successfully."
      );
    } catch (error) {
      console.error("Password change failed:", error);

      const status = error.response?.status;
      const responseData = error.response?.data;

      setPasswordError(
          status === 401
              ? "Your session is invalid or has expired. Please sign in again."
              : responseData?.message ||
              responseData?.error ||
              "Unable to change your password. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
      <main className="min-h-full bg-[#F8F9FB] px-5 py-7 text-[#20242A] md:px-8 md:py-8">
        <header className="mb-7">
          <p className="mb-2 text-[11px] font-semibold tracking-[1.5px] text-[#68717A]">
            ACCOUNT MANAGEMENT
          </p>

          <h1 className="text-2xl font-semibold tracking-tight">
            Settings
          </h1>

          <p className="mt-2 text-sm text-[#68717A]">
            Manage your account and security preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-[#E3E6EC] bg-white p-3">
            <p className="px-3 pb-3 pt-2 text-[10px] font-semibold tracking-[1.3px] text-[#68717A]">
              SETTINGS
            </p>

            {sections.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;

              return (
                  <button
                      type="button"
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      aria-current={active ? "page" : undefined}
                      className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                          active
                              ? "bg-[#EFF0F6] text-[#4F5580]"
                              : "text-[#556A8A] hover:bg-[#F7F8FA]"
                      }`}
                  >
                    <Icon size={19} strokeWidth={1.8} />

                    <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {section.label}
                  </span>

                  <span
                      className={`mt-0.5 block text-xs ${
                          active
                              ? "text-[#62698D]"
                              : "text-[#87909D]"
                      }`}
                  >
                    {section.description}
                  </span>
                </span>

                    {active && <ChevronRight size={16} />}
                  </button>
              );
            })}
          </aside>

          <section className="min-w-0 rounded-xl border border-[#E3E6EC] bg-white p-5 md:p-7">
            {loading ? (
                <div
                    className="flex min-h-48 flex-col items-center justify-center gap-3"
                    role="status"
                >
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E3E6EC] border-t-[#4F5580]" />

                  <p className="text-sm text-[#68717A]">
                    Loading your account information...
                  </p>
                </div>
            ) : profileError ? (
                <div className="flex min-h-48 flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-red-50 p-3 text-red-600">
                    <AlertCircle size={24} />
                  </div>

                  <h2 className="mt-4 text-base font-semibold">
                    Couldn't load your account
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-[#68717A]">
                    {profileError}
                  </p>

                  <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="mt-4 rounded-lg bg-[#4F5580] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#41476D]"
                  >
                    Try again
                  </button>
                </div>
            ) : (
                <>
                  {activeSection === "profile" && (
                      <div>
                        <div className="border-b border-[#E9EBF0] pb-5">
                          <h2 className="text-lg font-semibold">
                            Account information
                          </h2>

                          <p className="mt-1.5 text-sm text-[#68717A]">
                            Your registered Txnora identity.
                          </p>
                        </div>

                        <div className="mt-6 rounded-xl border border-[#E3E6EC] p-5 md:p-6">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold tracking-[1.2px] text-[#68717A]">
                              ACCOUNT ROLE
                            </p>

                            {rawRole && (
                                <span className="inline-flex items-center rounded-md bg-[#EFF0F6] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#4F5580]">
                          {rawRole}
                        </span>
                            )}
                          </div>

                          <div className="mt-2">
                            <p className="text-lg font-semibold text-[#20242A]">
                              {name || "Name not available"}
                            </p>

                            <p className="mt-1 break-all text-sm text-[#68717A]">
                              {email || "Email not available"}
                            </p>
                          </div>

                          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#E9EBF0] pt-5 sm:grid-cols-2">
                            <div>
                              <p className="text-[10px] font-semibold tracking-[1px] text-[#87909D]">
                                FULL NAME
                              </p>

                              <p className="mt-1.5 text-sm font-medium">
                                {name || "Not available"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold tracking-[1px] text-[#87909D]">
                                WORK EMAIL
                              </p>

                              <p className="mt-1.5 break-all text-sm font-medium">
                                {email || "Not available"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold tracking-[1px] text-[#87909D]">
                                ACCOUNT ROLE
                              </p>

                              <p className="mt-1.5 text-sm font-medium">
                                {roleLabel}
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="mt-5 text-xs leading-5 text-[#68717A]">
                          Account details are managed by your organization's
                          administrator.
                        </p>
                      </div>
                  )}

                  {activeSection === "security" && (
                      <div>
                        <div className="border-b border-[#E9EBF0] pb-5">
                          <h2 className="text-lg font-semibold">
                            Security
                          </h2>

                          <p className="mt-1.5 text-sm text-[#68717A]">
                            Manage your password and keep your account secure.
                          </p>
                        </div>

                        <div className="mt-6 rounded-xl border border-[#E3E6EC] p-4 md:p-5">
                          <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-[#EFF0F6] p-3 text-[#4F5580]">
                              <KeyRound size={21} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-semibold">
                                Password
                              </h3>

                              <p className="mt-1.5 text-sm leading-6 text-[#68717A]">
                                Keep your account credentials secure.
                                Change your password periodically and
                                never share it with anyone.
                              </p>

                              {!showPasswordForm && (
                                  <button
                                      type="button"
                                      onClick={() => {
                                        setShowPasswordForm(true);
                                        resetPasswordMessages();
                                      }}
                                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F5580] transition hover:text-[#343A65] focus:outline-none focus:ring-2 focus:ring-[#4F5580]/30 focus:ring-offset-2"
                                  >
                                    Change password
                                    <ChevronRight size={16} />
                                  </button>
                              )}
                            </div>
                          </div>

                          {showPasswordForm && (
                              <form
                                  onSubmit={handleChangePassword}
                                  className="mt-6 space-y-5 border-t border-[#E9EBF0] pt-6"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <h4 className="text-sm font-semibold">
                                      Update password
                                    </h4>

                                    <p className="mt-1 text-xs text-[#68717A]">
                                      Enter your current password, then
                                      choose a new one.
                                    </p>
                                  </div>

                                  <button
                                      type="button"
                                      onClick={() => {
                                        setShowPasswordForm(false);
                                        resetPasswordForm();
                                      }}
                                      disabled={passwordLoading}
                                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#68717A] hover:bg-[#F5F6F9] hover:text-[#20242A] disabled:opacity-50"
                                  >
                                    <ArrowLeft size={14} />
                                    Cancel
                                  </button>
                                </div>

                                <PasswordField
                                    id="currentPassword"
                                    label="Current password"
                                    value={currentPassword}
                                    onChange={(event) => {
                                      setCurrentPassword(event.target.value);
                                      resetPasswordMessages();
                                    }}
                                    placeholder="Enter current password"
                                    visible={showCurrentPassword}
                                    onToggle={() =>
                                        setShowCurrentPassword((value) => !value)
                                    }
                                    disabled={passwordLoading}
                                />

                                <PasswordField
                                    id="newPassword"
                                    label="New password"
                                    value={newPassword}
                                    onChange={(event) => {
                                      setNewPassword(event.target.value);
                                      resetPasswordMessages();
                                    }}
                                    placeholder="At least 8 characters"
                                    visible={showNewPassword}
                                    onToggle={() =>
                                        setShowNewPassword((value) => !value)
                                    }
                                    disabled={passwordLoading}
                                />

                                <PasswordField
                                    id="confirmPassword"
                                    label="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(event) => {
                                      setConfirmPassword(event.target.value);
                                      resetPasswordMessages();
                                    }}
                                    placeholder="Re-enter new password"
                                    visible={showConfirmPassword}
                                    onToggle={() =>
                                        setShowConfirmPassword((value) => !value)
                                    }
                                    disabled={passwordLoading}
                                />

                                <div className="flex items-start gap-2 rounded-lg bg-[#F8F9FB] p-3 text-xs leading-5 text-[#68717A]">
                                  <ShieldCheck
                                      size={16}
                                      className="mt-0.5 shrink-0 text-[#4F5580]"
                                  />

                                  <p>
                                    Use at least 8 characters and choose a
                                    password you don't use for other accounts.
                                  </p>
                                </div>

                                {passwordError && (
                                    <div
                                        role="alert"
                                        className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                                    >
                                      <AlertCircle
                                          size={17}
                                          className="mt-0.5 shrink-0"
                                      />
                                      <span>{passwordError}</span>
                                    </div>
                                )}

                                {passwordMessage && (
                                    <div
                                        role="status"
                                        className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                                    >
                                      <CheckCircle2
                                          size={17}
                                          className="mt-0.5 shrink-0"
                                      />
                                      <span>{passwordMessage}</span>
                                    </div>
                                )}

                                <div className="flex flex-col-reverse gap-3 border-t border-[#E9EBF0] pt-5 sm:flex-row sm:items-center sm:justify-end">
                                  <button
                                      type="button"
                                      onClick={() => {
                                        setShowPasswordForm(false);
                                        resetPasswordForm();
                                      }}
                                      disabled={passwordLoading}
                                      className="rounded-lg border border-[#DDE2EA] px-4 py-2.5 text-sm font-semibold text-[#556A8A] transition hover:bg-[#F8F9FB] disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>

                                  <button
                                      type="submit"
                                      disabled={passwordLoading}
                                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4F5580] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#41476D] focus:outline-none focus:ring-4 focus:ring-[#4F5580]/20 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {passwordLoading ? (
                                        <>
                                          <LoaderCircle
                                              size={16}
                                              className="animate-spin"
                                          />
                                          Updating...
                                        </>
                                    ) : (
                                        <>
                                          <KeyRound size={16} />
                                          Update password
                                        </>
                                    )}
                                  </button>
                                </div>
                              </form>
                          )}
                        </div>
                      </div>
                  )}
                </>
            )}
          </section>
        </div>
      </main>
  );
}

//
// import { useEffect, useState } from "react";
// import {
//   UserRound,
//   ShieldCheck,
//   ChevronRight,
//   Shield,
//   RefreshCw,
// } from "lucide-react";
// import { getCurrentUser } from "../services/userApi";
//
// const sections = [
//   { id: "profile", label: "My Profile", icon: UserRound },
//   { id: "security", label: "Security", icon: ShieldCheck },
// ];
//
// export default function Settings() {
//   const [activeSection, setActiveSection] = useState("profile");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//
//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");
//
//       const profile = await getCurrentUser();
//       setUser(profile);
//     } catch (err) {
//       console.error("Failed to fetch current user:", err);
//
//       setError(
//         err.response?.status === 401
//           ? "Your session has expired or is invalid. Please sign in again."
//           : "Unable to load your profile. Check your connection and try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   useEffect(() => {
//     fetchProfile();
//   }, []);
//
//   const name = user?.name || "—";
//   const email = user?.email || "—";
//   const role = (user?.role || "—").replace(/^ROLE_/, "");
//   const status = user?.status || "—";
//   const userId = user?.id || "—";
//
//   const inputClass =
//     "mt-2 w-full rounded-lg border border-[#E3E6EC] " +
//     "bg-[#F8F9FB] px-3.5 py-3 text-sm text-[#20242A] " +
//     "outline-none cursor-default";
//
//   return (
//     <main className="min-h-full bg-[#F8F9FB] px-5 py-7 text-[#20242A] md:px-8">
//       {/* Page heading */}
//       <header className="mb-7 flex items-center justify-between gap-4">
//         <div>
//           <p className="mb-2 text-[11px] font-semibold tracking-[1.5px] text-[#68717A]">
//             ACCOUNT MANAGEMENT
//           </p>
//
//           <h1 className="text-2xl font-semibold tracking-tight">
//             Settings
//           </h1>
//
//           <p className="mt-2 text-sm text-[#68717A]">
//             View your account information and security details.
//           </p>
//         </div>
//
//         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E9EAF2] font-semibold text-[#4F5580]">
//           {loading ? (
//             <UserRound size={22} />
//           ) : (
//             name !== "—" ? name.charAt(0).toUpperCase() : <UserRound size={22} />
//           )}
//         </div>
//       </header>
//
//       {/* Settings layout */}
//       <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
//         {/* Navigation */}
//         <aside className="rounded-xl border border-[#E3E6EC] bg-white p-3">
//           <p className="px-3 pb-3 pt-2 text-[10px] font-semibold tracking-[1.3px] text-[#68717A]">
//             YOUR ACCOUNT
//           </p>
//
//           {sections.map((section) => {
//             const Icon = section.icon;
//             const active = activeSection === section.id;
//
//             return (
//               <button
//                 type="button"
//                 key={section.id}
//                 onClick={() => setActiveSection(section.id)}
//                 className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
//                   active
//                     ? "bg-[#EFF0F6] font-semibold text-[#4F5580]"
//                     : "text-[#556A8A] hover:bg-[#F5F6F9]"
//                 }`}
//               >
//                 <Icon size={18} strokeWidth={1.8} />
//
//                 <span className="flex-1">{section.label}</span>
//
//                 {active && <ChevronRight size={16} />}
//               </button>
//             );
//           })}
//         </aside>
//
//         {/* Content */}
//         <section className="min-w-0 rounded-xl border border-[#E3E6EC] bg-white p-5 md:p-7">
//           {/* Loading */}
//           {loading && (
//             <div className="flex min-h-52 flex-col items-center justify-center gap-3">
//               <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E3E6EC] border-t-[#4F5580]" />
//
//               <p className="text-sm text-[#68717A]">
//                 Loading your account information...
//               </p>
//             </div>
//           )}
//
//           {/* Error */}
//           {!loading && error && (
//             <div className="flex min-h-52 flex-col items-center justify-center text-center">
//               <div className="rounded-full bg-red-50 p-4 text-red-600">
//                 <ShieldCheck size={26} />
//               </div>
//
//               <h2 className="mt-4 text-base font-semibold">
//                 Couldn't load your profile
//               </h2>
//
//               <p className="mt-2 max-w-md text-sm leading-6 text-[#68717A]">
//                 {error}
//               </p>
//
//               <button
//                 type="button"
//                 onClick={fetchProfile}
//                 className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4F5580] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#41476D]"
//               >
//                 <RefreshCw size={15} />
//                 Try again
//               </button>
//             </div>
//           )}
//
//           {/* Actual profile and security data */}
//           {!loading && !error && user && (
//             <>
//               {/* PROFILE */}
//               {activeSection === "profile" && (
//                 <>
//                   <div className="flex items-start justify-between gap-3 border-b border-[#E9EBF0] pb-5">
//                     <div>
//                       <h2 className="text-lg font-semibold">
//                         My Profile
//                       </h2>
//
//                       <p className="mt-1.5 text-sm text-[#68717A]">
//                         Your account information and assigned role.
//                       </p>
//                     </div>
//
//                     <span className="rounded-md bg-[#F0F1F6] px-3 py-1.5 text-xs font-medium text-[#4F5580]">
//                       Account
//                     </span>
//                   </div>
//
//                   <div className="flex items-center gap-4 border-b border-[#E9EBF0] py-6">
//                     <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E9EAF2] text-2xl font-semibold text-[#4F5580]">
//                       {name !== "—" ? name.charAt(0).toUpperCase() : <UserRound size={26} />}
//                     </div>
//
//                     <div className="min-w-0">
//                       <h3 className="truncate font-semibold">
//                         {name}
//                       </h3>
//
//                       <p className="mt-1 break-all text-sm text-[#68717A]">
//                         {email}
//                       </p>
//
//                       <span className="mt-2 inline-block rounded-md bg-[#EEF0F8] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#4F5580]">
//                         {role}
//                       </span>
//                     </div>
//                   </div>
//
//                   <div className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2">
//                     <div>
//                       <label className="text-xs font-semibold text-[#556A8A]">
//                         Full name
//                       </label>
//
//                       <input
//                         className={inputClass}
//                         value={name}
//                         readOnly
//                       />
//                     </div>
//
//                     <div>
//                       <label className="text-xs font-semibold text-[#556A8A]">
//                         Work email
//                       </label>
//
//                       <input
//                         className={inputClass}
//                         value={email}
//                         readOnly
//                       />
//                     </div>
//
//                     <div>
//                       <label className="text-xs font-semibold text-[#556A8A]">
//                         Assigned role
//                       </label>
//
//                       <input
//                         className={inputClass}
//                         value={role}
//                         readOnly
//                       />
//                     </div>
//
//                     <div>
//                       <label className="text-xs font-semibold text-[#556A8A]">
//                         Account status
//                       </label>
//
//                       <input
//                         className={inputClass}
//                         value={status}
//                         readOnly
//                       />
//                     </div>
//
//                     <div className="sm:col-span-2">
//                       <label className="text-xs font-semibold text-[#556A8A]">
//                         Account ID
//                       </label>
//
//                       <input
//                         className={inputClass}
//                         value={userId}
//                         readOnly
//                       />
//                     </div>
//                   </div>
//
//                   <p className="mt-6 text-xs leading-5 text-[#68717A]">
//                     Profile information is read-only. Contact your
//                     administrator if your account details need updating.
//                   </p>
//                 </>
//               )}
//
//               {/* SECURITY */}
//               {activeSection === "security" && (
//                 <>
//                   <div className="border-b border-[#E9EBF0] pb-5">
//                     <h2 className="text-lg font-semibold">
//                       Security
//                     </h2>
//
//                     <p className="mt-1.5 text-sm text-[#68717A]">
//                       Review your authentication and account access.
//                     </p>
//                   </div>
//
//                   <div className="mt-6 flex items-start gap-4 rounded-xl border border-[#E3E6EC] p-4">
//                     <div className="rounded-lg bg-[#EFF0F6] p-3 text-[#4F5580]">
//                       <ShieldCheck size={22} />
//                     </div>
//
//                     <div className="min-w-0 flex-1">
//                       <h3 className="text-sm font-semibold">
//                         Authentication
//                       </h3>
//
//                       <p className="mt-1.5 text-sm leading-6 text-[#68717A]">
//                         Txnora uses JSON Web Tokens (JWT) to authenticate
//                         requests to protected backend endpoints.
//                       </p>
//
//                       <div className="mt-3 flex items-center gap-2 text-xs text-[#556A8A]">
//                         <Shield size={14} />
//                         JWT-based authentication
//                       </div>
//                     </div>
//                   </div>
//
//                   <div className="mt-4 flex items-start gap-4 rounded-xl border border-[#E3E6EC] p-4">
//                     <div className="rounded-lg bg-[#F1F3F7] p-3 text-[#556A8A]">
//                       <UserRound size={22} />
//                     </div>
//
//                     <div className="min-w-0 flex-1">
//                       <h3 className="text-sm font-semibold">
//                         Role-based access
//                       </h3>
//
//                       <p className="mt-1.5 text-sm leading-6 text-[#68717A]">
//                         Your assigned role determines which administrative
//                         actions are available. The backend enforces access
//                         permissions for protected endpoints.
//                       </p>
//
//                       <span className="mt-3 inline-block rounded-md bg-[#EFF0F6] px-2.5 py-1 text-xs font-semibold text-[#4F5580]">
//                         {role}
//                       </span>
//                     </div>
//                   </div>
//
//                   <div className="mt-4 flex items-start gap-4 rounded-xl border border-[#E3E6EC] p-4">
//                     <div className="rounded-lg bg-[#F1F3F7] p-3 text-[#556A8A]">
//                       <Shield size={22} />
//                     </div>
//
//                     <div>
//                       <h3 className="text-sm font-semibold">
//                         Account status
//                       </h3>
//
//                       <p className="mt-1.5 text-sm leading-6 text-[#68717A]">
//                         Your current account status is{" "}
//                         <span className="font-semibold text-[#20242A]">
//                           {status}
//                         </span>
//                         .
//                       </p>
//                     </div>
//                   </div>
//
//                   <p className="mt-6 text-xs leading-5 text-[#68717A]">
//                     Password changes, session revocation and multi-factor
//                     authentication require dedicated backend support.
//                   </p>
//                 </>
//               )}
//             </>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }
