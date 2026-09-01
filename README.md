# Bollybuzz.io

A Bollywood trivia game where **rare answers win**. Every prompt asks you to name
*one* thing — a Shah Rukh Khan film, a Filmfare Best Film winner, a villain. The
answer everybody thinks of first scores 10 points; the one almost nobody
remembers scores 50. Your total is converted into how far back through 113 years
of Hindi cinema you managed to dive.

## Running it

The app uses ES modules, which browsers will not load over `file://`. Serve the
folder over HTTP:

```powershell
.\server\serve.ps1       # then open http://localhost:8080
```

It serves the **repo root**, not `public/`, and returns `public/index.html` for
`/`. That is what lets the page shell reference `src/...` directly with no
build step: the browser asks for `/src/js/main.js` and gets the module you are
editing. Change one file, refresh, done.

Any static server works equally well (`npx serve`, `python -m http.server`), and
the folder deploys as-is to any static host — there is no build step.

## Sharing it

`.\environment\build.ps1` flattens the whole game into **two** files:

```
docs\index.html                complete standalone page, no server needed
dist\bollybuzz.artifact.html   same content minus the document wrapper
```

`docs\index.html` is the one to share by hand: a single file with React, the CSS
and the answer bank all inlined. It has no dependency except Google Fonts, and
falls back to Georgia / system sans without them. Open it by double-clicking,
email it, drag the folder onto a host, or let GitHub Pages serve it — it is the
same file in every case. Rebuild after changing anything under `src/`.

It used to write four files, three of which were byte-identical: the standalone
page, a copy named for a web root, and a copy for GitHub Pages. One file serves
all three, and the artifact body is the only output that genuinely differs.

## Putting it on a public URL

### GitHub Pages

`docs/` is a deploy-ready web root — one `index.html`, nothing else, no build
step and no server-side anything. In the repo: **Settings → Pages → Deploy from
a branch → `main` / `/docs`**. Live at
`https://<user>.github.io/<repo>/` in a minute or two.

Pages serves either the repo root or a folder named exactly `docs/`, which is
why the built page is written there and not somewhere tidier. The repo root has
no `index.html` to give it — `public/index.html` is the dev shell and points at
`/src/`, which would render a broken page for visitors.

### Vercel, and the one deployment trap

`vercel.json` exists for a single reason, and it is worth knowing because it
will bite on any host that guesses:

> **`public/` is NOT the folder to publish.** It holds the *dev shell* — an
> `index.html` that loads `src/css/…` and `src/js/main.js` from the tree beside
> it. Deployed on its own it renders the "Loading Bollybuzz.io" placeholder and
> nothing else, because every path it points at 404s.

Vercel, given a project with no framework, defaults its output directory to
`public/` when that folder exists — so it published exactly that, and the page
hung on the boot text forever. `vercel.json` overrides it:

```json
{ "framework": null, "outputDirectory": "docs" }
```

Nothing else is needed: no build command, no install step. `docs/index.html` is
already the whole game in one self-contained file.

If another host does the same thing, the fix is always the same — point it at
**`docs/`**, never `public/`. The name is unfortunate and kept only because
that is what the dev server and the shell have always been called.

### Drag-and-drop hosts

The same `docs/` folder works on either of these, free, on `https://`:

- **Netlify Drop** — <https://app.netlify.com/drop>
- **Cloudflare Pages** — <https://pages.cloudflare.com> → *Upload assets*

Drag the **folder**, not the file. Both hand back a URL like
`something-random.netlify.app`, renameable in the site settings, and both let
you attach a custom domain later. Both need you signed in, so this step cannot
be automated from the repo.

**The built page is a committed artifact**, so the workflow after any change
under `src/` is: rerun `.\environment\build.ps1`, commit, push. Skipping the
rebuild publishes the previous game — that has happened once already, when
`build.ps1` quietly stopped writing one of its outputs and a stale page sat in
the repo for a day.

### As a Claude Artifact

`dist\bollybuzz.artifact.html` publishes and runs as a Claude Artifact, which is
the one route to a shareable URL that needs no account anywhere.

One warning, recorded because it cost a great deal of time: the artifact's
preview frame does not reliably repaint into an automated screenshot. A capture
taken right after loading frequently comes back blank while the page is in fact
rendering normally — interacting with the frame forces the paint. Do not treat
a blank screenshot of an artifact as evidence that the page is broken. Confirm
against the same file served over `localhost` first, and only investigate the
host if it fails there too.

## Layout

Four top-level folders, split by what each thing *is* rather than by file type:
`public/` is served as-is, `src/` is the application, `server/` runs it locally,
`environment/` builds and checks it, `dist/` is output and is regenerated.

```
public/
  index.html                page shell: fonts, stylesheets, #root, script tags
server/
  serve.ps1                 dependency-free local static server
environment/
  build.ps1                 flattens src/ into the two outputs (see Sharing it)
  check-bank.py             validates the answer bank; build.ps1 runs it
src/vendor/
  mini-react.js             the renderer; sets window.React / ReactDOMClient
src/css/
  tokens.css                colours, type, shape, rhythm — everything reads these
  base.css                  reset, the ground, header, footer
  components.css            card surfaces, buttons, tiles, the input
  screen-start.css          masthead, rarity ladder, programme, archive
  screen-game.css           the one dark surface: prompt, clock, feedback
  screen-result.css         depth gauge, score band, breakdown, share box
src/js/
  main.js                   entry point; mounts <App> into #root
  data/tiers.js             the five rarity tiers and their point values
  data/categories.js        the running order; the packs themselves are next door
  data/packs/*.js           one file per pack — 17 of them, ~1,120 answers
  data/dailies.js           the daily shows and their constraints
  data/schedule.js          hand-picked prompts for particular dates
  data/bank.js              facts read off the bank: counts, the rarity ladder
  lib/random.js             seeded PRNG; the day runs midnight-to-midnight IST,
                            plus the archive's date keys
  lib/history.js            best score per day, in localStorage, for the archive
  lib/text-match.js         normalization + fuzzy matching of typed answers
  lib/audio.js              the sound effects, synthesised — no audio files
  game/eras.js              era labelling and the early/mid/late bucketing
  game/constraints.js       what a round ACCEPTS, and how the rule is worded
  game/question-types.js    what a round ASKS: the seven types and their phrasing
  game/rounds.js            which packs a game draws and in what order
  game/scoring.js           score → year, and the shareable result grid
  ui/dom.js                 the `h` (createElement) helper and focus utilities
  ui/Chrome.js              header and footer
  ui/StartScreen.js         the main game, rarity ladder, programme, archive
  ui/GameScreen.js          prompt, clock, answer box, feedback panel
  ui/ResultScreen.js        the depth gauge, breakdown, share box
  ui/App.js                 all game state and the round lifecycle
docs/index.html             the built page — committed, and what Pages serves
dist/                       the Artifact body; safe to delete, regenerated
```

**Nothing here is over 300 lines**, and that is maintained deliberately. Three
files had grown past it and were split along seams they already had:
`categories.js` (1,507 lines) into `data/packs/`, `rounds.js` (629) into the
ask/accept/choose split above, and `screens.css` (655) into one stylesheet per
screen.

Paths cross folders in exactly three places, so those are the ones to fix if
anything moves again: `public/index.html` points at `src/`, `server/serve.ps1`
resolves its root one level up, and `environment/build.ps1` reads from `src/`
and writes `docs/index.html` and `dist/bollybuzz.artifact.html`.

Two lists must stay in step with the files beside them, and both say so in
place: the stylesheet links in `public/index.html` against `$cssFiles` in
`build.ps1`, and the imports in `data/categories.js` against `data/packs/`
(check-bank.py fails the build on a pack file nothing imports, or an import
with no file).

There is no JSX and no bundler — components call `h(...)` (React.createElement)
directly, so the source you edit is exactly what the browser runs.

## The main game

**Daily Dive** is top-billed: the first thing on the start card, and the only
button on the page at that scale. `MIXED_ROUNDS` prompts, no per-round
constraint, seeded off the calendar date so every player gets the same set
today and a different one tomorrow.

**The draw takes each pack at most once**, so no question can repeat within a
day — a property of the arithmetic rather than a check somebody has to
remember. `MIXED_ROUNDS` was once exactly the pack count, so every pack
appeared daily; with `bhansali` there are eleven and one now rests each day.
The alternative was an eleven-round game, and the length of the main game
should not be set by how many packs happen to exist. Which pack rests is seeded
off the date, so it is the same for everyone and rotates by itself.

### Pinning questions to a date

`data/schedule.js` is the one place that overrides the generated draw: a date
maps to a list of prompts, each naming a pack, the question verbatim, and the
constraint that validates an answer.

A day need not specify all ten rounds. What it lists is used first, in order,
and the rest of the day is filled from the ordinary draw with those packs
excluded — so a day specifying four rounds still plays ten. **A prompt naming a
pack that does not exist is skipped rather than throwing**, which is what lets
a requested set go in as soon as the first pack behind it is built, with each
later pack quietly bringing its own prompt to life.

Wording is written out rather than generated, because controlling the wording
is the entire reason to schedule a day.

## What a round asks — the question types

The pack supplies the subject. The **type** supplies the question, and there are
seven of them. This split is the fix for the game's worst early flaw: every
prompt used to be "Name a *pack title*" with an optional year clause bolted on,
so the year was the only thing that ever varied. Ten rounds of the Daily Dive
asked one question about ten subjects, and the daily shows differed from each
other by a date range and nothing else.

| Type | Example | Reads off |
| --- | --- | --- |
| `open` | Name an Amitabh Bachchan movie. | — |
| `initial` | …whose title begins with "D". | `name` |
| `words` | …with a one-word title / …runs to four words or more. | `name` |
| `rarity` | Deep cut only: …off the beaten track. | `tier` |
| `decade` | …released in the 2000s. | `year` |
| `era` | …, up to 1996. (thirds of the pack) | `year` |
| `role` | A villain CHARACTER, not the actor. | `role` |

Every one reads a field the bank already carried, so adding them needed no data
migration — only three optional pack fields for phrasing (`noun`, `yearIs`,
`shortTitle`, all defaulted; see `data/categories.js`).

### `PROMPT_FLOOR_YEAR` — what the game asks vs. what it accepts

No prompt is built around a year before **1990** (`eras.js`). The two year-based
types respect it in different ways:

- `decade` simply drops any decade below the floor. There is no "name one from
  the 1970s" round.
- `era` cuts its thirds over 1990-and-later answers only, so every boundary
  lands in the modern era.

**This governs what the game ASKS, not what it accepts, and the distinction is
the whole point.** All 153 pre-1990 films are still in the bank and still score:
*Sholay*, *Mughal-e-Azam*, *Sangam*, Yash Chopra. Because era's earliest bucket
reads "up to 1998", a 1975 film satisfies it exactly as it should — every one of
those answers remains reachable through the round where it belongs. Deleting
them instead would have made *Sholay* a wrong answer to "name an Amitabh
Bachchan movie", which is the failure this bank exists to prevent.

Raising or lowering the floor is a one-line change in `eras.js`.

`viableTypes(cat)` in `game/rounds.js` decides which types a pack can host, on
two rules worth keeping:

- **`MIN_TYPE_ANSWERS` (6)** — a round with three valid answers is a guess, not
  a question. The clock is 40 seconds and the player cannot see the bank. Every
  type counts what it would actually accept before offering itself. **`era` did
  not**, and that was a real bug: it checked only whether a pack had six dated
  answers to cut into thirds, then offered all three thirds however small they
  came out, so the ten-film `bhansali` pack was asked for "up to 2005" with
  three valid answers behind it. Both places that pick an era round — the type
  catalogue and the daily shows' `isEligible` — now count the bucket.
- **`NARROWING_SHARE` (0.75)** — a constraint admitting more than three
  quarters of the pack is not asking anything. This is what stops "a *Dil*
  movie whose title begins with D" (48 of 53) and "a 1990s movie released in
  the 1990s" (all 147) from ever being generated, as a rule rather than as a
  list of special cases.

`assignTypes` then spends that catalogue across a game, giving each pack the
type used least so far, so the *kinds* of question stay spread out. `open`
starts one use in the hole — left level with the others it wins early ties and
the game opens on the exact prompt this whole mechanism exists to stop being
the entire game.

Internally it is still `mode === 'practice'`, which is now a misleading name —
it dates from when the draw really was random and unconstrained. `pickSession()`
in `game/rounds.js` is the only place that matters.

### The archive: previous days' dives

Under the programme, the start screen lists the last `ARCHIVE_DAYS` (14) days,
newest first, and playing one rebuilds that day's dive exactly.

**Nothing is stored to make this work, and that is the point.** A dive is a
pure function of its date — `buildDivePlan(date)` — so a past day needs no
saved puzzle, no server and no migration: its date is the puzzle. There is no
floor date either, so raising `ARCHIVE_DAYS` is the entire change needed to
offer a longer archive. Days before the game existed would generate perfectly
valid dives, which is why the window is a count of days back rather than a
launch date nobody recorded.

Two things it is easy to get wrong here, both handled:

- **The share stamp must name the puzzle's day, not the poster's.** A grid
  pasted today for last Tuesday's dive says `(2026-08-25)`. `buildShareText`
  takes `puzzleKey` and only falls back to today when there isn't one.
- **The label and the share name differ.** On screen an archived run reads
  "Daily Dive · Mon 31 Aug", because nothing else on the result screen says
  which run you are looking at. The shared grid uses the plain "Daily Dive",
  because it stamps the date on its own line and would otherwise say it twice.

`lib/history.js` holds a best-score-per-day in `localStorage` purely so the
list can show which days you have done. It stores no answers and nothing
identifying, never leaves the browser, and every access is wrapped — reading
`localStorage` *throws* in a browser set to block site data, and a game that
would not start because a scoreboard could not be read is a poor trade.

### The themed mode is dormant, not deleted

The start screen used to carry a grid of ten pack buttons under "Or dive one
subject", which started a five-round game on a single pack. That grid was
removed, so the mode now has no entry point — but the machinery behind it is
untouched: `pickSession('themed', packId)`, `buildRoundPlan()`, `THEMED_ROUNDS`
and the `.pack-btn` styles are all still there and still correct. Restoring it
means putting the button grid back on `StartScreen.js` and passing
`onStartThemed` down from `App.js`. Nothing else needs to change.

It also benefits most from the type catalogue: because a themed game never
changes pack, the type is the *only* thing that can distinguish one round from
the next, so `buildRoundPlan` takes five different types in a fixed (not
seeded) order — a themed game is replayable on demand and should not reshuffle
itself between attempts.

## The daily programme

The daily shows are listed on the start screen like a cinema's schedule. Each is
five rounds, seeded off the date so every player gets the same programme today.

| Show | Constraint |
| --- | --- |
| The Early Show | answers from the oldest third of each pack |
| The Matinee | the middle third |
| The Late Show | the newest third |
| The Double Bill | `mixed` — a different question type every round |

What keeps the shows distinct is that each carries a **different kind of
constraint**, not merely a different random draw. Two shows can land on the same
pack and still cannot ask the same question — "a Shah Rukh Khan movie, up to
2000" and "a Shah Rukh Khan movie, 2006 or later" have no answer in common.
Every question on the programme is unique by construction.

To add or change a show, edit `data/dailies.js`. A show is a name, a blurb, and
one constraint; `game/rounds.js` turns that into five questions and `ui/App.js`
enforces it in `constraintFailure()`. Packs that cannot satisfy a constraint are
filtered out automatically — the villain pack has no years, so it never appears
in the three era shows.

Four show constraints are implemented: `era`, `rarity` (answers at or above a
given tier — a deep-cuts-only show), `mixed` (no single constraint; every round
draws a different type from the catalogue above), and `open`, which is now
unused — five unconstrained rounds is five times the same question, which is
what `mixed` exists to fix. Nothing on the programme uses `rarity`, but it
works end to end, so adding `{ type: 'rarity', minTier: 3 }` needs no other
changes.

## Sound

Every tone is generated at runtime with the Web Audio API. There are no audio
files, so the project stays a folder of text with nothing to fetch and still
works offline.

Pitches come from a major pentatonic — Sa Re Ga Pa Dha — rather than the usual
arcade blips, and **the sound carries the same information the colour and the
points do**:

| Moment | Sound |
| --- | --- |
| Answer accepted | one note for a common answer, opening to a four-note flourish for a legendary one — the rarer it is, the higher it starts and the further it climbs |
| Answer rejected | a short, quiet fall. The round is still open, so this is a nudge, not a buzzer |
| Timed out or skipped | two notes falling away |
| Final score | a phrase that always resolves but climbs further the better you did — three notes for a poor run, seven for a perfect one — over a low drone |

A mute control sits in the top-right corner, reachable mid-game, and the choice
is remembered in `localStorage`. Sound is on by default: nothing plays except in
response to something the player just did.

The `AudioContext` is built lazily on the first sound rather than at load,
because browsers only allow one to start after a user gesture. Every play
function returns silently when muted, unsupported, or blocked, so audio can
never break the game.

## The design

**Current style: "Social"** — a light card-based interface in the register
Facebook made familiar. Grey ground, white cards with small radii and soft
shadows, one blue for every action, the system font stack.

The bullets below describe the **previous** direction, "Four-Colour Process":
the Bombay film hoarding printed at night on cold stock, lit by marquee lamps,
with process cyan/magenta/yellow inks on a deep indigo ground. It was replaced
on request. It is documented here rather than deleted because reverting is
mostly a matter of restoring `tokens.css`, `base.css` and `components.css` —
the markup never carried the style, and the ghost spans in `Chrome.js` and the
`.bulbs` element are still there, merely hidden.

What survived the swap, and should survive any future one: **the rarity ramp is
information, not decoration.** Those five colours are the scoring model made
visible. They were retuned for a light ground, never flattened to greys.

- **The palette is a printing process, not a theme.** Every colour is either an
  ink or a light source: process cyan, process magenta and process yellow, laid
  on a deep indigo ground, with violet as the fourth pass. That is why the
  off-register printing device below makes sense — those are the separations
  that failed to register. Defined once in `tokens.css`.
- **The ground is Hindi cinema, not a dark theme.** Four layers, all painted as
  body backgrounds so nothing overlays the content: **sprockets** down both
  edges, making the page itself a length of 35mm film; a **jali** lattice, the
  pierced-stone screen of Mughal windows, which replaced a plain halftone dot
  grid that said "printed" but said nothing about where these films come from;
  and three **projector beams**. The same jali is printed faintly into the
  paper card and the sprockets run down the game card too — otherwise the cards
  cover the wall and the start and result screens would show none of it. The
  sprockets drop below 620px, where the card covers the edges anyway.
- **The lamps are the signature.** A rail of marquee bulbs runs across the top
  of the masthead and along both edges of the main-game panel — two repeating
  radial-gradients, one for the filament and one for the glow it throws back,
  with a slow flicker because filament lamps are never quite steady. Nothing
  else on the page is lit, which is what makes the main attraction read as the
  main attraction.

- **Surface carries meaning.** The start and result cards are printed paper —
  the hoarding outside the cinema, the ticket you keep afterwards. The game card
  (`.card--screen`) is dark: the lights are down and the screen is lit.
- **Type.** *Rozha One* is a Devanagari display face set here in Latin, so the
  page's typographic accent comes from the subject's own foundry tradition
  instead of a Western editorial serif. *Hind* carries body text, *DM Mono*
  carries scores, labels and the clock.
- **The rarity ramp means something.** Common answers are drab slate; legendary
  ones are full-chroma poster magenta. The ramp is defined once in `tokens.css`
  and indexed by tier.
- **Two devices do real work.** The rarity ladder on the start screen is built
  from actual answers in the bank, so it argues the game's premise rather than
  describing it. The depth gauge on the result screen plots your year on the
  1913–2026 timeline, because a year on a timeline means something a score does
  not.
- **One indulgence:** the wordmark prints three times — cyan and magenta laid
  down first, paper-white on top, each pass slightly out of register the way a
  screen print misses its marks. The primary buttons carry the same offset as a
  hard shadow, and pressing one collapses it. Nothing else on the page uses it.
- **Two small conceits that earn their place:** the pack tiles go up at
  alternating half-degree angles, like bills pasted on a wall in a hurry, and
  straighten when you reach for one; and the section rules are perforated like
  the tear line on a ticket rather than drawn as plain lines.
- **Colour is the index.** Each pack tile carries a spine cycling the five
  rarity inks and each daily show a spine of its own, because ten identically
  bordered boxes read as a wall of nothing. The shows are numbered from a CSS
  counter, so the order is real information and no markup carries it. The start
  card's sections paste up in sequence on load — short and low-amplitude, so it
  reads as the page settling rather than as an animation to sit through.

Reduced motion is respected, focus is always visible, and the layout goes to one
column below 520px. Under Windows High Contrast (`forced-colors`) the page takes
the system palette as it should, except for the rarity swatches, timer fill and
depth gauge — those carry the score rather than decorating it, so they opt out
and keep their ink. A colourless tier swatch would say nothing at all.

## Editing the question bank

`src/js/data/categories.js` is the file you will touch most. Each answer is:

```js
{ name: 'Dilwale Dulhania Le Jayenge', aliases: ['ddlj'], tier: 0, year: 1995 }
```

- **`tier`** indexes into `TIERS` (0 = everyone says it … 4 = legendary rare).
  This *is* the scoring model — it is the one field worth agonising over. It
  also drives the rarity ladder on the start screen, which shows the first
  answer it finds at each tier.
- **`year`** feeds the result screen and the era-bucketed themed rounds, so it
  needs to be right. Categories with fewer than six year-tagged answers fall
  back to generic round wording.
- **`aliases`** are alternative spellings people actually type. You do not need
  to list typos — fuzzy matching in `lib/text-match.js` already forgives edits
  scaled to the length of the title. You *do* need to list **short forms and
  initialisms**: fuzzy matching allows about two edits on a mid-length title,
  which a dropped word blows straight past. "Jab Tak Hai Jaan" was in the bank
  and still rejected `jab tak jaan`, four edits away. Every multi-word title
  should carry the short forms people actually type, plus its initialism.

  **A film's aliases must be the same in every pack it appears in.** They were
  not: `dilwale dulhania` reached DDLJ in the `srk` pack and nothing in
  `nineties`, purely because one entry listed the alias and the other did not.
  To a player that is indistinguishable from the game not knowing the film. 46
  entries were out of step; all now carry the union of what any copy had.
  Reused titles are the deliberate exception — `don 1978` and `don 2006` exist
  precisely to tell two different films apart and must not be merged.

  Punctuated initialisms are handled by the matcher, not by aliases: `normalize`
  re-joins runs of single letters, so `D.D.L.J.` folds to `ddlj`. Before that it
  became `d d l j` and matched nothing.

**A rejected valid answer is the worst bug this game can have** — it tells the
player they are wrong when they are right. Prefer over-inclusion: the packs
cover full filmographies rather than the hits.

Run `python environment\check-bank.py` after editing (`build.ps1` runs it too, and
refuses to build on failure). It catches duplicate names and aliases that fold
together under matching, missing or impossible years, bad tiers, missing `role`
on villains, packs too small for a 5-round game, answers outside a pack's
declared window (a 1989 film in the 1990s pack), names that contradict the pack
title (a film with no "Dil" in it), one-winner-per-year violations in the awards
pack, and the same film carrying two different release years in two packs.

What it cannot check is whether a film is really in an actor's filmography or
really scored by a given composer. That needs a source, and the errors it misses
are the invented kind: a film credited to the wrong composer, an actor credited
with a film they were not in, a Best Film *nominee* listed as a winner.

**Every pack has now been audited against an external source**, entry by entry:

| Pack | Source | Result |
| --- | --- | --- |
| `award` | 55 per-ceremony Wikipedia pages | clean |
| `srk` `ab` `deepika` | Wikidata SPARQL, Wikipedia arbitration | clean, 198 entries |
| `rahman` `director` | Wikipedia discography, TMDB, trade press | clean, 118 entries |
| `nineties` `diltitle` | Wikidata SPARQL (IMDb returned 403) | clean, 196 entries |
| `villain` | Wikipedia film and actor articles | clean, 41 entries |
| `biopic` | Wikipedia biographical-film categories | checked when written |
| `noughties` | Wikidata SPARQL, 125 entries | swept, spot-checked |
| `remake` | Wikipedia remake categories, 111 entries | swept, spot-checked |
| `actress` | Wikidata SPARQL, 57 entries | swept, spot-checked |
| `bhansali` | — | exhaustive, written from knowledge |
| `triangle` `wedding` `cop` | — | **judgement packs; no source exists** |

Three of the newest packs were **swept from raw data rather than written**:

- `noughties` — Wikidata SPARQL for Hindi films with a publication date in the
  window, ranked by how many Wikipedia editions carry the film.
- `remake` — Wikipedia's own `Hindi remakes of {Tamil,Telugu,Malayalam,Kannada}
  films` categories, via the API.
- `actress` — Wikidata, grouped by the earliest Hindi film recorded for each
  woman in a Hindi film's cast.

**Ranking by sitelink count is what makes the tier defensible.** The tier is
"how likely is a player to name this", and the number of language editions that
bothered to write the film up is the closest thing to a measurement of that
which exists. Tiers are assigned by *rank band* within the pack, not by an
absolute cutoff — an absolute threshold calibrated on the full result set put
four fifths of a trimmed pack into the middle tiers and left tier 4 empty.

The other three cannot be swept from anything. "Has a love triangle", "is
remembered for its wedding", and "has played a policeman" are not recorded as
data anywhere, so `triangle`, `wedding` and `cop` are hand-written, err wide per
the over-inclusion rule, and name the qualifying role in a comment where the
claim is thin. `bhansali` is the safest shape a pack can have — exhaustive
rather than curated, so it cannot reject a valid answer.

### What sweeping taught, which the next sweep should assume

- **`P364 = Hindi` is not "is a Bollywood film".** It returned *Lust, Caution*
  (Mandarin), *After the Wedding* (Danish), *Slumdog Millionaire* and *Bend It
  Like Beckham*. Every sweep needs a by-name exclusion pass.
- **Citizenship is the wrong proxy for "works in Hindi cinema".** Filtering the
  actress roster on `P27 = India` to keep Hollywood names out silently dropped
  Katrina Kaif (British passport) and Jacqueline Fernandez (Sri Lankan). Both
  had to be restored by hand.
- **An enwiki disambiguator beats P577.** "Dostana (2008 film)" states which
  film the article is about; P577's earliest date is a festival premiere often
  enough to matter — it dates *Paan Singh Tomar* to 2010 against a 2012 release.
- **The cross-pack year check finds reused titles, not errors.** Every
  disagreement it raised during these sweeps was two different films sharing a
  name: *Dostana*, *Barsaat*, *Baaghi*, *Coolie No. 1*. All four are now in
  `REUSED_TITLES`.

### `remake` points the other way round

The prompt is "a Hindi film that **is a remake of** a film in another language",
not "a Hindi film later **remade into** another language". The distinction
matters and is easy to lose: *Ghajini*, *Drishyam*, *Kabir Singh*, *Singham*,
*Wanted* and *Bhool Bhulaiyaa* are all Hindi versions of southern originals.
The opposite direction — *Don* (1978), remade in Tamil as *Billa* — is a good
pack too, but a different one needing different films, which is why *Don* is
not in this one.

Two lessons from that audit are worth keeping:

- **A summarised fetch of a long table is not a source.** The `award` pack was
  first built from one AI-summarised fetch of the "Filmfare Award for Best Film"
  list article. Three of its entries were wrong. That article still asserts
  Chhoti Bahen for 1960 and is contradicted by the ceremony page and by both
  films' own articles. Fetch the specific page, or query for raw JSON.
- **Wikidata's P577 publication date is noisy** — festival premieres, planned
  dates that slipped, and same-titled unrelated films. It flagged nine bank
  years as suspect across two audits; Wikipedia confirmed the bank was right
  every single time. Treat a P577 disagreement as a question, not a verdict.
- The `villain` pack additionally uses **`role`** (`'actor'` or `'character'`),
  which is what lets its rounds alternate between the two.

Two fields are carried in the data but no longer rendered: `icon` and
`packDesc`. The pack tiles now show the round and answer counts instead, which
come straight from the bank and cannot drift out of date.
