import Link from "next/link";

export function DBHowToUse() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">How to Use Our Dragon Ball Fusion Generator</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
                Our Dragon Ball Fusion Generator lets you create anime-accurate character combinations in seconds. Upload two clear, front-facing images for Character A and Character B, then choose a fusion form like Potara (Vegito), Fusion Dance (Gogeta), Super Saiyan God, Ultra Instinct, Legendary Super Saiyan, or Base Form. The tool blends silhouettes, colors, and iconic Dragon Ball visual motifs to produce a high-resolution result. For popular long‑tail queries such as Goku and Vegeta fusion or Dragon Ball Z fusion generator, simply input &quot;Goku&quot; and &quot;Vegeta&quot; as names to label your output, and pick Potara or Fusion Dance depending on the style you want.
            </p>

            <h3 className="text-xl font-semibold">Fusion Types Explained</h3>
            <p className="text-muted-foreground text-base leading-relaxed">
                Potara fusions combine fighters via Supreme Kai earrings and typically yield Vegito‑style results with golden aura lines and sharper contrast. Fusion Dance produces Gogeta‑style outcomes with balanced features, athletic proportions, and dynamic speed trails. Super Saiyan God adds crimson godly ki and refined edges, while Ultra Instinct emphasizes silver highlights and effortless motion. Legendary Super Saiyan evokes emerald energy and high impact lines. Each setting tailors color grading, glow distribution, and aura geometry to match Dragon Ball's canon aesthetics.
            </p>

            <h3 className="text-xl font-semibold">Tips for Best Results</h3>
            <p className="text-muted-foreground text-base leading-relaxed">
                Use high‑quality source images, avoid extreme angles, and keep backgrounds simple. Name your fighters (e.g., &quot;Goku&quot; and &quot;Vegeta&quot;) to auto‑generate a themed fusion name. After you click Create Dragon Ball Fusion, download the HD image or share on social media. If you love anime pairings beyond Saiyans, try Piccolo + Gohan, Trunks + Goten, or villain fusions like Frieza + Cell. This Dragon Ball Fusion Generator is AI‑assisted, ensuring consistent lighting, aura cohesion, and anime‑style edges for authentic DBZ character fusions every time. Want to explore character fusions beyond Dragon Ball? Check out our <Link href="/" className="text-primary hover:underline font-medium">main fusion generator</Link> for more options.
            </p>
        </div>
    );
}
