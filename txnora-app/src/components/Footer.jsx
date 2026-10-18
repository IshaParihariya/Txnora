const Footer = () => {
    return (
        <footer
            className="
                ml-0 lg:ml-[240px]
                flex min-h-10 shrink-0
                flex-col items-center justify-center
                gap-1
                border-t border-[#DDE2E4]
                bg-white
                px-4 py-2
                text-[11px] text-[#68717A]
                sm:flex-row sm:justify-between
            "
        >

            <p>
                © 2026 Txnora · Secure Transaction Operations
            </p>

            <p className="text-[#68717A]">
                Demo environment · No real banking data
            </p>

        </footer>
    );
};

export default Footer;