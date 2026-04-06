// Agentation loader for static HTML pages
// Loads React + Agentation from CDN and mounts the annotation toolbar
(function () {
  // Load React and ReactDOM
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.crossOrigin = 'anonymous';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function init() {
    // Skip if already loaded
    if (document.getElementById('agentation-root')) return;

    await loadScript('https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js');

    // Import Agentation as ESM
    const { Agentation } = await import('https://cdn.jsdelivr.net/npm/agentation/dist/index.mjs');

    // Mount
    const container = document.createElement('div');
    container.id = 'agentation-root';
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    root.render(
      React.createElement(Agentation, {
        endpoint: 'http://localhost:4747',
      })
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
