(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.getElementById('nav');
  var progress = document.querySelector('.progress');

  /* Barra de progreso y navegación que se esconde al bajar */
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    nav.classList.toggle('is-scrolled', y > 30);
    nav.classList.toggle('is-hidden', y > 500 && y > lastY + 4);
    if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* Números que cuentan hasta su valor */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduceMotion || !target) { el.textContent = target; return; }
    var start = null;
    var dur = Math.min(1800, 600 + target * 6);
    function step(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  /* Aparición al hacer scroll */
  var revealTargets = document.querySelectorAll('.reveal, .reveal-zoom, .timeline li, .steps, [data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.matches('.steps')) el.classList.add('in-line');
        else if (el.hasAttribute('data-count')) countUp(el);
        else el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in', 'in-line'); });
  }

  /* Videos: se cargan y reproducen solo cuando están a la vista */
  function loadVideo(v) {
    if (v.dataset.loaded) return;
    v.querySelectorAll('source[data-src]').forEach(function (s) { s.src = s.getAttribute('data-src'); });
    v.load();
    v.dataset.loaded = '1';
  }
  function tryPlay(v) {
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  var videos = document.querySelectorAll('video.lazy-video');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          loadVideo(v);
          if (!reduceMotion) tryPlay(v);
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.25, rootMargin: '200px 0px' });
    videos.forEach(function (v) { vio.observe(v); });
  } else {
    videos.forEach(loadVideo);
  }
  /* Con movimiento reducido, el video se reproduce con un toque */
  videos.forEach(function (v) {
    v.addEventListener('click', function () {
      loadVideo(v);
      if (v.paused) tryPlay(v); else v.pause();
    });
  });

  /* Pestañas del video de escritorio */
  var desk = document.getElementById('vetar-desktop');
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      if (tab.classList.contains('is-active')) return;
      document.querySelectorAll('.tab').forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      desk.classList.add('is-switching');
      setTimeout(function () {
        desk.querySelectorAll('source').forEach(function (src) {
          var url = tab.dataset.video + (src.type === 'video/webm' ? '.webm' : '.mp4');
          src.setAttribute('data-src', url);
          src.src = url;
        });
        desk.poster = tab.dataset.poster;
        desk.dataset.loaded = '1';
        desk.load();
        tryPlay(desk);
        desk.classList.remove('is-switching');
      }, 300);
    });
  });

  /* Marquesina: se duplica el contenido para que el giro no tenga cortes */
  var track = document.querySelector('.marquee-track');
  if (track && !reduceMotion) {
    Array.prototype.slice.call(track.children).forEach(function (item) {
      var c = item.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });
  }

  /* Enlace activo en la navegación */
  var links = document.querySelectorAll('.nav-links a');
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (a) { a.classList.remove('is-active'); });
          map[e.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) sio.observe(s);
    });
  }

  /* El teléfono del inicio sigue un poco al mouse */
  var visual = document.querySelector('.hero-visual');
  if (visual && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    var hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      visual.style.transform = 'perspective(1000px) rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () { visual.style.transform = ''; });
    visual.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)';
  }

  /* Copiar email */
  var copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.dataset.email;
      var done = function () {
        copyBtn.textContent = '¡Copiado!';
        copyBtn.classList.add('is-copied');
        setTimeout(function () { copyBtn.textContent = 'Copiar email'; copyBtn.classList.remove('is-copied'); }, 1800);
      };
      var fallback = function () {
        var el = document.getElementById('email');
        var r = document.createRange();
        r.selectNodeContents(el);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
      };
      try { navigator.clipboard.writeText(email).then(done, fallback); } catch (err) { fallback(); }
    });
  }
})();
