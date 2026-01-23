
# 确保目录存在
$dir = "public/dragon-ball/avatars"
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir
}

# 角色映射：ID -> Wiki URL
$images = @{
    "goku" = "https://upload.wikimedia.org/wikipedia/en/3/35/Son_Goku_Dragon_Ball_Super.png"
    "vegeta" = "https://upload.wikimedia.org/wikipedia/en/8/88/Vegeta_Dragon_Ball.jpg"
    "piccolo" = "https://upload.wikimedia.org/wikipedia/en/f/f3/Piccolo_Dragon_Ball.png"
    "frieza" = "https://upload.wikimedia.org/wikipedia/en/3/30/Frieza_Dragon_Ball.png"
    "cell" = "https://upload.wikimedia.org/wikipedia/en/4/4c/Cell_Dragon_Ball.jpg"
    "majin-buu" = "https://upload.wikimedia.org/wikipedia/en/4/48/Majin_Buu_Dragon_Ball.jpg"
    "broly" = "https://upload.wikimedia.org/wikipedia/en/4/41/Broly_Dragon_Ball_Super_Broly.png"
    "trunks" = "https://upload.wikimedia.org/wikipedia/en/6/6e/Trunks_Dragon_Ball.jpg"
    "gohan" = "https://upload.wikimedia.org/wikipedia/en/a/a2/Gohan_Dragon_Ball.jpg"
    "beerus" = "https://upload.wikimedia.org/wikipedia/en/5/52/Beerus_Dragon_Ball.png"
    "jiren" = "https://upload.wikimedia.org/wikipedia/en/c/c5/Jiren_Dragon_Ball_Super.png"
    "android-18" = "https://upload.wikimedia.org/wikipedia/en/e/e0/Android_18_Dragon_Ball.jpg"
}

foreach ($key in $images.Keys) {
    $url = $images[$key]
    $ext = [System.IO.Path]::GetExtension($url)
    $outputFile = "$dir/$key$ext"
    
    Write-Host "Downloading $key from $url to $outputFile..."
    
    try {
        # 使用 UserAgent 模拟浏览器，防止被 Wiki 拒绝
        Invoke-WebRequest -Uri $url -OutFile $outputFile -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" -ErrorAction Stop
        Write-Host "Success!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download $key : $_" -ForegroundColor Red
    }
}
