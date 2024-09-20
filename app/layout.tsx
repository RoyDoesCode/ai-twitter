import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AI Twitter",
    description: "Created by Roy Barzilay",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
