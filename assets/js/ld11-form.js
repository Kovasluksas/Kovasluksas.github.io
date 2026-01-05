// LD11 - Form validation logic
// Autor: Kovas Juan Luksas

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedbackForm");
    if (!form) return;
  
    const fields = {
      vardas: form.querySelector("#vardas"),
      pavarde: form.querySelector("#pavarde"),
      email: form.querySelector("#email"),
      telefonas: form.querySelector("#telefonas"),
      adresas: form.querySelector("#adresas"),
      q1: form.querySelector("#q1"),
      q2: form.querySelector("#q2"),
      q3: form.querySelector("#q3"),
    };
  
    const errors = {
      vardas: document.getElementById("err-vardas"),
      pavarde: document.getElementById("err-pavarde"),
      email: document.getElementById("err-email"),
      telefonas: document.getElementById("err-telefonas"),
      adresas: document.getElementById("err-adresas"),
      q1: document.getElementById("err-q1"),
      q2: document.getElementById("err-q2"),
      q3: document.getElementById("err-q3"),
    };
  
    const submitBtn = form.querySelector("#submitBtn");
    const resetBtn = form.querySelector("#resetBtn");
  
    const resultBox = document.getElementById("resultBox");
    const resultText = document.getElementById("resultText");
    const avgText = document.getElementById("avgText");
    const successPopup = document.getElementById("successPopup");
  
    if (!submitBtn || !resetBtn) return;
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ltPhoneRegex = /^\+370 6\d{2} \d{5}$/;
  
    // ---------------------------
    // Helpers (UI)
    // ---------------------------
    function showError(key, show) {
      const el = errors[key];
      if (!el) return;
      el.classList.toggle("d-none", !show);
    }
  
    function setFieldState(key, ok) {
      const el = fields[key];
      if (!el) return;
  
      el.classList.toggle("is-invalid", !ok);
      el.classList.toggle("is-valid", ok);
  
      el.setAttribute("aria-invalid", String(!ok));
  
      const errEl = errors[key];
      if (errEl && errEl.id) {
        el.setAttribute("aria-describedby", errEl.id);
      }
    }
  
    // ---------------------------
    // Phone normalize / format
    // ---------------------------
    function normalizeLtPhone(value) {
      let d = String(value || "").replace(/[^\d]/g, "");
  
      // local mobile: 6xxxxxxx -> 3706xxxxxxx
      if (d.length === 8 && d.startsWith("6")) {
        d = "370" + d;
      }
  
      // country digits: 3706xxxxxxx
      if (d.length >= 11 && d.startsWith("3706")) {
        const op = d.slice(3, 6); // 6xx
        const rest = d.slice(6, 11); // xxxxx
        return `+370 ${op} ${rest}`;
      }
  
      return null;
    }
  
    function formatPhone() {
      const el = fields.telefonas;
      if (!el) return;
      const normalized = normalizeLtPhone(el.value);
      if (normalized) el.value = normalized;
    }
  
    // ---------------------------
    // Validators
    // ---------------------------
    function validateText(key) {
      const el = fields[key];
      if (!el) return false;
  
      const ok = el.value.trim().length > 0;
      showError(key, !ok);
      setFieldState(key, ok);
      return ok;
    }
  
    function validateEmail() {
      const el = fields.email;
      if (!el) return false;
  
      const ok = emailRegex.test(el.value.trim());
      showError("email", !ok);
      setFieldState("email", ok);
      return ok;
    }
  
    function validatePhone() {
      const el = fields.telefonas;
      if (!el) return false;
  
      const normalized = normalizeLtPhone(el.value);
      if (normalized) el.value = normalized;
  
      const ok = ltPhoneRegex.test(el.value.trim());
      showError("telefonas", !ok);
      setFieldState("telefonas", ok);
      return ok;
    }
  
    function validateScore(key) {
      const el = fields[key];
      if (!el) return false;
  
      const n = Number(el.value);
      const ok = Number.isFinite(n) && n >= 1 && n <= 10;
  
      showError(key, !ok);
      setFieldState(key, ok);
      return ok;
    }
  
    function validateAll() {
      const checks = [
        validateText("vardas"),
        validateText("pavarde"),
        validateEmail(),
        validatePhone(),
        validateText("adresas"),
        validateScore("q1"),
        validateScore("q2"),
        validateScore("q3"),
      ];
  
      const ok = checks.every(Boolean);
      submitBtn.disabled = !ok;
      return ok;
    }
  
    // ---------------------------
    // Events
    // ---------------------------
    Object.keys(fields).forEach((k) => {
      const el = fields[k];
      if (!el) return;
  
      el.addEventListener("input", () => {
        if (k === "telefonas") formatPhone();
        validateAll();
      });
  
      el.addEventListener("blur", () => {
        if (k === "telefonas") formatPhone();
        validateAll();
      });
    });
  
    resetBtn.addEventListener("click", () => {
      form.reset();
  
      // hide errors + clear visual states
      Object.keys(errors).forEach((k) => {
        showError(k, false);
        const el = fields[k];
        if (el) {
          el.classList.remove("is-valid", "is-invalid");
          el.removeAttribute("aria-invalid");
        }
      });
  
      submitBtn.disabled = true;
  
      if (resultBox) resultBox.classList.add("d-none");
      if (successPopup) successPopup.classList.add("d-none");
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateAll()) return;
  
      const q1 = Number(fields.q1.value);
      const q2 = Number(fields.q2.value);
      const q3 = Number(fields.q3.value);
      const avg = (q1 + q2 + q3) / 3;
  
      if (resultText) {
        resultText.textContent =
          `Vardas: ${fields.vardas.value}, ` +
          `Pavardė: ${fields.pavarde.value}, ` +
          `El. paštas: ${fields.email.value}, ` +
          `Telefonas: ${fields.telefonas.value}, ` +
          `Adresas: ${fields.adresas.value}.`;
      }
  
      if (avgText) {
        avgText.textContent =
          `${fields.vardas.value} ${fields.pavarde.value}: vidurkis = ${avg.toFixed(2)}`;
      }
  
      if (resultBox) resultBox.classList.remove("d-none");
  
      if (successPopup) {
        successPopup.classList.remove("d-none");
        setTimeout(() => successPopup.classList.add("d-none"), 3000);
      }
  
      console.log("LD11 duomenys:", {
        vardas: fields.vardas.value,
        pavarde: fields.pavarde.value,
        email: fields.email.value,
        telefonas: fields.telefonas.value,
        adresas: fields.adresas.value,
        q1, q2, q3, avg,
      });
    });
  
    submitBtn.disabled = true;
    validateAll();
  });
  