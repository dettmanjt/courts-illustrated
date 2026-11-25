document.querySelectorAll('form.ci-form:not([data-ready])').forEach((form) => {
    form.dataset.ready = '1';
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
