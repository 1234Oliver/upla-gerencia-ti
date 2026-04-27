/* ================================================
   ACADEMIA DIGITAL — script.js
   ================================================ */

// ─── CURSOR PERSONALIZADO ───────────────────────
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let rafId = null;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';

  if (!rafId) animateFollower();
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;

  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';

  const dist = Math.hypot(mouseX - followerX, mouseY - followerY);
  if (dist > 0.5) {
    rafId = requestAnimationFrame(animateFollower);
  } else {
    rafId = null;
  }
}

// Efecto hover en botones
document.addEventListener('mouseover', (e) => {
  if (e.target.matches('button, a, [role="button"]')) {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursor.style.background = '#e879f9';
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.matches('button, a, [role="button"]')) {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.background = '#3b82f6';
  }
});

// Cursor click
document.addEventListener('mousedown', () => {
  cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
});
document.addEventListener('mouseup', () => {
  cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

// ─── EFECTO PARALLAX EN ORBS ────────────────────
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.orb');
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 15;
    orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});

// ─── EFECTO SPOTLIGHT EN TARJETAS ───────────────
function initCardSpotlight() {
  document.querySelectorAll('.semana-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}

// ─── REVEAL AL HACER SCROLL ─────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// Versión con delay encadenado para la grilla de unidades
function revealUnitsGrid() {
  const cards = document.querySelectorAll('.unit-preview-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.transitionDelay = (i * 0.1) + 's';
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

// ─── NAVEGACIÓN PÁGINAS ─────────────────────────
let currentUnit = 1;

function irCatalogo(unidad = 1) {
  const home = document.getElementById('page-home');
  const catalogo = document.getElementById('page-catalogo');

  home.classList.add('exit');

  setTimeout(() => {
    home.classList.remove('active', 'exit');
    catalogo.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    mostrarUnidad(unidad, false);
    initCardSpotlight();
  }, 380);
}

function irHome() {
  const home = document.getElementById('page-home');
  const catalogo = document.getElementById('page-catalogo');

  catalogo.classList.add('exit');

  setTimeout(() => {
    catalogo.classList.remove('active', 'exit');
    home.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    initScrollReveal();
    revealUnitsGrid();
  }, 380);
}

// ─── NAVEGACIÓN ENTRE UNIDADES ──────────────────
function mostrarUnidad(num, scroll = true) {
  // Desactivar sección actual con animación
  const prev = document.querySelector('.unidad-section.active');
  if (prev) {
    prev.style.animation = 'sectionExit 0.3s ease forwards';
    setTimeout(() => {
      prev.classList.remove('active');
      prev.style.animation = '';
      activarUnidad(num);
    }, 280);
  } else {
    activarUnidad(num);
  }

  // Actualizar botones sidebar
  document.querySelectorAll('.unit-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.unit) === num);
  });

  // Actualizar label progress
  const labels = ['Fundamentos', 'Desarrollo', 'Aplicación', 'Integración'];
  document.getElementById('progress-label').textContent =
    `Unidad ${num} de 4 — ${labels[num - 1]}`;

  currentUnit = num;

  if (scroll) {
    const mainEl = document.querySelector('.cat-main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function activarUnidad(num) {
  const seccion = document.getElementById('unidad' + num);
  if (seccion) {
    seccion.classList.add('active');
    // Re-aplicar spotlight a nuevas tarjetas
    setTimeout(initCardSpotlight, 100);
  }
}

// CSS de salida de sección (inyectado dinámicamente)
const exitStyle = document.createElement('style');
exitStyle.textContent = `
  @keyframes sectionExit {
    to {
      opacity: 0;
      transform: translateX(-20px);
    }
  }
`;
document.head.appendChild(exitStyle);

// ─── ANIMACIÓN DE TÍTULO HÉROE ─────────────────
function animarTitulo() {
  const lineas = document.querySelectorAll('.hero-title .line');
  lineas.forEach((linea, i) => {
    linea.style.animationDelay = (0.5 + i * 0.15) + 's';
  });
}

// ─── EFECTO GLITCH AL HOVER EN LOGO ─────────────
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('mouseenter', () => {
    logo.style.animation = 'none';
  });
}

// ─── CUENTA REGRESIVA / PARTICLES FONDO ─────────
// Partículas flotantes para el hero
function crearParticulas() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: rgba(${Math.random() > 0.5 ? '59,130,246' : '232,121,249'}, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${8 + Math.random() * 12}s linear ${Math.random() * -20}s infinite;
      pointer-events: none;
    `;
    heroBg.appendChild(p);
  }

  const particleCSS = document.createElement('style');
  particleCSS.textContent = `
    @keyframes particleFloat {
      0% { transform: translateY(0) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-120vh) rotate(720deg); opacity: 0; }
    }
  `;
  document.head.appendChild(particleCSS);
}

// ─── TILT 3D EN TARJETAS PREVIEW ────────────────
function initTilt3D() {
  document.querySelectorAll('.unit-preview-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -8;
      const tiltY = dx * 8;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

// ─── BARRA DE PROGRESO ───────────────────────────
function crearBarraProgreso() {
  const bar = document.createElement('div');
  bar.id = 'read-progress';
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #e879f9);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  });
}

// ─── INICIALIZACIÓN ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  crearParticulas();
  initScrollReveal();
  revealUnitsGrid();
  animarTitulo();
  crearBarraProgreso();

  // Tilt con pequeño delay para que cargue el DOM de inicio
  setTimeout(initTilt3D, 800);

  // Efecto de entrada escalonada de estadísticas hero
  const stats = document.querySelectorAll('.stat');
  stats.forEach((s, i) => {
    s.style.animation = `fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) ${1.1 + i * 0.15}s both`;
  });
});

// Re-inicializar tilt cuando cambia de página
const observer = new MutationObserver(() => {
  initTilt3D();
  initCardSpotlight();
});

observer.observe(document.body, {
  subtree: true,
  attributes: true,
  attributeFilter: ['class']
});