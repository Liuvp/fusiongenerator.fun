import type { ReactNode } from "react";

interface DragonBallLayoutProps {
  children: ReactNode;
}

// ✅ 极简布局 - 所有重要内容都在page.tsx处理
export default function DragonBallLayout({ children }: DragonBallLayoutProps) {
  return <>{children}</>;
}

// ✅ 不需要generateStaticParams - 静态路由不需要
