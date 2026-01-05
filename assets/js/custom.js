// Custom JS (general) - Kovas Juan Luksas
// Este archivo queda para scripts generales del sitio.
// LD11 (formulario) se movió a: assets/js/ld11-form.js
// Semáforo se mantiene en: assets/js/traffic-ui.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("custom.js cargado ✅");

  // Si en el futuro querés agregar pequeñas mejoras globales, ponelas acá.
  // Ejemplo (opcional): scroll suave para anchors internos
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id ? document.querySelector(id) : null;
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
