// Resize a photo in the browser to at most 1600px and re-encode as JPEG.
function shrink(file, max = 1600) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

document.querySelectorAll('form.ci-form:not([data-ready])').forEach((form) => {
    form.dataset.ready = '1';
    const pre = form.querySelector('[data-prefill]');
    const want = new URLSearchParams(location.search).get('builder');
    if (pre && want && pre.querySelector(`option[value="${CSS.escape(want)}"]`)) pre.value = want;
    const page = form.querySelector('[name=page]');
    if (page) page.value = location.pathname;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const out = form.querySelector('.sent');
      const btn = form.querySelector('button[type=submit]');
      const data = Object.fromEntries(new FormData(form));
      // Join form: collect checkbox groups into comma lists.
      form.querySelectorAll('[data-group]').forEach((g) => {
        data[g.dataset.group] = [...g.querySelectorAll('input:checked')].map((i) => i.value).join(', ');
      });
      out.className = 'sent'; out.textContent = 'Sending…'; btn.disabled = true;
      try {
        for (const input of form.querySelectorAll('input[data-photos]')) {
          const max = Number(input.dataset.max || 4), size = Number(input.dataset.size || 1600);
          data[input.dataset.name || 'photos'] = await Promise.all([...input.files].slice(0, max).map((f) => shrink(f, size)));
        }
      } catch { out.className = 'sent err'; out.textContent = 'One of the photos could not be read. Try a JPG or PNG.'; btn.disabled = false; return; }
      try {
        const res = await fetch(form.dataset.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
        const body = await res.json().catch(() => ({}));
        if (!res.ok || !body.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
        form.reset();
        out.textContent = form.dataset.done || 'Thanks. Your request is in, and someone will reach out soon.';
      } catch (err) {
        out.className = 'sent err'; out.textContent = err.message;
      } finally { btn.disabled = false; }
    });
  });
