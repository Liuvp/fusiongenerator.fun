export async function getLastModifiedDate(filePath: string): Promise<string> {
    // 生产环境优化：使用固定的合理日期，避免日期频繁变化导致 Google 混淆
    // 使用网站主要更新日期，而不是每次都返回当前日期
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
        return '2026-02-01'; // 网站上线/最后重大更新日期
    }

    // 开发环境：尝试获取更精确的日期
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');

    const fullPath = path.join(process.cwd(), filePath);

    // 1. 尝试从 Git 获取最后提交时间
    try {
        const timestamp = execSync(`git log -1 --format=%ct ${fullPath}`, {
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore']
        }).trim();

        if (timestamp && !isNaN(parseInt(timestamp))) {
            const date = new Date(parseInt(timestamp) * 1000);
            // 验证日期合理性（不早于 2020 年）
            if (date.getFullYear() >= 2020) {
                return date.toISOString().split('T')[0];
            }
        }
    } catch (e) {
        // Git 命令失败，继续下一步
    }

    // 2. 回退到文件系统修改时间
    try {
        const stats = fs.statSync(fullPath);
        const date = new Date(stats.mtime);
        // 验证日期合理性（不早于 2020 年）
        if (date.getFullYear() >= 2020) {
            return date.toISOString().split('T')[0];
        }
    } catch (e) {
        // 文件系统失败
    }

    // 3. 最终兜底：返回当前日期
    return new Date().toISOString().split('T')[0];
}
