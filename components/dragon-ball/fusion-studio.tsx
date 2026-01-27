"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, RefreshCw, Share2, LogIn, Crown, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { DB_CHARACTERS, DBCharacter, DB_FUSION_STYLES, getRandomCharacters } from "@/lib/dragon-ball-data";
import { User } from "@supabase/supabase-js";

export function DBFusionStudio() {
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createClient();
    const resultRef = useRef<HTMLDivElement>(null);

    const [char1, setChar1] = useState<DBCharacter>();
    const [char2, setChar2] = useState<DBCharacter>();
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<{ imageUrl: string; char1: DBCharacter; char2: DBCharacter } | null>(null);
    const [quota, setQuota] = useState<{ used: number; remaining: number; limit: number; isVIP: boolean } | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    /** Load saved selection */
    useEffect(() => {
        const saved = localStorage.getItem("fusion_state");
        if (saved) {
            try {
                const { c1, c2 } = JSON.parse(saved);
                if (c1) setChar1(DB_CHARACTERS.find(c => c.id === c1));
                if (c2) setChar2(DB_CHARACTERS.find(c => c.id === c2));
            } catch (e) {
                console.error("Failed to load saved state");
            }
        }
    }, []);

    /** Save selection */
    useEffect(() => {
        if (char1 || char2) {
            localStorage.setItem("fusion_state", JSON.stringify({ c1: char1?.id, c2: char2?.id }));
        }
    }, [char1, char2]);

    /** Scroll to result when generated */
    useEffect(() => {
        if (result && resultRef.current && !isGenerating) {
            // Small timeout to ensure DOM render
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    }, [result, isGenerating]);

    /** Auth & Quota */
    useEffect(() => {
        let subscription: { unsubscribe: () => void } | undefined;

        const checkUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error && error.message !== 'Auth session missing!') {
                    console.warn("Auth check verify:", error.message);
                }
                setUser(data?.user ?? null);
                setIsLoadingAuth(false);
            } catch (error) {
                console.error('Auth check critical error:', error);
                setIsLoadingAuth(false);
            }
        };

        const fetchQuota = async () => {
            try {
                const response = await fetch('/api/get-quota');
                if (response.ok) {
                    const data = await response.json();
                    setQuota(data.quota);
                }
            } catch (error) {
                console.error('Failed to fetch quota:', error);
            }
        };

        checkUser();
        fetchQuota();

        const { data: authData } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                setUser(session?.user ?? null);
                fetchQuota();
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setQuota(null);
            }
        });
        subscription = authData.subscription;

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [supabase]);

    /** Helpers */
    const getRemainingDisplay = () => quota?.isVIP ? "∞" : (quota ? quota.remaining : user ? "0" : "1");
    const hasQuotaAccess = () => quota?.isVIP || (quota ? quota.remaining > 0 : !user);
    const isSelectionComplete = !!(char1 && char2);
    const shouldDisableButton = !isSelectionComplete || isGenerating;

    /** Actions */
    const selectCharacter = (char: DBCharacter) => {
        if (char1?.id === char.id || char2?.id === char.id) return;
        if (!char1) setChar1(char);
        else if (!char2) setChar2(char);
        else { setChar2(char1); setChar1(char); }
    };

    const randomize = () => {
        const [c1, c2] = getRandomCharacters(2);
        setChar1(c1);
        setChar2(c2);
        setResult(null);
        toast({ title: "Random Pair Selected", description: `${c1.name} + ${c2.name}`, duration: 2000 });
    };

    const clearSelection = () => { setChar1(undefined); setChar2(undefined); setResult(null); };

    const generateFusion = async () => {
        if (!hasQuotaAccess()) {
            if (!user) router.push(`/sign-in?redirect_to=${window.location.pathname}&reason=fusion_quota`);
            else router.push('/pricing?source=dragon_ball_fusion&reason=upgrade_for_more');
            return;
        }

        if (!char1 || !char2) {
            toast({ title: "Select Two Characters", description: "Choose two fighters to fuse", variant: "destructive", duration: 3000 });
            return;
        }

        setIsGenerating(true);
        setResult(null);

        try {
            const defaultStyle = DB_FUSION_STYLES[0];
            const payload = { prompt: "", char1: char1.id, char2: char2.id, style: defaultStyle.id };

            const response = await fetch('/api/generate-fusion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            let data: any;
            try { data = await response.json(); } catch (e) { data = {}; }

            if (response.status === 429) { toast({ title: "Limit Reached", description: data.error || "Please try again later.", variant: "destructive", duration: 5000 }); return; }
            if (response.status === 402) { toast({ title: "Insufficient Credits", description: "Upgrade to continue.", variant: "destructive", duration: 5000 }); return; }
            if (!response.ok) throw new Error(data?.error || `Server error: ${response.status}`);

            if (data.quota) setQuota(data.quota);
            setResult({ imageUrl: data.imageUrl, char1, char2 });
            toast({ title: "Fusion Complete!", description: "A new warrior is born!", duration: 3000 });

        } catch (error: any) {
            console.error("Fusion error:", error);
            toast({ title: "Fusion Failed", description: error.message || "Please try again", variant: "destructive", duration: 4000 });
        } finally { setIsGenerating(false); }
    };

    const downloadImage = async () => {
        if (!result?.imageUrl) return;
        try {
            const response = await fetch(result.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fusion-${result.char1.name}-${result.char2.name}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast({ title: "Download Started", description: "Image saved to your device", duration: 3000 });
        } catch (error) { window.open(result.imageUrl, '_blank'); toast({ title: "Opening Image", description: "Use browser menu to save image.", duration: 3000 }); }
    };

    const shareResult = async () => {
        if (!result) return;
        const shareData = { title: `${result.char1.name} × ${result.char2.name} Fusion`, text: `Check out this Dragon Ball fusion!`, url: window.location.href };
        try { if (navigator.share && navigator.canShare(shareData)) await navigator.share(shareData); else { await navigator.clipboard.writeText(window.location.href); toast({ title: "Link Copied!", description: "Paste to share", duration: 3000 }); } }
        catch (error) { console.error("Share failed:", error); }
    };

    return (
        <div id="fusion-studio" className="bg-gradient-to-b from-orange-50/30 to-white p-4 pb-8 rounded-3xl min-h-[600px]">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-orange-600 tracking-tight">Dragon Ball Fusion Studio</h2>
                </div>
                <Badge variant={hasQuotaAccess() ? "default" : "destructive"} className="text-sm px-3 py-1.5 min-w-[80px] justify-center">
                    {quota?.isVIP ? "VIP" : `${getRemainingDisplay()} Left`}
                </Badge>
            </header>

            {/* 上半部分：角色选择 */}
            <Card className="border-0 shadow-md mb-6">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-700">Choose Fighters</h2>
                        <Button variant="ghost" size="sm" onClick={randomize} className="h-7 px-2 text-xs text-gray-600 hover:text-orange-600"><RefreshCw className="w-3 h-3 mr-1" />Random</Button>
                    </div>
                    <div className="grid grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                        {DB_CHARACTERS.map((character, index) => {
                            const isSelected1 = char1?.id === character.id;
                            const isSelected2 = char2?.id === character.id;
                            const isSelected = isSelected1 || isSelected2;
                            return (
                                <button key={character.id} onClick={() => selectCharacter(character)} className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 active:scale-95 touch-manipulation ${isSelected1 ? 'border-orange-500 shadow-md ring-2 ring-orange-200 ring-offset-1 scale-105' : isSelected2 ? 'border-blue-500 shadow-md ring-2 ring-blue-200 ring-offset-1 scale-105' : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'}`} aria-label={`Select ${character.name}`} aria-pressed={isSelected}>
                                    <div className="relative w-full h-full bg-gray-100">
                                        <Image src={character.imageUrl} alt={character.name} fill sizes="(max-width: 640px) 25vw, 80px" priority={index < 8} className={`object-contain p-1 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
                                        {isSelected && <div className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isSelected1 ? 'bg-orange-500 text-white shadow-md' : 'bg-blue-500 text-white shadow-md'}`}>{isSelected1 ? '1' : '2'}</div>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* 下半部分：当前选择 + 生成按钮 */}
            <Card className="border-0 shadow-md mb-6 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-700">{isSelectionComplete ? "Selected Fusion" : "Select 2 Fighters"}</h2>
                        {(char1 || char2) && <Button variant="ghost" size="sm" onClick={clearSelection} className="h-7 px-2 text-xs text-gray-500 hover:text-destructive">Clear</Button>}
                    </div>
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
                        <CharacterSlot char={char1} position={1} />
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center shadow-sm"><span className="text-xl font-bold text-orange-500">+</span></div>
                            <span className="text-[10px] text-orange-400 font-medium">FUSE</span>
                        </div>
                        <CharacterSlot char={char2} position={2} />
                    </div>

                    <Button onClick={generateFusion} disabled={shouldDisableButton} size="lg" className={`w-full py-6 text-xl font-black uppercase tracking-wide shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${isGenerating ? 'bg-gray-200 text-gray-500' : (!hasQuotaAccess() ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 hover:shadow-2xl text-white')}`}>
                        {isGenerating ? <span className="flex items-center gap-3"><Sparkles className="w-6 h-6 animate-spin" />FUSING...</span> : !isSelectionComplete ? "SELECT 2 FIGHTERS" : !hasQuotaAccess() ? (user ? "UPGRADE TO VIP" : "LOGIN FOR ENERGY") : <span className="flex items-center gap-3"><Sparkles className="w-6 h-6" />FUU-SION-HA!</span>}
                    </Button>
                </CardContent>
            </Card>

            {/* Loading State */}
            {isGenerating && (
                <Card className="border-0 shadow-md mb-6 animate-pulse">
                    <CardContent className="h-[400px] flex flex-col items-center justify-center p-5 space-y-4 bg-gray-50/50 rounded-xl">
                        <Sparkles className="w-12 h-12 text-orange-400 animate-spin" />
                        <p className="text-gray-500 font-medium">Channeling Ki...</p>
                    </CardContent>
                </Card>
            )}

            {/* 结果显示 */}
            {result && (
                <Card ref={resultRef} id="fusion-result" className="border-0 shadow-xl overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <CardContent className="p-0">
                        <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100">
                            <Image src={result.imageUrl} alt={`${result.char1.name} fused with ${result.char2.name}`} fill className="object-contain p-4" unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{result.char1.name} × {result.char2.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">Fusion Complete</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Button onClick={downloadImage} variant="default" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"><Download className="w-4 h-4 mr-2" />Save</Button>
                                <Button onClick={shareResult} variant="outline"><Share2 className="w-4 h-4 mr-2" />Share</Button>
                                <Button onClick={clearSelection} variant="outline"><RefreshCw className="w-4 h-4 mr-2" />New</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Footer */}
            <div className="mt-8 text-center space-y-1">
                <p className="text-xs text-gray-500">Daily free attempts reset at midnight. Log in for more.</p>
                <p className="text-xs text-gray-400">Fusion results are AI-generated for entertainment. Not official Dragon Ball content.</p>
            </div>
        </div>
    );
}

/** Character Slot */
const CharacterSlot = ({ char, position }: { char?: DBCharacter; position: number }) => {
    const colors = { 1: { border: 'border-orange-500', bg: 'bg-orange-500' }, 2: { border: 'border-blue-500', bg: 'bg-blue-500' } };
    const color = colors[position as keyof typeof colors];

    return (
        <div className="flex flex-col items-center">
            <div className={`relative w-24 h-24 rounded-xl overflow-hidden border-4 shadow-lg ${char ? color.border : 'border-gray-200'} bg-gray-100`}>
                {char ? (
                    <Image src={char.imageUrl} alt={char.name} fill className="object-contain p-1" sizes="96px" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-black text-gray-300">?</span>
                    </div>
                )}
            </div>
            <div className={`mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${char ? `${color.bg} text-white` : 'bg-gray-100 text-gray-400'}`}>
                {char ? char.name : `SLOT ${position}`}
            </div>
        </div>
    );
};
