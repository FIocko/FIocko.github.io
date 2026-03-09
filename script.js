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
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
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
    typeEffect();
    initParticles();
    initContactForm();
    initPdfModal();
    initRSSFeed();
    updateActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
