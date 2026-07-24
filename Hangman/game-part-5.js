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
        }
        renderHeroPicker();
      });
    });

    const range = $("diff");
    const labels = document.querySelectorAll(".diff-labels span");
    function setDiff(v) {
      state.difficulty = +v;
      range.value = v;
      labels.forEach((l) => l.classList.toggle("on", +l.dataset.diff === +v));
      $("diff-help").textContent = DIFF[v].help;
    }
    range.addEventListener("input", () => setDiff(range.value));
    labels.forEach((l) => l.addEventListener("click", () => setDiff(l.dataset.diff)));

    $("tog-sound").addEventListener("click", function () {
      state.sound = !state.sound;
      this.classList.toggle("on", state.sound);
      this.setAttribute("aria-pressed", state.sound);
      this.textContent = state.sound ? "🔊 Sound On" : "🔇 Sound Off";
      if (state.sound) sfx("pop");
    });
    $("tog-voice").addEventListener("click", function () {
      state.voice = !state.voice;
      this.classList.toggle("on", state.voice);
      this.setAttribute("aria-pressed", state.voice);
      this.textContent = state.voice ? "🗣️ Voice On" : "🤐 Voice Off";
      if (state.voice) speak("Voice on");
    });

    if ($("mode-custom")) {
      $("mode-custom").addEventListener("click", () => { setLessonMode("custom"); sfx("pop"); });
    }
    if ($("mode-theme")) {
      $("mode-theme").addEventListener("click", () => { setLessonMode("theme"); sfx("pop"); });
    }
    if ($("btn-parse-words")) {
      $("btn-parse-words").addEventListener("click", () => {
        const list = parseWordLines($("word-input").value);
        applyParsedWords(list, true);
      });
    }
    if ($("btn-sample-words")) {
      $("btn-sample-words").addEventListener("click", () => {
        $("word-input").value = SAMPLE_WORDS.join("\n");
        applyParsedWords(parseWordLines(SAMPLE_WORDS.join("\n")), true);
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

    $("btn-play").addEventListener("click", () => {
      sfx("pop");
      if (!beginLesson()) return;
      startRound();
    });

    setLessonMode("custom");
    renderWordChips();
    renderHeroPicker();
    renderShelf();
  }

