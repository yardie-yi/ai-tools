param(
    [Parameter(Mandatory = $true)]
    [string]$Target,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$SourceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
New-Item -ItemType Directory -Force -Path $Target | Out-Null
$Target = (Resolve-Path $Target).Path
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"

function Copy-FrameworkItem {
    param([string]$RelativePath)
    $Source = Join-Path $SourceRoot $RelativePath
    $Destination = Join-Path $Target $RelativePath

    if (Test-Path $Destination) {
        if (-not $Force) {
            Write-Host "SKIP existing: $Destination"
            return
        }
        $Backup = "$Destination.backup.$Stamp"
        Move-Item -Path $Destination -Destination $Backup
        Write-Host "BACKUP: $Destination -> $Backup"
    }

    $Parent = Split-Path -Parent $Destination
    if ($Parent) { New-Item -ItemType Directory -Force -Path $Parent | Out-Null }
    Copy-Item -Path $Source -Destination $Destination -Recurse
    Write-Host "COPY: $RelativePath"
}

@("AGENTS.md", "CLAUDE.md", ".agent", ".evospec", ".codex", ".claude", ".pi") | ForEach-Object {
    Copy-FrameworkItem $_
}

@(
    "scripts/project-commands.sh",
    "scripts/build.sh",
    "scripts/test.sh",
    "scripts/lint.sh",
    "scripts/verify.sh",
    "scripts/new-run.py",
    "scripts/check-run-state.py",
    "scripts/validate-framework.py",
    "scripts/validate-evospec.py"
) | ForEach-Object {
    Copy-FrameworkItem $_
}

Write-Host ""
Write-Host "Installed Graph + Loop framework into: $Target"
Write-Host "Next:"
Write-Host "  1. Edit .agent/project.yaml"
Write-Host "  2. Edit .evospec/module.config.yaml"
Write-Host "  3. Edit scripts/project-commands.sh"
Write-Host "  4. Run python scripts/validate-framework.py"
