
import {
    Menu,
    ChevronDown
} from "lucide-react";

const Navbar = ({ user, onMenuClick }) => {

    const displayName = user?.name || "Loading...";
    const displayRole = user?.role || "";

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "U";

    return (
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#DDE2E4] bg-white px-4 sm:px-6">

            {/* Left */}
            <div className="flex min-w-0 items-center gap-3">

                {/* Mobile menu */}
                <button
                    onClick={onMenuClick}
                    className="
                        rounded-md p-2
                        text-[#68717A]
                        hover:bg-[#F7F8F8]
                        hover:text-[#20242A]
                        lg:hidden
                    "
                    aria-label="Open navigation"
                >
                    <Menu size={19} strokeWidth={1.7} />
                </button>

                {/* Page title */}
                <div className="hidden sm:block">
                    <h1 className="text-[15px] font-semibold text-[#20242A]">
                        Dashboard
                    </h1>
                </div>

            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

                {/* User */}
                <button
                    type="button"
                    className="
                        flex items-center gap-2
                        rounded-md px-2 py-1.5
                        transition-colors
                        hover:bg-[#F7F8F8]
                    "
                    aria-label="Current user"
                >

                    {/* Avatar */}
                    <div
                        className="
                            flex h-7 w-7 shrink-0
                            items-center justify-center
                            rounded-full
                            bg-[#4F5580]/[0.12]
                            text-[10px] font-semibold
                            text-[#4F5580]
                        "
                    >
                        {initials}
                    </div>

                    {/* Name + role */}
                    <div className="hidden text-left sm:block">

                        <p className="max-w-[130px] truncate text-[13px] font-medium text-[#20242A]">
                            {displayName}
                        </p>

                        <p
                            className={`
                                text-[10px] font-semibold tracking-wide
                                ${
                                    displayRole === "ADMIN"
                                        ? "text-[#4F5580]"
                                        : "text-[#68717A]"
                                }
                            `}
                        >
                            {displayRole}
                        </p>

                    </div>

                    <ChevronDown
                        size={15}
                        strokeWidth={1.7}
                        className="hidden text-[#68717A] sm:block"
                    />

                </button>

            </div>

        </header>
    );
};

export default Navbar;
