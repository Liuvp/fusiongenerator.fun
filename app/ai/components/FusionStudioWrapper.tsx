"use client";

import dynamic from "next/dynamic";
import StaticFusionStudio from "./StaticFusionStudio";

// 这是一个客户端包装器，允许我们安全地使用 ssr: false
// 这样可以彻底避免客户端库（如 react-dropzone）在服务端尝试访问 window 对象
const DynamicClientPage = dynamic(() => import("../client-page"), {
    loading: () => <StaticFusionStudio />,
    ssr: false,
});

export default function FusionStudioWrapper() {
    return <DynamicClientPage />;
}
