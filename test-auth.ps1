# AI生图功能自动化测试脚本
# 测试登录/未登录状态下的生图功能

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI生图功能测试脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 检查端口3000是否被占用
Write-Host "[1/5] 检查开发服务器状态..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "✅ 开发服务器已在端口3000运行" -ForegroundColor Green
}
else {
    Write-Host "❌ 开发服务器未运行，请先启动：npm run dev" -ForegroundColor Red
    Write-Host ""
    Write-Host "提示：在另一个终端窗口运行以下命令：" -ForegroundColor Yellow
    Write-Host "  cd e:\github\fusiongenerator.fun" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    exit 1
}

Write-Host ""

# 2. 测试API端点可访问性
Write-Host "[2/5] 测试首页可访问性..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 首页响应正常 (HTTP 200)" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ 首页访问失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 3. 测试未认证的API请求
Write-Host "[3/5] 测试未登录状态下的API调用..." -ForegroundColor Yellow
try {
    $body = @{
        prompt = "Test Pokemon Fusion: Pikachu + Charizard"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $response = Invoke-WebRequest `
        -Uri "http://localhost:3000/api/generate-fusion" `
        -Method POST `
        -Body $body `
        -Headers $headers `
        -UseBasicParsing `
        -TimeoutSec 10 `
        -ErrorAction Stop
    
    Write-Host "⚠️  警告: API未拦截未认证请求 (应返回401)" -ForegroundColor Red
    Write-Host "响应状态码: $($response.StatusCode)" -ForegroundColor Yellow
    
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 401) {
        Write-Host "✅ 正确拦截未登录请求 (HTTP 401)" -ForegroundColor Green
        
        # 尝试读取错误消息
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        $errorJson = $errorBody | ConvertFrom-Json
        
        Write-Host "   错误信息: $($errorJson.error)" -ForegroundColor Gray
    }
    else {
        Write-Host "❌ 意外的响应状态码: $statusCode" -ForegroundColor Red
        Write-Host "   错误详情: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# 4. 检查前端页面
Write-Host "[4/5] 检查前端页面..." -ForegroundColor Yellow

$pages = @(
    @{ Name = "Pokemon Fusion"; Url = "http://localhost:3000/pokemon" },
    @{ Name = "Dragon Ball Fusion"; Url = "http://localhost:3000/dragon-ball" },
    @{ Name = "AI Studio"; Url = "http://localhost:3000/ai" }
)

foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri $page.Url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ $($page.Name) 页面正常" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  ❌ $($page.Name) 页面访问失败" -ForegroundColor Red
    }
}

Write-Host ""

# 5. 输出测试总结
Write-Host "[5/5] 测试总结" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ 已完成自动化测试" -ForegroundColor Green
Write-Host ""
Write-Host "📋 后续手动测试步骤：" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  未登录状态测试：" -ForegroundColor White
Write-Host "   - 打开浏览器访问: http://localhost:3000/pokemon" -ForegroundColor Gray
Write-Host "   - 点击 '生成融合' 按钮" -ForegroundColor Gray
Write-Host "   - 验证是否提示登录并跳转" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  登录状态测试（免费用户）：" -ForegroundColor White  
Write-Host "   - 登录账户" -ForegroundColor Gray
Write-Host "   - 选择Pokemon并生成" -ForegroundColor Gray
Write-Host "   - 验证图片生成和积分扣除" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  积分耗尽测试：" -ForegroundColor White
Write-Host "   - 生成图片直到积分为0" -ForegroundColor Gray
Write-Host "   - 验证是否提示充值并跳转到定价页" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  VIP用户测试：" -ForegroundColor White
Write-Host "   - 使用VIP账户登录" -ForegroundColor Gray
Write-Host "   - 验证每日10次限额" -ForegroundColor Gray
Write-Host "   - 验证不扣除积分" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "详细测试文档: .docs\生图功能测试报告.md" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
