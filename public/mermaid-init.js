// Renders ```mermaid code blocks (as emitted by Starlight's expressive-code)
// into real diagrams using mermaid.js, and re-renders on light/dark theme switch.
(() => {
  if (window.__mermaidInit) return;
  window.__mermaidInit = true;

  let mermaid = null;
  let pass = 0;
  const themeName = () =>
    document.documentElement.dataset.theme === 'light' ? 'default' : 'dark';

  // Convert each expressive-code mermaid block into a .mermaid container once,
  // preserving the diagram source (with newlines) in data-src.
  function collect() {
    document.querySelectorAll('pre[data-language="mermaid"]').forEach((pre) => {
      const figure = pre.closest('figure') || pre;
      const lines = pre.querySelectorAll('.ec-line');
      const src = lines.length
        ? Array.from(lines).map((l) => l.textContent).join('\n')
        : pre.textContent;
      const holder = document.createElement('div');
      holder.className = 'mermaid';
      holder.dataset.src = src.trim();
      figure.replaceWith(holder);
    });
  }

  async function render() {
    collect();
    const nodes = Array.from(document.querySelectorAll('.mermaid[data-src]'));
    if (!nodes.length) return;
    if (!mermaid) {
      try {
        mermaid = (await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs')).default;
      } catch (e) {
        console.error('mermaid load failed', e);
        return;
      }
    }
    mermaid.initialize({ startOnLoad: false, theme: themeName(), securityLevel: 'strict' });
    pass += 1;
    let i = 0;
    for (const n of nodes) {
      try {
        const { svg } = await mermaid.render('mmd-' + pass + '-' + i++, n.dataset.src);
        n.innerHTML = svg;
      } catch (e) {
        console.error('mermaid render', e);
      }
    }
  }

  function init() {
    render();
    new MutationObserver((m) => {
      if (m.some((x) => x.attributeName === 'data-theme')) render();
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
