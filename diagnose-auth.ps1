# 🔍 Dragon Ball 登录状态诊断脚本

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Dragon Ball 登录状态诊断" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 提示用户操作
Write-Host "📋 请按照以下步骤操作：" -ForegroundColor Yellow
Write-Host ""

Write-Host "步骤 1: 打开调试页面" -ForegroundColor White
Write-Host "  即将自动打开: http://localhost:3000/auth-debug" -ForegroundColor Gray
Write-Host ""

Write-Host "步骤 2: 查看调试页面显示的信息" -ForegroundColor White
Write-Host "  - Session 状态" -ForegroundColor Gray
Write-Host "  - User 状态" -ForegroundColor Gray
Write-Host "  - 是否有错误信息" -ForegroundColor Gray
Write-Host ""

Write-Host "步骤 3: 如果显示未登录，点击'前往登录'" -ForegroundColor White
Write-Host ""

Write-Host "步骤 4: 登录后，访问 Dragon Ball 页面" -ForegroundColor White
Write-Host "  http://localhost:3000/dragon-ball" -ForegroundColor Gray
Write-Host ""

Write-Host "步骤 5: 打开浏览器控制台 (F12)" -ForegroundColor White
Write-Host "  查看 Console 标签页的输出" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查代码修复
Write-Host "🔧 检查代码修复状态..." -ForegroundColor Yellow

$hasAuthListener = Select-String -Path "components\dragon-ball\fusion-studio.tsx" -Pattern "onAuthStateChange" -Quiet

if ($hasAuthListener) {
    Write-Host "  ✅ 认证监听器代码已添加" -ForegroundColor Green
}
else {
    Write-Host "  ❌ 认证监听器代码缺失！需要重新应用修复" -ForegroundColor Red
    Write-Host ""
    Write-Host "请运行以下命令重新应用修复：" -ForegroundColor Yellow
    Write-Host "  git status" -ForegroundColor White
    Write-Host "  git diff components/dragon-ball/fusion-studio.tsx" -ForegroundColor White
    exit 1
}

$has402Handler = Select-String -Path "components\dragon-ball\fusion-studio.tsx" -Pattern "402" -Quiet

if ($has402Handler) {
    Write-Host "  ✅ 402 错误处理代码已添加" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  402 错误处理代码缺失（非关键）" -ForegroundColor Yellow
}

Write-Host ""

# 检查服务器状态
Write-Host "🌐 检查开发服务器..." -ForegroundColor Yellow

$serverRunning = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($serverRunning) {
    Write-Host "  ✅ 服务器运行中 (端口 3000)" -ForegroundColor Green
}
else {
    Write-Host "  ❌ 服务器未运行" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先启动服务器：npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 提示可能的问题
Write-Host "🔍 常见问题检查：" -ForegroundColor Yellow
Write-Host ""

Write-Host "问题 1: 浏览器缓存" -ForegroundColor White
Write-Host "  解决方案: 按 Ctrl+Shift+R 强制刷新页面" -ForegroundColor Gray
Write-Host ""

Write-Host "问题 2: 多个标签页" -ForegroundColor White
Write-Host "  解决方案: 关闭所有标签页，只保留一个" -ForegroundColor Gray
Write-Host ""

Write-Host "问题 3: Cookie 被阻止" -ForegroundColor White
Write-Host "  解决方案: 检查浏览器设置 → 隐私 → 允许 Cookie" -ForegroundColor Gray
Write-Host ""

Write-Host "问题 4: 开发服务器需要重启" -ForegroundColor White
Write-Host "  解决方案: 停止服务器 (Ctrl+C) 然后重新运行 npm run dev" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 询问是否打开调试页面
Write-Host "💡 按 Enter 自动打开调试页面..." -ForegroundColor Yellow
$null = Read-Host

try {
    Start-Process "http://localhost:3000/auth-debug"
    Write-Host "✅ 已打开调试页面" -ForegroundColor Green
    Write-Host ""
    Write-Host "📌 请在调试页面中：" -ForegroundColor Cyan
    Write-Host "  1. 检查是否显示'已登录'" -ForegroundColor White
    Write-Host "  2. 如果未登录，点击'前往登录'按钮" -ForegroundColor White
    Write-Host "  3. 登录后，点击'刷新状态'按钮" -ForegroundColor White
    Write-Host "  4. 然后访问 Dragon Ball 页面测试" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host "❌ 无法自动打开浏览器" -ForegroundColor Red
    Write-Host "请手动访问: http://localhost:3000/auth-debug" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  如果问题仍然存在，请提供以下信息：" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 调试页面显示的完整信息（截图）" -ForegroundColor White
Write-Host "2. 浏览器控制台的日志（文字）" -ForegroundColor White
Write-Host "3. 是否看到 [DBFusion] 开头的日志？" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
