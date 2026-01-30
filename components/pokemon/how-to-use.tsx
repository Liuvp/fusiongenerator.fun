import { CheckCircle } from "lucide-react";

export function PokeHowToUse() {
    const steps = [
        {
            number: "01",
            title: "Select Your Pokemon",
            description: "Choose any two Pokemon from our curated library of iconic characters across all generations.",
            tips: ["Click Pokemon images to select", "Scroll to browse the collection", "Try legendary combinations"]
        },
        {
            number: "02",
            title: "Customize Fusion Style",
            description: "Open the Settings menu to pick from 6 AI styles: Balanced, Cute, Cool, Realistic, Anime, or Custom.",
            tips: ["Balanced: 50/50 trait blend", "Realistic: Photo-realistic results", "Custom: Manual adjustments"]
        },
        {
            number: "03",
            title: "Generate & Download",
            description: "Click generate to create your fusion. Download in HD or share directly.",
            tips: ["High-Quality downloads", "Social media sharing", "Save to your device"]
        }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold tracking-tight">How to Create Pokemon Fusions</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Follow these simple steps to create amazing Pokemon fusions in under 30 seconds
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {steps.map((step, index) => (
                    <div key={index} className="group relative">
                        {/* 步骤编号装饰 */}
                        <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl -z-10 group-hover:scale-110 transition-transform duration-300" />

                        <div className="bg-card border-2 rounded-xl p-6 h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                            {/* 步骤编号 */}
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl mb-4">
                                {step.number}
                            </div>

                            {/* 步骤标题 */}
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>

                            {/* 步骤描述 */}
                            <p className="text-muted-foreground mb-4">{step.description}</p>

                            {/* 实用提示 */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground/70">Pro Tips:</p>
                                <ul className="space-y-1.5">
                                    {step.tips.map((tip, tipIndex) => (
                                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-muted-foreground">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 额外提示 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-700 font-bold">💡</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-800 mb-2">Best Practices for Great Results</h4>
                        <ul className="space-y-2 text-blue-700/80">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                <span>Edit the text prompt manually to add specific details (e.g. "wings")</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                <span>Experiment with different type combinations (Fire + Water, etc.)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                <span>Try the "Custom" style for full creative control</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
