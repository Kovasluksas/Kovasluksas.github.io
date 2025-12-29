// LD11 - Custom form logic
// Autor: Kovas Juan Luksas

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedbackForm");
    if (!form) return;
  
    const fields = {
      vardas: document.getElementById("vardas"),
      pavarde: document.getElementById("pavarde"),
      email: document.getElementById("email"),
      telefonas: document.getElementById("telefonas"),
      adresas: document.getElementById("adresas"),
      q1: document.getElementById("q1"),
      q2: document.getElementById("q2"),
      q3: document.getElementById("q3"),
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
  
    const submitBtn = document.getElementById("submitBtn");
    const resetBtn = document.getElementById("resetBtn");
  
    const resultBox = document.getElementById("resultBox");
    const resultText = document.getElementById("resultText");
    const avgText = document.getElementById("avgText");
    const successPopup = document.getElementById("successPopup");
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ltPhoneRegex = /^\+370 6\d{2} \d{5}$/;
  
    function showError(key, show) {
      if (!errors[key]) return;
      errors[key].classList.toggle("d-none", !show);
    }
  
    function validateText(key) {
      const v = fields[key].value.trim();
      const ok = v.length > 0;
      showError(key, !ok);
      return ok;
    }
  
    function validateEmail() {
      const v = fields.email.value.trim();
      const ok = emailRegex.test(v);
      showError("email", !ok);
      return ok;
    }
  
    function validatePhone() {
      const v = fields.telefonas.value.trim();
      const ok = ltPhoneRegex.test(v);
      showError("telefonas", !ok);
      return ok;
    }
  
    function validateScore(key) {
      const n = Number(fields[key].value);
      const ok = Number.isFinite(n) && n >= 1 && n <= 10;
      showError(key, !ok);
      return ok;
    }
  
    function formatPhone() {
      let raw = fields.telefonas.value.replace(/[^\d+]/g, "");
  
      if (raw.startsWith("370")) raw = "+370" + raw.slice(3);
  
      if (raw.startsWith("+3706")) {
        const digits = raw.replace(/[^\d]/g, "");
        if (digits.length >= 11) {
          const op = digits.slice(3, 6);
          const rest = digits.slice(6, 11);
          fields.telefonas.value = `+370 ${op} ${rest}`;
        }
      }
    }
  
    function validateAll() {
      const ok =
        validateText("vardas") &&
        validateText("pavarde") &&
        validateEmail() &&
        validatePhone() &&
        validateText("adresas") &&
        validateScore("q1") &&
        validateScore("q2") &&
        validateScore("q3");
  
      submitBtn.disabled = !ok;
      return ok;
    }
  
    Object.keys(fields).forEach((k) => {
      fields[k].addEventListener("input", () => {
        if (k === "telefonas") formatPhone();
        validateAll();
      });
      fields[k].addEventListener("blur", () => {
        if (k === "telefonas") formatPhone();
        validateAll();
      });
    });
  
    resetBtn.addEventListener("click", () => {
      form.reset();
      Object.keys(errors).forEach((k) => showError(k, false));
      submitBtn.disabled = true;
      resultBox.classList.add("d-none");
      successPopup.classList.add("d-none");
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateAll()) return;
  
      const q1 = Number(fields.q1.value);
      const q2 = Number(fields.q2.value);
      const q3 = Number(fields.q3.value);
  
      const avg = (q1 + q2 + q3) / 3;
  
      resultText.textContent =
        `Vardas: ${fields.vardas.value}, ` +
        `Pavardė: ${fields.pavarde.value}, ` +
        `El. paštas: ${fields.email.value}, ` +
        `Telefonas: ${fields.telefonas.value}, ` +
        `Adresas: ${fields.adresas.value}.`;
  
      avgText.textContent =
        `${fields.vardas.value} ${fields.pavarde.value}: vidurkis = ${avg.toFixed(2)}`;
  
      resultBox.classList.remove("d-none");
      successPopup.classList.remove("d-none");
  
      setTimeout(() => {
        successPopup.classList.add("d-none");
      }, 3000);
  
      console.log("LD11 duomenys:", {
        vardas: fields.vardas.value,
        pavarde: fields.pavarde.value,
        email: fields.email.value,
        telefonas: fields.telefonas.value,
        adresas: fields.adresas.value,
        q1, q2, q3, avg
      });
    });
  
    validateAll();
  });
  