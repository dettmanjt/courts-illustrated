// Click-to-play: any link to a YouTube video opens an on-site player instead of leaving.
// The YouTube player only loads after a click, so pages stay fast.
(function () {
  var dlg;
  function idFrom(href) {
    var m = href.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([\w-]{11})/);
    return m && m[1];
  }
  function close() {
    dlg.querySelector('.ytp-box').innerHTML = '';
    if (dlg.open) dlg.close();
  }
  function open(id, title) {
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'ytp';
      dlg.innerHTML = '<div class="ytp-bar"><a class="ytp-out" target="_blank" rel="noopener">Open on YouTube ↗</a><button type="button" class="ytp-x" aria-label="Close video">✕</button></div><div class="ytp-box"></div>';
      document.body.appendChild(dlg);
      dlg.querySelector('.ytp-x').addEventListener('click', close);
      dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
      dlg.addEventListener('close', function () { dlg.querySelector('.ytp-box').innerHTML = ''; });
    }
    dlg.querySelector('.ytp-out').href = 'https://www.youtube.com/watch?v=' + id;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
    f.title = title || 'YouTube video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    dlg.querySelector('.ytp-box').appendChild(f);
    dlg.showModal();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.classList.contains('ytp-out')) return;
    var id = idFrom(a.href);
    if (!id) return;
    e.preventDefault();
    open(id, a.getAttribute('aria-label') || a.textContent.trim());
  });
})();
