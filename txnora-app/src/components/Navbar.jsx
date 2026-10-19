
import {
    Search,
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

            {/* Center search */}
            <div className="mx-4 hidden w-full max-w-[420px] md:block">
                <div className="relative">

                    <Search
                        size={16}
                        strokeWidth={1.7}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68717A]"
                    />

                    <input
                        type="text"
                        placeholder="Search transaction ID"
                        className="
                            h-9 w-full
                            rounded-md
                            border border-[#DDE2E4]
                            bg-[#F7F8F8]
                            pl-9 pr-10
                            text-sm text-[#20242A]
                            outline-none
                            placeholder:text-[#68717A]
                            focus:border-[#55858A]
                            focus:bg-white
                            focus:ring-2
                            focus:ring-[#55858A]/10
                        "
                    />

                    <span
                        className="
                            absolute right-2.5 top-1/2
                            -translate-y-1/2
                            rounded border border-[#DDE2E4]
                            bg-white px-1.5 py-0.5
                            text-[10px] font-medium
                            text-[#68717A]
                        "
                    >
                        /
                    </span>

                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

                {/* Mobile search */}
                <button
                    type="button"
                    className="
                        rounded-md p-2
                        text-[#68717A]
                        hover:bg-[#F7F8F8]
                        hover:text-[#20242A]
                        md:hidden
                    "
                    aria-label="Search"
                >
                    <Search size={18} strokeWidth={1.7} />
                </button>

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
