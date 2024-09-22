import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
    return (
        <div className="fixed border-b w-screen p-4 bg-background">
            <div className="relative flex justify-between items-center">
                <h1 className="font-medium">AI Twitter</h1>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-x-8">
                    <Link href="/" className="hover:underline underline-offset-2">
                        Clients
                    </Link>
                    <Link href="/register" className="hover:underline underline-offset-2">
                        Register
                    </Link>
                </div>

                <p className="text-sm">by Roy Barzilay</p>
            </div>
        </div>
    );
};

export default Navbar;
