$ErrorActionPreference = 'Stop'
$taskRoot = 'C:\DATA\personal\ai-tools\doc\Graph Engineering'
$testPath = Join-Path $taskRoot '.build\native-test.pptx'
$renderPath = Join-Path $taskRoot '.build\powerpoint'
New-Item -ItemType Directory -Force -Path $renderPath | Out-Null
Copy-Item -LiteralPath (Join-Path $taskRoot 'Graph_Engineering_分享.pptx') -Destination $testPath -Force
$existingPowerPoint = @(Get-Process POWERPNT -ErrorAction SilentlyContinue).Count -gt 0
$pptApp = $null
$deck = $null
try {
    $pptApp = New-Object -ComObject PowerPoint.Application
    $deck = $pptApp.Presentations.Open($testPath, 0, 0, 0)
    $count = $deck.Slides.Count
    $title = $deck.Slides.Item(1).Shapes.Item(1).TextFrame.TextRange
    $originalTitle = $title.Text
    $title.Text = $originalTitle + ' '
    $title.Text = $originalTitle
    $tableShape = $null
    foreach ($shape in $deck.Slides.Item(10).Shapes) {
        if ($shape.HasTable -eq -1) { $tableShape = $shape; break }
    }
    if ($null -eq $tableShape) { throw 'Expected editable table missing on slide 10' }
    $cell = $tableShape.Table.Cell(2, 1).Shape.TextFrame.TextRange
    $originalCell = $cell.Text
    $cell.Text = $originalCell + ' '
    $cell.Text = $originalCell
    $deck.Save()
    $deck.Close()
    $deck = $pptApp.Presentations.Open($testPath, -1, 0, 0)
    if ($deck.Slides.Count -ne 21) { throw 'Slide count changed after reopen' }
    $deck.Export($renderPath, 'PNG', 1280, 720)
    $report = @{ slide_count=$count; opened=$true; title_edit=$true; table_edit=$true; saved_and_reopened=$true; exported=$true }
    $report | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $taskRoot '.build\native-check.json') -Encoding utf8
    $report | ConvertTo-Json
} finally {
    if ($null -ne $deck) { $deck.Close() }
    if ($null -ne $pptApp -and -not $existingPowerPoint) { $pptApp.Quit() }
}

