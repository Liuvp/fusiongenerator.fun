#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔍 Google Search Console Sitemap 诊断工具" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "https://fusiongenerator.fun"
$issues = @()
$warnings = @()

# 测试 1: 检查 sitemap.xml
Write-Host "[1/8] 检查 sitemap.xml..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -Method Get -UseBasicParsing -TimeoutSec 10
    Write-Host "  ✓ 状态码: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  ✓ Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Green
    
    # 检查 XML 格式
    try {
        [xml]$xml = $response.Content
        $urlCount = $xml.urlset.url.Count
        Write-Host "  ✓ XML 格式正确" -ForegroundColor Green
        Write-Host "  ✓ 包含 $urlCount 个 URL" -ForegroundColor Green
        
        # 检查是否有重复 URL
        $uniqueUrls = $xml.urlset.url.loc | Select-Object -Unique
        if ($uniqueUrls.Count -lt $urlCount) {
            $issues += "sitemap.xml 包含重复的 URL"
            Write-Host "  ✗ 警告: 发现重复 URL" -ForegroundColor Red
        }
        
    } catch {
        $issues += "sitemap.xml 的 XML 格式无效"
        Write-Host "  ✗ XML 格式错误: $($_.Exception.Message)" -ForegroundColor Red
    }
} catch {
    $issues += "无法访问 sitemap.xml"
    Write-Host "  ✗ 错误: $($_.Exception.Message)" -ForegroundColor Red
}

# 测试 2: 检查 sitemap-index.xml
Write-Host "`n[2/8] 检查 sitemap-index.xml..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/sitemap-index.xml" -Method Get -UseBasicParsing -TimeoutSec 10
    Write-Host "  ⚠ 发现 sitemap-index.xml (状态码: $($response.StatusCode))" -ForegroundColor Yellow
    
    [xml]$xml = $response.Content
    $sitemapCount = $xml.sitemapindex.sitemap.Count
    Write-Host "  ⚠ 索引包含 $sitemapCount 个 sitemap" -ForegroundColor Yellow
    
    if ($sitemapCount -eq 1) {
        $warnings += "sitemap-index.xml 只有一个条目，建议直接使用 sitemap.xml"
        Write-Host "  ⚠ 建议: 只有一个 sitemap 时，建议删除 index 直接提交 sitemap.xml" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "  ✓ 不存在 sitemap-index.xml (正常)" -ForegroundColor Green
}

# 测试 3: 检查 robots.txt
Write-Host "`n[3/8] 检查 robots.txt..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/robots.txt" -Method Get -UseBasicParsing -TimeoutSec 10
    Write-Host "  ✓ 状态码: $($response.StatusCode)" -ForegroundColor Green
    
    if ($response.Content -match "Sitemap:\s*(.+)") {
        $sitemapUrl = $matches[1].Trim()
        Write-Host "  ✓ Sitemap 引用: $sitemapUrl" -ForegroundColor Green
        
        if ($sitemapUrl -notmatch "sitemap\.xml$") {
            $warnings += "robots.txt 引用的不是 sitemap.xml"
        }
    } else {
        $issues += "robots.txt 中未找到 Sitemap 引用"
        Write-Host "  ✗ 未找到 Sitemap 引用" -ForegroundColor Red
    }
} catch {
    $issues += "无法访问 robots.txt"
    Write-Host "  ✗ 错误: $($_.Exception.Message)" -ForegroundColor Red
}

# 测试 4: 模拟 Googlebot 访问
Write-Host "`n[4/8] 模拟 Googlebot 访问..." -ForegroundColor Yellow
try {
    $headers = @{
        "User-Agent" = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -Headers $headers -UseBasicParsing -TimeoutSec 10
    Write-Host "  ✓ Googlebot 可以访问 (状态码: $($response.StatusCode))" -ForegroundColor Green
    
    # 检查是否有重定向
    if ($response.BaseResponse.ResponseUri.ToString() -ne "$baseUrl/sitemap.xml") {
        $warnings += "sitemap.xml 发生了重定向"
        Write-Host "  ⚠ 发生重定向至: $($response.BaseResponse.ResponseUri)" -ForegroundColor Yellow
    }
} catch {
    $issues += "Googlebot 无法访问 sitemap.xml"
    Write-Host "  ✗ 错误: $($_.Exception.Message)" -ForegroundColor Red
}

# 测试 5: 检查 sitemap中的所有 URL
Write-Host "`n[5/8] 验证 sitemap 中的 URL..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -UseBasicParsing
    [xml]$xml = $response.Content
    
    $totalUrls = $xml.urlset.url.Count
    $checkedCount = 0
    $errorCount = 0
    
    Write-Host "  检查前 5 个 URL..." -ForegroundColor Gray
    
    foreach ($url in $xml.urlset.url | Select-Object -First 5) {
        $loc = $url.loc
        $checkedCount++
        
        try {
            $urlResponse = Invoke-WebRequest -Uri $loc -Method Head -UseBasicParsing -TimeoutSec 5
            if ($urlResponse.StatusCode -eq 200) {
                Write-Host "    ✓ $loc" -ForegroundColor Green
            } else {
                Write-Host "    ⚠ $loc (状态码: $($urlResponse.StatusCode))" -ForegroundColor Yellow
                $errorCount++
            }
        } catch {
            Write-Host "    ✗ $loc (错误)" -ForegroundColor Red
            $errorCount++
            $issues += "URL 无法访问: $loc"
        }
    }
    
    if ($errorCount -gt 0) {
        Write-Host "  ⚠ $errorCount/$checkedCount 个 URL 存在问题" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ 所有检查的 URL 都可访问" -ForegroundColor Green
    }
    
} catch {
    Write-Host "  ✗ 无法验证 URL: $($_.Exception.Message)" -ForegroundColor Red
}

# 测试 6: 检查 lastmod 日期的稳定性
Write-Host "`n[6/8] 检查 lastmod 日期稳定性..." -ForegroundColor Yellow
try {
    $response1 = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -UseBasicParsing
    [xml]$xml1 = $response1.Content
    $date1 = $xml1.urlset.url[0].lastmod
    
    Start-Sleep -Seconds 2
    
    $response2 = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -UseBasicParsing
    [xml]$xml2 = $response2.Content
    $date2 = $xml2.urlset.url[0].lastmod
    
    if ($date1 -eq $date2) {
        Write-Host "  ✓ lastmod 日期稳定: $date1" -ForegroundColor Green
    } else {
        $warnings += "lastmod 日期不稳定 (第一次: $date1, 第二次: $date2)"
        Write-Host "  ⚠ lastmod 日期不稳定!" -ForegroundColor Yellow
        Write-Host "    第一次: $date1" -ForegroundColor Yellow
        Write-Host "    第二次: $date2" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠ 无法检查日期稳定性: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 测试 7: 检查 HTTP 响应头
Write-Host "`n[7/8] 检查 HTTP 响应头..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -Method Head -UseBasicParsing
    
    # Content-Type
    $contentType = $response.Headers['Content-Type']
    if ($contentType -match "application/xml" -or $contentType -match "text/xml") {
        Write-Host "  ✓ Content-Type 正确: $contentType" -ForegroundColor Green
    } else {
        $issues += "Content-Type 不正确: $contentType"
        Write-Host "  ✗ Content-Type 错误: $contentType" -ForegroundColor Red
    }
    
    # X-Robots-Tag
    $robotsTag = $response.Headers['X-Robots-Tag']
    if ($robotsTag) {
        Write-Host "  ✓ X-Robots-Tag: $robotsTag" -ForegroundColor Green
        if ($robotsTag -match "noindex") {
            $issues += "X-Robots-Tag 包含 noindex"
            Write-Host "  ✗ 警告: 包含 noindex!" -ForegroundColor Red
        }
    }
    
    # Cache-Control
    $cacheControl = $response.Headers['Cache-Control']
    if ($cacheControl) {
        Write-Host "  ✓ Cache-Control: $cacheControl" -ForegroundColor Green
    }
    
} catch {
    Write-Host "  ⚠ 无法检查响应头: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 测试 8: XML Schema 验证
Write-Host "`n[8/8] 验证 XML Schema..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -UseBasicParsing
    [xml]$xml = $response.Content
    
    # 检查命名空间
    $xmlns = $xml.DocumentElement.xmlns
    if ($xmlns -eq "http://www.sitemaps.org/schemas/sitemap/0.9") {
        Write-Host "  ✓ XML 命名空间正确" -ForegroundColor Green
    } else {
        $issues += "XML 命名空间不正确: $xmlns"
        Write-Host "  ✗ XML 命名空间错误: $xmlns" -ForegroundColor Red
    }
    
    # 检查必需元素
    $hasRequiredElements = $true
    foreach ($url in $xml.urlset.url | Select-Object -First 1) {
        if (-not $url.loc) {
            $hasRequiredElements = $false
            $issues += "缺少必需的 <loc> 元素"
        }
    }
    
    if ($hasRequiredElements) {
        Write-Host "  ✓ 包含所有必需元素" -ForegroundColor Green
    } else {
        Write-Host "  ✗ 缺少必需元素" -ForegroundColor Red
    }
    
} catch {
    $issues += "XML Schema 验证失败"
    Write-Host "  ✗ 错误: $($_.Exception.Message)" -ForegroundColor Red
}

# 输出总结
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📊 诊断总结" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✓ 未发现问题！sitemap 配置正确。" -ForegroundColor Green
    Write-Host "`n建议操作:" -ForegroundColor Yellow
    Write-Host "1. 在 Google Search Console 手动提交: $baseUrl/sitemap.xml" -ForegroundColor White
    Write-Host "2. 等待 24-48 小时让 Google 处理" -ForegroundColor White
    Write-Host "3. 检查 GSC 的索引覆盖率报告" -ForegroundColor White
} else {
    if ($issues.Count -gt 0) {
        Write-Host "❌ 发现 $($issues.Count) 个严重问题:" -ForegroundColor Red
        foreach ($issue in $issues) {
            Write-Host "  • $issue" -ForegroundColor Red
        }
        Write-Host ""
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host "⚠️  发现 $($warnings.Count) 个警告:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  • $warning" -ForegroundColor Yellow
        }
        Write-Host ""
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🔧 推荐的修复方案" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 根据发现的问题给出建议
if ($warnings -match "sitemap-index.xml") {
    Write-Host "【建议 1】删除不必要的 sitemap-index.xml" -ForegroundColor Yellow
    Write-Host "  原因: 只有一个 sitemap 时，index 没有意义且可能导致混淆" -ForegroundColor Gray
    Write-Host "  操作: 删除 app/sitemap-index.xml/ 目录" -ForegroundColor Gray
    Write-Host ""
}

if ($warnings -match "lastmod 日期不稳定") {
    Write-Host "【建议 2】修复 lastmod 日期不稳定问题" -ForegroundColor Yellow
    Write-Host "  原因: 每次生成都返回当前日期，Google 会认为内容经常变化" -ForegroundColor Gray
    Write-Host "  操作: 修改 lib/sitemap-helper.ts，使用固定日期而不是当前日期" -ForegroundColor Gray
    Write-Host ""
}

if ($issues -match "无法访问") {
    Write-Host "【建议 3】修复无法访问的 URL" -ForegroundColor Red
    Write-Host "  原因: sitemap 中的 URL 必须都能正常访问 (200 状态码)" -ForegroundColor Gray
    Write-Host "  操作: 检查并修复返回错误的页面" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "========================================`n" -ForegroundColor Cyan
