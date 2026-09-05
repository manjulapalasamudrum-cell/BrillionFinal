<#
  Bundles the whole game into one self-contained HTML file.

  The source is deliberately split into ES modules with no build step, which is
  right for editing but needs a server to run. This flattens it back down for
  the cases where a single file is what you need: emailing it, dropping it on
  any host, or opening it straight off disk.

  NOTE: keep this script pure ASCII. Windows PowerShell 5.1 decodes a .ps1 with
  no byte-order mark as ANSI, so any non-ASCII character written literally here
  is corrupted on its way into the output. Where output needs one, build it from
  its code point (see $EMDASH below). Content read from src/ is unaffected --
  that is decoded as UTF-8 explicitly.

  Two outputs, because there are exactly two shapes the page is ever needed in:

    docs\index.html          the complete standalone page. Serves every
                             destination at once -- GitHub Pages requires this
                             exact path, drag-and-drop hosts take the folder,
                             and it is still a file you can double-click or
                             email. Committed on purpose; see .gitignore.
    dist\bollybuzz.artifact.html
                             the same content WITHOUT the <!doctype>/<html>/
                             <head>/<body> wrapper, which Claude's Artifact host
                             supplies itself. The only output that differs.

  This once wrote four files, three of which were byte-identical.

  Usage:  .\build.ps1
#>

$ErrorActionPreference = 'Stop'
# build.ps1 lives in environment/, so the repo root is one level up.
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)

<#
  Validate the answer bank before bundling it. The bank is hand-maintained and
  large; a duplicate or an out-of-window year reaches the player as a rejected
  valid answer or a repeated prompt, which is the worst class of bug this game
  has. Skipped with a warning if Python is not installed, since it is only a
  check and must never be the reason a build cannot run.
#>
if (Get-Command python -ErrorAction SilentlyContinue) {
  & python (Join-Path $root 'environment\check-bank.py')
  if ($LASTEXITCODE -ne 0) { throw 'Answer bank failed validation (see above).' }
} else {
  Write-Host 'NOTE: python not found; skipping answer-bank validation.' -ForegroundColor Yellow
}

# Built from its code point so this file can stay ASCII. See the note above.
$EMDASH = [char]0x2014

function Read-Text($relative) {
  [System.IO.File]::ReadAllText((Join-Path $root $relative), [System.Text.Encoding]::UTF8)
}

# --- Stylesheets, in cascade order ------------------------------------------
$cssFiles = @(
  'src\css\tokens.css',
  'src\css\base.css',
  'src\css\components.css',
  'src\css\screen-start.css',
  'src\css\screen-game.css',
  'src\css\screen-result.css'
)
$css = ($cssFiles | ForEach-Object { "/* ===== $_ ===== */`n" + (Read-Text $_) }) -join "`n"

<#
  Strip comments and indentation from the bundled copy only. The source files
  stay as written -- their comments are the documentation -- but none of that
  prose needs to travel inside a single-file build, and the Artifact host has a
  ceiling on how much it will process before it gives up on the page.
#>
function Compact-Css($text) {
  $text = [regex]::Replace($text, '/\*.*?\*/', '', 'Singleline')
  $text = [regex]::Replace($text, '(?m)^[ \t]+', '')
  [regex]::Replace($text, '(\r?\n){2,}', "`n")
}
$css = Compact-Css $css

<#
  App modules in dependency order. The bundle is a classic script, not a module,
  so `import`/`export` are stripped and every module shares one scope. The
  order below is what makes each name defined before it is first evaluated.
  ResultScreen in particular reads PRESENT_YEAR at top level, so scoring must
  precede it.
#>

<#
  The answer packs, one file each. Globbed rather than listed, because a listed
  file is a file somebody has to remember to add: two modules have already been
  written, imported, and then silently left out of the bundle, which works
  perfectly over the dev server and breaks only in the built page.

  Order among the packs does not matter -- each is a standalone const with no
  references to the others -- but they must all precede categories.js, which
  collects them.
#>
$packFiles = Get-ChildItem (Join-Path $root 'src\js\data\packs') -Filter *.js |
  Sort-Object Name | ForEach-Object { "src\js\data\packs\$($_.Name)" }

$jsFiles = @(
  'src\js\data\tiers.js'
) + $packFiles + @(
  'src\js\data\categories.js',
  'src\js\data\dailies.js',
  'src\js\data\schedule.js',
  'src\js\lib\random.js',
  'src\js\lib\text-match.js',
  'src\js\lib\audio.js',
  'src\js\lib\history.js',
  'src\js\game\eras.js',
  'src\js\data\bank.js',
  'src\js\game\constraints.js',
  'src\js\game\question-types.js',
  'src\js\game\rounds.js',
  'src\js\game\scoring.js',
  'src\js\ui\dom.js',
  'src\js\ui\Chrome.js',
  'src\js\ui\StartScreen.js',
  'src\js\ui\GameScreen.js',
  'src\js\ui\ResultScreen.js',
  'src\js\ui\App.js',
  'src\js\main.js'
)

$parts = foreach ($f in $jsFiles) {
  $src = Read-Text $f
  # Drop import statements outright, and demote exports to plain declarations.
  $src = [regex]::Replace($src, '(?ms)^import\b[^;]*;[ \t]*\r?\n', '')
  $src = [regex]::Replace($src, '(?m)^export\s+', '')
  "/* ===== $f ===== */`n" + $src.Trim()
}
$appJs = $parts -join "`n`n"

<#
  Same treatment for the app. Leading whitespace is only significant inside a
  template literal, so this refuses to run if any line has an unbalanced
  backtick -- that would mean a template spanning a line break, and stripping
  its indentation would silently change the rendered text.
#>
$spansLines = @($appJs -split "`n" | Where-Object { (([regex]::Matches($_, '`')).Count % 2) -ne 0 }).Count
if ($spansLines -gt 0) {
  Write-Host "NOTE: $spansLines line(s) hold a multi-line template literal; skipping app de-indent." -ForegroundColor Yellow
} else {
  $appJs = [regex]::Replace($appJs, '/\*.*?\*/', '', 'Singleline')
  $appJs = [regex]::Replace($appJs, '(?m)^[ \t]+', '')
  $appJs = [regex]::Replace($appJs, '(\r?\n){2,}', "`n")
}

$vendorJs = Read-Text 'src\vendor\mini-react.js'

$fonts = @'
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
'@

# Everything after the <head>: identical in both outputs.
$payload = @"
<div class="wrap" id="root"><p class="boot">Loading Bollybuzz.io</p></div>
<script>
$vendorJs
</script>
<script>
/* Bundled by build.ps1 from src/js. Edit the modules, not this file. */
$appJs
</script>
"@

<#
  Guard against the same class of bug returning if React is ever re-vendored.
  A literal tag opener inside an inlined script can end the document early in a
  strict HTML processor; far better to see it here than in a blank page.
#>
foreach ($hazard in @('<script', '</script', '<!--', '<style', '</style')) {
  $count = ([regex]::Matches($vendorJs + $appJs, [regex]::Escape($hazard))).Count
  if ($count -gt 0) {
    Write-Host ("WARNING: inlined JS holds {0} literal '{1}'. Escape the '<' as \x3c or the bundle may render blank when inlined." -f $count, $hazard) -ForegroundColor Yellow
  }
}

New-Item -ItemType Directory -Force -Path (Join-Path $root 'dist') | Out-Null

<#
  Vercel Web Analytics.

  Counts visits and page views. It goes ONLY in the standalone page, never in
  the artifact body below: the script is served by Vercel itself and would 404
  anywhere else, including in Claude's Artifact host and on a double-clicked
  copy of the file. A deferred script that 404s is harmless, but there is no
  reason to ship a broken request to hosts that can never serve it.

  Worth knowing about the path: it is FIRST-PARTY. Vercel proxies the script
  and the collector under the site's own origin, so this adds no third-party
  host and no cookie, and the page still reaches nothing but Google Fonts and
  itself. That is why this was an acceptable thing to add to a page whose whole
  character is that it phones nobody.

  It reports nothing until Web Analytics is switched on for the project in the
  Vercel dashboard; until then the endpoint simply is not there.
#>
$analytics = '<script defer src="/_vercel/insights/script.js"></script>'

# --- 1. Standalone page ------------------------------------------------------
$standalone = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Bollybuzz.io $EMDASH 10 Bollywood Trivia Games Where Rare Answers Win</title>
<meta name="description" content="Name one answer per prompt. The rarer your answer, the deeper you dive into 113 years of Hindi cinema." />
<meta name="theme-color" content="#EEF0F4">
$fonts
<style>
$css
</style>
</head>
<body>
$payload
$analytics
</body>
</html>
"@

<#
  ONE deployable page, not three.

  This wrote dist\bollybuzz.html, dist\site\index.html and docs\index.html --
  three files with the same bytes and the same MD5, kept apart only because each
  had been added for a different destination. docs\index.html serves all of
  them: GitHub Pages requires that exact path, drag-and-drop hosts take the
  folder, and the file itself is still just a page you can double-click or
  attach to an email.

  The artifact body below is the only output that genuinely differs, so it is
  the only other one written.
#>
New-Item -ItemType Directory -Force -Path (Join-Path $root 'docs') | Out-Null
[System.IO.File]::WriteAllText((Join-Path $root 'docs\index.html'), $standalone, $utf8)

# --- 2. Artifact body --------------------------------------------------------
# The Artifact host wraps this in its own document skeleton, so no <!doctype>,
# <html>, <head> or <body> here. The <title> must land in the first 8KB, so it
# goes before the stylesheet.
$artifact = @"
<title>Bollybuzz.io</title>
$fonts
<style>
$css
</style>
$payload
"@
[System.IO.File]::WriteAllText((Join-Path $root 'dist\bollybuzz.artifact.html'), $artifact, $utf8)

"{0,-30} {1,9:N0} bytes" -f "bundled from $($jsFiles.Count) modules", ($css.Length + $payload.Length)
foreach ($out in @('docs\index.html', 'dist\bollybuzz.artifact.html')) {
  $item = Get-Item (Join-Path $root $out)
  "{0,-30} {1,9:N0} bytes" -f $out, $item.Length
}
