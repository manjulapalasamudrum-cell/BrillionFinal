<#
  Serves this folder over http://localhost:8080 so the game can run.

  Why a server at all: the app is split into ES modules, and browsers refuse to
  load modules over file:// (opening index.html by double-clicking gives a blank
  page and a CORS error in the console). Any static server works; this one just
  avoids needing Node or Python installed.

  Keep this script pure ASCII: PowerShell 5.1 decodes a .ps1 with no byte-order
  mark as ANSI, so literal non-ASCII characters get corrupted.

  Usage:  .\serve.ps1          or   .\serve.ps1 -Port 3000
  Stop:   Ctrl+C
#>
param([int]$Port = 8080)

# This script lives in server/, but the tree it serves is the repo root, so
# that "/src/..." and "/public/..." both resolve. "/" is mapped to the page
# shell in public/ further down.
$root = Split-Path -Parent $PSScriptRoot
$types = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.ico'  = 'image/x-icon'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try { $listener.Start() } catch {
  Write-Host "Could not bind port $Port. Try another: .\serve.ps1 -Port 3000" -ForegroundColor Red
  exit 1
}

Write-Host "Bollybuzz.io serving $root" -ForegroundColor Yellow
Write-Host "  -> http://localhost:$Port/    (Ctrl+C to stop)" -ForegroundColor Green

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'public\index.html' }

    $full = Join-Path $root $rel
    # Keep requests inside the project folder.
    $resolved = try { (Resolve-Path -LiteralPath $full -ErrorAction Stop).Path } catch { $null }

    if ($resolved -and $resolved.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -and (Test-Path -LiteralPath $resolved -PathType Leaf)) {
      $ext = [System.IO.Path]::GetExtension($resolved).ToLower()
      $ctx.Response.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($resolved)
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes('404 - not found')
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $ctx.Response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
