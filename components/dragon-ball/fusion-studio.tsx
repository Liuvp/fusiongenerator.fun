import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ChevronDown } from "lucide-react";

export function DBFusionStudio() {
    return (
        <div id="fusion-studio" className="space-y-6 scroll-mt-20">
            <h2 className="text-2xl font-bold">Dragon Ball Fusion Studio</h2>
            <Card className="border-2 shadow-sm">
                <CardContent className="p-6 space-y-8">
                    {/* Upload Areas */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Character A */}
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                Upload Dragon Ball Character A
                            </div>
                            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                <input className="hidden" type="file" accept="image/*" />
                                <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-muted">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Drop or Click to Upload
                                </div>
                            </div>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Name A (optional)"
                            />
                            <div className="text-xs text-muted-foreground">
                                Pro Tip: Use clear, front-facing images
                            </div>
                        </div>

                        {/* Character B */}
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                Upload Dragon Ball Character B
                            </div>
                            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                <input className="hidden" type="file" accept="image/*" />
                                <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-muted">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Drop or Click to Upload
                                </div>
                            </div>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Name B (optional)"
                            />
                            <div className="text-xs text-muted-foreground">
                                Pro Tip: Use clear, front-facing images
                            </div>
                        </div>
                    </div>

                    {/* Settings & Action */}
                    <div className="grid gap-4 md:grid-cols-3 items-end">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Select Fusion Form</div>
                            <div className="relative">
                                <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                                    <option>Potara (Vegito Style)</option>
                                    <option>Fusion Dance (Gogeta Style)</option>
                                    <option>Super Saiyan God</option>
                                    <option>Ultra Instinct</option>
                                    <option>Legendary Super Saiyan</option>
                                    <option>Base Form</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <Button className="w-full h-12 text-base font-bold tracking-wide" disabled>
                                CREATE DRAGON BALL FUSION
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
