$excelFile = "$pwd\fusiongenerator.fun-Performance-on-Search-2026-01-16.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $workbook = $excel.Workbooks.Open($excelFile)
    $worksheet = $workbook.Worksheets.Item(1)
    $usedRange = $worksheet.UsedRange
    $rowCount = $usedRange.Rows.Count
    $colCount = $usedRange.Columns.Count
    
    Write-Host "Total rows: $rowCount, columns: $colCount"
    Write-Host ""
    
    # Print first 100 rows
    for($i=1; $i -le [Math]::Min($rowCount, 100); $i++) {
        $row = @()
        for($j=1; $j -le $colCount; $j++) {
            $cellValue = $worksheet.Cells.Item($i, $j).Text
            $row += $cellValue
        }
        Write-Host ($row -join "`t")
    }
}
finally {
    $workbook.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($worksheet) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($workbook) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
