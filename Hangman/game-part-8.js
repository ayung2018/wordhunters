  function showLessonSummary() {
    const results = state.lessonResults;
    const total = results.length;
    const wins = results.filter((r) => r.won).length;
    $("summary-line").textContent =
      total === 0
        ? "No words practiced yet."
        : `You practiced ${total} word${total === 1 ? "" : "s"} — spelled ${wins} correctly. Review them below!`;
    const ratio = total ? wins / total : 0;
    $("summary-stars").textContent =
      ratio >= 0.9 ? "⭐⭐⭐" : ratio >= 0.6 ? "⭐⭐☆" : ratio > 0 ? "⭐☆☆" : "💫💫💫";

    const list = $("summary-list");
    list.innerHTML = results.map((r, i) => `
      <div class="summary-item">
        <span>${r.emoji || "✏️"}</span>
        <span class="sw">${r.word}</span>
        <span class="${r.won ? "sok" : "smiss"}">${r.won ? "✓" : "learn"}</span>
        <button type="button" data-hear="${i}" aria-label="Hear ${r.word}">🔈</button>
      </div>
    `).join("");
    list.querySelectorAll("button[data-hear]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const r = results[+btn.dataset.hear];
        if (r) {
          speak(r.word);
          setTimeout(() => speak(r.word.toLowerCase().split("").join(" ")), 700);
        }
      });
    });

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
    if (state.voice) {
      setTimeout(() => speak(`Lesson complete! You spelled ${wins} out of ${total} words.`), 350);
    }
  }

