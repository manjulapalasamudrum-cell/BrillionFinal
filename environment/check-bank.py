"""
Sanity-check the answer bank.

The bank is hand-maintained data and is now large enough that duplicates and
typos cannot be caught by reading it. Every problem below is one a player would
eventually hit as a wrong rejection, a repeated prompt, or a nonsense year, so
this is run as part of the build.

    python environment\\check-bank.py

Exits non-zero and prints every problem it finds.
"""

import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src", "js", "data", "categories.js")

CINEMA_START = 1913
PRESENT = 2026

# Packs whose title is itself a claim about the year. An answer outside the
# window is not a rarity judgement the maintainer can make either way — it is
# simply wrong, and the game would award points for it.
YEAR_WINDOWS = {"nineties": (1990, 1999), "noughties": (2000, 2010)}

# Packs of people whose `year` would be a fact the pack does not have. An actor
# who played a policeman in 1973 played another in 2015, so there is no one year
# to record; inventing one to satisfy the check below would be worse than having
# none. Undated packs simply generate no era or decade rounds.
UNDATED_PACKS = {"villain", "cop"}

# Packs where `year` identifies the answer rather than describing it: an annual
# award has exactly one winner per ceremony, so a repeated year means an entry
# is a nominee, a mis-dated winner, or invented outright. Gaps get reported too,
# since the pack is only useful if it is complete.
ONE_PER_YEAR = {"award": "ceremony"}

# Years an annual award genuinely did not happen, so a gap is not a hole.
KNOWN_GAPS = {"award": {1987, 1988}}

# Packs whose title is a claim about the answer's own name. Membership here is
# checkable without knowing anything about film history.
NAME_RULES = {
    # "Dilwale" counts — dil plus a suffix. "Dilli" does not: that is the city,
    # not the word for heart, and Delhi-6 sat in this pack on exactly that
    # false match until the lookahead was added.
    "diltitle": (r"\bdil(?!li\b)", "must have 'Dil' in the title"),
}

# Packs where `year` is the film's release year, and so must agree wherever the
# same film appears. `award` is excluded because its year is the ceremony, one
# year later; `director` because its year is a representative film, not a
# release. A disagreement means one of the two is simply wrong.
RELEASE_YEAR_PACKS = {"srk", "ab", "nineties", "deepika", "biopic", "rahman",
                      "diltitle", "bhansali", "triangle", "noughties", "wedding",
                      "remake"}

# Titles Hindi cinema has genuinely used more than once. A year disagreement on
# these is two different films, not a mistake, so the cross-pack check skips
# them. Everything here was confirmed as a real pair before being added — do not
# use this list to silence a disagreement you have not actually looked into.
REUSED_TITLES = {
    "don",       # 1978 Amitabh; 2006 Shah Rukh remake
    "dilwale",   # 1994 Ajay Devgn; 2015 Shah Rukh
    "aankhen",   # 1993 Govinda comedy; 2002 Amitabh heist
    "pukar",     # 1983 Amitabh; 2000 Anil Kapoor, scored by Rahman
    "saudagar",  # 1973 Amitabh; 1991 Subhash Ghai, Dilip Kumar and Raaj Kumar
}


def normalize(s):
    """Mirror of normalize() in lib/text-match.js — matching folds these away."""
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    s = re.sub(r"^(the|a|an)\s+", "", s)
    return re.sub(r"\s+", " ", s).strip()


def loose_key(s):
    """
    Mirror of looseKey() in lib/text-match.js. Keep the two in step: this is
    what catches two different films folding onto each other, which would make
    one of them permanently unreachable no matter what the player typed.
    """
    s = normalize(s)
    s = re.sub(r"([aeiou])h(?=\s|$)", r"\1", s)
    s = re.sub(r"(.)\1+", r"\1", s)
    s = s.replace("w", "v").replace("z", "j").replace("ck", "k")
    return re.sub(r"\s+", " ", s).strip()


def parse():
    text = open(SRC, encoding="utf-8").read()
    packs = []
    for m in re.finditer(r"id:'([a-z]+)'", text):
        start = m.start()
        end = text.find("\n  {\n", start + 1)
        packs.append((m.group(1), text[start: end if end > 0 else len(text)]))

    out = []
    for pid, body in packs:
        entries = []
        for e in re.finditer(
            r"\{name:'((?:[^'\\]|\\.)*)'\s*,\s*aliases:\[([^\]]*)\][^}]*\}", body
        ):
            raw = e.group(0)
            name = e.group(1).replace("\\'", "'")
            aliases = [a.strip().strip("'").replace("\\'", "'")
                       for a in e.group(2).split(",") if a.strip()]
            tier = re.search(r"tier:(\d)", raw)
            year = re.search(r"year:(\d{4})", raw)
            role = re.search(r"role:'(\w+)'", raw)
            entries.append({
                "name": name,
                "aliases": aliases,
                "tier": int(tier.group(1)) if tier else None,
                "year": int(year.group(1)) if year else None,
                "role": role.group(1) if role else None,
            })
        out.append((pid, entries))
    return out


def main():
    packs = parse()
    problems = []
    notes = []
    total = 0

    for pid, entries in packs:
        total += len(entries)
        if not entries:
            problems.append("%s: parsed zero answers" % pid)
            continue

        # Two entries a player cannot tell apart is a bug: whichever matches
        # first wins and the other is unreachable and dead weight in the draw.
        # Keyed by position, not by name, so an exact duplicate is caught too —
        # that is the easiest mistake to make and the easiest one to miss.
        seen = {}
        for i, e in enumerate(entries):
            for key, kind in [(normalize(e["name"]), "name")] + \
                             [(normalize(a), "alias") for a in e["aliases"]]:
                if not key:
                    problems.append("%s: empty %s on %r" % (pid, kind, e["name"]))
                    continue
                if key in seen and seen[key][0] != i:
                    problems.append("%s: %r (#%d) collides with %r (#%d) — both fold to %r"
                                    % (pid, e["name"], i, seen[key][1], seen[key][0], key))
                seen[key] = (i, e["name"])

        for e in entries:
            if e["tier"] is None or not 0 <= e["tier"] <= 4:
                problems.append("%s: %r has tier %r" % (pid, e["name"], e["tier"]))
            if pid == "villain":
                if e["role"] not in ("actor", "character"):
                    problems.append("%s: %r has role %r" % (pid, e["name"], e["role"]))
            elif pid in UNDATED_PACKS:
                pass  # carries no year on purpose — see UNDATED_PACKS
            elif pid == "director":
                pass  # a director's `year` is a representative film, not a release
            else:
                if e["year"] is None:
                    problems.append("%s: %r has no year" % (pid, e["name"]))
                elif not CINEMA_START <= e["year"] <= PRESENT:
                    problems.append("%s: %r year %d is outside %d-%d"
                                    % (pid, e["name"], e["year"], CINEMA_START, PRESENT))
                elif pid in YEAR_WINDOWS:
                    lo, hi = YEAR_WINDOWS[pid]
                    if not lo <= e["year"] <= hi:
                        problems.append("%s: %r is from %d, outside the pack's %d-%d"
                                        % (pid, e["name"], e["year"], lo, hi))

        if pid in ONE_PER_YEAR:
            label = ONE_PER_YEAR[pid]
            by_year = {}
            for e in entries:
                if e["year"] is None:
                    continue
                if e["year"] in by_year:
                    problems.append("%s: %r and %r share %s year %d — an annual award has one winner"
                                    % (pid, by_year[e["year"]], e["name"], label, e["year"]))
                by_year[e["year"]] = e["name"]
            if by_year:
                span = range(min(by_year), max(by_year) + 1)
                missing = sorted(set(span) - set(by_year) - KNOWN_GAPS.get(pid, set()))
                if missing:
                    notes.append("%s: no entry for %s year(s) %s"
                                 % (pid, label, ", ".join(str(y) for y in missing)))

        # Matching's forgiving second pass folds romanisation differences away
        # (jaan/jan, doh/do, w/v, z/j). Two entries that survive that fold
        # identically are indistinguishable to a player: whichever is listed
        # first always wins and the other can never be reached.
        folded = {}
        for i, e in enumerate(entries):
            key = loose_key(e["name"])
            if key in folded and folded[key][0] != i:
                problems.append("%s: %r and %r both fold to %r under loose matching"
                                % (pid, folded[key][1], e["name"], key))
            folded[key] = (i, e["name"])

        if pid in NAME_RULES:
            pattern, why = NAME_RULES[pid]
            for e in entries:
                if not re.search(pattern, e["name"], re.I):
                    problems.append("%s: %r %s" % (pid, e["name"], why))

        # eras.js needs enough year-tagged answers to cut into three buckets.
        dated = [e for e in entries if e["year"] is not None]
        if pid not in UNDATED_PACKS and len(dated) < 6:
            problems.append("%s: only %d dated answers; era rounds need 6+"
                            % (pid, len(dated)))

        # A themed game draws 5 rounds from one pack with no repeats.
        if len(entries) < 8:
            problems.append("%s: only %d answers; a 5-round game needs headroom"
                            % (pid, len(entries)))

    # The same film in two packs must carry the same release year.
    release = {}
    for pid, entries in packs:
        if pid not in RELEASE_YEAR_PACKS:
            continue
        for e in entries:
            if e["year"] is None:
                continue
            key = normalize(e["name"])
            if key in REUSED_TITLES:
                continue
            if key in release:
                prev_pid, prev_year = release[key]
                if prev_year != e["year"]:
                    problems.append("%r is %d in %s but %d in %s — one is wrong"
                                    % (e["name"], prev_year, prev_pid, e["year"], pid))
            else:
                release[key] = (pid, e["year"])

    print("%d packs, %d answers" % (len(packs), total))
    for pid, entries in packs:
        by_tier = [sum(1 for e in entries if e["tier"] == t) for t in range(5)]
        print("  %-9s %3d   tiers %s" % (pid, len(entries), by_tier))

    if notes:
        print("\nnotes (not failures):")
        for n in notes:
            print("  - " + n)

    if problems:
        print("\n%d PROBLEM(S):" % len(problems))
        for p in problems:
            print("  - " + p)
        return 1
    print("\nno problems found")
    return 0


if __name__ == "__main__":
    sys.exit(main())
