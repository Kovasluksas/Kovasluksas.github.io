// Traffic Light UI (Šviesoforas) - Kovas Juan Luksas

(() => {
  const $ = (s) => document.querySelector(s);

  // Helpers (no dependen de variables globales)
  function setLight(which, color) {
    const el = document.querySelector(`[data-light="${which}"]`);
    if (!el) return;

    el.querySelectorAll("[data-bulb]").forEach((b) => b.classList.remove("on"));
    const target = el.querySelector(`[data-bulb="${color}"]`);
    if (target) target.classList.add("on");
  }

  function setAllRed() {
    setLight("ns", "red");
    setLight("ew", "red");
  }

  function setPhaseUI(name, seconds) {
    const phase = $("#phaseText");
    const cd = $("#countdownText");
    if (phase) phase.textContent = name ?? "-";
    if (cd) cd.textContent = (seconds ?? "-").toString();
  }

  function setStatus(text, style = "dark") {
    const badge = $("#statusBadge");
    if (!badge) return;
    badge.textContent = text;
    badge.className = `badge text-bg-${style}`;
  }

  function readTimes() {
    const g = $("#tGreen");
    const y = $("#tYellow");
    const a = $("#tAllRed");
    const green = Math.max(3, parseInt(g?.value ?? "10", 10) || 10);
    const yellow = Math.max(2, parseInt(y?.value ?? "3", 10) || 3);
    const allRed = Math.max(0, parseInt(a?.value ?? "1", 10) || 1);
    return { green, yellow, allRed };
  }

  // State
  let mode = "auto";
  let running = false;
  let phaseIndex = 0;
  let secondsLeft = 0;
  let timerId = null;

  function applyPhase(idx) {
    const t = readTimes();
    switch (idx) {
      case 0:
        setLight("ns", "green"); setLight("ew", "red");
        secondsLeft = t.green; setPhaseUI("NS Green", secondsLeft);
        break;
      case 1:
        setLight("ns", "yellow"); setLight("ew", "red");
        secondsLeft = t.yellow; setPhaseUI("NS Yellow", secondsLeft);
        break;
      case 2:
        setAllRed();
        secondsLeft = t.allRed; setPhaseUI("All Red", secondsLeft);
        break;
      case 3:
        setLight("ns", "red"); setLight("ew", "green");
        secondsLeft = t.green; setPhaseUI("EW Green", secondsLeft);
        break;
      case 4:
        setLight("ns", "red"); setLight("ew", "yellow");
        secondsLeft = t.yellow; setPhaseUI("EW Yellow", secondsLeft);
        break;
      case 5:
        setAllRed();
        secondsLeft = t.allRed; setPhaseUI("All Red", secondsLeft);
        break;
      default:
        phaseIndex = 0;
        applyPhase(phaseIndex);
    }
  }

  function tick() {
    if (!running || mode !== "auto") return;

    secondsLeft -= 1;
    setPhaseUI($("#phaseText")?.textContent ?? "-", secondsLeft);

    if (secondsLeft <= 0) {
      phaseIndex = (phaseIndex + 1) % 6;
      applyPhase(phaseIndex);
    }
  }

  function start() {
    if (running) return;
    running = true;

    if (mode === "auto") {
      setStatus("AUTO", "success");
      phaseIndex = 0;
      applyPhase(phaseIndex);
      timerId = setInterval(tick, 1000);
    } else {
      setStatus("MANUAL", "primary");
      setPhaseUI("Manual control", "-");
    }
  }

  function stop() {
    running = false;
    if (timerId) clearInterval(timerId);
    timerId = null;
    setStatus("STOP", "dark");
    setPhaseUI("-", "-");
    setAllRed();
  }

  function setMode(next) {
    mode = next;

    const hint = $("#manualHint");
    if (hint) {
      const enabled = mode === "manual";
      hint.textContent = enabled ? "Enabled" : "Disabled";
      hint.className = `badge text-bg-${enabled ? "primary" : "secondary"}`;
    }

    if (running) {
      if (timerId) clearInterval(timerId);
      timerId = null;

      if (mode === "auto") {
        setStatus("AUTO", "success");
        phaseIndex = 0;
        applyPhase(phaseIndex);
        timerId = setInterval(tick, 1000);
      } else {
        setStatus("MANUAL", "primary");
        setPhaseUI("Manual control", "-");
      }
    }
  }

  function manualOnly(fn) {
    return () => {
      if (mode !== "manual") return;
      if (!running) running = true;
      fn();
      setStatus("MANUAL", "primary");
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    console.log("traffic-ui.js cargado");

    // Si no encuentra el semáforo en el HTML, avisá en consola:
    if (!document.querySelector('[data-light="ns"]') || !document.querySelector('[data-light="ew"]')) {
      console.warn("No encuentro data-light='ns' o 'ew' en el HTML.");
    }

    // Default
    setAllRed();
    setStatus("STOP", "dark");
    setPhaseUI("-", "-");

    // Hook UI
    $("#modeSelect")?.addEventListener("change", (e) => setMode(e.target.value));
    $("#btnStart")?.addEventListener("click", start);
    $("#btnStop")?.addEventListener("click", stop);

    $("#btnNSGreen")?.addEventListener("click", manualOnly(() => { setLight("ns","green"); setLight("ew","red"); setPhaseUI("NS Green (manual)", "-"); }));
    $("#btnEWGreen")?.addEventListener("click", manualOnly(() => { setLight("ew","green"); setLight("ns","red"); setPhaseUI("EW Green (manual)", "-"); }));
    $("#btnNSYellow")?.addEventListener("click", manualOnly(() => { setLight("ns","yellow"); setLight("ew","red"); setPhaseUI("NS Yellow (manual)", "-"); }));
    $("#btnEWYellow")?.addEventListener("click", manualOnly(() => { setLight("ew","yellow"); setLight("ns","red"); setPhaseUI("EW Yellow (manual)", "-"); }));
    $("#btnAllRed")?.addEventListener("click", manualOnly(() => { setAllRed(); setPhaseUI("All Red (manual)", "-"); }));

    // Si tu HTML tiene los botones Ped/Emergency y querés, después los re-agregamos.
    setMode($("#modeSelect")?.value ?? "auto");
  });
})();
