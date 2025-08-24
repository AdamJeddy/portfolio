(function(){
  // Mark JS-enabled
  try { document.documentElement.classList.add('js'); } catch(_) {}
  // Mobile menu toggle
  var btn = document.querySelector('[data-menu-btn]');
  var nav = document.querySelector('[data-nav]');
  if (btn && nav) {
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  // Highlight current nav link by path
  try {
    var here = location.pathname.replace(/\\+/g,'/');
    document.querySelectorAll('.nav a').forEach(function(a){
      var href = a.getAttribute('href');
      if (!href) return;
      var target = href.replace(/\\+/g,'/');
      if (here === '/' && (target.endsWith('/index.html') || target === '/')) {
        a.setAttribute('aria-current','page');
      } else if (here.endsWith('/index.html')) {
        var base = here.replace(/index\.html$/, '');
        if (target === base + 'index.html' || target === base) a.setAttribute('aria-current','page');
      } else if (target === here) {
        a.setAttribute('aria-current','page');
      }
    });
  } catch(_) {}

  // Theme toggle: default is light (no .dark class). Persist choice.
  try {
    var themeBtn = document.getElementById('theme-toggle');
    function applyTheme(t){
      if(t === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      if(themeBtn) {
        themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
        themeBtn.textContent = t === 'dark' ? '🌙' : '🌞';
        themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      }
    }
    var saved = localStorage.getItem('theme');
    applyTheme(saved || 'light');
    if(themeBtn) themeBtn.addEventListener('click', function(){
      var next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  } catch(_) {}

  // Simple local hit counter (no network): counts per page in localStorage
  try {
    var key = 'hits:' + location.pathname;
    var n = parseInt(localStorage.getItem(key) || '0', 10) + 1;
    localStorage.setItem(key, String(n));
    var slot = document.querySelector('[data-hitcount]');
    if (slot) slot.textContent = n.toString();
  } catch(_) {}

  // Progressive marquee polyfill: if prefers-reduced-motion, pause
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.marquee span').forEach(function(el){ el.style.animationPlayState = 'paused'; });
    }
  } catch (_) {}
})();
