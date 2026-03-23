'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { trackEvent, toAnalyticsErrorMessage } from '@/utils/analytics';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
    context?: string;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: unknown) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        trackEvent('ui_error_boundary', {
            context: this.props.context || 'unknown',
            message: toAnalyticsErrorMessage(error),
            fatal: false,
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        this.props.onReset?.();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
                                <span className="text-4xl" role="img" aria-label="Recovery">
                                    !
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-gray-900">
                                Training Accident?
                            </h3>
                            <p className="text-sm text-gray-600 max-w-md mx-auto">
                                Even Goku needs a break sometimes. The fusion energy was too unstable.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                            <Button
                                onClick={this.handleReset}
                                variant="default"
                                className="min-w-[140px] bg-green-600 hover:bg-green-700 text-white border-0 shadow-md"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                            <Button
                                onClick={() => {
                                    try {
                                        localStorage.removeItem("db_fusion_studio_state");
                                        localStorage.removeItem("pokemon_fusion_studio_state");
                                        localStorage.removeItem("ai_fusion_studio_state");
                                    } catch (error) {
                                        console.error("Clear storage failed", error);
                                    }
                                    window.location.reload();
                                }}
                                variant="outline"
                                className="min-w-[140px] border-orange-200 text-orange-700 hover:bg-orange-50"
                            >
                                Reload Page
                            </Button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-4 text-left">
                                <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                                    Error Details
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
