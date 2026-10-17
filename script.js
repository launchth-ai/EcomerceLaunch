(() => {
  'use strict';
  const menuButton = document.querySelector('#menu-button');
  const mobileNav = document.querySelector('#mobile-nav');
  function toggleMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileNav.hidden = !open;
  }
  menuButton.addEventListener('click', () => toggleMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') toggleMenu(false); });

  const progress = document.querySelector('.reading-progress');
  let ticking = false;
  function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${maxScroll > 0 ? Math.min(100, window.scrollY / maxScroll * 100) : 0}%`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if(!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
  }, { passive: true });
  updateProgress();

  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('visible'));

  const steps = [
    {count:'PASO 01 / 04', kicker:'PRIMERO, ESCUCHAR.', title:'ENTENDEMOS<br>TU IDEA.', description:'Charlamos sobre tus objetivos, tu situación actual y lo que te gustaría construir. Sin tecnicismos ni presión.', icon:'↗'},
    {count:'PASO 02 / 04', kicker:'LA BASE IMPORTA.', title:'ELEGIMOS<br>QUÉ VENDER.', description:'Exploramos productos, proveedores, márgenes y oportunidades para que tu propuesta tenga sentido.', icon:'◎'},
    {count:'PASO 03 / 04', kicker:'DE LA IDEA A LA PANTALLA.', title:'DISEÑAMOS<br>TU TIENDA.', description:'Preparamos tu tienda en Shopify: catálogo, páginas, pagos, envíos y una experiencia de compra clara.', icon:'✳'},
    {count:'PASO 04 / 04', kicker:'LLEGÓ EL MOMENTO.', title:'LANZAMOS<br>Y APRENDEMOS.', description:'Revisamos el lanzamiento, vemos cómo funcionan los anuncios y observamos los datos para mejorar.', icon:'↗'}
  ];
  const stepButtons = Array.from(document.querySelectorAll('.process-step'));
  const stepDisplay = document.querySelector('.step-display-text');
  stepButtons.forEach((button, index) => button.addEventListener('click', () => {
    stepButtons.forEach((b, i) => { b.classList.toggle('is-selected', i === index); b.setAttribute('aria-pressed', String(i === index)); });
    const s = steps[index];
    document.querySelector('#step-display-count').textContent = s.count;
    document.querySelector('#step-display-kicker').textContent = s.kicker;
    document.querySelector('#step-display-heading').innerHTML = s.title;
    document.querySelector('#step-display-description').textContent = s.description;
    document.querySelector('#step-display-icon').textContent = s.icon;
    document.querySelectorAll('.step-pips i').forEach((pip, i) => pip.classList.toggle('active', i === index));
    stepDisplay.style.animation = 'none';
    void stepDisplay.offsetWidth;
    stepDisplay.style.animation = '';
  }));

  // Profundidad 3D con pointer tracking: sin motores pesados ni descargas.
  const heroArt = document.querySelector('#hero-art');
  const depthCard = document.querySelector('#store-tilt-wrapper');
  const motionAllowed = matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)');
  let pointerFrame = 0;
  if(motionAllowed.matches && heroArt && depthCard) {
    heroArt.addEventListener('pointermove', event => {
      if(pointerFrame) return;
      const x = event.clientX, y = event.clientY;
      pointerFrame = requestAnimationFrame(() => {
        const r = heroArt.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, ((x - r.left)/r.width - .5) * 2));
        const ny = Math.max(-1, Math.min(1, ((y - r.top)/r.height - .5) * 2));
        depthCard.style.setProperty('--rx', `${(-6 - ny * 10).toFixed(2)}deg`);
        depthCard.style.setProperty('--ry', `${(-18 + nx * 17).toFixed(2)}deg`);
        pointerFrame = 0;
      });
    }, {passive:true});
    heroArt.addEventListener('pointerleave', () => {
      depthCard.style.setProperty('--rx', '-6deg');
      depthCard.style.setProperty('--ry', '-18deg');
    });
  }

  const year = document.querySelector('#year');
  year.textContent = new Date().getFullYear();
})();
