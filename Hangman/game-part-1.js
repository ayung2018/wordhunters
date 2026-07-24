  // ---------- Characters (player picks ONE hero; game picks a villain) ----------
  const HEROES = [
    // HUNTR/X — best for kids to "be"
    { id: "rumi", name: "Rumi", emoji: "💜", role: "HUNTR/X", world: "demon", slug: "rumi", color: "#c084fc" },
    { id: "mira", name: "Mira", emoji: "💗", role: "HUNTR/X", world: "demon", slug: "mira", color: "#f472b6" },
    { id: "zoey", name: "Zoey", emoji: "💙", role: "HUNTR/X", world: "demon", slug: "zoey", color: "#60a5fa" },
    // Friendly helpers
    { id: "celine", name: "Celine", emoji: "🌙", role: "Helper", world: "demon", slug: "celine", color: "#a78bfa" },
    { id: "bobby", name: "Bobby", emoji: "🎧", role: "Helper", world: "demon", slug: "bobby", color: "#34d399" },
    { id: "han", name: "Healer Han", emoji: "🩺", role: "Helper", world: "demon", slug: "han", color: "#67e8f9" },

    // Saja Boys — all members (playable like Pokémon buddies)
    { id: "jinu", name: "Jinu", emoji: "🦊", role: "Saja Boys", world: "demon", slug: "jinu", color: "#a78bfa" },
    { id: "baby", name: "Baby Saja", emoji: "🍼", role: "Saja Boys", world: "demon", slug: "baby", color: "#f9a8d4" },
    { id: "romance", name: "Romance", emoji: "💕", role: "Saja Boys", world: "demon", slug: "romance", color: "#fb7185" },
    { id: "abby", name: "Abby Saja", emoji: "😎", role: "Saja Boys", world: "demon", slug: "abby", color: "#38bdf8" },
    { id: "mystery", name: "Mystery", emoji: "🎭", role: "Saja Boys", world: "demon", slug: "mystery", color: "#c4b5fd" },
    // Big demon + cute pets
    { id: "gwima", name: "Gwi-Ma", emoji: "😈", role: "Demon", world: "demon", slug: "gwima", color: "#f87171" },
    { id: "derpy", name: "Derpy", emoji: "🐯", role: "Pet", world: "demon", slug: "derpy", color: "#fde047" },
    { id: "sussie", name: "Sussie", emoji: "🐦", role: "Pet", world: "demon", slug: "sussie", color: "#86efac" },

    // Poké Quest — TRAINERS first (main characters kids can be)
    { id: "trainer", name: "Red", emoji: "🧢", role: "Trainer", world: "poke", slug: "trainer", color: "#ef4444" },
    { id: "ash", name: "Ash", emoji: "🧢", role: "Trainer", world: "poke", slug: "trainer_ash", color: "#3b82f6" },
    { id: "may", name: "May", emoji: "🎀", role: "Trainer", world: "poke", slug: "trainer_may", color: "#f472b6" },
    { id: "serena", name: "Serena", emoji: "🎀", role: "Trainer", world: "poke", slug: "trainer_serena", color: "#f9a8d4" },
    { id: "dawn", name: "Dawn", emoji: "❄️", role: "Trainer", world: "poke", slug: "trainer_dawn", color: "#93c5fd" },
    { id: "hilda", name: "Hilda", emoji: "⭐", role: "Trainer", world: "poke", slug: "trainer_hilda", color: "#fb7185" },
    { id: "gloria", name: "Gloria", emoji: "🎩", role: "Trainer", world: "poke", slug: "trainer_gloria", color: "#a3e635" },
    { id: "brendan", name: "Brendan", emoji: "🧢", role: "Trainer", world: "poke", slug: "trainer_brendan", color: "#38bdf8" },
    { id: "victor", name: "Victor", emoji: "🧢", role: "Trainer", world: "poke", slug: "trainer_victor", color: "#fbbf24" },

    // Poké Quest — buddy Pokémon (cute / fan favorites)
    { id: "pikachu", name: "Pikachu", emoji: "⚡", role: "Buddy", world: "poke", slug: "pikachu", color: "#facc15" },
    { id: "eevee", name: "Eevee", emoji: "🦊", role: "Buddy", world: "poke", slug: "eevee", color: "#d6b28c" },
    { id: "charmander", name: "Charmander", emoji: "🔥", role: "Buddy", world: "poke", slug: "charmander", color: "#fb923c" },
    { id: "squirtle", name: "Squirtle", emoji: "💧", role: "Buddy", world: "poke", slug: "squirtle", color: "#38bdf8" },
    { id: "bulbasaur", name: "Bulbasaur", emoji: "🌱", role: "Buddy", world: "poke", slug: "bulbasaur", color: "#4ade80" },
    { id: "jigglypuff", name: "Jigglypuff", emoji: "🎤", role: "Buddy", world: "poke", slug: "jigglypuff", color: "#f9a8d4" },
    { id: "snorlax", name: "Snorlax", emoji: "😴", role: "Buddy", world: "poke", slug: "snorlax", color: "#67e8f9" },
    { id: "psyduck", name: "Psyduck", emoji: "🦆", role: "Buddy", world: "poke", slug: "psyduck", color: "#fde047" },
    { id: "sylveon", name: "Sylveon", emoji: "🎀", role: "Buddy", world: "poke", slug: "sylveon", color: "#fda4af" },
    { id: "lucario", name: "Lucario", emoji: "🥋", role: "Buddy", world: "poke", slug: "lucario", color: "#60a5fa" },
    { id: "mew", name: "Mew", emoji: "✨", role: "Buddy", world: "poke", slug: "mew", color: "#f0abfc" },
    { id: "lapras", name: "Lapras", emoji: "🌊", role: "Buddy", world: "poke", slug: "lapras", color: "#7dd3fc" },
    { id: "pichu", name: "Pichu", emoji: "⚡", role: "Buddy", world: "poke", slug: "pichu", color: "#fef08a" },
  ];

  // Villains for the stage (each Saja Boy can creep closer individually)
  const DEMON_VILLAINS = [
    { id: "gwima", name: "Gwi-Ma", emoji: "😈", slug: "gwima" },
    { id: "jinu", name: "Jinu", emoji: "🦊", slug: "jinu" },
    { id: "baby", name: "Baby Saja", emoji: "🍼", slug: "baby" },
    { id: "romance", name: "Romance", emoji: "💕", slug: "romance" },
    { id: "abby", name: "Abby Saja", emoji: "😎", slug: "abby" },
    { id: "mystery", name: "Mystery", emoji: "🎭", slug: "mystery" },
    { id: "saja", name: "Saja Boys", emoji: "🕶️", slug: "saja" },
  ];

  // Top-tier legendary villains with real artwork
  const POKE_VILLAINS = [
    { id: "arceus", name: "Arceus", emoji: "✨", slug: "arceus" },
    { id: "mewtwo", name: "Mewtwo", emoji: "🧬", slug: "mewtwo" },
    { id: "giratina", name: "Giratina", emoji: "👻", slug: "giratina" },
    { id: "dialga", name: "Dialga", emoji: "⏱️", slug: "dialga" },
    { id: "palkia", name: "Palkia", emoji: "🌌", slug: "palkia" },
    { id: "rayquaza", name: "Rayquaza", emoji: "🐉", slug: "rayquaza" },
    { id: "eternatus", name: "Eternatus", emoji: "☢️", slug: "eternatus" },
    { id: "ultra-necrozma", name: "Ultra Necrozma", emoji: "💡", slug: "ultra-necrozma" },
    { id: "groudon", name: "Groudon", emoji: "🌋", slug: "groudon" },
    { id: "kyogre", name: "Kyogre", emoji: "🌊", slug: "kyogre" },
  ];
