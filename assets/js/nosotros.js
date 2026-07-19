// nosotros.js — Interacciones exclusivas para nosotros.html
(function () {
  "use strict";

  // Año dinámico en el footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú móvil y accordions responsivos
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    // Cerrar al elegir una opción (solo si no es un dropdown trigger en móvil)
    if (nav) {
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A" && header.classList.contains("nav-open")) {
          if (window.innerWidth <= 980 && e.target.classList.contains("dropdown-trigger")) {
            // Si es un disparador de dropdown en móvil, no cerrar el menú principal
            return;
          }
          header.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Abrir menú");
        }
      });
    }
  }

  // Reubicación de botones CTA y lógica de acordeón para móvil
  function initMobileMenu() {
    var mainNav = document.getElementById("mainNav");
    var headerCta = document.querySelector(".site-header .header-cta");
    
    // 1. Mover botones CTA dentro del menú de navegación en móvil
    if (mainNav && headerCta) {
      if (window.innerWidth <= 980) {
        if (!mainNav.querySelector(".header-cta")) {
          mainNav.appendChild(headerCta);
        }
      } else {
        // En desktop, devolverlo a su posición original (después de #mainNav)
        if (mainNav.querySelector(".header-cta")) {
          mainNav.parentNode.insertBefore(headerCta, mainNav.nextSibling);
        }
      }
    }
    
    // 2. Controlar acordeones de submenús en móviles
    var dropdownTriggers = document.querySelectorAll(".site-header .dropdown-trigger");
    dropdownTriggers.forEach(function(trigger) {
      if (trigger.getAttribute("data-mobile-bound")) return;
      trigger.setAttribute("data-mobile-bound", "true");
      
      trigger.addEventListener("click", function(e) {
        if (window.innerWidth <= 980) {
          var parent = trigger.parentElement;
          var dropdownMenu = parent.querySelector(".dropdown-menu");
          if (dropdownMenu) {
            e.preventDefault();
            var isOpen = parent.classList.contains("expanded");
            
            // Cerrar otros dropdowns abiertos
            document.querySelectorAll(".site-header .nav-item-dropdown").forEach(function(item) {
              if (item !== parent) {
                item.classList.remove("expanded");
              }
            });
            
            // Alternar actual
            if (isOpen) {
              parent.classList.remove("expanded");
            } else {
              parent.classList.add("expanded");
            }
          }
        }
      });
    });
  }

  // Inicializar y escuchar cambios de tamaño de pantalla
  initMobileMenu();
  window.addEventListener("resize", initMobileMenu);

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Animación reveal para las tarjetas (MVV y ventajas)
  var revealEls = document.querySelectorAll(".reveal, .nos-advantage-card");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i * 60) + "ms";
      revealIO.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

})();
