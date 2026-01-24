"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AuthDebugPage() {
    const [authState, setAuthState] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const checkAuth = async () => {
        setLoading(true);
        try {
            // 1. 检查 Session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            // 2. 检查 User
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            // 3. 检查 Cookies
            const cookies = document.cookie;

            setAuthState({
                session: {
                    exists: !!session,
                    accessToken: session?.access_token ? `${session.access_token.substring(0, 20)}...` : null,
                    refreshToken: session?.refresh_token ? `${session.refresh_token.substring(0, 20)}...` : null,
                    expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : null,
                    error: sessionError?.message,
                },
                user: {
                    exists: !!user,
                    id: user?.id,
                    email: user?.email,
                    error: userError?.message,
                },
                cookies: {
                    hasCookies: cookies.length > 0,
                    cookieNames: cookies.split(';').map(c => c.trim().split('=')[0]).filter(Boolean),
                },
                timestamp: new Date().toLocaleString(),
            });
        } catch (error: any) {
            setAuthState({
                error: error.message,
                timestamp: new Date().toLocaleString(),
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();

        // 监听认证状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session);
            checkAuth();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">🔍 认证状态调试面板</h1>

            <div className="mb-4 flex gap-4">
                <Button onClick={checkAuth} disabled={loading}>
                    {loading ? '检查中...' : '刷新状态'}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => window.location.href = '/sign-in'}
                >
                    前往登录
                </Button>

                <Button
                    variant="outline"
                    onClick={async () => {
                        await supabase.auth.signOut();
                        checkAuth();
                    }}
                >
                    退出登录
                </Button>
            </div>

            {authState && (
                <div className="space-y-4">
                    {/* Session 信息 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Session 状态
                                <Badge variant={authState.session?.exists ? "default" : "destructive"}>
                                    {authState.session?.exists ? "✅ 存在" : "❌ 不存在"}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {authState.session?.error && (
                                <div className="text-red-600">
                                    <strong>错误:</strong> {authState.session.error}
                                </div>
                            )}
                            {authState.session?.accessToken && (
                                <div className="text-sm">
                                    <strong>Access Token:</strong> {authState.session.accessToken}
                                </div>
                            )}
                            {authState.session?.refreshToken && (
                                <div className="text-sm">
                                    <strong>Refresh Token:</strong> {authState.session.refreshToken}
                                </div>
                            )}
                            {authState.session?.expiresAt && (
                                <div className="text-sm">
                                    <strong>过期时间:</strong> {authState.session.expiresAt}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* User 信息 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                User 状态
                                <Badge variant={authState.user?.exists ? "default" : "destructive"}>
                                    {authState.user?.exists ? "✅ 已登录" : "❌ 未登录"}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {authState.user?.error && (
                                <div className="text-red-600">
                                    <strong>错误:</strong> {authState.user.error}
                                </div>
                            )}
                            {authState.user?.id && (
                                <div className="text-sm">
                                    <strong>User ID:</strong> {authState.user.id}
                                </div>
                            )}
                            {authState.user?.email && (
                                <div className="text-sm">
                                    <strong>Email:</strong> {authState.user.email}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cookies 信息 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Cookies 状态
                                <Badge variant={authState.cookies?.hasCookies ? "default" : "secondary"}>
                                    {authState.cookies?.hasCookies ? "✅ 存在" : "⚠️ 无"}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {authState.cookies?.cookieNames?.length > 0 ? (
                                <div className="text-sm space-y-1">
                                    <strong>Cookie 列表:</strong>
                                    <ul className="list-disc pl-6">
                                        {authState.cookies.cookieNames.map((name: string, idx: number) => (
                                            <li key={idx} className="font-mono text-xs">
                                                {name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    未找到任何 Cookies
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 诊断建议 */}
                    <Card className="border-blue-200 bg-blue-50">
                        <CardHeader>
                            <CardTitle className="text-blue-900">💡 诊断建议</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {!authState.session?.exists && (
                                <div>
                                    ❌ <strong>Session 不存在</strong> - 用户可能未登录或 Session 已过期
                                </div>
                            )}
                            {!authState.user?.exists && (
                                <div>
                                    ❌ <strong>User 不存在</strong> - 需要登录或重新验证
                                </div>
                            )}
                            {authState.session?.exists && !authState.user?.exists && (
                                <div className="text-orange-600">
                                    ⚠️ <strong>Session 存在但 User 不存在</strong> - 可能是 Session 验证失败
                                </div>
                            )}
                            {!authState.cookies?.hasCookies && (
                                <div className="text-orange-600">
                                    ⚠️ <strong>无 Cookies</strong> - 浏览器可能禁用了 Cookies
                                </div>
                            )}
                            {authState.session?.exists && authState.user?.exists && (
                                <div className="text-green-600">
                                    ✅ <strong>认证状态正常</strong> - Session 和 User 都已验证
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 时间戳 */}
                    <div className="text-sm text-muted-foreground text-center">
                        最后检查时间: {authState.timestamp}
                    </div>
                </div>
            )}

            {authState?.error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <div className="text-red-600">
                            <strong>系统错误:</strong> {authState.error}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
