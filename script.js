/* ============================================
   PORTFOLIO BTS SIO SISR - SCRIPT.JS
   JavaScript ES6 natif - Aucune librairie
   ============================================ */

(() => {
  'use strict';

  /* ============================================
     0. DARK MODE TOGGLE
     ============================================ */
  const themeToggle = document.getElementById('themeToggle');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  function initTheme() {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'dark') {
      setTheme('dark');
    }
  }

  initTheme();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---- DOM References ---- */
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const reveals = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-progress');
  const skillPercentages = document.querySelectorAll('.skill-percentage');
  const statNumbers = document.querySelectorAll('.stat-number');
  const typingText = document.getElementById('typingText');
  const contactForm = document.getElementById('contactForm');
  const particleCanvas = document.getElementById('particleCanvas');

  /* ============================================
     1. MOBILE NAVIGATION
     ============================================ */
  function toggleMobileMenu() {
    const isOpen = sidebar.classList.toggle('open');
    mobileToggle.classList.toggle('open', isOpen);
    sidebarOverlay.classList.toggle('visible', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    sidebar.classList.remove('open');
    mobileToggle.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileMenu);

  /* Close menu on link click (mobile) */
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ============================================
     2. ACTIVE NAV LINK ON SCROLL
     ============================================ */
  function updateActiveNav() {
    let current = '';
    const scrollY = window.scrollY + window.innerHeight / 3;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const wasActive = link.classList.contains('active');
      const isActive = link.getAttribute('data-section') === current;
      
      if (wasActive && !isActive) {
        link.classList.remove('active');
      } else if (!wasActive && isActive) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================
     3. SCROLL REVEAL
     ============================================ */
  function handleReveal() {
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      const trigger = window.innerHeight * 0.88;
      if (top < trigger) {
        el.classList.add('visible');
      }
    });
  }

  /* ============================================
     3.5 CONTACT SECTION ANIMATION
     ============================================ */
  let contactAnimated = false;

  function animateContact() {
    if (contactAnimated) return;
    const contactSection = document.getElementById('contactAnimated');
    if (!contactSection) return;

    const rect = contactSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      contactAnimated = true;
      contactSection.classList.add('animate-in');
    }
  }

  /* ============================================
     4. SKILL BARS ANIMATION
     ============================================ */
  let skillsAnimated = false;

  function animateSkills() {
    if (skillsAnimated) return;
    const skillsSection = document.getElementById('competences');
    if (!skillsSection) return;

    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      skillsAnimated = true;

      skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
      });

      skillPercentages.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, 0, target, 1200, '%');
      });
    }
  }

  /* ============================================
     5. STAT COUNTERS ANIMATION
     ============================================ */
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      statsAnimated = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, 0, target, 1000, '');
      });
    }
  }

  function animateCounter(el, start, end, duration, suffix) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* ============================================
     6. TYPING EFFECT
     ============================================ */
  const typingPhrases = [
    'Administration Systemes & Reseaux',
    'Virtualisation & Cloud Computing',
    'Cybersecurite & Protection',
    'Support IT & Maintenance'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!typingText) return;

    const currentPhrase = typingPhrases[phraseIndex];

    if (!isDeleting) {
      typingText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
      setTimeout(typeEffect, 60);
    } else {
      typingText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        setTimeout(typeEffect, 400);
        return;
      }
      setTimeout(typeEffect, 30);
    }
  }

  /* ============================================
     7. PARTICLE CANVAS
     ============================================ */
  function initParticles() {
    if (!particleCanvas) return;

    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      particleCanvas.width = particleCanvas.offsetWidth;
      particleCanvas.height = particleCanvas.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((particleCanvas.width * particleCanvas.height) / 18000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * particleCanvas.width,
          y: Math.random() * particleCanvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const pColor = isDark ? '96, 165, 250' : '59, 130, 246';
        ctx.fillStyle = `rgba(${pColor}, ${p.opacity})`;
        ctx.fill();
      });

      /* Connect close particles */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const isDarkLine = document.documentElement.getAttribute('data-theme') === 'dark';
            const lColor = isDarkLine ? '96, 165, 250' : '59, 130, 246';
            ctx.strokeStyle = `rgba(${lColor}, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  /* ============================================
     8. PDF MODAL - Skill card viewer (multi-PDF)
     ============================================ */
  function initPdfModal() {
    const modal       = document.getElementById('pdfModal');
    const frame       = document.getElementById('pdfFrame');
    const placeholder = document.getElementById('pdfPlaceholder');
    const closeBtn    = document.getElementById('pdfModalClose');
    const backdrop    = modal ? modal.querySelector('.pdf-modal-backdrop') : null;
    const titleEl     = document.getElementById('pdfModalTitle');
    const dlBtn       = document.getElementById('pdfDownloadBtn');
    const tabsEl      = document.getElementById('pdfDocTabs');

    if (!modal) return;

    function loadPdf(pdfPath) {
      // Load directly - no fetch() (breaks on file:// protocol)
      placeholder.classList.remove('visible');
      frame.style.display = 'block';
      frame.src = pdfPath;
      dlBtn.href = pdfPath;
      dlBtn.style.display = 'inline-flex';

      // If iframe fails to load (file not found), show placeholder
      frame.onerror = function() {
        frame.src = '';
        frame.style.display = 'none';
        placeholder.classList.add('visible');
        dlBtn.removeAttribute('href');
        dlBtn.style.display = 'none';
      };
    }

    function buildTabs(docs) {
      tabsEl.innerHTML = '';
      if (!docs || docs.length <= 1) return;
      docs.forEach(function(doc, i) {
        const btn = document.createElement('button');
        btn.className = 'pdf-doc-tab' + (i === 0 ? ' active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
          doc.label;
        btn.addEventListener('click', function() {
          tabsEl.querySelectorAll('.pdf-doc-tab').forEach(function(t) {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          loadPdf(doc.file);
        });
        tabsEl.appendChild(btn);
      });
    }

    function openModal(docs, title) {
      titleEl.textContent = title;
      buildTabs(docs);

      // Load first available doc
      const first = docs && docs.length > 0 ? docs[0] : null;
      if (first) {
        loadPdf(first.file);
      } else {
        frame.src = '';
        frame.style.display = 'none';
        placeholder.classList.add('visible');
        dlBtn.style.display = 'none';
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(function() {
        frame.src = '';
        tabsEl.innerHTML = '';
      }, 300);
    }

    // Skill cards with data-pdfs (JSON array)
    document.querySelectorAll('.skill-card[data-pdfs]').forEach(function(card) {
      function handleOpen() {
        let docs = [];
        try { docs = JSON.parse(card.dataset.pdfs); } catch(e) {}
        const skill = card.dataset.skill || '';
        const labels = {
          reseaux: 'R\u00e9seaux', systemes: 'Syst\u00e8mes',
          virtualisation: 'Virtualisation', cybersecurite: 'Cybers\u00e9curit\u00e9',
          maintenance: 'Maintenance', support: 'Support Utilisateur'
        };
        openModal(docs, 'Documents \u2014 ' + (labels[skill] || skill));
      }
      card.addEventListener('click', handleOpen);
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); }
      });
    });

    // Rapport de stage buttons
    document.querySelectorAll('.rapport-btn[data-pdf]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const label = btn.dataset.label || 'Rapport de stage';
        openModal([{ label: label, file: btn.dataset.pdf }], label);
      });
    });

    // Projet GSB buttons (Contexte & Documentation)
    document.querySelectorAll('.projet-btn[data-pdf]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const label = btn.dataset.label || 'Document';
        openModal([{ label: label, file: btn.dataset.pdf }], label);
      });
    });

    // Tableau de compétences PDF button
    var compBtn = document.getElementById('openCompetencesPdf');
    if (compBtn) {
      compBtn.addEventListener('click', function() {
        openModal(
          [{ label: 'Tableau de comp\u00e9tences', file: 'assets/competences.pdf' }],
          'Tableau de comp\u00e9tences'
        );
      });
    }

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ============================================
     9. RSS FEED - Google Alert (Atom XML)
     ============================================ */
  function initRSSFeed() {
    const container = document.getElementById('rssFeed');
    if (!container) return;

    const RSS_URL = 'https://www.google.fr/alerts/feeds/01423504381686435311/8633374578522871457';
    const CACHE_KEY = 'portfolio-rss-cache-v3';
    const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

    // Try cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < CACHE_TTL && data.items && data.items.length > 0) {
          renderArticles(container, data.items);
          return;
        }
      }
    } catch (e) { /* ignore bad cache */ }

    // Proxies: own API first, then external fallbacks
    const proxies = [
      '/api/rss',
      'https://api.allorigins.win/raw?url=' + encodeURIComponent(RSS_URL),
      'https://corsproxy.io/?' + encodeURIComponent(RSS_URL)
    ];

    function tryProxy(index) {
      if (index >= proxies.length) {
        // All proxies failed, show error
        container.innerHTML =
          '<div class="feed-error">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
          '<p>Impossible de charger le flux RSS.<br>Veuillez r\u00e9essayer plus tard.</p>' +
          '</div>';
        return;
      }

      fetch(proxies[index])
        .then(function (res) {
          if (!res.ok) throw new Error('Proxy ' + index + ' failed');
          return res.text();
        })
        .then(function (xmlText) {
          // Check it's actual XML
          if (!xmlText || xmlText.indexOf('<entry>') === -1 && xmlText.indexOf('<entry ') === -1) {
            throw new Error('Not valid Atom XML');
          }
          const parser = new DOMParser();
          const doc = parser.parseFromString(xmlText, 'text/xml');
          const parseError = doc.querySelector('parsererror');
          if (parseError) throw new Error('XML parse error');

          const entries = doc.querySelectorAll('entry');
          if (!entries || entries.length === 0) throw new Error('No entries');

          const items = [];
          const max = Math.min(entries.length, 5);
          for (let i = 0; i < max; i++) {
            const entry = entries[i];
            const titleEl = entry.querySelector('title');
            const title = titleEl ? titleEl.textContent.trim() : '';
            const linkEl = entry.querySelector('link');
            const link = linkEl ? (linkEl.getAttribute('href') || '') : '';
            const updatedEl = entry.querySelector('updated');
            const pubDate = updatedEl ? updatedEl.textContent.trim() : '';
            const contentEl = entry.querySelector('content');
            const content = contentEl ? contentEl.textContent.trim() : '';
            items.push({ title: title, link: link, pubDate: pubDate, content: content });
          }

          if (items.length === 0) throw new Error('No items parsed');

          // Cache results
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), items: items }));
          } catch (e) { /* storage full */ }
          renderArticles(container, items);
        })
        .catch(function () {
          // Try next proxy
          tryProxy(index + 1);
        });
    }

    tryProxy(0);
  }

  function renderArticles(container, items) {
    let html = '';
    items.forEach(function (item) {
      let date = '';
      if (item.pubDate) {
        const d = new Date(item.pubDate);
        date = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      }

      // Strip HTML tags for snippet
      const temp = document.createElement('div');
      temp.innerHTML = item.content || item.description || '';
      let snippet = temp.textContent || temp.innerText || '';
      snippet = snippet.substring(0, 160);
      if (snippet.length >= 160) snippet += '\u2026';

      // Extract source domain
      let source = '';
      try {
        source = new URL(item.link).hostname.replace('www.', '');
      } catch (e) { source = ''; }

      html +=
        '<a href="' + item.link + '" target="_blank" rel="noopener noreferrer" class="rss-article">' +
        (date ? '<div class="rss-article-date">' + date + '</div>' : '') +
        '<div class="rss-article-title">' + (item.title || 'Article sans titre') + '</div>' +
        (snippet ? '<div class="rss-article-snippet">' + snippet + '</div>' : '') +
        (source ? '<div class="rss-article-source"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' + source + '</div>' : '') +
        '</a>';
    });
    container.innerHTML = html;
  }

  /* ============================================
     9. CONTACT FORM VALIDATION
     ============================================ */
  function initContactForm() {
    if (!contactForm) return;

    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const subjectInput = document.getElementById('formSubject');
    const messageInput = document.getElementById('formMessage');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const confirmation = document.getElementById('formConfirmation');

    function validateField(input, errorEl, message) {
      if (!input.value.trim()) {
        input.classList.add('error');
        errorEl.textContent = message;
        return false;
      }
      input.classList.remove('error');
      errorEl.textContent = '';
      return true;
    }

    function validateEmail(input, errorEl) {
      if (!input.value.trim()) {
        input.classList.add('error');
        errorEl.textContent = 'L\'adresse e-mail est requise.';
        return false;
      }
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(input.value)) {
        input.classList.add('error');
        errorEl.textContent = 'Veuillez entrer une adresse e-mail valide.';
        return false;
      }
      input.classList.remove('error');
      errorEl.textContent = '';
      return true;
    }

    /* Real-time validation on blur */
    nameInput.addEventListener('blur', () => validateField(nameInput, nameError, 'Le nom est requis.'));
    emailInput.addEventListener('blur', () => validateEmail(emailInput, emailError));
    subjectInput.addEventListener('blur', () => validateField(subjectInput, subjectError, 'Le sujet est requis.'));
    messageInput.addEventListener('blur', () => validateField(messageInput, messageError, 'Le message est requis.'));

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const v1 = validateField(nameInput, nameError, 'Le nom est requis.');
      const v2 = validateEmail(emailInput, emailError);
      const v3 = validateField(subjectInput, subjectError, 'Le sujet est requis.');
      const v4 = validateField(messageInput, messageError, 'Le message est requis.');

      if (!v1 || !v2 || !v3 || !v4) return;

      submitBtn.classList.add('loading');

      // Send to Formspree as JSON (more reliable)
      const data = {
        name:    nameInput.value,
        email:   emailInput.value,
        subject: subjectInput.value,
        message: messageInput.value
      };

      fetch('https://formspree.io/f/mojkvyez', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          submitBtn.classList.remove('loading');
          if (response.ok) {
            submitBtn.classList.add('success');
            confirmation.classList.add('visible');
            contactForm.reset();

            setTimeout(() => {
              submitBtn.classList.remove('success');
              confirmation.classList.remove('visible');
            }, 4000);
          } else {
            throw new Error('Erreur envoi');
          }
        })
        .catch(() => {
          submitBtn.classList.remove('loading');
          alert('Une erreur est survenue. Veuillez r\u00e9essayer.');
        });
    });
  }

  /* ============================================
     10. SCROLL EVENT HANDLER
     ============================================ */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        handleReveal();
        animateSkills();
        animateStats();
        animateContact();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ============================================
     11. INIT ON DOM READY
     ============================================ */
  function init() {
    handleReveal();
    animateSkills();
    animateStats();
    animateContact();
    typeEffect();
    initParticles();
    initContactForm();
    initPdfModal();
    initRSSFeed();
    initCarousel();
    initLightbox();
    updateActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* ================================================================
   CAROUSEL — GALERIE PHOTOS
   Vanilla JS, pas de librairie externe.
   Defilement automatique toutes les 4 secondes, transition en fondu.
   ================================================================

   ┌─────────────────────────────────────────────────────────────┐
   │ POUR AJOUTER VOS PROPRES PHOTOS :                           │
   ├─────────────────────────────────────────────────────────────┤
   │                                                             │
   │ 1. PLACEZ VOS IMAGES dans le dossier images/carousel/      │
   │    Exemples : images/carousel/photo-1.jpg                  │
   │              images/carousel/photo-2.jpg, etc.             │
   │                                                             │
   │ 2. MODIFIEZ LE TABLEAU carouselSlides ci-dessous :          │
   │    - Ajouter/supprimer des objets selon vos photos          │
   │    - Il n'y a PAS de limite de nombre de slides             │
   │                                                             │
   │ 3. POUR CHAQUE SLIDE, vous devez definir :                │
   │    image  : chemin vers votre photo (OBLIGATOIRE)          │
   │    title  : titre court, 2-3 mots max (OBLIGATOIRE)        │
   │    legend : description de 1 phrase (OBLIGATOIRE)          │
   │                                                             │
   │ 4. TAILLES D'IMAGES FLEXIBLES :                             │
   │    ✓ Les images sont automatiquement redimensionnees      │
   │    ✓ Peu importe la taille originale de votre photo      │
   │    ✓ Elle s\'affichera en pleine largeur avec bon ratio   │
   │    ✓ Aucune distorsion, meme si ratio different           │
   │                                                             │
   │ 5. EXEMPLE COMPLET :                                        │
   │    {                                                        │
   │      image:  'images/carousel/salle-serveur.jpg',          │
   │      title:  'Salle Serveur',                              │
   │      legend: 'Infrastructure physique du datacenter.'      │
   │    }                                                        │
   │                                                             │
   │ NE SUPPRIMEZ PAS LES TIRETS ET ESPERLUETTES :              │
   │ Exemple : l\'entreprise (apostrophe echappee)              │
   │           \"exemple\" (pour les guillemets)                 │
   │                                                             │
   └─────────────────────────────────────────────────────────────┘
   ================================================================ */

const carouselSlides = [
  {
    image:  'images/carousel/slide-1.jpg',
    title:  'Baie reseau GSB',
    legend: 'Baie reseau utilisee pour le projet GSB — switches Cisco Catalyst 2960 et routeur Cisco 1941'
  },
  {
    image:  'images/carousel/slide-2.jpg',
    title:  'Schema du reseau GSB',
    legend: 'Diagramme de l\'infrastructure reseau GSB : VLANs, routeurs, Stormshield, hyperviseurs et adressage IP'
  },
  {
    image:  'images/carousel/slide-3.jpg',
    title:  'Windows Server',
    legend: 'Verification des permissions NTFS via PowerShell avec la commande Get-NTFSAccess sur C:\\dossierperso'
  },
  {
    image:  'images/carousel/slide-4.jpg',
    title:  'Configuration reseau',
    legend: 'Interface de gestion PCG03 — adressage statique 172.20.92.3, passerelle 172.20.127.254'
  }
];

/* ============================================================
   CODE DU CAROUSEL — ne pas modifier sauf pour personnaliser
   ============================================================ */
function initCarousel() {
  const track    = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const btnPrev  = document.getElementById('carouselPrev');
  const btnNext  = document.getElementById('carouselNext');

  if (!track || carouselSlides.length === 0) return;

  const INTERVAL = 8000; // delai en ms entre chaque slide
  let currentIndex = 0;
  let autoTimer    = null;
  let progressTimer = null;

  /* ---- Construction des slides ---- */
  carouselSlides.forEach(function(slide, i) {
    const el = document.createElement('div');
    el.className = 'carousel-slide' + (i === 0 ? ' active' : '');
    el.setAttribute('role', 'tabpanel');
    el.setAttribute('aria-label', 'Slide ' + (i + 1) + ' sur ' + carouselSlides.length);

    const img = document.createElement('img');
    img.src = slide.image;
    img.alt = slide.title;
    img.loading = 'lazy';
    img.onerror = function() {
      // Si l'image ne se charge pas, afficher un fond coloré avec le nom du fichier
      el.style.background = '#1e293b';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      const msg = document.createElement('p');
      msg.style.cssText = 'color:#60a5fa;font-size:13px;text-align:center;padding:16px;font-family:monospace;';
      msg.textContent = 'Image introuvable : ' + slide.image;
      el.insertBefore(msg, el.firstChild);
    };

    const caption = document.createElement('div');
    caption.className = 'carousel-caption';
    caption.innerHTML =
      '<p class="carousel-caption-title">' + slide.title + '</p>' +
      '<p class="carousel-caption-legend">' + slide.legend + '</p>';

    el.appendChild(img);
    el.appendChild(caption);
    track.appendChild(el);
  });

  /* ---- Barre de progression ---- */
  const progressWrap = document.createElement('div');
  progressWrap.className = 'carousel-progress';
  const progressBar = document.createElement('div');
  progressBar.className = 'carousel-progress-bar';
  progressWrap.appendChild(progressBar);
  track.parentNode.parentNode.appendChild(progressWrap);

  /* ---- Construction des points ---- */
  carouselSlides.forEach(function(_, i) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Aller a la slide ' + (i + 1));
    dot.addEventListener('click', function() { goTo(i); });
    dotsWrap.appendChild(dot);
  });

  /* ---- Affichage d'une slide ---- */
  function goTo(index) {
    const slides = track.querySelectorAll('.carousel-slide');
    const dots   = dotsWrap.querySelectorAll('.carousel-dot');

    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');

    currentIndex = (index + carouselSlides.length) % carouselSlides.length;

    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');

    resetProgress();
  }

  /* ---- Barre de progression animee ---- */
  function resetProgress() {
    clearTimeout(progressTimer);
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    // Force reflow pour reset la transition
    progressBar.getBoundingClientRect();
    progressBar.style.transition = 'width ' + INTERVAL + 'ms linear';
    progressBar.style.width = '100%';
  }

  /* ---- Defilement automatique ---- */
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() {
      goTo(currentIndex + 1);
    }, INTERVAL);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    clearTimeout(progressTimer);
  }

  /* ---- Fleches ---- */
  btnPrev.addEventListener('click', function() {
    stopAuto();
    goTo(currentIndex - 1);
    startAuto();
  });

  btnNext.addEventListener('click', function() {
    stopAuto();
    goTo(currentIndex + 1);
    startAuto();
  });

  /* ---- Pause au survol ---- */
  const carouselEl = document.getElementById('mainCarousel');
  carouselEl.addEventListener('mouseenter', stopAuto);
  carouselEl.addEventListener('mouseleave', function() {
    startAuto();
    resetProgress();
  });

  /* ---- Swipe tactile ---- */
  let touchStartX = 0;
  carouselEl.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  carouselEl.addEventListener('touchend', function(e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      stopAuto();
      goTo(currentIndex + (diff > 0 ? 1 : -1));
      startAuto();
    }
  }, { passive: true });

  /* ---- Demarrage ---- */
  resetProgress();
  startAuto();
}

/* ================================================================
   LIGHTBOX IMAGE — Clic sur les photos du carousel pour les agrandir
   ================================================================ */
function initLightbox() {
  const lightbox     = document.getElementById('imgLightbox');
  const lbImg        = document.getElementById('imgLightboxImg');
  const lbCaption    = document.getElementById('imgLightboxCaption');
  const lbClose      = document.getElementById('imgLightboxClose');
  const lbBackdrop   = lightbox ? lightbox.querySelector('.img-lightbox-backdrop') : null;

  if (!lightbox) return;

  function openLightbox(src, alt, caption) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCaption.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  /* Clic sur une image du carousel */
  document.addEventListener('click', function(e) {
    const img = e.target.closest('.carousel-slide img');
    if (!img) return;
    const caption = img.closest('.carousel-slide')
      ? img.closest('.carousel-slide').querySelector('.carousel-caption-title')
      : null;
    const legend = img.closest('.carousel-slide')
      ? img.closest('.carousel-slide').querySelector('.carousel-caption-legend')
      : null;
    const fullCaption = [
      caption ? caption.textContent : '',
      legend  ? legend.textContent  : ''
    ].filter(Boolean).join(' — ');
    openLightbox(img.src, img.alt, fullCaption);
  });

  /* Fermeture */
  if (lbClose)    lbClose.addEventListener('click', closeLightbox);
  if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}
