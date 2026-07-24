  // ---------- Confetti ----------
  function fireConfetti() {
    const c = $("confetti");
    const ctx2 = c.getContext("2d");
    c.width = innerWidth; c.height = innerHeight;
    const bits = Array.from({ length: 80 }, () => ({
      x: Math.random() * c.width,
      y: -20 - Math.random() * 100,
      r: 4 + Math.random() * 6,
      vy: 2 + Math.random() * 4,
      vx: -2 + Math.random() * 4,
      color: ["#ff4fd8","#3de7ff","#ffd84d","#7dff8a","#ff6b6b","#a78bfa"][Math.floor(Math.random()*6)],
      a: Math.random() * Math.PI,
    }));
    let frames = 0;
    function frame() {
      frames++;
      ctx2.clearRect(0, 0, c.width, c.height);
      bits.forEach((b) => {
        b.x += b.vx; b.y += b.vy; b.a += 0.1;
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
    const ch = e.key.toUpperCase();
    if (/^[A-Z]$/.test(ch)) guess(ch);
  });

  // ---------- Result / nav buttons ----------
  function setupGameControls() {
    $("btn-home").addEventListener("click", () => {
      state.lessonQueue = [];
      showScreen("home");
      renderShelf();
      renderWordChips();
    });
    $("btn-result-home").addEventListener("click", () => {
      state.lessonQueue = [];
      showScreen("home");
      renderShelf();
      renderWordChips();
    });
    $("btn-again").addEventListener("click", () => {
      if (state.lessonResults.length && state.lessonQueue.length) {
        state.lessonResults.pop();
      }
      startRound();
    });
    $("btn-next").addEventListener("click", () => goNextLessonWord());
    if ($("btn-hear-word")) {
      $("btn-hear-word").addEventListener("click", () => {
        if (!state.word) return;
        speak(state.word.word);
        setTimeout(() => {
          speak(state.word.word.toLowerCase().replace(/[^a-z]/g, " ").split(/\s+/).join(" "));
        }, 600);
        const letters = state.word.word.replace(/[^A-Za-z]/g, "");
        if (letters.length) {
          setTimeout(() => speak(letters.toLowerCase().split("").join(" ")), 600);
        }
        sfx("pop");
      });
    }
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
    $("btn-hint").addEventListener("click", useHint);

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

  // ---------- Boot ----------
  spawnFX();
  setupHome();
  setupGameControls();
  buildKeyboard();
