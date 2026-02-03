import { Sparkles, Dice6 } from "lucide-react";
import StaticUploadBox from "./StaticUploadBox"; // 使用纯静态版本

export default function StaticFusionStudio() {
    return (
        <section
            id="fusion-studio"
            className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8"
            aria-labelledby="studio-title"
            aria-busy="true"
        >
            {/* 标题部分 */}
            <div className="text-center space-y-2">
                <h2 id="studio-title" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    AI Fusion Studio
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                    Upload two images, describe the fusion style, and create unique artwork instantly.
                </p>
                {/* 加载状态提示 */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    Loading interactive tools...
                </div>
            </div>

            {/* 步骤1: 上传区域 - 使用纯静态组件 */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                    Select Images to Fuse
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <StaticUploadBox side="left" />

                    {/* 中间的融合图标 */}
                    <div className="flex sm:hidden items-center justify-center -my-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-px w-8 bg-border"></div>
                            <Sparkles className="h-5 w-5 text-primary" />
                            <div className="h-px w-8 bg-border"></div>
                        </div>
                    </div>

                    <StaticUploadBox side="right" />
                </div>
            </div>

            {/* 步骤2: 提示词区域 */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                    Describe Fusion Style (Optional)
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="static-fusion-prompt" className="sr-only">Fusion Prompt</label>
                        <div
                            className="text-sm flex items-center gap-1.5 text-primary/50 ml-auto min-h-[44px] px-2 pointer-events-none"
                            aria-label="Generate random prompt (feature will load)"
                        >
                            <Dice6 size={16} aria-hidden="true" />
                            Surprise Me
                        </div>
                    </div>
                    <div className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base min-h-[48px] flex items-center">
                        <span className="text-muted-foreground">e.g. Cyberpunk style, Cinematic lighting...</span>
                    </div>
                </div>
            </div>

            {/* 步骤3: 生成按钮 */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                    Generate Fusion
                </div>

                <div className="w-full rounded-2xl py-4 text-lg font-bold flex items-center justify-center gap-3 min-h-[56px] bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 text-foreground/50 pointer-events-none">
                    <Sparkles size={20} aria-hidden="true" />
                    Generate Fusion
                </div>

                {/* 进度条占位符 */}
                <div className="space-y-4 opacity-50">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary/20 w-1/3 animate-pulse" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        AI fusion tools are initializing...
                    </p>
                </div>
            </div>

            {/* 结果展示占位符 */}
            <div className="space-y-4">
                <div className="relative aspect-square w-full rounded-2xl border-2 border-primary/10 bg-gradient-to-br from-background to-muted/10 flex items-center justify-center">
                    <div className="text-center p-6">
                        <Sparkles className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                        <p className="font-semibold text-muted-foreground">Your Fusion Result Will Appear Here</p>
                        <p className="text-sm text-muted-foreground mt-2">Interactive tools loading...</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
