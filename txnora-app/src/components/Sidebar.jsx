import {
    LayoutDashboard,
    ArrowLeftRight,
    ScanSearch,
    Users,
    MailPlus,
    Settings,
    LogOut,
    X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";



const Sidebar = ({ mobileOpen = false, onClose }) => {

    const navigate = useNavigate();
    const location = useLocation();


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
                        <div className="flex h-7 w-7 items-center justify-center text-lg font-semibold text-[#4F5580]">
                            ◈
                        </div>

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

                    <button
                        className="
                            group flex h-9 w-full items-center gap-2.5
                            rounded-md px-2.5
                            text-sm font-medium text-[#68717A]
                            transition-colors
                            hover:bg-[#F7F8F8] hover:text-[#20242A]
                        "
                    >
                        <Settings
                            size={16}
                            strokeWidth={1.7}
                        />

                        <span>
                            Settings
                        </span>
                    </button>

                    <button
                        className="
                            group mt-0.5 flex h-9 w-full items-center gap-2.5
                            rounded-md px-2.5
                            text-sm font-medium text-[#68717A]
                            transition-colors
                            hover:bg-[#F7F8F8] hover:text-[#20242A]
                        "
                    >
                        <LogOut
                            size={16}
                            strokeWidth={1.7}
                        />

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </aside>
        </>
    );
};

export default Sidebar;