export async function getLastModifiedDate(filePath: string): Promise<string> {
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');

    const fullPath = path.join(process.cwd(), filePath);

    // 1. 尝试从 Git 获取最后提交时间 (最准确，生产环境需确保有 .git 目录或 CI 环境传递了 commit info)
    try {
        // 使用 git log 获取最后提交时间戳
        const timestamp = execSync(`git log -1 --format=%ct ${fullPath}`).toString().trim();
        if (timestamp) {
            return new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0];
        }
    } catch (e) {
        // 忽略 git 错误 (例如本地没有 git 环境，或者文件未提交)
    }

    // 2. 如果 Git 失败，回退到文件系统修改时间 (本地开发环境常用)
    try {
        const stats = fs.statSync(fullPath);
        return stats.mtime.toISOString().split('T')[0];
    } catch (e) {
        // 3. 最后的兜底：返回当天的日期
        console.warn(`Could not get last modified date for ${filePath}`);
        return new Date().toISOString().split('T')[0];
    }
}
