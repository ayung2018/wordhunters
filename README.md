# Word Hunters

Spelling hangman for kids — HUNTR/X and Poké Quest themes.

## Play

After Vercel deploy, open the site root URL (rewrites to `Hangman/index.html`).

Locally:

```bash
cd Hangman
python3 -m http.server 8080
# open http://localhost:8080
```

## Vercel

1. Import this GitHub repo on [vercel.com/new](https://vercel.com/new)
2. **Root Directory:** leave default (repo root)
3. **Framework:** Other / no build
4. Deploy

Root `vercel.json` rewrites `/` → `/Hangman/` so the game and images load correctly.

## Progress rules

| Setting | Value |
|---------|------:|
| Words per level | 5 |
| Max level | 10 |
| Words to unlock all | 50 |
| Progress storage | Session only (refresh resets) |

## Stack

- Static HTML/CSS/JS (no build step)
- Character art in `Hangman/images/`
- Word bank: `Hangman/words-bank.js` (~2000 HK primary words)

Turso can be added later for cloud scores; not required for hosting.
