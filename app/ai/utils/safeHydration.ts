// 安全检测是否在客户端环境
export const isClient = typeof window !== 'undefined';

// 安全的 useEffect，只在客户端执行
import { useEffect } from 'react';
export const useClientEffect: typeof useEffect = (effect, deps) => {
    useEffect(() => {
        if (isClient) {
            return effect();
        }
    }, deps);
};
