import {
    LayoutDashboard,
    ArrowLeftRight,
    ScanSearch,
    Users,
    MailPlus,
    Settings,
    LogOut,
    X,
    BookOpen
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { useState } from "react";



const Sidebar = ({ mobileOpen = false, onClose }) => {

    const navigate = useNavigate();
    const location = useLocation();

    //logout modal
    const [showLogoutModal, setShowLogoutModal] = useState(false);


    const role = localStorage.getItem("role") || "SUPPORT";

    const isAdmin = role === "ADMIN";

    const navigation = [
        {
            section: "OVERVIEW",
            items: [
                {
                    name: "Dashboard",
                    icon: LayoutDashboard,
                    path: "/dashboard"
                }
            ]
        },
        {
            section: "MONITORING",
            items: [
                {
                    name: "Transactions",
                    icon: ArrowLeftRight,
                    path: "/transactions"
                },
                {
                    name: "Investigations",
                    icon: ScanSearch,
                    path: "/investigations"
                }
            ]
        }
    ];

    if (isAdmin) {
        navigation.push({
            section: "ADMINISTRATION",
            items: [
                {
                    name: "Users",
                    icon: Users,
                    path: "/users"
                },
                {
                    name: "Invitations",
                    icon: MailPlus,
                    path: "/invitations"
                }
            ]
        });
    }

    const handleNavigation = (path) => {
        navigate(path);
        onClose?.();
    };

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                />
            )}

           <aside
    className={`
        fixed left-0 top-14 z-50
        flex h-[calc(100vh-3.5rem)] w-[240px] flex-col
        border-r border-[#DDE2E4]
        bg-white
        transition-transform duration-200
        lg:z-auto lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    `}
>

                {/* Brand */}
                <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#DDE2E4] px-4">

                    <div className="flex items-center gap-2">
                        {/*<div className="flex h-7 w-7 items-center justify-center text-lg font-semibold text-[#4F5580]">*/}
                        {/*    ◈*/}
                        {/*</div>*/}
                        {/*our logo*/}
                        <img
                            src="/txnoraLogo1.png"
                            alt="Txnora logo"
                            className="h-7 w-7 object-contain"
                        />

                        <span className="text-[13px] font-semibold tracking-[0.08em] text-[#20242A]">
                            TXNORA
                        </span>

                        <span className="rounded border border-[#DDE2E4] px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-[#68717A]">
                            DEMO
                        </span>
                    </div>

                    {/* Mobile close */}
                    <button
                        onClick={onClose}
                        className="rounded p-1.5 text-[#68717A] hover:bg-[#F7F8F8] hover:text-[#20242A] lg:hidden"
                        aria-label="Close navigation"
                    >
                        <X size={18} strokeWidth={1.7} />
                    </button>

                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-5">

                    {navigation.map((group) => (
                        <div
                            key={group.section}
                            className="mb-6"
                        >

                            {/* Section heading */}
                            <p className="mb-2 px-2 text-[10px] font-semibold tracking-[0.08em] text-[#68717A]">
                                {group.section}
                            </p>

                            <div className="space-y-0.5">

                                {group.items.map((item) => {

                                    const Icon = item.icon;

                                    const isActive =
    location.pathname === item.path ||
    (
        item.path !== "/dashboard" &&
        location.pathname.startsWith(item.path)
    );

                                    return (
                                        <button
                                            key={item.name}
                                            onClick={() => handleNavigation(item.path)}
                                            className={`
                                                group relative flex h-9 w-full
                                                items-center gap-2.5
                                                rounded-md px-2.5
                                                text-left text-sm font-medium
                                                transition-colors
                                                ${
                                                    isActive
                                                        ? "bg-[#4F5580]/[0.08] text-[#4F5580]"
                                                        : "text-[#68717A] hover:bg-[#F7F8F8] hover:text-[#20242A]"
                                                }
                                            `}
                                        >

                                            {/* Active indicator */}
                                            {isActive && (
                                                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[#4F5580]" />
                                            )}

                                            <Icon
                                                size={16}
                                                strokeWidth={1.7}
                                                className={
                                                    isActive
                                                        ? "text-[#4F5580]"
                                                        : "text-[#68717A] group-hover:text-[#20242A]"
                                                }
                                            />

                                            <span>
                                                {item.name}
                                            </span>

                                        </button>
                                    );
                                })}

                            </div>
                        </div>
                    ))}

                </nav>
               
{/* Bottom utilities */}
<div className="shrink-0 border-t border-[#DDE2E4] px-3 py-3">

    {/* About & User Guide */}
    <a
        href="/txnora-user-guide.pdf"
        // When the user clicks the link, the PDF opens in a new browser tab, leaving the Txnora application open in the original tab
        target="_blank"
        // This adds security and privacy protections when opening the new tab. It prevents the opened page from accessing the original page through window.opener and avoids sending referrer information.
        rel="noopener noreferrer"
        onClick={() => onClose?.()}
        className="flex h-9 w-full items-center gap-2.5
               rounded-md px-2.5 text-sm font-medium
               text-[#68717A] transition-colors
               hover:bg-[#F7F8F8] hover:text-[#20242A]"
    >
        <BookOpen size={16} strokeWidth={1.7} />
        <span>About & User Guide</span>
    </a>

    {/* Settings */}
    <button
        onClick={() => handleNavigation("/settings")}
        className={`
            group relative flex h-9 w-full items-center gap-2.5
            rounded-md px-2.5 text-sm font-medium transition-colors
            ${
                location.pathname === "/settings"
                    ? "bg-[#4F5580]/[0.08] text-[#4F5580]"
                    : "text-[#68717A] hover:bg-[#F7F8F8] hover:text-[#20242A]"
            }
        `}
    >
        {location.pathname === "/settings" && (
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[#4F5580]" />
        )}

        <Settings size={16} strokeWidth={1.7} />
        <span>Settings</span>
    </button>

    {/* Logout */}
    <button
        onClick={() => setShowLogoutModal(true)}
        className="mt-1 flex h-9 w-full items-center gap-2.5
                   rounded-md px-2.5 text-sm font-medium
                   text-[#68717A] transition-colors
                   hover:bg-red-50 hover:text-red-600"
    >
        <LogOut size={16} strokeWidth={1.7} />
        <span>Logout</span>
    </button>
</div>

            </aside>

            {/* Logout Confirmation Modal */}
{showLogoutModal && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">

        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            className="w-full max-w-sm rounded-2xl border border-[#E3E6EC]
                       bg-white p-6 shadow-2xl"
        >
            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center
                            rounded-xl bg-red-50 text-red-600">
                <LogOut size={22} strokeWidth={1.8} />
            </div>

            {/* Heading */}
            <h2
                id="logout-modal-title"
                className="text-lg font-semibold text-[#20242A]"
            >
                Log out of Txnora?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#68717A]">
                Are you sure you want to log out? You will need to sign
                in again to access your account.
            </p>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={() => setShowLogoutModal(false)}
                    className="rounded-xl border border-[#DDE2E4] px-4 py-2.5
                               text-sm font-medium text-[#20242A]
                               transition hover:bg-[#F7F8F8]"
                >
                    Cancel
                </button>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        localStorage.removeItem("role");

                        setShowLogoutModal(false);
                        navigate("/", { replace: true });
                        onClose?.();
                    }}
                    className="rounded-xl bg-red-600 px-4 py-2.5
                               text-sm font-medium text-white
                               transition hover:bg-red-700"
                >
                    Yes, log out
                </button>
            </div>
        </div>
    </div>
)}

        </>
    );
};

export default Sidebar;