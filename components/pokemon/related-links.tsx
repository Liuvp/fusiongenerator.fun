import Link from "next/link";

export function PokeRelatedLinks() {
    return (
        <div className="space-y-4">
            <p className="text-muted-foreground text-base leading-relaxed">
                Want to explore character fusions beyond Pokémon? Check out our{" "}
                <Link href="/" className="text-primary font-medium hover:underline">
                    main Fusion Generator
                </Link>{" "}
                to create Dragon Ball, AI, and cross-universe fusions in one place.
            </p>
        </div>
    );
}
