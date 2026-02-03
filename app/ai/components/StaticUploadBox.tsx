import { Upload } from "lucide-react";

interface StaticUploadBoxProps {
    side: "left" | "right";
    className?: string;
}

export default function StaticUploadBox({ side, className = "" }: StaticUploadBoxProps) {
    return (
        <div className={`relative w-full ${className}`}>
            <div className="relative aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/10 flex flex-col items-center justify-center p-6 h-full w-full">
                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-xl font-semibold text-center text-foreground">
                    {side === "left" ? "Upload Image A" : "Upload Image B"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 text-center">
                    PNG, JPG, or WebP
                </p>
            </div>
        </div>
    );
}
