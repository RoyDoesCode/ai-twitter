import Link from "next/link";
import { Twitter } from "lucide-react";

const Navbar = () => {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground hover:opacity-80 transition-opacity">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-sm">
                        <Twitter className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span>AI Twitter</span>
                </Link>

                <nav className="flex items-center gap-1">
                    <Link
                        href="/"
                        className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                        Clients
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                        Register
                    </Link>
                </nav>

                <p className="text-sm text-muted-foreground">by Roy Barzilay</p>
            </div>
        </header>
    );
};

export default Navbar;
