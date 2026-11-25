// Tap any gallery photo to see it large, with arrows to move through the gallery.
(function () {
  var dlg, list = [], at = 0;
  function show() {
    var img = list[at], fig = img.closest('figure');
    dlg.querySelector('img').src = img.currentSrc || img.src;
    dlg.querySelector('img').alt = img.alt;
    var cap = fig && fig.querySelector('figcaption');
    dlg.querySelector('.pv-cap').textContent = (cap ? cap.textContent : img.alt) + '  ·  ' + (at + 1) + ' / ' + list.length;
  }
  function go(n) { at = (at + n + list.length) % list.length; show(); }
  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'pv';
    dlg.innerHTML = '<button type="button" class="pv-x" aria-label="Close photo">✕</button>' +
      '<button type="button" class="pv-nav pv-prev" aria-label="Previous photo">‹</button>' +
      '<img alt=""><button type="button" class="pv-nav pv-next" aria-label="Next photo">›</button><p class="pv-cap"></p>';
    document.body.appendChild(dlg);
    dlg.querySelector('.pv-x').onclick = function () { dlg.close(); };
    dlg.querySelector('.pv-prev').onclick = function () { go(-1); };
    dlg.querySelector('.pv-next').onclick = function () { go(1); };
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });
    var x0 = null;
    dlg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    });
  }
  document.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('.gallery .shot img');
    if (!img) return;
    if (!dlg) build();
    list = [].slice.call(img.closest('.gallery').querySelectorAll('.shot img'));
    at = list.indexOf(img);
    dlg.classList.toggle('one', list.length < 2);
    show();
    dlg.showModal();
  });
})();
