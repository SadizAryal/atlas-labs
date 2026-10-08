// Reveal, counters, draggable pano preview. Deferred, passive where possible.
(function () {
  function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  function counters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseInt(el.getAttribute('data-count'), 10) || 0, cur = 0;
        var step = Math.max(1, Math.round(target / 24));
        var t = setInterval(function () {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur;
        }, 40);
        io.unobserve(el);
      });
    });
    nums.forEach(function (n) { io.observe(n); });
  }
  function pano() {
    var pano = document.getElementById('pano'), inner = document.getElementById('panoInner');
    if (!pano || !inner) return;
    var down = false, startX = 0, off = 0;
    pano.addEventListener('pointerdown', function (e) { down = true; startX = e.clientX - off; pano.setPointerCapture(e.pointerId); }, { passive: true });
    pano.addEventListener('pointermove', function (e) {
      if (!down) return;
      off = e.clientX - startX;
      off = Math.max(-60, Math.min(60, off));
      inner.style.transform = 'translateX(' + off + 'px)';
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      pano.addEventListener(ev, function () { down = false; });
    });
    // card tilt
    document.querySelectorAll('.tilt').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(700px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 8) + 'deg) translateY(-4px)';
      }, { passive: true });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }
  function init() { reveal(); counters(); pano(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
