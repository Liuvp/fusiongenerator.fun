# 登录状态问题验证脚本
# 用于快速验证认证状态修复是否成功

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  登录状态问题验证" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查开发服务器
Write-Host "[1/3] 检查开发服务器..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "✅ 服务器运行中" -ForegroundColor Green
}
else {
    Write-Host "❌ 服务器未运行" -ForegroundColor Red
    Write-Host ""
    Write-Host "请运行: npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 检查页面可访问性
Write-Host "[2/3] 检查页面可访问性..." -ForegroundColor Yellow

$pages = @(
    @{ Name = "Dragon Ball 页面"; Url = "http://localhost:3000/dragon-ball" },
    @{ Name = "Pokemon 页面"; Url = "http://localhost:3000/pokemon" },
    @{ Name = "调试页面"; Url = "http://localhost:3000/auth-debug" }
)

foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri $page.Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ $($page.Name) 正常" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  ❌ $($page.Name) 访问失败" -ForegroundColor Red
    }
}

Write-Host ""

# 提供测试指引
Write-Host "[3/3] 🧪 手动测试步骤" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 请按以下步骤测试：" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  打开调试页面：" -ForegroundColor White
Write-Host "   http://localhost:3000/auth-debug" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  检查认证状态：" -ForegroundColor White
Write-Host "   - 如果未登录，点击'前往登录'按钮" -ForegroundColor Gray
Write-Host "   - 登录后应该自动显示用户信息" -ForegroundColor Gray
Write-Host ""

Write-Host "3️⃣  访问 Dragon Ball 页面：" -ForegroundColor White
Write-Host "   http://localhost:3000/dragon-ball" -ForegroundColor Gray
Write-Host ""

Write-Host "4️⃣  打开浏览器控制台 (F12)，查看日志：" -ForegroundColor White
Write-Host "   应该看到类似以下输出：" -ForegroundColor Gray
Write-Host "   [DBFusion] 开始检查用户认证状态..." -ForegroundColor DarkGray
Write-Host "   [DBFusion] Session 检查: { hasSession: true }" -ForegroundColor DarkGray
Write-Host "   [DBFusion] 用户信息: { hasUser: true, userId: '...', email: '...' }" -ForegroundColor DarkGray
Write-Host ""

Write-Host "5️⃣  验证功能：" -ForegroundColor White
Write-Host "   - 页面显示用户已登录 ✅" -ForegroundColor Gray
Write-Host "   - 显示配额信息 ✅" -ForegroundColor Gray
Write-Host "   - 生成按钮可用 ✅" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 关键检查点：" -ForegroundColor Yellow
Write-Host ""
Write-Host "✓ Session 存在" -ForegroundColor Green
Write-Host "✓ User 存在" -ForegroundColor Green
Write-Host "✓ 控制台无错误" -ForegroundColor Green
Write-Host "✓ 前端显示已登录" -ForegroundColor Green
Write-Host ""

Write-Host "如果以上都正常，说明修复成功！ 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# 提示打开浏览器
Write-Host ""
Write-Host "💡 提示：按 Enter 自动打开调试页面..." -ForegroundColor Yellow
$null = Read-Host

try {
    Start-Process "http://localhost:3000/auth-debug"
    Write-Host "✅ 已在浏览器中打开调试页面" -ForegroundColor Green
}
catch {
    Write-Host "❌ 无法自动打开浏览器，请手动访问：" -ForegroundColor Red
    Write-Host "   http://localhost:3000/auth-debug" -ForegroundColor White
}
