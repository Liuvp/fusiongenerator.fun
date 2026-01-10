import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ChevronDown, Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function PokeFusionStudio() {
    return (
        <div id="fusion-studio" className="space-y-6 scroll-mt-20">
            <h2 className="text-2xl font-bold">Pokemon Fusion Studio</h2>
            <Card className="border-2 shadow-sm">
                <CardContent className="p-6 space-y-8">
                    {/* Upload Areas */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Pokemon A */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                    Upload Pokemon A
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Supported: JPG, PNG, WebP. Max 5MB.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors group">
                                <input className="hidden" type="file" accept="image/png, image/jpeg, image/webp" />
                                <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-muted group-hover:bg-background transition-colors">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    Drop image or Click to Upload
                                </div>
                                <div className="text-xs text-muted-foreground/60">
                                    Max 5MB (JPG, PNG, WebP)
                                </div>
                            </div>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Name A (e.g. Pikachu)"
                            />
                        </div>

                        {/* Pokemon B */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                    Upload Pokemon B
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Supported: JPG, PNG, WebP. Max 5MB.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors group">
                                <input className="hidden" type="file" accept="image/png, image/jpeg, image/webp" />
                                <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-muted group-hover:bg-background transition-colors">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    Drop image or Click to Upload
                                </div>
                                <div className="text-xs text-muted-foreground/60">
                                    Max 5MB (JPG, PNG, WebP)
                                </div>
                            </div>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Name B (e.g. Charizard)"
                            />
                        </div>
                    </div>

                    {/* Settings & Action */}
                    <div className="grid gap-4 md:grid-cols-3 items-end">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Fusion Style</div>
                            <div className="relative">
                                <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                                    <option>Balanced Hybrid</option>
                                    <option>Type-Dominant A</option>
                                    <option>Type-Dominant B</option>
                                    <option>Mega Evolution Style</option>
                                    <option>Regional Variant</option>
                                    <option>Shiny Palette</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span tabIndex={0} className="w-full block">
                                            <Button className="w-full h-12 text-base font-bold tracking-wide" disabled>
                                                EVOLVE & FUSE!
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Upload both Pokemon images to unlock fusion.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
