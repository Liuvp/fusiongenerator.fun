# Sitemap 快速检测脚本
# 使用方法: .\check-sitemap.ps1

param(
    [string]$Url = "https://fusiongenerator.fun/sitemap.xml"
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Sitemap 完整检测" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "检测 URL: $Url`n" -ForegroundColor White

try {
    # 发送 HEAD 请求
    $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -ErrorAction Stop
    
    # 1. 检查状态码
    Write-Host "[1/5] HTTP 状态码" -ForegroundColor Yellow
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Red
    }
    
    # 2. 检查 Content-Type
    Write-Host "`n[2/5] Content-Type" -ForegroundColor Yellow
    $contentType = $response.Headers['Content-Type']
    if ($contentType) {
        if ($contentType -match "application/xml" -or $contentType -match "text/xml") {
            Write-Host "  ✓ $contentType" -ForegroundColor Green
        }
        else {
            Write-Host "  ✗ $contentType (应该包含 'xml')" -ForegroundColor Red
        }
    }
    else {
        Write-Host "  ✗ Content-Type 缺失!" -ForegroundColor Red
    }
    
    # 3. 检查 Cache-Control
    Write-Host "`n[3/5] Cache-Control" -ForegroundColor Yellow
    $cacheControl = $response.Headers['Cache-Control']
    if ($cacheControl) {
        Write-Host "  ✓ $cacheControl" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠ 未设置 (可选)" -ForegroundColor Yellow
    }
    
    # 4. 检查 X-Robots-Tag
    Write-Host "`n[4/5] X-Robots-Tag" -ForegroundColor Yellow
    $robotsTag = $response.Headers['X-Robots-Tag']
    if ($robotsTag) {
        if ($robotsTag -match "noindex") {
            Write-Host "  ✗ $robotsTag (包含 noindex，禁止索引!)" -ForegroundColor Red
        }
        else {
            Write-Host "  ✓ $robotsTag" -ForegroundColor Green
        }
    }
    else {
        Write-Host "  ✓ 未设置 (默认允许索引)" -ForegroundColor Green
    }
    
    # 5. 检查 Content-Length
    Write-Host "`n[5/5] Content-Length" -ForegroundColor Yellow
    $contentLength = $response.Headers['Content-Length']
    if ($contentLength) {
        if ([int]$contentLength -gt 0) {
            Write-Host "  ✓ $contentLength 字节" -ForegroundColor Green
        }
        else {
            Write-Host "  ✗ $contentLength (文件为空)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "  ⚠ 未知 (使用 Transfer-Encoding)" -ForegroundColor Yellow
    }
    
    # 总结
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "   检测结果" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    $allGood = $true
    
    # 判断是否通过
    if ($response.StatusCode -ne 200) { $allGood = $false }
    if (-not ($contentType -match "xml")) { $allGood = $false }
    if ($robotsTag -match "noindex") { $allGood = $false }
    
    if ($allGood) {
        Write-Host "✓ 所有检测通过!" -ForegroundColor Green
        Write-Host "✓ Sitemap 技术配置正确" -ForegroundColor Green
        Write-Host "`n下一步: 在 Google Search Console 提交 sitemap.xml`n" -ForegroundColor Yellow
    }
    else {
        Write-Host "✗ 发现问题，需要修复" -ForegroundColor Red
        Write-Host "`n请查看上面的详细信息`n" -ForegroundColor Yellow
    }
    
    # 可选：显示完整 headers
    $showAll = Read-Host "`n是否显示所有 HTTP Headers? (y/n)"
    if ($showAll -eq 'y' -or $showAll -eq 'Y') {
        Write-Host "`n完整的 Response Headers:" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        $response.Headers.GetEnumerator() | ForEach-Object {
            Write-Host "$($_.Key): $($_.Value)" -ForegroundColor White
        }
    }
    
}
catch {
    Write-Host "`n✗ 检测失败" -ForegroundColor Red
    Write-Host "错误: $($_.Exception.Message)`n" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        Write-Host "HTTP 状态码: $statusCode" -ForegroundColor Yellow
        
        if ($statusCode -eq 404) {
            Write-Host "提示: Sitemap 文件不存在，请检查 URL 是否正确`n" -ForegroundColor Yellow
        }
    }
}

Write-Host "========================================`n" -ForegroundColor Cyan
