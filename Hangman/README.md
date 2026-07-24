# Word Hunters 🎤⚡

A **high-quality, animated hangman game** for kids (ages ~5–7) that makes spelling English fun.

Themes blend:

- **Demon Hunters** — HUNTR/X heroes **Rumi, Mira, Zoey** protect the stage while cute villains like **Gwi-Ma** and **Jinu** creep closer on wrong guesses (friendly “rescue” meter — **no hanging figure**).
- **Poké Quest** — Spell to stop legendary “villains” from escaping: **Arceus, Mewtwo, Giratina, Dialga, Palkia, Rayquaza, Eternatus, Ultra Necrozma, Groudon, Kyogre** (official artwork embedded for offline play).

> Fan-inspired **private family educational game**, not a commercial product.  
> Pokémon artwork © Nintendo / Creatures / Game Freak (sprites via [PokéAPI](https://pokeapi.co) for personal use).  
> K-pop Demon Hunters characters are referenced by name with original emoji/UI avatars.

---

## How to play

1. Open **`index.html`** in any modern browser (double-click works; no install).
2. **Spelling Lesson** — paste or type **10–20 words** (one per line). Optional clue: `HAPPY - a big smile feeling`.
3. Pick a world & hero, set difficulty, tap **PLAY!**
4. Guess letters Hangman-style. Wrong letters move the villain closer.
5. After each word, see the full spelling, hear it spoken, then **Next word**.
6. At the end, review the whole list and re-practice missed words.

### Modes

| Mode | What you spell |
|------|----------------|
| **My Word List** | Your custom list (best 30–50, max 1000). Cleared when the lesson ends so you can paste a new test. |
| **General English** | ~2,000 HK primary-school everyday words (school, food, home, feelings…). Random pack by difficulty. |
| **Theme Words** | Demon Hunters & Pokémon spelling pack |

### Difficulty

| Level  | Chances | Hints |
|--------|---------|--------|
| Easy   | ~8      | Free first letter, voice clue, emoji, 3 letter-hints |
| Medium | ~6      | Clue + emoji, 2 letter-hints |
| Hard   | ~6      | Clue/emoji only via 💡, 1 letter-hint |

### Learning English

- **Voice** (built-in SpeechSynthesis) says each letter and the full word.
- **Sound FX** via Web Audio API (no audio files).
- Picture clues + optional **💡 Hint** button.
- Toggles for Sound and Voice on the home screen.

---

## Features

- Animated title, floating sparkles / notes / flames
- Rescue stage: demon creeps in **or** legendary Pokémon wobbles out of the ball
- Letter-tile flip animations, color-coded keyboard
- Confetti + star rating on wins
- Collection shelf (`localStorage`)
- Fully responsive (phone / tablet / desktop), huge touch targets
- Respects `prefers-reduced-motion`
- **Zero dependencies** — one self-contained `index.html`

---

## Levels (session only)

| Rule | Value |
|------|------:|
| Words per level | **5** |
| Max level | **10** |
| Words to unlock everyone | **50** |
| Progress storage | **In-memory only** — every browser refresh resets levels, collection, and unlocks |

Unlock path: pets/helpers → stars (Rumi, Ash…) → bosses (Gwi-Ma, Mewtwo, Arceus).

## Open the game locally

```bash
# From this folder:
open index.html          # macOS
# or serve (recommended for Vercel-like paths):
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy to Vercel (static)

1. Push this repo to GitHub (include the full `images/` folder — all character PNGs).
2. Import the repo in [Vercel](https://vercel.com) → Framework: **Other** / static.
3. Root directory = repo root (has `index.html`). No build command needed.
4. Deploy. `vercel.json` already sets long cache for `/images/*`.

```bash
# Optional CLI
npx vercel
```

### Assets checklist for GitHub

Must be committed (not gitignored):

- `index.html`, `game.js`, `styles-full.css`, `words-bank.js`
- `images/**/*.png` (all character + world art)
- `vercel.json`

## Turso (later)

Static hosting does **not** need a database. When you want cloud leaderboards / multi-device progress:

1. Create a Turso DB and copy URL + token into `.env` (see `.env.example`).
2. Add a small serverless API route (Vercel function) to read/write scores.
3. Keep local session reset as default for classroom “fresh game each visit”, or switch to cloud save behind a toggle.

Repo: https://github.com/ayung2018/Hangman

---

## Character images

### Pokémon villains (included)

Official artwork for the top legendaries is in `images/` (also loaded from PokéAPI online). Offline play works when you open the game from this folder (local images load automatically):

| File                 | Character        |
|----------------------|------------------|
| `arceus.png`         | Arceus           |
| `mewtwo.png`         | Mewtwo           |
| `giratina.png`       | Giratina         |
| `dialga.png`         | Dialga           |
| `palkia.png`         | Palkia           |
| `rayquaza.png`       | Rayquaza         |
| `eternatus.png`      | Eternatus        |
| `necrozma.png`       | Necrozma         |
| `ultra-necrozma.png` | Ultra Necrozma   |
| `groudon.png`        | Groudon          |
| `kyogre.png`         | Kyogre           |

### Demon Hunters (optional drop-in)

Place your own kid-safe pictures in `images/` using the names in [`images/README.md`](images/README.md). The game falls back to friendly emoji avatars for **Rumi, Mira, Zoey, Jinu, Gwi-Ma**, etc.

---

## Project layout

```
Hangman/
├── index.html        # App shell
├── styles.css        # Kid-friendly animated UI
├── game.js           # Game logic, words, audio, voice
├── images-data/      # Offline legendary art (data-URI JS)
├── images/           # PNG villains + optional hero drops
└── README.md
```

---

## Privacy / IP note

Built for **personal family use** to help kids learn English spelling. Not affiliated with Netflix, Sony, or The Pokémon Company. Do not redistribute as a commercial product.
