/* Small page behaviours: reveal sections on scroll, highlight the current nav link. */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sections = Array.prototype.slice.call(document.querySelectorAll('.section'));
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));

  // Reveal on scroll
  if (!reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    sections.forEach(function (s) { io.observe(s); });
  }

  // Theme toggle (dark is the default; the choice is remembered in this browser)
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var root = document.documentElement;
      var light = root.getAttribute('data-theme') === 'light';
      if (light) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'light');
      try { localStorage.setItem('theme', light ? 'dark' : 'light'); } catch (e) {}
    });
  }

  // Active nav link
  if ('IntersectionObserver' in window && sections.length) {
    var current = null;
    var nav = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          current = e.target.id;
          links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + current); });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (s) { nav.observe(s); });
  }
})();
