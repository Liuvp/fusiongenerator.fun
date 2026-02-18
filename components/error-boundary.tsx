'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Error Boundary 组件
 * 用于捕获子组件的渲染错误，防止整个应用崩溃
 * 特别用于保护免受浏览器扩展冲突的影响
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // 更新状态以便下次渲染时显示备用 UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // 记录错误到控制台（生产环境可以发送到错误追踪服务）
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // 可选：发送到错误追踪服务（如 Sentry）
        // if (typeof window !== 'undefined' && window.gtag) {
        //   window.gtag('event', 'exception', {
        //     description: error.message,
        //     fatal: false,
        //   });
        // }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        this.props.onReset?.();
    };

    render() {
        if (this.state.hasError) {
            // 如果提供了自定义 fallback，使用它
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // 默认错误 UI - Dragon Ball 风格
            return (
                <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
                                <span className="text-4xl" role="img" aria-label="Senzu Bean">💊</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-gray-900">
                                Training Accident?
                            </h3>
                            <p className="text-sm text-gray-600 max-w-md mx-auto">
                                Even Goku needs a break sometimes. The fusion energy was too unstable!
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                            <Button
                                onClick={this.handleReset}
                                variant="default"
                                className="min-w-[140px] bg-green-600 hover:bg-green-700 text-white border-0 shadow-md"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Eat Senzu Bean
                            </Button>
                            <Button
                                onClick={() => {
                                    // 尝试清除可能导致崩溃的本地存储
                                    try {
                                        localStorage.removeItem("db_fusion_studio_state");
                                        localStorage.removeItem("pokemon_fusion_studio_state");
                                        localStorage.removeItem("ai_fusion_studio_state");
                                    } catch (e) {
                                        console.error("Clear storage failed", e);
                                    }
                                    window.location.reload();
                                }}
                                variant="outline"
                                className="min-w-[140px] border-orange-200 text-orange-700 hover:bg-orange-50"
                            >
                                Full Recovery (Reload)
                            </Button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-4 text-left">
                                <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                                    Scouter Data (Error Details)
                                </summary>
                                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto font-mono text-red-600">
                                    {this.state.error.message}
                                    {'\n\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}
