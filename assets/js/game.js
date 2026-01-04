// Flip Card Memory Game (robusto: soporta IDs viejos y nuevos)
// Autor: Kovas Juan Luksas

document.addEventListener("DOMContentLoaded", () => {
    // helper: busca el primer ID que exista
    const pick = (...ids) => ids.map((id) => document.getElementById(id)).find(Boolean);
  
    // Soporta IDs nuevos (game-*) y viejos (startBtn, board, etc.)
    const boardEl = pick("game-board", "board");
    const difficultyEl = pick("game-difficulty", "difficulty");
    const startBtn = pick("game-start", "startBtn");
    const resetBtn = pick("game-reset", "resetBtn");
    const movesEl = pick("game-moves", "moves");
    const matchesEl = pick("game-matches", "matches");
    const messageEl = pick("game-message", "message");
  
    // Mensaje visible para confirmar que el JS está vivo
    if (messageEl) messageEl.textContent = "game.js loaded ✅ (spauskite Start)";
  
    // Si falta algo clave, salimos (pero dejando mensaje arriba)
    if (!boardEl || !difficultyEl || !startBtn || !resetBtn || !movesEl || !matchesEl || !messageEl) {
      if (messageEl) {
        messageEl.textContent =
          "game.js loaded ✅ pero trūksta elementų (ID mismatch). Patikrink IDs HTML.";
      }
      return;
    }
  
    // Config
    const baseItems = ["🍀", "🚀", "🎧", "🧠", "⚡", "📚", "🎮", "🌙", "🐉", "🧩", "🦊", "🎯"];
    const config = {
      easy: { cols: 4, rows: 3 }, // 12 cards
      hard: { cols: 6, rows: 4 }, // 24 cards
    };
  
    // State
    let deck = [];
    let isPlaying = false;
    let lockBoard = false;
    let firstCard = null;
    let secondCard = null;
    let moves = 0;
    let matches = 0;
  
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
  
    function neededPairs(level) {
      const { cols, rows } = config[level] || config.easy;
      return (cols * rows) / 2;
    }
  
    function setStats() {
      movesEl.textContent = String(moves);
      matchesEl.textContent = String(matches);
    }
  
    function setMessage(text) {
      messageEl.textContent = text || "";
    }
  
    function buildDeck(level) {
      const pairs = neededPairs(level);
      const uniques = baseItems.slice(0, pairs);
      return shuffle([...uniques, ...uniques]);
    }
  
    function renderBoard(level) {
      const { cols } = config[level] || config.easy;
  
      boardEl.style.display = "grid";
      boardEl.style.gridTemplateColumns = `repeat(${cols}, minmax(60px, 1fr))`;
      boardEl.style.gap = "12px";
      boardEl.innerHTML = "";
  
      deck.forEach((value) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mem-card";
        btn.dataset.value = value;
  
        btn.innerHTML = `
          <div class="mem-inner">
            <div class="mem-face mem-front">?</div>
            <div class="mem-face mem-back">${value}</div>
          </div>
        `;
  
        btn.addEventListener("click", () => onCardClick(btn));
        boardEl.appendChild(btn);
      });
    }
  
    function resetPick() {
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }
  
    function flip(el) { el.classList.add("flipped"); }
    function unflip(el) { el.classList.remove("flipped"); }
    function disable(el) { el.disabled = true; el.classList.add("matched"); }
  
    function win() {
      isPlaying = false;
      setMessage(`Laimėjote! Ėjimai: ${moves}`);
    }
  
    function startLevel(level) {
      isPlaying = true;
      lockBoard = false;
      moves = 0;
      matches = 0;
      setStats();
      setMessage("Žaidimas prasidėjo! ✅");
  
      deck = buildDeck(level);
      renderBoard(level);
    }
  
    function onCardClick(cardEl) {
      if (!isPlaying) return;
      if (lockBoard) return;
      if (cardEl.disabled) return;
      if (cardEl.classList.contains("flipped")) return;
  
      flip(cardEl);
  
      if (!firstCard) {
        firstCard = cardEl;
        return;
      }
  
      secondCard = cardEl;
      lockBoard = true;
  
      moves += 1;
      setStats();
  
      const v1 = firstCard.dataset.value;
      const v2 = secondCard.dataset.value;
  
      if (v1 === v2) {
        disable(firstCard);
        disable(secondCard);
        matches += 1;
        setStats();
        resetPick();
  
        if (matches === neededPairs(difficultyEl.value)) win();
        return;
      }
  
      setTimeout(() => {
        unflip(firstCard);
        unflip(secondCard);
        resetPick();
      }, 900);
    }
  
    // Eventos (con prueba visible)
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      setMessage("Start click ✅");
      startLevel(difficultyEl.value);
    });
  
    resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      setMessage("Reset click ✅");
      startLevel(difficultyEl.value);
    });
  
    difficultyEl.addEventListener("change", () => {
      isPlaying = false;
      moves = 0;
      matches = 0;
      setStats();
      setMessage("Pasirinkite Start, kad pradėtumėte.");
      deck = buildDeck(difficultyEl.value);
      renderBoard(difficultyEl.value);
    });
  
    // Init
    deck = buildDeck(difficultyEl.value);
    renderBoard(difficultyEl.value);
    setStats();
    setMessage("Pasirinkite Start, kad pradėtumėte.");
  });
  