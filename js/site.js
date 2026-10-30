/* Yëggal Services — comportements communs a toutes les pages */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');

  // ---------- Theme clair / sombre ----------
  var STORAGE_KEY = 'yeggal-theme';
  function storedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#060b1a' : '#ffffff');
  }
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  applyTheme(storedTheme() || (media && media.matches ? 'dark' : 'light'));
  if (media && media.addEventListener) {
    media.addEventListener('change', function (e) { if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light'); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      });
    }

    // ---------- Navigation ----------
    var nav = document.getElementById('header');
    var burger = document.getElementById('navBurger');
    var backdrop = document.querySelector('.nav-backdrop');
    function closeMenu() { document.body.classList.remove('nav-open'); if (burger) burger.setAttribute('aria-expanded', 'false'); }
    if (burger) {
      burger.addEventListener('click', function () {
        var open = document.body.classList.toggle('nav-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    if (backdrop) backdrop.addEventListener('click', closeMenu);
    document.querySelectorAll('.nav-menu a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    // Lien actif selon la page courante
    var page = location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
    document.querySelectorAll('.nav-menu a[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === page) a.classList.add('active');
    });

    // ---------- Defilement : nav, progression, retour en haut ----------
    var progress = document.querySelector('.scroll-progress');
    var toTop = document.querySelector('.to-top');
    function onScroll() {
      var y = window.scrollY;
      if (nav) nav.classList.toggle('scrolled', y > 24);
      if (toTop) toTop.classList.toggle('visible', y > 600);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // ---------- Apparition au defilement (avec decalage automatique) ----------
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      var step = parseFloat(group.getAttribute('data-stagger')) || 0.08;
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.classList.add('reveal');
        child.style.setProperty('--d', (i * step).toFixed(2) + 's');
      });
    });
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }

    // ---------- Compteurs animes : <span data-count="1200" data-suffix="+"> ----------
    var counters = document.querySelectorAll('[data-count]');
    function animateCount(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var start = null;
      function frame(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / 1600, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('fr-FR') + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }

    // ---------- Effet d'inclinaison au survol : data-tilt ----------
    var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine && !reduce) {
      document.querySelectorAll('[data-tilt]').forEach(function (el) {
        var max = parseFloat(el.getAttribute('data-tilt')) || 6;
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = 'perspective(900px) rotateY(' + (x * max) + 'deg) rotateX(' + (-y * max) + 'deg)';
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
      });
    }

    // ---------- Sommaire : surligne la section en cours de lecture ----------
    var tocLinks = document.querySelectorAll('.toc-list a[href^="#"]');
    if (tocLinks.length && 'IntersectionObserver' in window) {
      var byId = {};
      tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          var link = byId[entry.target.id];
          if (link) link.classList.add('active');
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      Object.keys(byId).forEach(function (id) { var el = document.getElementById(id); if (el) sio.observe(el); });
    }

    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  });
})();
