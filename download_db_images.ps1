$ErrorActionPreference = "Stop"

$destDir = "public/images/dragon-ball/characters"
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
    Write-Host "Created directory: $destDir"
}

$images = @{
    "goku" = "https://dragonball-api.com/characters/goku_normal.webp"
    "vegeta" = "https://dragonball-api.com/characters/vegeta_normal.webp"
    "piccolo" = "https://dragonball-api.com/characters/picolo_normal.webp"
    "frieza" = "https://dragonball-api.com/characters/Freezer.webp"
    "cell" = "https://dragonball-api.com/characters/celula.webp"
    "majin-buu" = "https://dragonball-api.com/characters/BuuGordo_Universo7.webp"
    "broly" = "https://dragonball-api.com/transformaciones/Broly_DBS_Base.webp"
    "trunks" = "https://dragonball-api.com/characters/Trunks_Buu_Artwork.webp"
    "gohan" = "https://dragonball-api.com/characters/gohan.webp"
    "beerus" = "https://dragonball-api.com/characters/Beerus_DBS_Broly_Artwork.webp"
    "jiren" = "https://dragonball-api.com/characters/Jiren.webp"
    "android-18" = "https://dragonball-api.com/characters/Androide_18_Artwork.webp"
    "krillin" = "https://dragonball-api.com/characters/Krilin_Universo7.webp"
    "master-roshi" = "https://dragonball-api.com/characters/roshi.webp"
    "android-17" = "https://dragonball-api.com/characters/17_Artwork.webp"
    "bardock" = "https://dragonball-api.com/characters/Bardock_Artwork.webp"
    "whis" = "https://dragonball-api.com/characters/Whis_DBS_Broly_Artwork.webp"
    "vegetto" = "https://dragonball-api.com/transformaciones/Vegetto.webp"
    "gogeta" = "https://dragonball-api.com/transformaciones/gogeta.webp"
    "gotenks" = "https://dragonball-api.com/characters/Gotenks_Artwork.webp"
    "mr-satan" = "https://dragonball-api.com/characters/Mr_Satan_DBSuper.webp"
    "tenshinhan" = "https://dragonball-api.com/characters/Tenshinhan_Universo7.webp"
    "yamcha" = "https://dragonball-api.com/characters/Final_Yamcha.webp"
    "raditz" = "https://dragonball-api.com/characters/Raditz_artwork_Dokkan.webp"
}

foreach ($key in $images.Keys) {
    $url = $images[$key]
    $ext = [System.IO.Path]::GetExtension($url)
    if (-not $ext) { $ext = ".webp" } # Default to webp if missing
    
    # Keep the filename from the URL to be safe, or rename to ID?
    # Renaming to ID is cleaner: goku.webp
    $fileName = "$key$ext"
    $outputPath = Join-Path $destDir $fileName

    Write-Host "Downloading $key from $url ..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UserAgent "Mozilla/5.0"
    } catch {
        Write-Error "Failed to download $key: $_"
    }
}

Write-Host "Download complete!"
