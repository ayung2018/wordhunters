// Word Hunters — plain JS game (no compressed bootstrap)
// Rebuilt so the game loads without DecompressionStream / gzip payloads.
"use strict";

(function () {
  const $ = (id) => document.getElementById(id);

  // ---------- Villain art loader ----------
  const POKE_IDS = {
    arceus: 493, mewtwo: 150, giratina: 487, dialga: 483, palkia: 484,
    rayquaza: 384, eternatus: 890, necrozma: 800, "ultra-necrozma": 10157,
    groudon: 383, kyogre: 382,
    pikachu: 25, pika: 25, eevee: 133, charmander: 4, squirtle: 7,
    bulbasaur: 1, jigglypuff: 39, snorlax: 143, psyduck: 54, sylveon: 700,
    lucario: 448, charizard: 6, gengar: 94, lapras: 131, mew: 151,
    meowth: 52, pichu: 172, espeon: 196, umbreon: 197,
  };
  const EMBEDDED_IMAGES = window.EMBEDDED_IMAGES || {};
  const CDN =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

  function artCandidates(slug) {
    if (!slug) return [];
    const out = [];
    // Prefer local PNGs first (bundled offline art)
    out.push("images/" + slug + ".png");
    if (slug === "pika" || slug === "pikachu") {
      out.push("images/pikachu.png", "images/pika.png");
    }
    if (slug === "trainer") {
      out.push("images/trainer.png", "images/trainer_red.png", "images/trainer_ash.png");
    }
    if (slug === "trainer_ash") {
      out.push("images/trainer_ash.png", "images/trainer.png");
    }
    if (slug === "ash") {
      out.push("images/trainer_ash.png", "images/trainer.png");
    }
    if (EMBEDDED_IMAGES[slug]) out.push(EMBEDDED_IMAGES[slug]);
    // CDN fallback for Pokémon species (official artwork)
    if (POKE_IDS[slug] != null) out.push(CDN + POKE_IDS[slug] + ".png");
    return out;
  }

  function img(slug, name) {
    const candidates = artCandidates(slug);
    return { slug, name: name || slug || "character", src: candidates[0] || null, candidates };
  }

  /** Load character photo only — never show emoji faces */
  function setImgEl(el, a) {
    if (!el) return;
    el.classList.add("has-photo");
    el.innerHTML = "";
    if (!a) {
      el.classList.add("photo-missing");
      return;
    }
    const list = (a.candidates || (a.src ? [a.src] : [])).filter(Boolean);
    let i = 0;
    // soft gradient placeholder while loading (no emoji)
    el.classList.add("photo-loading");
    function tryNext() {
      if (i >= list.length) {
        el.classList.remove("photo-loading");
        el.classList.add("photo-missing");
        el.title = a.name || a.slug || "";
        return;
      }
      const src = list[i++];
      const im = new Image();
      im.alt = a.name || a.slug || "character";
      im.draggable = false;
      im.onload = () => {
        el.classList.remove("photo-loading", "photo-missing");
        el.innerHTML = "";
        im.className = "char-photo";
        el.appendChild(im);
      };
      im.onerror = tryNext;
      im.src = src;
    }
    tryNext();
  }

  // ---------- Characters (playable) ----------
  // unlockLevel = player level needed. Weak/support first → stars → boss villains last.
  const HEROES = [
    // ===== Demon Hunters world =====
    // Lv1 starters (cute / support)
    { id: "derpy", name: "Derpy", role: "Pet", world: "demon", slug: "derpy", color: "#fde047", unlockLevel: 1, power: 1 },
    { id: "sussie", name: "Sussie", role: "Pet", world: "demon", slug: "sussie", color: "#86efac", unlockLevel: 1, power: 1 },
    { id: "bobby", name: "Bobby", role: "Helper", world: "demon", slug: "bobby", color: "#34d399", unlockLevel: 1, power: 1 },
    // Lv2 helpers
    { id: "han", name: "Healer Han", role: "Helper", world: "demon", slug: "han", color: "#67e8f9", unlockLevel: 2, power: 2 },
    { id: "celine", name: "Celine", role: "Helper", world: "demon", slug: "celine", color: "#a78bfa", unlockLevel: 2, power: 2 },
    // Lv3 junior Saja
    { id: "baby", name: "Baby Saja", role: "Saja Boys", world: "demon", slug: "baby", color: "#f9a8d4", unlockLevel: 3, power: 3 },
    { id: "romance", name: "Romance", role: "Saja Boys", world: "demon", slug: "romance", color: "#fb7185", unlockLevel: 3, power: 3 },
    // Lv4 mid Saja
    { id: "abby", name: "Abby Saja", role: "Saja Boys", world: "demon", slug: "abby", color: "#38bdf8", unlockLevel: 4, power: 4 },
    { id: "mystery", name: "Mystery", role: "Saja Boys", world: "demon", slug: "mystery", color: "#c4b5fd", unlockLevel: 4, power: 4 },
    // Lv5 Saja leader
    { id: "jinu", name: "Jinu", role: "Saja Boys", world: "demon", slug: "jinu", color: "#a78bfa", unlockLevel: 5, power: 5 },
    // Lv6–8 HUNTR/X (main heroes)
    { id: "zoey", name: "Zoey", role: "HUNTR/X", world: "demon", slug: "zoey", color: "#60a5fa", unlockLevel: 6, power: 6 },
    { id: "mira", name: "Mira", role: "HUNTR/X", world: "demon", slug: "mira", color: "#f472b6", unlockLevel: 7, power: 7 },
    { id: "rumi", name: "Rumi", role: "HUNTR/X Star", world: "demon", slug: "rumi", color: "#c084fc", unlockLevel: 8, power: 8 },
    // Lv9–10 villains / bosses (strongest)
    { id: "saja", name: "Saja Boys", role: "Villain Team", world: "demon", slug: "saja", color: "#94a3b8", unlockLevel: 9, power: 9 },
    { id: "gwima", name: "Gwi-Ma", role: "Boss Villain", world: "demon", slug: "gwima", color: "#f87171", unlockLevel: 10, power: 10 },

    // ===== Poké Quest world =====
    // Lv1 starters
    { id: "trainer", name: "Red", role: "Trainer", world: "poke", slug: "trainer", color: "#ef4444", unlockLevel: 1, power: 1 },
    { id: "brendan", name: "Brendan", role: "Trainer", world: "poke", slug: "trainer_brendan", color: "#38bdf8", unlockLevel: 1, power: 1 },
    { id: "pichu", name: "Pichu", role: "Buddy", world: "poke", slug: "pichu", color: "#fef08a", unlockLevel: 1, power: 1 },
    // Lv2
    { id: "may", name: "May", role: "Trainer", world: "poke", slug: "trainer_may", color: "#f472b6", unlockLevel: 2, power: 2 },
    { id: "dawn", name: "Dawn", role: "Trainer", world: "poke", slug: "trainer_dawn", color: "#93c5fd", unlockLevel: 2, power: 2 },
    { id: "eevee", name: "Eevee", role: "Buddy", world: "poke", slug: "eevee", color: "#d6b28c", unlockLevel: 2, power: 2 },
    { id: "psyduck", name: "Psyduck", role: "Buddy", world: "poke", slug: "psyduck", color: "#fde047", unlockLevel: 2, power: 2 },
    // Lv3
    { id: "hilda", name: "Hilda", role: "Trainer", world: "poke", slug: "trainer_hilda", color: "#fb7185", unlockLevel: 3, power: 3 },
    { id: "serena", name: "Serena", role: "Trainer", world: "poke", slug: "trainer_serena", color: "#f9a8d4", unlockLevel: 3, power: 3 },
    { id: "jigglypuff", name: "Jigglypuff", role: "Buddy", world: "poke", slug: "jigglypuff", color: "#f9a8d4", unlockLevel: 3, power: 3 },
    { id: "snorlax", name: "Snorlax", role: "Buddy", world: "poke", slug: "snorlax", color: "#67e8f9", unlockLevel: 3, power: 3 },
    // Lv4 starters line
    { id: "victor", name: "Victor", role: "Trainer", world: "poke", slug: "trainer_victor", color: "#fbbf24", unlockLevel: 4, power: 4 },
    { id: "gloria", name: "Gloria", role: "Trainer", world: "poke", slug: "trainer_gloria", color: "#a3e635", unlockLevel: 4, power: 4 },
    { id: "charmander", name: "Charmander", role: "Buddy", world: "poke", slug: "charmander", color: "#fb923c", unlockLevel: 4, power: 4 },
    { id: "squirtle", name: "Squirtle", role: "Buddy", world: "poke", slug: "squirtle", color: "#38bdf8", unlockLevel: 4, power: 4 },
    { id: "bulbasaur", name: "Bulbasaur", role: "Buddy", world: "poke", slug: "bulbasaur", color: "#4ade80", unlockLevel: 4, power: 4 },
    // Lv5 stars
    { id: "ash", name: "Ash", role: "Trainer Star", world: "poke", slug: "trainer_ash", color: "#3b82f6", unlockLevel: 5, power: 5 },
    { id: "pikachu", name: "Pikachu", role: "Buddy", world: "poke", slug: "pikachu", color: "#facc15", unlockLevel: 5, power: 5 },
    // Lv6 strong buddies
    { id: "sylveon", name: "Sylveon", role: "Buddy", world: "poke", slug: "sylveon", color: "#fda4af", unlockLevel: 6, power: 6 },
    { id: "lapras", name: "Lapras", role: "Buddy", world: "poke", slug: "lapras", color: "#7dd3fc", unlockLevel: 6, power: 6 },
    { id: "lucario", name: "Lucario", role: "Buddy", world: "poke", slug: "lucario", color: "#60a5fa", unlockLevel: 6, power: 6 },
    // Lv7 mythicals
    { id: "mew", name: "Mew", role: "Mythical", world: "poke", slug: "mew", color: "#f0abfc", unlockLevel: 7, power: 7 },
    // Lv8 legendary villains (mid)
    { id: "mewtwo", name: "Mewtwo", role: "Legendary Villain", world: "poke", slug: "mewtwo", color: "#c4b5fd", unlockLevel: 8, power: 8 },
    { id: "giratina", name: "Giratina", role: "Legendary Villain", world: "poke", slug: "giratina", color: "#a78bfa", unlockLevel: 8, power: 8 },
    // Lv9 legendary bosses
    { id: "rayquaza", name: "Rayquaza", role: "Legendary Boss", world: "poke", slug: "rayquaza", color: "#4ade80", unlockLevel: 9, power: 9 },
    { id: "dialga", name: "Dialga", role: "Legendary Boss", world: "poke", slug: "dialga", color: "#60a5fa", unlockLevel: 9, power: 9 },
    { id: "palkia", name: "Palkia", role: "Legendary Boss", world: "poke", slug: "palkia", color: "#e879f9", unlockLevel: 9, power: 9 },
    { id: "groudon", name: "Groudon", role: "Legendary Boss", world: "poke", slug: "groudon", color: "#f97316", unlockLevel: 9, power: 9 },
    { id: "kyogre", name: "Kyogre", role: "Legendary Boss", world: "poke", slug: "kyogre", color: "#38bdf8", unlockLevel: 9, power: 9 },
    // Lv10 apex
    { id: "eternatus", name: "Eternatus", role: "Apex Villain", world: "poke", slug: "eternatus", color: "#a3e635", unlockLevel: 10, power: 10 },
    { id: "ultra-necrozma", name: "Ultra Necrozma", role: "Apex Villain", world: "poke", slug: "ultra-necrozma", color: "#fde047", unlockLevel: 10, power: 10 },
    { id: "arceus", name: "Arceus", role: "Apex Legend", world: "poke", slug: "arceus", color: "#fbbf24", unlockLevel: 10, power: 10 },
  ];

  // Stage opponents (can also appear as playable when unlocked above)
  const DEMON_VILLAINS = [
    { id: "baby", name: "Baby Saja", slug: "baby", power: 3 },
    { id: "romance", name: "Romance", slug: "romance", power: 3 },
    { id: "abby", name: "Abby Saja", slug: "abby", power: 4 },
    { id: "mystery", name: "Mystery", slug: "mystery", power: 4 },
    { id: "jinu", name: "Jinu", slug: "jinu", power: 5 },
    { id: "saja", name: "Saja Boys", slug: "saja", power: 9 },
    { id: "gwima", name: "Gwi-Ma", slug: "gwima", power: 10 },
  ];

  const POKE_VILLAINS = [
    { id: "mewtwo", name: "Mewtwo", slug: "mewtwo", power: 8 },
    { id: "giratina", name: "Giratina", slug: "giratina", power: 8 },
    { id: "rayquaza", name: "Rayquaza", slug: "rayquaza", power: 9 },
    { id: "dialga", name: "Dialga", slug: "dialga", power: 9 },
    { id: "palkia", name: "Palkia", slug: "palkia", power: 9 },
    { id: "groudon", name: "Groudon", slug: "groudon", power: 9 },
    { id: "kyogre", name: "Kyogre", slug: "kyogre", power: 9 },
    { id: "eternatus", name: "Eternatus", slug: "eternatus", power: 10 },
    { id: "ultra-necrozma", name: "Ultra Necrozma", slug: "ultra-necrozma", power: 10 },
    { id: "arceus", name: "Arceus", slug: "arceus", power: 11 },
  ];

  const DIFF = [
    {
      lives: 8,
      freeFirst: true,
      voiceHint: true,
      letterHints: 3,
      help: "Easy: free first letter, voice says the clue, more hearts & hints",
    },
    {
      lives: 6,
      freeFirst: false,
      voiceHint: true,
      letterHints: 2,
      help: "Medium: clue + emoji, 2 letter-hints",
    },
    {
      lives: 6,
      freeFirst: false,
      voiceHint: false,
      letterHints: 1,
      help: "Hard: clue/emoji only via 💡, 1 letter-hint",
    },
  ];

  const SAMPLE_WORDS = [
    "CAT - a soft pet",
    "HAPPY - a big smile feeling",
    "FRIEND - someone you love",
    "SCHOOL - where we learn",
    "RAINBOW - colors in the sky",
  ];

  function sampleFromBank(count) {
    count = count || 15;
    const bank = (window.HK_PRIMARY_WORDS || []).slice();
    if (!bank.length) {
      return SAMPLE_WORDS.map((line) => {
        const p = parseWordLines(line);
        return p[0];
      }).filter(Boolean);
    }
    const tierMax = state.difficulty;
    let pool = bank.filter((w) => (w.tier || 0) <= tierMax + 1);
    if (pool.length < count) pool = bank.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    // avoid words already known when possible
    const known = new Set(state.knownWords.map((k) => k.word));
    const fresh = pool.filter((w) => !known.has(w.word.toUpperCase()));
    const pick = (fresh.length >= count ? fresh : pool).slice(0, count);
    return pick.map((w) => ({
      word: w.word.toUpperCase(),
      clue: w.clue || "Spell this word!",
      emoji: "",
      tier: w.tier || 0,
      theme: "bank",
      custom: true,
    }));
  }


  // Everyday English tied to story themes — NOT character/Pokémon names
  const THEME_WORDS = {
    demon: [
      { word: "STAGE", clue: "place for a big show", tier: 0 },
      { word: "SONG", clue: "music with words", tier: 0 },
      { word: "DANCE", clue: "move your body to music", tier: 0 },
      { word: "VOICE", clue: "sound from your throat", tier: 0 },
      { word: "BRAVE", clue: "not afraid to try", tier: 0 },
      { word: "TEAM", clue: "friends working together", tier: 0 },
      { word: "FRIEND", clue: "someone you care about", tier: 0 },
      { word: "LIGHT", clue: "brightness that helps you see", tier: 0 },
      { word: "HEART", clue: "place of feelings", tier: 0 },
      { word: "DREAM", clue: "a big hope for later", tier: 0 },
      { word: "MUSIC", clue: "songs and beautiful sounds", tier: 1 },
      { word: "RHYTHM", clue: "the beat you clap to", tier: 1 },
      { word: "MELODY", clue: "the tune of a song", tier: 1 },
      { word: "HARMONY", clue: "voices blending nicely", tier: 2 },
      { word: "COURAGE", clue: "bravery when you feel scared", tier: 1 },
      { word: "PROTECT", clue: "keep someone safe", tier: 1 },
      { word: "RESCUE", clue: "save someone in trouble", tier: 1 },
      { word: "SECRET", clue: "something you keep hidden", tier: 1 },
      { word: "SHADOW", clue: "dark shape without light", tier: 1 },
      { word: "TRUTH", clue: "what is real and honest", tier: 1 },
      { word: "UNITY", clue: "staying together as one", tier: 2 },
      { word: "SPIRIT", clue: "energy inside you", tier: 2 },
      { word: "DESTINY", clue: "what is meant to happen", tier: 2 },
      { word: "CONCERT", clue: "a live music show", tier: 1 },
      { word: "AUDIENCE", clue: "people watching the show", tier: 2 },
      { word: "SPOTLIGHT", clue: "bright light on the star", tier: 2 },
      { word: "COSTUME", clue: "special clothes for a show", tier: 1 },
      { word: "APPLAUSE", clue: "clapping for a great show", tier: 2 },
      { word: "CHOICE", clue: "what you decide to pick", tier: 1 },
      { word: "HOPE", clue: "wishing for something good", tier: 0 },
    ],
    poke: [
      { word: "CATCH", clue: "grab or collect carefully", tier: 0 },
      { word: "TRAIN", clue: "practise to get better", tier: 0 },
      { word: "FRIEND", clue: "someone on your side", tier: 0 },
      { word: "TEAM", clue: "group that works together", tier: 0 },
      { word: "JOURNEY", clue: "a long trip to learn", tier: 1 },
      { word: "QUEST", clue: "an important mission", tier: 1 },
      { word: "BADGE", clue: "prize for winning a challenge", tier: 1 },
      { word: "GOAL", clue: "what you aim for", tier: 0 },
      { word: "POWER", clue: "energy and strength", tier: 0 },
      { word: "BRAVE", clue: "ready to face something hard", tier: 0 },
      { word: "CAPTURE", clue: "catch something carefully", tier: 1 },
      { word: "PARTNER", clue: "someone who helps you", tier: 1 },
      { word: "PROTECT", clue: "keep a friend safe", tier: 1 },
      { word: "RESCUE", clue: "save someone from danger", tier: 1 },
      { word: "ESCAPE", clue: "get away safely", tier: 1 },
      { word: "CHALLENGE", clue: "a hard task to try", tier: 2 },
      { word: "VICTORY", clue: "winning a contest", tier: 1 },
      { word: "STRATEGY", clue: "a smart plan", tier: 2 },
      { word: "BALANCE", clue: "stay steady", tier: 1 },
      { word: "FOCUS", clue: "pay full attention", tier: 1 },
      { word: "ENERGY", clue: "power to move and play", tier: 1 },
      { word: "NATURE", clue: "plants, animals, outdoors", tier: 1 },
      { word: "EXPLORE", clue: "look around new places", tier: 1 },
      { word: "DISCOVER", clue: "find something new", tier: 1 },
      { word: "LOYAL", clue: "always true to friends", tier: 1 },
      { word: "TRUST", clue: "believe in someone", tier: 0 },
      { word: "GROWTH", clue: "getting bigger and better", tier: 2 },
      { word: "SKILL", clue: "something you are good at", tier: 1 },
      { word: "EFFORT", clue: "hard work you put in", tier: 1 },
      { word: "CHAMPION", clue: "the best winner", tier: 2 },
      { word: "MEDAL", clue: "metal prize for winners", tier: 1 },
      { word: "TROPHY", clue: "cup prize for winners", tier: 1 },
      { word: "ADVENTURE", clue: "an exciting trip", tier: 1 },
      { word: "MISSION", clue: "a special job to finish", tier: 1 },
      { word: "FRIENDSHIP", clue: "the bond between friends", tier: 2 },
    ],
    mix: [
      { word: "HERO", clue: "brave helper in a story", tier: 0 },
      { word: "MUSIC", clue: "songs and sounds", tier: 0 },
      { word: "POWER", clue: "strength to keep going", tier: 0 },
      { word: "QUEST", clue: "important adventure", tier: 1 },
      { word: "SPARKLE", clue: "shiny happy light", tier: 1 },
      { word: "LEGEND", clue: "old famous story", tier: 1 },
      { word: "COURAGE", clue: "being brave inside", tier: 1 },
      { word: "TEAMWORK", clue: "working well together", tier: 2 },
      { word: "FRIENDSHIP", clue: "loving your friends", tier: 2 },
      { word: "ADVENTURE", clue: "exciting journey", tier: 1 },
      { word: "VICTORY", clue: "winning together", tier: 1 },
      { word: "HARMONY", clue: "everything blending well", tier: 2 },
    ],
  };

  // Progression: 5 new words per level, max Level 10 = 50 words to unlock everyone
  // Level 1 @ 0, Level 2 @ 5, … Level 9 @ 40, Level 10 @ 50
  const WORDS_PER_LEVEL = 5;
  const MAX_LEVEL = 10;
  const WORDS_TO_MAX = MAX_LEVEL * WORDS_PER_LEVEL; // 50
  // Threshold to REACH each level (index 0 unused; level L needs LEVEL_STEPS[L])
  // LEVEL_STEPS[1]=0 … LEVEL_STEPS[9]=40, LEVEL_STEPS[10]=50
  const LEVEL_STEPS = (() => {
    const steps = [0]; // dummy for index 0
    for (let L = 1; L <= MAX_LEVEL; L++) {
      if (L === 1) steps[L] = 0;
      else if (L === MAX_LEVEL) steps[L] = WORDS_TO_MAX; // 50
      else steps[L] = (L - 1) * WORDS_PER_LEVEL; // 5,10,…,40
    }
    return steps;
  })();

  // ---------- State (session-only: every browser refresh resets progress) ----------
  // Clear any older localStorage progress so Vercel/browser reloads always start fresh
  try {
    [
      "wh_known_words",
      "wh_collection",
      "wh_hero_id",
      "wh_world",
      "wh_level",
    ].forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }

  function knownWordCount() {
    return state.knownWords.length;
  }

  function playerLevel() {
    const n = knownWordCount();
    let lvl = 1;
    for (let L = 1; L <= MAX_LEVEL; L++) {
      if (n >= LEVEL_STEPS[L]) lvl = L;
    }
    return Math.min(MAX_LEVEL, lvl);
  }

  function wordsToNextLevel() {
    const n = knownWordCount();
    const lvl = playerLevel();
    if (lvl >= MAX_LEVEL) {
      // Fill remaining to 50 if not complete
      return Math.max(0, WORDS_TO_MAX - n);
    }
    return Math.max(0, LEVEL_STEPS[lvl + 1] - n);
  }

  function progressInLevel() {
    const n = knownWordCount();
    if (n >= WORDS_TO_MAX) return 1;
    const lvl = playerLevel();
    if (lvl >= MAX_LEVEL) {
      // Between 40 and 50 while climbing to full clear (level 10 bar)
      const start = LEVEL_STEPS[9] || 40; // 40
      return Math.min(1, Math.max(0, (n - start) / (WORDS_TO_MAX - start)));
    }
    const start = LEVEL_STEPS[lvl];
    const end = LEVEL_STEPS[lvl + 1];
    if (end <= start) return 1;
    return Math.min(1, Math.max(0, (n - start) / (end - start)));
  }

  function isHeroUnlocked(hero) {
    return playerLevel() >= (hero.unlockLevel || 1);
  }

  function firstUnlockedHero(world) {
    const list = HEROES.filter(
      (h) => (world === "mix" || h.world === world) && isHeroUnlocked(h)
    );
    return list[0] || HEROES.find(isHeroUnlocked) || HEROES[0];
  }

  const defaultHero = HEROES.find((h) => h.id === "derpy") || HEROES[0];

  const state = {
    world: "demon",
    hero: defaultHero,
    difficulty: 0,
    sound: true,
    voice: true,
    lessonMode: "custom",
    customWords: [],
    lessonQueue: [],
    lessonIndex: 0,
    lessonResults: [],
    word: null,
    guessed: new Set(),
    wrong: 0,
    lives: 8,
    hintsLeft: 3,
    over: false,
    knownWords: [], // session memory only — empty every refresh
    villain: null,
    lastLevel: 1,
  };

  state.lastLevel = playerLevel();

  function rememberWord(entry) {
    if (!entry || !entry.word) return { leveled: false, newWord: false };
    const w = String(entry.word).toUpperCase();
    const before = playerLevel();
    let row = state.knownWords.find((x) => x.word === w);
    let newWord = false;
    if (!row) {
      row = { word: w, clue: entry.clue || "", count: 1, at: Date.now() };
      state.knownWords.push(row);
      newWord = true;
    } else {
      row.count += 1;
      row.at = Date.now();
      if (entry.clue) row.clue = entry.clue;
    }
    // No localStorage — progress lives only until the page is refreshed
    const after = playerLevel();
    return { leveled: after > before, newWord, level: after };
  }

  // ---------- Audio / voice ----------
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function sfx(kind) {
    if (!state.sound) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    if (kind === "correct") {
      o.type = "triangle";
      o.frequency.setValueAtTime(520, now);
      o.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      o.start(now);
      o.stop(now + 0.22);
    } else if (kind === "wrong") {
      o.type = "sawtooth";
      o.frequency.setValueAtTime(180, now);
      o.frequency.exponentialRampToValueAtTime(90, now + 0.18);
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      o.start(now);
      o.stop(now + 0.22);
    } else if (kind === "win") {
      [523, 659, 784, 1046].forEach((f, i) => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = "triangle";
        o2.connect(g2);
        g2.connect(ctx.destination);
        const t = now + i * 0.1;
        o2.frequency.setValueAtTime(f, t);
        g2.gain.setValueAtTime(0.1, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o2.start(t);
        o2.stop(t + 0.28);
      });
    } else {
      // pop
      o.type = "sine";
      o.frequency.setValueAtTime(440, now);
      o.frequency.exponentialRampToValueAtTime(660, now + 0.06);
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      o.start(now);
      o.stop(now + 0.12);
    }
  }

  // ---------- Energetic natural female voice ----------
  let preferredVoice = null;
  let speakChain = Promise.resolve();

  function pickKidVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    if (!voices.length) return null;
    // Prefer American English female voices (energetic kid-friendly coach)
    const score = (v) => {
      let s = 0;
      const n = (v.name || "").toLowerCase();
      const lang = (v.lang || "").toLowerCase().replace("_", "-");
      // Strong preference for US English
      if (lang === "en-us") s += 50;
      else if (lang.startsWith("en-us")) s += 45;
      else if (lang.startsWith("en")) s += 10;
      else s -= 40;
      // Prefer American female system voices
      const usFemale = [
        "samantha", // macOS US English female (common default)
        "susan",
        "zira", // Windows US English female
        "jenny",
        "aria",
        "sara",
        "salli",
        "joanna",
        "kendra",
        "kimberly",
        "salli",
        "ivy",
        "emma", // sometimes US
        "google us english",
        "microsoft zira",
        "microsoft aria",
      ];
      if (usFemale.some((h) => n.includes(h))) s += 40;
      if (n.includes("female") || n.includes("woman") || n.includes("girl")) s += 15;
      if (n.includes("natural") || n.includes("enhanced") || n.includes("premium") || n.includes("neural")) s += 8;
      if (n.includes("google") && lang === "en-us") s += 20;
      if (n.includes("microsoft") && lang === "en-us") s += 15;
      // Deprioritize non-US accents even if female
      if (lang.includes("en-gb") || lang.includes("en-au") || lang.includes("en-in") || lang.includes("en-ie")) s -= 25;
      if (n.includes("karen") || n.includes("moira") || n.includes("tessa") || n.includes("fiona") || n.includes("veena") || n.includes("raveena")) s -= 20;
      // Male / novelty
      if (n.includes("male") && !n.includes("female")) s -= 30;
      if (n.includes("daniel") || n.includes("alex") || n.includes("fred") || n.includes("ralph") || n.includes("aaron")) s -= 25;
      if (n.includes("robot") || n.includes("novelty") || n.includes("whisper")) s -= 30;
      return s;
    };
    const sorted = voices.slice().sort((a, b) => score(b) - score(a));
    // Prefer any en-US voice if top score is weak
    const usFemale = sorted.find(
      (v) =>
        (v.lang || "").toLowerCase().replace("_", "-").startsWith("en-us") &&
        score(v) > 0
    );
    return usFemale || sorted[0] || null;
  }

  function refreshVoice() {
    preferredVoice = pickKidVoice();
  }
  if (typeof speechSynthesis !== "undefined") {
    refreshVoice();
    speechSynthesis.onvoiceschanged = refreshVoice;
  }

  const KID_LINES = {
    heroPick: [
      (name) => `Yay! ${name} is ready! Let's spell some words!`,
      (name) => `${name}! Awesome pick! I can't wait to play with you!`,
      (name) => `You chose ${name}! High five! Let's learn English together!`,
      (name) => `${name} jumps in! Super choice, super speller!`,
    ],
    worldPick: [
      (world, hero) => `${world}! ${hero} is so excited for this adventure!`,
      (world, hero) => `Ooh, ${world}! ${hero} is ready for word power!`,
      (world, hero) => `${world} world, here we come! Let's go, ${hero}!`,
    ],
    roundStart: [
      (hero, vill, n, total) => `${hero} versus ${vill}! Word number ${n} of ${total}. You've got this!`,
      (hero, vill, n, total) => `Here we go! ${hero} steps up against ${vill}. Word ${n}!`,
      (hero, vill, n, total) => `Battle time! Protect the stage, ${hero}! This is word ${n}.`,
    ],
    correct: [
      (letter) => `Yes! ${letter}! Sparkle power!`,
      (letter) => `Woo! ${letter} is right!`,
      (letter) => `Nice! ${letter} fits perfectly!`,
      (letter) => `Boom! ${letter}! You're on fire!`,
    ],
    wrong: [
      (letter, vill, hero, lives) => `Oops, not ${letter}. ${vill} tiptoes closer to ${hero}. ${lives} hearts left!`,
      (letter, vill, hero, lives) => `Uh-oh, ${letter} is wrong. ${vill} takes a step! Stay strong, ${hero}!`,
      (letter, vill, hero, lives) => `Not that letter! ${vill} is sneaking up! ${lives} hearts remaining!`,
    ],
    win: [
      (hero, vill, word) => `You did it, ${hero}! ${vill} ran away! The word is ${word}! Super star!`,
      (hero, vill, word) => `Victory dance! ${hero} saved the day! Spell it with me: ${word}!`,
      (hero, vill, word) => `Amazing, ${hero}! You know the word ${word}! That word is yours forever!`,
    ],
    lose: [
      (hero, vill, word) => `Oh no, ${hero}. ${vill} got too close. But hey, now we learn ${word} together!`,
      (hero, vill, word) => `Almost! The secret word was ${word}. Let's practice and beat ${vill} next time!`,
      (hero, vill, word) => `${vill} won this round, but ${hero} never gives up! The word is ${word}.`,
    ],
    levelUp: [
      (level, unlocks) => `Level up! You are now level ${level}! ${unlocks}`,
      (level, unlocks) => `Whoo-hoo! Level ${level}! New heroes are waiting for you! ${unlocks}`,
      (level, unlocks) => `Fantastic! Level ${level} unlocked! ${unlocks} Keep collecting words!`,
    ],
    newWord: [
      (word) => `New word saved: ${word}! Your word book is growing!`,
      (word) => `${word} is in your collection now. Smart cookie!`,
    ],
  };

  function pickLine(arr, ...args) {
    if (!arr || !arr.length) return "";
    const line = arr[Math.floor(Math.random() * arr.length)];
    return typeof line === "function" ? line(...args) : line;
  }

  /** Core speech — must never throw (gameplay depends on callers continuing after speak) */
  function speak(text, opts) {
    opts = opts || {};
    if (!state.voice || !text || !window.speechSynthesis) return Promise.resolve();
    const say = () =>
      new Promise((resolve) => {
        try {
          const u = new SpeechSynthesisUtterance(String(text));
          u.lang = "en-US"; // force American English
          u.rate = opts.rate != null ? opts.rate : 1.06;
          u.pitch = opts.pitch != null ? opts.pitch : 1.12;
          u.volume = 1;
          if (!preferredVoice) refreshVoice();
          if (preferredVoice) {
            try {
              u.voice = preferredVoice;
              // Keep utterance lang aligned with chosen US voice
              if (preferredVoice.lang) u.lang = preferredVoice.lang;
            } catch (_) {
              /* ignore bad voice assignment */
            }
          }
          u.onend = () => resolve();
          u.onerror = () => resolve();
          window.speechSynthesis.speak(u);
        } catch (err) {
          console.warn("speak failed", err);
          resolve();
        }
      });
    try {
      if (!opts.append) {
        window.speechSynthesis.cancel();
        speakChain = say();
        return speakChain;
      }
      speakChain = speakChain.then(say);
      return speakChain;
    } catch (err) {
      console.warn("speak queue failed", err);
      return Promise.resolve();
    }
  }

  function speakLater(text, delayMs) {
    return new Promise((resolve) => {
      setTimeout(() => {
        speak(text, { append: true }).then(resolve);
      }, delayMs || 250);
    });
  }

  function speakPick(kind, ...args) {
    try {
      const factory = KID_LINES[kind];
      if (!factory) return speak(String(args[0] || ""));
      return speak(pickLine(factory, ...args));
    } catch (err) {
      console.warn("speakPick failed", err);
      return Promise.resolve();
    }
  }

  // ---------- FX ----------
  function spawnFX() {
    const layer = $("fx");
    if (!layer) return;
    const colors = ["#ff4fd8", "#3de7ff", "#ffd84d", "#7dff8a", "#a78bfa", "#ff6b6b"];
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("span");
      s.className = "spark spark-dot";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.background = colors[i % colors.length];
      s.style.setProperty("--dur", 6 + Math.random() * 8 + "s");
      s.style.setProperty("--delay", Math.random() * 4 + "s");
      layer.appendChild(s);
    }
  }

  // ---------- Screens ----------
  function showScreen(name) {
    document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
    const map = {
      home: "screen-home",
      game: "screen-game",
      result: "screen-result",
      summary: "screen-summary",
    };
    const el = $(map[name] || name);
    if (el) el.classList.add("active");
  }

  // ---------- Heroes ----------
  function heroesForWorld(world) {
    const list = world === "mix" ? HEROES.slice() : HEROES.filter((h) => h.world === world);
    return list.sort(
      (a, b) =>
        (a.unlockLevel || 1) - (b.unlockLevel || 1) ||
        (a.power || 0) - (b.power || 0) ||
        a.name.localeCompare(b.name)
    );
  }

  function setHeroById(id) {
    const h = HEROES.find((x) => x.id === id);
    if (!h) return false;
    if (!isHeroUnlocked(h)) {
      speak(`Hmm, ${h.name} is still locked. Spell more words to unlock them!`);
      return false;
    }
    state.hero = h;
    return true;
  }

  function updateLevelUI() {
    const lvl = playerLevel();
    const n = knownWordCount();
    const need = wordsToNextLevel();
    const pct = Math.round(progressInLevel() * 100);
    const label = $("level-label");
    const known = $("words-known-label");
    const fill = $("level-fill");
    const fill2 = $("energy-fill");
    const hint = $("level-hint");
    const energyHint = $("energy-hint");
    const energyLabel = $("energy-label");
    const energyNext = $("energy-next");
    if (label) label.textContent = `Level ${lvl}`;
    if (known) known.textContent = `${n} word${n === 1 ? "" : "s"} known`;
    if (fill) fill.style.width = pct + "%";
    if (fill2) fill2.style.width = pct + "%";
    if (energyLabel) energyLabel.textContent = `Level ${lvl} energy`;
    if (energyNext) {
      if (n >= WORDS_TO_MAX) energyNext.textContent = "COMPLETE · all unlocked!";
      else if (lvl >= MAX_LEVEL) energyNext.textContent = `${need} more to full clear (50)`;
      else energyNext.textContent = `${need} more word${need === 1 ? "" : "s"} → Lv ${lvl + 1}`;
    }
    const nextUnlocks = HEROES.filter((h) => h.unlockLevel === Math.min(MAX_LEVEL, lvl + 1))
      .sort((a, b) => (a.power || 0) - (b.power || 0))
      .map((h) => h.name);
    const who = nextUnlocks.length ? nextUnlocks.slice(0, 4).join(", ") : "new legends";
    let msg;
    if (n >= WORDS_TO_MAX) {
      msg = "Amazing! 50 words — Level 10 complete. Every character is unlocked this session!";
    } else if (lvl >= MAX_LEVEL) {
      msg = `You are Level 10! Spell ${need} more new word${need === 1 ? "" : "s"} to fully clear the energy bar (50 total).`;
    } else {
      msg = `Energy to Level ${lvl + 1}: ${need} new word${need === 1 ? "" : "s"} (5 per level). Next unlocks: ${who}. Refresh resets progress.`;
    }
    if (hint) hint.textContent = msg;
    if (energyHint) energyHint.textContent = msg;
  }

  function renderHeroPicker() {
    const grid = $("hero-picker");
    if (!grid) return;
    updateLevelUI();
    const list = heroesForWorld(state.world);
    // keep selected hero valid
    if (!list.some((h) => h.id === state.hero.id) || !isHeroUnlocked(state.hero)) {
      state.hero = firstUnlockedHero(state.world);
    }
    grid.innerHTML = list
      .map((h) => {
        const unlocked = isHeroUnlocked(h);
        const selected = h.id === state.hero.id && unlocked;
        return `
      <button type="button" class="char-card ${selected ? "selected" : ""} ${unlocked ? "" : "locked"}"
        data-id="${h.id}" role="radio" aria-checked="${selected}"
        ${unlocked ? "" : 'aria-disabled="true"'}>
        ${unlocked ? "" : `<span class="lock-badge">Lv ${h.unlockLevel}</span>`}
        <div class="face" data-face="${h.id}"></div>
        <span class="cname">${h.name}</span>
        <span class="crole">${h.role}</span>
        ${unlocked ? "" : `<span class="clock">Unlock at Level ${h.unlockLevel}</span>`}
      </button>`;
      })
      .join("");
    grid.querySelectorAll(".char-card").forEach((btn) => {
      const h = list.find((x) => x.id === btn.dataset.id);
      if (h) setImgEl(btn.querySelector(".face"), img(h.slug, h.name));
      btn.addEventListener("click", () => {
        if (!isHeroUnlocked(h)) {
          sfx("wrong");
          speak(
            `${h.name} is locked! Reach Level ${h.unlockLevel} by learning more words. You are Level ${playerLevel()} now.`
          );
          return;
        }
        if (!setHeroById(btn.dataset.id)) return;
        sfx("pop");
        renderHeroPicker();
        // Always say the character name first, then a fun line
        const n = state.hero.name;
        speak(`${n}!`, { rate: 1.08, pitch: 1.14 });
        speakLater(pickLine(KID_LINES.heroPick, n), 180);
      });
    });
  }

  function renderShelf() {
    const shelf = $("shelf");
    if (!shelf) return;
    updateLevelUI();
    const words = state.knownWords
      .slice()
      .sort((a, b) => String(a.word).localeCompare(String(b.word)));
    if (!words.length) {
      shelf.innerHTML = `<p class="word-list-empty">No words yet — win a round and your first word will appear here!</p>`;
      return;
    }
    // Simple text list — no images
    shelf.innerHTML =
      `<ol class="word-list">` +
      words
        .map((c) => {
          const times = c.count > 1 ? ` ×${c.count}` : "";
          const clue = c.clue ? ` — ${String(c.clue).replace(/</g, "")}` : "";
          return `<li><strong>${c.word}</strong><span class="wmeta">${times}${clue}</span></li>`;
        })
        .join("") +
      `</ol>` +
      `<p class="word-list-count">${words.length} word${words.length === 1 ? "" : "s"} in your book</p>`;
  }

  // ---------- Word list ----------
  function parseWordLines(text) {
    if (!text) return [];
    const out = [];
    const seen = new Set();
    String(text)
      .split(/\r?\n/)
      .forEach((line) => {
        line = line.trim();
        if (!line) return;
        let word = line;
        let clue = "";
        const dash = line.match(/^(.+?)\s+[-–—:]\s+(.+)$/);
        if (dash) {
          word = dash[1].trim();
          clue = dash[2].trim();
        }
        word = word.toUpperCase().replace(/[^A-Z' -]/g, "");
        if (word.length < 2 || word.length > 20) return;
        const key = word.replace(/\s+/g, " ");
        if (seen.has(key)) return;
        seen.add(key);
        out.push({
          word: key,
          clue: clue || "Spell this word!",
          emoji: "✏️",
          tier: state.difficulty,
          theme: "custom",
          custom: true,
        });
      });
    return out.slice(0, 1000);
  }

  function wordsToTextarea(words) {
    return words
      .map((w) => (w.clue && w.clue !== "Spell this word!" ? `${w.word} - ${w.clue}` : w.word))
      .join("\n");
  }

  function applyParsedWords(list, announce) {
    state.customWords = list;
    renderWordChips();
    if (announce) sfx("pop");
  }

  function renderWordChips() {
    const count = $("word-count");
    const chips = $("word-chips");
    const n = state.customWords.length;
    if (count) {
      count.textContent =
        n === 0
          ? "0 words ready (aim for 10–20)"
          : `${n} word${n === 1 ? "" : "s"} ready${n < 10 ? " (aim for 10–20)" : n > 50 ? " (nice long list!)" : ""}`;
    }
    if (!chips) return;
    chips.innerHTML = state.customWords
      .slice(0, 40)
      .map(
        (w) =>
          `<span class="chip">${w.word}${
            w.clue && w.clue !== "Spell this word!"
              ? `<span class="chip-clue"> — ${w.clue}</span>`
              : ""
          }</span>`
      )
      .join("");
    if (state.customWords.length > 40) {
      chips.innerHTML += `<span class="chip">+${state.customWords.length - 40} more</span>`;
    }
  }

  function setLessonMode(mode) {
    state.lessonMode = mode;
    const customBtn = $("mode-custom");
    const themeBtn = $("mode-theme");
    const panel = $("custom-words-panel");
    const note = $("theme-mode-note");
    if (customBtn) {
      customBtn.classList.toggle("on", mode === "custom");
      customBtn.setAttribute("aria-pressed", mode === "custom");
    }
    if (themeBtn) {
      themeBtn.classList.toggle("on", mode === "theme");
      themeBtn.setAttribute("aria-pressed", mode === "theme");
    }
    if (panel) panel.style.display = mode === "custom" ? "" : "none";
    if (note) note.style.display = mode === "theme" ? "" : "none";
  }

  function pickThemeWords() {
    const world = state.world === "mix" ? "mix" : state.world;
    let pool = (THEME_WORDS[world] || THEME_WORDS.mix).slice();
    if (state.world === "mix") {
      pool = [...THEME_WORDS.demon, ...THEME_WORDS.poke, ...THEME_WORDS.mix];
    }
    const tier = state.difficulty;
    let filtered = pool.filter((w) => w.tier <= tier);
    if (filtered.length < 6) filtered = pool.slice();
    // shuffle
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
    return filtered.slice(0, 12).map((w) => ({
      word: w.word.toUpperCase(),
      clue: w.clue,
      emoji: w.emoji || "✏️",
      tier: w.tier,
      theme: world,
      custom: false,
    }));
  }

  function beginLesson() {
    let queue = [];
    if (state.lessonMode === "custom") {
      if (!state.customWords.length) {
        // try parse current textarea
        const ta = $("word-input");
        if (ta) applyParsedWords(parseWordLines(ta.value), false);
      }
      if (!state.customWords.length) {
        alert("Add some words first (or tap ✨ Sample list), or switch to Theme Words.");
        return false;
      }
      queue = state.customWords.map((w) => ({ ...w }));
    } else {
      queue = pickThemeWords();
    }
    state.lessonQueue = queue;
    state.lessonIndex = 0;
    state.lessonResults = [];
    return true;
  }

  // ---------- Round / hangman ----------
  function lettersOf(word) {
    // Accept plain string or entry object { word }
    const raw = word && typeof word === "object" ? word.word : word;
    return String(raw || "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "");
  }

  function uniqueLetters(word) {
    return [...new Set(lettersOf(word).split(""))].filter(Boolean);
  }

  function currentAnswer() {
    if (!state.word) return "";
    return lettersOf(state.word.word || state.word);
  }

  function pickVillain() {
    let list =
      state.world === "poke"
        ? POKE_VILLAINS.slice()
        : state.world === "mix"
          ? DEMON_VILLAINS.concat(POKE_VILLAINS)
          : DEMON_VILLAINS.slice();
    // Prefer villains near the player's level (fair fight), fall back to full pool
    const pl = playerLevel();
    const near = list.filter((v) => {
      const p = v.power || 5;
      return p <= pl + 2 && p >= Math.max(1, pl - 3);
    });
    if (near.length) list = near;
    // Don't fight as yourself if player chose a villain
    list = list.filter((v) => v.id !== state.hero.id);
    if (!list.length) {
      list =
        state.world === "poke"
          ? POKE_VILLAINS.slice()
          : state.world === "demon"
            ? DEMON_VILLAINS.slice()
            : DEMON_VILLAINS.concat(POKE_VILLAINS);
    }
    return list[Math.floor(Math.random() * list.length)];
  }

  function startRound() {
    if (!state.lessonQueue.length || state.lessonIndex >= state.lessonQueue.length) {
      showLessonSummary();
      return;
    }
    const entry = state.lessonQueue[state.lessonIndex];
    const d = DIFF[state.difficulty];
    state.word = entry;
    state.guessed = new Set();
    state.wrong = 0;
    state.lives = d.lives;
    state.hintsLeft = d.letterHints;
    state.over = false;
    state.villain = pickVillain();

    if (d.freeFirst) {
      const first = lettersOf(entry.word)[0];
      if (first) state.guessed.add(first);
    }

    showScreen("game");
    updateGameChrome();
    renderWordRow();
    renderKeyboard();
    updateStage();
    updateHearts();

    const hero = state.hero.name;
    const vill = state.villain.name;
    const n = state.lessonIndex + 1;
    const total = state.lessonQueue.length;
    speakPick("roundStart", hero, vill, n, total);
    if (d.voiceHint) {
      speakLater(`Here's a clue: ${entry.clue}`, 300);
    } else {
      speakLater("Find the hidden letters!", 300);
    }
  }

  function updateGameChrome() {
    const banner = $("theme-banner");
    if (banner) {
      banner.textContent =
        state.world === "poke"
          ? "Poké Quest"
          : state.world === "mix"
            ? "Mix World"
            : "Demon Hunters";
    }
    const prog = $("lesson-progress");
    if (prog) {
      prog.hidden = false;
      prog.textContent = `${state.lessonIndex + 1} / ${state.lessonQueue.length}`;
    }
    const heroSprite = $("hero-sprite");
    const heroName = $("hero-name");
    if (heroName) heroName.textContent = state.hero.name;
    if (heroSprite) setImgEl(heroSprite, img(state.hero.slug, state.hero.name));

    const villainEl = $("villain");
    const villainName = $("villain-name");
    if (villainName) villainName.textContent = state.villain.name;
    if (villainEl) setImgEl(villainEl, img(state.villain.slug, state.villain.name));

    const stage = $("stage");
    if (stage) {
      stage.classList.toggle("demon", state.world !== "poke");
      stage.classList.toggle("poke", state.world === "poke");
    }
    const ball = $("pokeball");
    if (ball) ball.hidden = state.world !== "poke";

    const hintPic = $("hint-pic");
    const hintClue = $("hint-clue");
    if (hintClue) hintClue.textContent = state.word.clue || "Guess the word!";
    if (hintPic) {
      // Show hero portrait for custom words; villain art for theme rounds
      const slug = state.word.custom ? state.hero.slug : state.villain.slug;
      const name = state.word.custom ? state.hero.name : state.villain.name;
      setImgEl(hintPic, img(slug, name));
    }
    const hintBtn = $("btn-hint");
    if (hintBtn) hintBtn.title = `Hint (${state.hintsLeft} left)`;
  }

  function updateHearts() {
    const el = $("hearts");
    if (!el) return;
    const max = DIFF[state.difficulty].lives;
    let html = "";
    for (let i = 0; i < max; i++) {
      html += `<span class="heart ${i < state.lives ? "filled" : "empty"}" aria-hidden="true"></span>`;
    }
    el.setAttribute("aria-label", `${state.lives} lives remaining`);
    el.innerHTML = html;
  }

  function updateStage(opts) {
    opts = opts || {};
    const maxWrong = DIFF[state.difficulty].lives;
    const ratio = Math.min(1, state.wrong / Math.max(1, maxWrong));
    const meter = $("meter");
    if (meter) meter.style.width = Math.max(0, (1 - ratio) * 100) + "%";

    // CSS uses --villain-x on .villain-side (left: var(--villain-x))
    // Walk from far left (~4%) toward the hero on the right (~68%)
    const pct = 4 + ratio * 64;
    const wrap = $("villain-wrap");
    if (wrap) {
      wrap.style.setProperty("--villain-x", pct + "%");
      wrap.style.left = pct + "%";
      if (opts.step) {
        wrap.classList.remove("villain-step");
        // reflow to restart CSS animation
        void wrap.offsetWidth;
        wrap.classList.add("villain-step");
      }
    }

    // Step track dots
    const track = $("step-track");
    if (track) {
      const steps = maxWrong;
      let html = "";
      for (let i = 0; i < steps; i++) {
        const filled = i < state.wrong;
        const safe = i >= state.wrong;
        html += `<span class="step-dot ${filled ? "danger" : "safe"}"></span>`;
      }
      track.innerHTML = html;
    }

    const stage = $("stage");
    if (stage) {
      stage.classList.toggle("danger", ratio >= 0.5);
      stage.classList.toggle("danger-close", ratio >= 0.75);
    }
    const villain = $("villain");
    if (villain) {
      villain.classList.toggle("danger", ratio >= 0.5);
    }
    const heroSide = $("hero-wrap");
    if (heroSide) heroSide.classList.toggle("scared", ratio >= 0.75);

    const vName = state.villain ? state.villain.name : "the villain";
    const hName = state.hero ? state.hero.name : "you";
    const caption = $("stage-caption");
    if (caption) {
      if (state.over) {
        caption.textContent =
          state.lives > 0
            ? `${hName} saved the stage from ${vName}!`
            : `${vName} got too close — practice that word!`;
      } else if (ratio >= 0.75) {
        caption.textContent = `${vName} is almost at ${hName}! Think carefully!`;
      } else if (ratio >= 0.4) {
        caption.textContent = `${vName} is walking closer to ${hName}…`;
      } else {
        caption.textContent = `Wrong letter = ${vName} takes one step toward ${hName}!`;
      }
    }
  }

  function renderWordRow() {
    const row = $("word-row");
    if (!row || !state.word) return;
    const w = String(state.word.word || "").toUpperCase();
    row.innerHTML = "";
    for (const ch of w) {
      const tile = document.createElement("div");
      if (ch === " ") {
        tile.className = "tile space";
        tile.textContent = "";
      } else if (/[^A-Z]/.test(ch)) {
        tile.className = "tile revealed";
        tile.textContent = ch;
      } else {
        const show = state.guessed.has(ch);
        tile.className = "tile" + (show ? " revealed" : "");
        tile.textContent = show ? ch : "";
      }
      row.appendChild(tile);
    }
  }

  function buildKeyboard() {
    renderKeyboard();
  }

  function renderKeyboard() {
    const kb = $("keyboard");
    if (!kb) return;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    kb.innerHTML = letters
      .map((L) => {
        let cls = "key";
        if (state.guessed && state.guessed.has(L)) {
          cls += lettersOf(state.word?.word || "").includes(L) ? " correct" : " wrong";
        }
        const disabled = state.guessed && state.guessed.has(L) ? "disabled" : "";
        return `<button type="button" class="${cls}" data-letter="${L}" ${disabled}>${L}</button>`;
      })
      .join("");
    kb.querySelectorAll(".key").forEach((btn) => {
      btn.addEventListener("click", () => guess(btn.dataset.letter));
    });
  }

  function guess(letter) {
    try {
      if (!letter || state.over || !state.word) return;
      letter = String(letter).toUpperCase();
      if (!/^[A-Z]$/.test(letter)) return;
      if (state.guessed.has(letter)) return;

      const target = currentAnswer();
      if (!target) return;

      state.guessed.add(letter);
      const vName = (state.villain && state.villain.name) || "the villain";
      const hName = (state.hero && state.hero.name) || "hero";
      const isHit = target.includes(letter);

      // Always update tiles first — never block gameplay on speech
      if (isHit) {
        sfx("correct");
        renderWordRow();
        renderKeyboard();
        const won = uniqueLetters(target).every((L) => state.guessed.has(L));
        if (won) {
          endRound(true);
        } else {
          speakPick("correct", letter);
        }
      } else {
        sfx("wrong");
        state.wrong++;
        state.lives = Math.max(0, state.lives - 1);
        updateHearts();
        updateStage({ step: true });
        renderKeyboard();
        if (state.lives <= 0) {
          endRound(false);
        } else {
          speakPick("wrong", letter, vName, hName, state.lives);
        }
      }
    } catch (err) {
      console.error("guess failed", err);
    }
  }

  function useHint() {
    if (state.over || !state.word || state.hintsLeft <= 0) {
      sfx("wrong");
      return;
    }
    const missing = uniqueLetters(state.word.word).filter((L) => !state.guessed.has(L));
    if (!missing.length) return;
    const pick = missing[Math.floor(Math.random() * missing.length)];
    state.hintsLeft--;
    const hintBtn = $("btn-hint");
    if (hintBtn) hintBtn.title = `Hint (${state.hintsLeft} left)`;
    sfx("pop");
    speak(pick);
    guess(pick);
  }

  function endRound(won) {
    state.over = true;
    // reveal all
    uniqueLetters(state.word.word).forEach((L) => state.guessed.add(L));
    renderWordRow();
    renderKeyboard();
    updateStage();

    state.lessonResults.push({
      word: state.word.word,
      clue: state.word.clue,
      emoji: state.word.emoji,
      won,
    });

    if (won) {
      sfx("win");
      fireConfetti();
      const reward = rememberWord(state.word);
      renderShelf();
      if (reward.leveled) {
        const lvl = reward.level;
        const unlocked = HEROES.filter((h) => h.unlockLevel === lvl).map((h) => h.name);
        const unlockMsg = unlocked.length
          ? `You unlocked ${unlocked.join(", ")}!`
          : "New adventures await!";
        setTimeout(() => speakPick("levelUp", lvl, unlockMsg), 1600);
        state.lastLevel = lvl;
      } else if (reward.newWord) {
        setTimeout(() => speakPick("newWord", state.word.word), 1500);
      }
    } else {
      sfx("wrong");
    }

    const title = $("result-title");
    const line = $("result-line");
    const stars = $("result-stars");
    const wordEl = $("result-word");
    const pic = $("result-pic");
    const spell = $("spell-out");
    const nextBtn = $("btn-next");
    const hName = state.hero.name;
    const vName = state.villain.name;

    if (title) title.textContent = won ? `${hName} wins!` : `Learn it, ${hName}!`;
    if (line) {
      line.textContent = won
        ? `Great spelling, ${hName}! "${state.word.word}" is in your word book now.`
        : `The word was ${state.word.word}. ${vName} got close — practice and try again!`;
    }
    if (stars) {
      const max = DIFF[state.difficulty].lives;
      const left = state.lives;
      stars.textContent =
        !won ? "···" : left >= max - 1 ? "★★★" : left >= max / 2 ? "★★☆" : "★☆☆";
    }
    if (wordEl) wordEl.textContent = state.word.word;
    if (pic) {
      if (won) setImgEl(pic, img(state.hero.slug, state.hero.name));
      else setImgEl(pic, img(state.villain.slug, state.villain.name));
    }
    if (spell) {
      const letters = lettersOf(state.word.word).split("");
      spell.innerHTML = letters.map((L) => `<span class="tile revealed">${L}</span>`).join("");
    }
    if (nextBtn) {
      const last = state.lessonIndex + 1 >= state.lessonQueue.length;
      nextBtn.textContent = last ? "Finish lesson ▶" : "Next word ▶";
    }

    showScreen("result");
    if (won) {
      speakPick("win", hName, vName, state.word.word);
      speakLater(state.word.word.toLowerCase().split("").join(" "), 400);
    } else {
      speakPick("lose", hName, vName, state.word.word);
      speakLater(state.word.word.toLowerCase().split("").join(" "), 500);
    }
  }

  function goNextLessonWord() {
    state.lessonIndex++;
    if (state.lessonIndex >= state.lessonQueue.length) {
      // custom list clears after lesson ends (README)
      if (state.lessonMode === "custom") {
        state.customWords = [];
        const ta = $("word-input");
        if (ta) ta.value = "";
        renderWordChips();
      }
      showLessonSummary();
    } else {
      startRound();
    }
  }

  function showLessonSummary() {
    const results = state.lessonResults;
    const total = results.length;
    const wins = results.filter((r) => r.won).length;
    if ($("summary-line")) {
      $("summary-line").textContent =
        total === 0
          ? "No words practiced yet."
          : `You practiced ${total} word${total === 1 ? "" : "s"} — spelled ${wins} correctly. Review them below!`;
    }
    const ratio = total ? wins / total : 0;
    if ($("summary-stars")) {
      $("summary-stars").textContent =
        ratio >= 0.9 ? "★★★" : ratio >= 0.6 ? "★★☆" : ratio > 0 ? "★☆☆" : "···";
    }

    const list = $("summary-list");
    if (list) {
      list.innerHTML = results
        .map(
          (r, i) => `
      <div class="summary-item">
        <span class="sw">${r.word}</span>
        <span class="${r.won ? "sok" : "smiss"}">${r.won ? "correct" : "learn"}</span>
        <button type="button" data-hear="${i}" aria-label="Hear ${r.word}">Hear</button>
      </div>`
        )
        .join("");
      list.querySelectorAll("button[data-hear]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const r = results[+btn.dataset.hear];
          if (r) {
            speak(r.word, { interrupt: true });
            speakLater(r.word.toLowerCase().split("").join(" "), 200);
          }
        });
      });
    }

    const missed = results.filter((r) => !r.won);
    const retryBtn = $("btn-summary-retry");
    if (retryBtn) {
      retryBtn.style.display = missed.length ? "" : "none";
      retryBtn.onclick = () => {
        state.lessonQueue = missed.map((r) => ({
          word: r.word,
          clue: r.clue,
          emoji: r.emoji,
          tier: state.difficulty,
          theme: "custom",
          custom: true,
        }));
        state.lessonIndex = 0;
        state.lessonResults = [];
        sfx("pop");
        startRound();
      };
    }

    showScreen("summary");
    speak(
      `Lesson complete, ${state.hero.name}! You spelled ${wins} out of ${total} words. Your word book has ${knownWordCount()} words. You are Level ${playerLevel()}!`
    );
    updateLevelUI();
    renderShelf();
  }

  // ---------- Confetti ----------
  function fireConfetti() {
    const c = $("confetti");
    if (!c || !c.getContext) return;
    const ctx2 = c.getContext("2d");
    c.width = innerWidth;
    c.height = innerHeight;
    const bits = Array.from({ length: 80 }, () => ({
      x: Math.random() * c.width,
      y: -20 - Math.random() * 100,
      r: 4 + Math.random() * 6,
      vy: 2 + Math.random() * 4,
      vx: -2 + Math.random() * 4,
      color: ["#ff4fd8", "#3de7ff", "#ffd84d", "#7dff8a", "#ff6b6b", "#a78bfa"][
        Math.floor(Math.random() * 6)
      ],
      a: Math.random() * Math.PI,
    }));
    let frames = 0;
    function frame() {
      frames++;
      ctx2.clearRect(0, 0, c.width, c.height);
      bits.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.a += 0.1;
        ctx2.save();
        ctx2.translate(b.x, b.y);
        ctx2.rotate(b.a);
        ctx2.fillStyle = b.color;
        ctx2.fillRect(-b.r, -b.r / 2, b.r * 2, b.r);
        ctx2.restore();
      });
      if (frames < 90) requestAnimationFrame(frame);
      else ctx2.clearRect(0, 0, c.width, c.height);
    }
    requestAnimationFrame(frame);
  }

  // ---------- Physical keyboard ----------
  window.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const game = $("screen-game");
    if (!game || !game.classList.contains("active")) return;
    const ch = e.key.toUpperCase();
    if (/^[A-Z]$/.test(ch)) guess(ch);
  });

  // ---------- Home bindings ----------
  function setupHome() {
    document.querySelectorAll(".world-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".world-card").forEach((b) => {
          b.classList.remove("selected");
          b.setAttribute("aria-checked", "false");
        });
        btn.classList.add("selected");
        btn.setAttribute("aria-checked", "true");
        state.world = btn.dataset.world;
        sfx("pop");
        if (state.world === "poke") {
          const list = heroesForWorld("poke");
          if (!list.some((h) => h.id === state.hero.id) || state.hero.role === "Buddy") {
            if (state.hero.world !== "poke") setHeroById("trainer");
          }
        } else if (state.world === "demon" && state.hero.world !== "demon") {
          setHeroById("rumi");
        }
        renderHeroPicker();
        const worldName =
          state.world === "poke"
            ? "Poké Quest"
            : state.world === "mix"
              ? "Mix World"
              : "Demon Hunters";
        if (
          !isHeroUnlocked(state.hero) ||
          (state.world !== "mix" && state.hero.world !== state.world)
        ) {
          state.hero = firstUnlockedHero(state.world);
        }
        renderHeroPicker();
        speak(`${worldName}!`, { rate: 1.08, pitch: 1.12 });
        speakLater(pickLine(KID_LINES.worldPick, worldName, state.hero.name), 200);
      });
    });

    const range = $("diff");
    const labels = document.querySelectorAll(".diff-labels span");
    function setDiff(v) {
      state.difficulty = +v;
      if (range) range.value = v;
      labels.forEach((l) => l.classList.toggle("on", +l.dataset.diff === +v));
      if ($("diff-help")) $("diff-help").textContent = DIFF[v].help;
    }
    if (range) range.addEventListener("input", () => setDiff(range.value));
    labels.forEach((l) => l.addEventListener("click", () => setDiff(l.dataset.diff)));

    if ($("tog-sound")) {
      $("tog-sound").addEventListener("click", function () {
        state.sound = !state.sound;
        this.classList.toggle("on", state.sound);
        this.setAttribute("aria-pressed", state.sound);
        this.textContent = state.sound ? "🔊 Sound On" : "🔇 Sound Off";
        if (state.sound) sfx("pop");
      });
    }
    if ($("tog-voice")) {
      $("tog-voice").addEventListener("click", function () {
        state.voice = !state.voice;
        this.classList.toggle("on", state.voice);
        this.setAttribute("aria-pressed", state.voice);
        this.textContent = state.voice ? "🗣️ Voice On" : "🤐 Voice Off";
        if (state.voice) speak("Voice on");
      });
    }

    if ($("mode-custom")) {
      $("mode-custom").addEventListener("click", () => {
        setLessonMode("custom");
        sfx("pop");
      });
    }
    if ($("mode-theme")) {
      $("mode-theme").addEventListener("click", () => {
        setLessonMode("theme");
        sfx("pop");
      });
    }
    if ($("btn-parse-words")) {
      $("btn-parse-words").addEventListener("click", () => {
        const list = parseWordLines($("word-input").value);
        applyParsedWords(list, true);
      });
    }
    if ($("btn-sample-words")) {
      $("btn-sample-words").addEventListener("click", () => {
        const list = sampleFromBank(15);
        const lines = list.map((w) =>
          w.clue && w.clue !== "Spell this word!" ? `${w.word} - ${w.clue}` : w.word
        );
        if ($("word-input")) $("word-input").value = lines.join("\n");
        applyParsedWords(list, true);
        speak(`Here are fifteen fun words for you! Ready when you are!`);
      });
    }
    if ($("btn-clear-words")) {
      $("btn-clear-words").addEventListener("click", () => {
        $("word-input").value = "";
        applyParsedWords([], false);
        sfx("pop");
      });
    }
    if ($("word-input")) {
      let t = null;
      $("word-input").addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => {
          applyParsedWords(parseWordLines($("word-input").value), false);
        }, 250);
      });
      if (state.customWords.length) {
        $("word-input").value = wordsToTextarea(state.customWords);
      }
    }

    if ($("btn-play")) {
      $("btn-play").addEventListener("click", () => {
        sfx("pop");
        if (!beginLesson()) return;
        startRound();
      });
    }

    setLessonMode("custom");
    renderWordChips();
    renderHeroPicker();
    renderShelf();
  }

  function setupGameControls() {
    if ($("btn-home")) {
      $("btn-home").addEventListener("click", () => {
        state.lessonQueue = [];
        showScreen("home");
        renderShelf();
        renderWordChips();
      });
    }
    if ($("btn-result-home")) {
      $("btn-result-home").addEventListener("click", () => {
        state.lessonQueue = [];
        showScreen("home");
        renderShelf();
        renderWordChips();
      });
    }
    if ($("btn-again")) {
      $("btn-again").addEventListener("click", () => {
        if (state.lessonResults.length && state.lessonQueue.length) {
          state.lessonResults.pop();
        }
        startRound();
      });
    }
    if ($("btn-next")) {
      $("btn-next").addEventListener("click", () => goNextLessonWord());
    }
    if ($("btn-hear-word")) {
      $("btn-hear-word").addEventListener("click", () => {
        if (!state.word) return;
        speak(state.word.word);
        const letters = state.word.word.replace(/[^A-Za-z]/g, "");
        if (letters.length) {
          setTimeout(() => speak(letters.toLowerCase().split("").join(" ")), 600);
        }
        sfx("pop");
      });
    }
    if ($("btn-speak")) {
      $("btn-speak").addEventListener("click", () => {
        if (!state.word) return;
        const d = DIFF[state.difficulty];
        if (d.voiceHint || state.difficulty === 0) {
          speak(state.word.clue);
          setTimeout(() => speak(state.word.word.toLowerCase()), 800);
        } else {
          speak(state.word.clue);
        }
        sfx("pop");
      });
    }
    if ($("btn-hint")) {
      $("btn-hint").addEventListener("click", useHint);
    }
    if ($("btn-summary-home")) {
      $("btn-summary-home").addEventListener("click", () => {
        state.lessonQueue = [];
        showScreen("home");
        renderShelf();
        renderWordChips();
      });
    }
    if ($("btn-summary-again")) {
      $("btn-summary-again").addEventListener("click", () => {
        if (!beginLesson()) return;
        sfx("pop");
        startRound();
      });
    }
  }

  // Browsers often block speech until a user gesture — unlock on first tap
  function unlockAudioAndVoice() {
    try {
      ensureAudio();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        // warm up voices list
        refreshVoice();
      }
    } catch (_) {}
  }
  document.addEventListener("pointerdown", unlockAudioAndVoice, { once: true });
  document.addEventListener("keydown", unlockAudioAndVoice, { once: true });

  // ---------- Boot ----------
  function boot() {
    try {
      spawnFX();
      setupHome();
      setupGameControls();
      buildKeyboard();
      // restore world selection UI
      document.querySelectorAll(".world-card").forEach((btn) => {
        const on = btn.dataset.world === state.world;
        btn.classList.toggle("selected", on);
        btn.setAttribute("aria-checked", on ? "true" : "false");
      });
      updateLevelUI();
      renderHeroPicker();
      renderShelf();
      showScreen("home");
      setTimeout(() => {
        if (state.voice) {
          speak(
            `Welcome back, super speller! You are Level ${playerLevel()} with ${knownWordCount()} words. Pick a hero and let's play!`
          );
        }
      }, 500);
    } catch (err) {
      console.error("Word Hunters failed to load", err);
      alert("Could not load game: " + (err && err.message ? err.message : err));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
