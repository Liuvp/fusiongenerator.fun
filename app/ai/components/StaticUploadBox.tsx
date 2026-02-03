import { Upload } from "lucide-react";

interface StaticUploadBoxProps {
    side: "left" | "right";
    className?: string;
}

export default function StaticUploadBox({ side, className = "" }: StaticUploadBoxProps) {
    return (
        <div className={`relative w-full ${className}`}>
            <div className="relative aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/5 flex flex-col items-center justify-center p-4 h-full w-full">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="text-base font-semibold text-center text-foreground">
                    {side === "left" ? "Upload Image A" : "Upload Image B"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 text-center">
                    Click or drag to upload
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-medium opacity-70">
                    JPG, PNG, WebP (Max 5MB)
                </p>
            </div>
        </div>
    );
}
