/* =====================================================
   VISION DESIGN — main.js
   Scroll reveal · Nav scroll · Mobile menu · Tilt · Form
   ===================================================== */

// ── Scroll reveal ────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // No dejamos de observar para mantener la animación si vuelve
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ── Nav scroll ───────────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile menu ──────────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  // Evitar scroll del body cuando el menú está abierto
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Cerrar al hacer click en un link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Smooth scroll para links del nav ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navHeight = nav.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

// ── Card tilt effect ─────────────────────────────────
// Solo en desktop (pointer: fine = mouse)
const hasMouse = window.matchMedia('(pointer: fine)').matches;

if (hasMouse) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;  // max 6deg
      const rotY = ((x - cx) / cx) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// ── Staggered delay para proceso steps ───────────────
document.querySelectorAll('.proceso__step').forEach((step, i) => {
  step.style.setProperty('--i', i);
  step.style.transitionDelay = `${i * 0.1}s`;
});

// ── Staggered delay para servicios ───────────────────
document.querySelectorAll('.servicio').forEach((s, i) => {
  s.style.transitionDelay = `${i * 0.07}s`;
});

// ── Staggered delay para portfolio cards ─────────────
document.querySelectorAll('.card').forEach((c, i) => {
  c.style.transitionDelay = `${i * 0.12}s`;
});

// ── Form: envío simulado ──────────────────────────────
// (Para conectar a Google Sheets: reemplazar fetch con el endpoint de tu Google Form)
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const evento = form.evento.value;
    const mensaje = form.mensaje.value.trim();

    // Validación simple
    if (!nombre || !mensaje) {
      shakeField(!nombre ? form.nombre : form.mensaje);
      return;
    }

    // Animación del botón
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // ── Envío a Google Forms ─────────────────────────────
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdRZ735c3KC22foxbGJaDjxnX6x77j8AFaJBUYLL9Fsj9vaIw/formResponse';
    const formData = new FormData();
    formData.append('entry.1627463590', nombre);
    formData.append('entry.674460941',  evento);
    formData.append('entry.2010630178', mensaje);
    // mode: 'no-cors' — Google Forms no permite CORS, pero el envío igual funciona.
    // No podemos leer la respuesta, pero los datos llegan a tu hoja de cálculo.
    await fetch(GOOGLE_FORM_URL, { method: 'POST', body: formData, mode: 'no-cors' });
    // ─────────────────────────────────────────────────────

    // Mostrar éxito
    form.style.display = 'none';
    formSuccess.classList.add('visible');
  });
}

// Función para animar campo inválido
function shakeField(el) {
  el.style.borderColor = '#ef4444';
  el.style.animation = 'shake 0.4s ease';
  el.focus();

  setTimeout(() => {
    el.style.borderColor = '';
    el.style.animation = '';
  }, 2000);
}

// Agregar keyframe de shake dinámicamente
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

// ── Active nav link on scroll ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--accent)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Modal de preview ──────────────────────────────────
const modal        = document.getElementById('previewModal');
const modalIframe  = document.getElementById('modalIframe');
const modalTitle   = document.getElementById('modalTitle');
const modalExternal= document.getElementById('modalExternal');
const modalClose   = document.getElementById('modalClose');
const modalBackdrop= document.getElementById('modalBackdrop');
const modalLoader  = document.getElementById('modalLoader');

// Nombres para el título del modal según la URL
const projectNames = {
  'invitacion-tadeo': 'Invitación Tadeo — Grizzy & The Lemmings',
  'album-diego':      'Álbum Minecraft',
  'vcard-visiondesign': 'vCard Personal — Vision Design',
};

function openModal(url) {
  // Detectar el nombre del proyecto desde la URL
  const key = Object.keys(projectNames).find(k => url.includes(k));
  const name = key ? projectNames[key] : url;

  modalTitle.textContent = name;
  modalExternal.href = url;

  // Mostrar loader, limpiar iframe anterior
  modalLoader.classList.remove('hidden');
  modalIframe.src = '';

  // Abrir modal
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Cargar el iframe
  // Pequeño delay para que la animación de apertura no compita con la carga
  setTimeout(() => {
    modalIframe.src = url;
  }, 150);

  // Ocultar loader cuando cargue el iframe
  modalIframe.onload = () => {
    modalLoader.classList.add('hidden');
  };
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';

  // Limpiar iframe al cerrar para parar audio/video
  setTimeout(() => {
    modalIframe.src = '';
    modalLoader.classList.remove('hidden');
  }, 300);
}

// Click en botones "Ver proyecto"
document.querySelectorAll('.card__preview-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // No propagar al tilt
    const card = btn.closest('[data-url]');
    const url = card?.dataset.url;
    if (url) openModal(url);
  });
});

// Cerrar con botón X
modalClose.addEventListener('click', closeModal);

// Cerrar al hacer click en el backdrop
modalBackdrop.addEventListener('click', closeModal);

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});