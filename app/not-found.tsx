import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - Page Not Found",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl font-extrabold text-foreground mb-4">404</h1>
            <h2 className="text-2xl font-bold mb-4 text-foreground/80">Page Not Found</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-md">
                The fusion you are looking for does not exist or has been moved to another dimension.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
                Return to Home
            </Link>
        </div>
    );
}
