// Centro Integrado 360 — interacciones de la landing
(function () {
  "use strict";

  // Año dinámico en el footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú móvil
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    // Cerrar al elegir una opción
    if (nav) {
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A" && header.classList.contains("nav-open")) {
          header.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Abrir menú");
        }
      });
    }
  }

  // Animaciones de entrada al hacer scroll
  var revealTargets = document.querySelectorAll(
    ".section .section-title, .hero-copy, .hero-figure, .brand-card, .mv-card, " +
    ".serv-card, .ventaja, .suc-card, .eco-card, .con-card, .table-wrap, .sol-list"
  );

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealTargets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 6) * 60 + "ms";
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach(function (el) { io.observe(el); });
  }

  // --- CHATBOX FAQ SYSTEM ---
  var chatbox = document.getElementById("faqChatbox");
  var trigger = document.getElementById("chatboxTrigger");
  var tooltip = document.getElementById("chatboxTooltip");
  var tooltipClose = document.getElementById("tooltipClose");
  var chatWindow = document.getElementById("chatboxWindow");
  var closeBtn = document.getElementById("chatboxCloseBtn");
  var messagesContainer = document.getElementById("chatboxMessages");
  var inputForm = document.getElementById("chatboxInputForm");
  var chatInput = document.getElementById("chatboxInput");
  var badge = document.getElementById("chatboxBadge");
  var quickReplies = document.getElementById("chatboxQuickReplies");

  if (chatbox && trigger && chatWindow) {
    // Mostrar tooltip después de un retraso
    setTimeout(function() {
      if (!chatWindow.classList.contains("open") && tooltip) {
        tooltip.classList.add("show");
      }
    }, 4000);

    // Cerrar tooltip
    if (tooltipClose) {
      tooltipClose.addEventListener("click", function(e) {
        e.stopPropagation();
        tooltip.classList.remove("show");
      });
    }

    // Toggle ventana del chat
    function toggleChat() {
      var isOpen = chatWindow.classList.toggle("open");
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      chatWindow.setAttribute("aria-hidden", isOpen ? "false" : "true");
      
      // Ocultar tooltip al abrir
      if (isOpen && tooltip) {
        tooltip.classList.remove("show");
      }
      
      // Ocultar badge de notificación
      if (isOpen && badge) {
        badge.style.display = "none";
      }

      // Alternar iconos de trigger
      var iconChat = trigger.querySelector(".icon-chat");
      var iconClose = trigger.querySelector(".icon-close");
      if (isOpen) {
        if (iconChat) iconChat.style.display = "none";
        if (iconClose) iconClose.style.display = "block";
        setTimeout(function() { chatInput.focus(); }, 300);
      } else {
        if (iconChat) iconChat.style.display = "block";
        if (iconClose) iconClose.style.display = "none";
      }

      // Mensaje de bienvenida inicial
      if (isOpen && messagesContainer && messagesContainer.children.length === 0) {
        sendBotMessage("¡Hola! Bienvenido al <b>Centro Integrado 360</b>. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?");
      }
    }

    trigger.addEventListener("click", toggleChat);
    if (closeBtn) closeBtn.addEventListener("click", toggleChat);

    // Respuestas rápidas
    if (quickReplies) {
      quickReplies.addEventListener("click", function(e) {
        var btn = e.target.closest(".quick-reply-btn");
        if (btn) {
          var questionText = btn.textContent;
          var key = btn.getAttribute("data-question");
          addUserMessage(questionText);
          showTypingIndicator();
          
          setTimeout(function() {
            removeTypingIndicator();
            var response = getAnswerByKey(key);
            sendBotMessage(response);
          }, 800);
        }
      });
    }

    // Enviar pregunta desde input
    if (inputForm) {
      inputForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var query = chatInput.value.trim();
        if (!query) return;

        addUserMessage(query);
        chatInput.value = "";
        showTypingIndicator();

        setTimeout(function() {
          removeTypingIndicator();
          var response = findAnswer(query);
          sendBotMessage(response);
        }, 800);
      });
    }

    var FAQ_DATA = [
      {
        key: "servicios",
        keywords: ["servicio", "servicios", "ofrecen", "hacen", "salud", "seguridad", "ocupacional", "industrial", "examen", "examenes", "capacitacion", "capacitaciones"],
        answer: "Ofrecemos soluciones integrales en:<br>• <b>Salud Ocupacional:</b> Exámenes pre/post ocupacionales, toma de muestras in situ, historias clínicas digitales e indicadores SUT.<br>• <b>Seguridad Industrial:</b> EPP especializado, identificación de riesgos y capacitaciones en seguridad laboral."
      },
      {
        key: "sucursales",
        keywords: ["sucursal", "sucursales", "donde", "ubicacion", "ubicados", "direcciones", "quito", "guayaquil", "manta", "sedes", "oficinas", "direccion", "matriz"],
        answer: "Contamos con cobertura nacional en 4 sedes:<br>• <b>Guayaquil Matriz:</b> Av. de las Aguas, Urbanor (junto a UIDE).<br>• <b>Guayaquil Mucho Lote:</b> Mucho Lote 1 (locales 5-8 y 11).<br>• <b>Quito:</b> Av. de la Prensa y Vaca de Castro.<br>• <b>Manta:</b> Av. Flavio Reyes, edificio Platinum."
      },
      {
        key: "horarios",
        keywords: ["horario", "horarios", "atencion", "atendiendo", "hora", "abren", "cierran", "dias", "sabado", "sabados", "semana"],
        answer: "Nuestra matriz en Guayaquil atiende de:<br>• <b>Lunes a Viernes:</b> 07:00 – 19:00.<br>• <b>Sábados:</b> 07:00 – 14:00.<br>Para citas o consultas en otras sedes, contáctanos por WhatsApp."
      },
      {
        key: "contacto",
        keywords: ["contacto", "whatsapp", "telefono", "correo", "mail", "llamar", "escribir", "redes", "celular", "facebook", "instagram", "web", "asesor", "cotizar", "cotizacion", "precio", "precios", "costo", "costos"],
        answer: "Comunícate con nosotros para cotizaciones o dudas:<br>• <b>Salud Ocupacional (OHS):</b> WhatsApp al <a href='https://wa.me/593992631451' target='_blank'>099 263 1451</a> o ventas@ohs.com.ec.<br>• <b>Seguridad Industrial (Grupo Renee):</b> WhatsApp al <a href='https://wa.me/593984064249' target='_blank'>098 406 4249</a> o jefatura.ventas@gruporenee.com.ec."
      },
      {
        key: "movil",
        keywords: ["movil", "unidad", "domicilio", "empresa", "in situ", "viaje", "camion", "brigadas", "brigadistas", "simulacro", "extintor"],
        answer: "¡Sí! Contamos con una <b>Unidad Médica Móvil</b> completamente equipada para realizar exámenes ocupacionales directo en tu empresa a nivel nacional. También capacitamos brigadas en primeros auxilios y evacuación."
      },
      {
        key: "resultados",
        keywords: ["resultado", "resultados", "portal", "pacientes", "crm", "orion", "contifico", "historias", "clinicas", "plataforma", "sistema", "digital"],
        answer: "El <b>Portal de Pacientes</b> para consultar resultados e historias clínicas estará disponible próximamente. Si eres asesor o administrador, puedes ingresar al <b>CRM 360</b> desde la sección Ecosistema Digital en el menú superior."
      }
    ];

    function getAnswerByKey(key) {
      for (var i = 0; i < FAQ_DATA.length; i++) {
        if (FAQ_DATA[i].key === key) return FAQ_DATA[i].answer;
      }
      return "Lo siento, no encontré información sobre eso.";
    }

    function removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function findAnswer(query) {
      var cleanQuery = removeAccents(query.toLowerCase());
      var bestMatch = null;
      var maxMatches = 0;
      
      for (var i = 0; i < FAQ_DATA.length; i++) {
        var matches = 0;
        var keywords = FAQ_DATA[i].keywords;
        for (var j = 0; j < keywords.length; j++) {
          if (cleanQuery.indexOf(keywords[j]) !== -1) {
            matches++;
          }
        }
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = FAQ_DATA[i];
        }
      }

      if (bestMatch && maxMatches > 0) {
        return bestMatch.answer;
      }

      return "Lo siento, no tengo una respuesta exacta para eso. ¿Podrías intentar con palabras clave como 'servicios', 'sucursales', 'horarios', 'contacto' o 'unidad móvil'? También puedes escribir a nuestros asesores vía WhatsApp:<br>• <b>Salud (OHS):</b> <a href='https://wa.me/593992631451' target='_blank'>099 263 1451</a><br>• <b>Seguridad (Renee):</b> <a href='https://wa.me/593984064249' target='_blank'>098 406 4249</a>";
    }

    function addUserMessage(text) {
      var msg = document.createElement("div");
      msg.className = "chat-msg chat-msg--user";
      msg.textContent = text;
      messagesContainer.appendChild(msg);
      scrollToBottom();
    }

    function sendBotMessage(html) {
      var msg = document.createElement("div");
      msg.className = "chat-msg chat-msg--bot";
      msg.innerHTML = html;
      messagesContainer.appendChild(msg);
      scrollToBottom();
    }

    function showTypingIndicator() {
      var indicator = document.createElement("div");
      indicator.className = "typing-indicator";
      indicator.id = "typingIndicator";
      indicator.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
      messagesContainer.appendChild(indicator);
      scrollToBottom();
    }

    function removeTypingIndicator() {
      var indicator = document.getElementById("typingIndicator");
      if (indicator) {
        indicator.parentNode.removeChild(indicator);
      }
    }

    function scrollToBottom() {
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }

  // --- FORMULARIO DE CONTACTO INTERACTIVO ---
  var contactForm = document.getElementById("interactiveContactForm");
  var submitBtn = document.getElementById("formSubmitBtn");
  var successAlert = document.getElementById("formSuccessAlert");

  if (contactForm && submitBtn && successAlert) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Cambiar estado del botón a enviando
      var btnText = submitBtn.querySelector("span");
      var btnIcon = submitBtn.querySelector(".send-icon");
      var originalText = btnText ? btnText.textContent : "Enviar Solicitud";

      if (btnText) btnText.textContent = "Enviando...";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.75";
      submitBtn.style.cursor = "not-allowed";

      // Simular envío de datos
      setTimeout(function () {
        // Mostrar alerta de éxito
        successAlert.style.display = "flex";
        
        // Desplazar suavemente hasta la alerta de éxito
        successAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });

        // Resetear formulario
        contactForm.reset();

        // Restaurar estado del botón
        setTimeout(function () {
          if (btnText) btnText.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = "";
          submitBtn.style.cursor = "";
          
          // Ocultar alerta de éxito después de un tiempo
          setTimeout(function() {
            successAlert.style.opacity = "0";
            setTimeout(function() {
              successAlert.style.display = "none";
              successAlert.style.opacity = "1";
            }, 300);
          }, 6000);
        }, 2000);

      }, 1500);
    });
  }
})();
