"use strict";

  // ---------- Villain art loader ----------

  // Image resolver: local images/ → embedded JS → PokeAPI CDN → emoji
  const POKE_IDS = {
    "arceus": 493, "mewtwo": 150, "giratina": 487, "dialga": 483, "palkia": 484,
    "rayquaza": 384, "eternatus": 890, "necrozma": 800, "ultra-necrozma": 10157,
    "groudon": 383, "kyogre": 382,
    "pikachu": 25, "pika": 25, "eevee": 133, "charmander": 4, "squirtle": 7,
    "bulbasaur": 1, "jigglypuff": 39, "snorlax": 143, "psyduck": 54, "sylveon": 700,
    "lucario": 448, "charizard": 6, "gengar": 94, "lapras": 131, "mew": 151,
    "meowth": 52, "pichu": 172, "espeon": 196, "umbreon": 197
  };
  const EMBEDDED_IMAGES = window.EMBEDDED_IMAGES || {};
  const CDN = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

  function artCandidates(slug) {
    if (!slug) return [];
    const out = [];
    // Local drop-in portraits (preferred)
    out.push("images/" + slug + ".png");
    // Aliases
    if (slug === "pika" || slug === "pikachu") {
      out.push("images/pikachu.png", "images/pika.png");
    }
    if (slug === "trainer") {
      out.push("images/trainer.png", "images/trainer_red.png");
    }
    if (slug === "trainer_ash") out.push("images/trainer_ash.png", "images/trainer.png");
    // Offline embed packs (if present)
    if (EMBEDDED_IMAGES[slug]) out.push(EMBEDDED_IMAGES[slug]);
    // PokeAPI official artwork CDN for species
    if (POKE_IDS[slug] != null) out.push(CDN + POKE_IDS[slug] + ".png");
    return out;
  }

  // ---------- Avatar helper: real images with emoji fallback ----------
  function img(slug, emoji) {
    const candidates = artCandidates(slug);
    return { slug, emoji: emoji || "✨", src: candidates[0] || null, candidates };
  }

  function setImgEl(el, a) {
    if (!el) return;
    if (!a) { el.textContent = "✨"; return; }
    const list = (a.candidates || (a.src ? [a.src] : [])).filter(Boolean);
    let i = 0;
    // Show emoji immediately, swap in real art when it loads
    el.innerHTML = `<span class="emoji-face" style="font-size:inherit">${a.emoji || "✨"}</span>`;
    function tryNext() {
      if (i >= list.length) return; // keep emoji
      const src = list[i++];
      const im = new Image();
      im.alt = a.slug || a.emoji || "character";
      im.onload = () => {
        el.innerHTML = "";
        im.style.width = "100%";
        im.style.height = "100%";
        im.style.objectFit = "contain";
        im.style.objectPosition = "center top";
        el.appendChild(im);
      };
      im.onerror = tryNext;
      im.src = src;
    }
    tryNext();
  }

  /** Build an <img> that falls back to emoji if the file is missing */
  function portraitHTML(slug, emoji, alt) {
    const src = "images/" + slug + ".png";
    const e = emoji || "✨";
    const a = alt || slug;
    return `<img src="${src}" alt="${a}" draggable="false"
      onerror="this.style.display='none';const s=this.nextElementSibling;if(s)s.style.display='grid';" />
      <span class="emoji-face" style="display:none">${e}</span>`;
  }

