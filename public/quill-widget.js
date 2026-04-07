// Quill Chat Widget — AirOps
// Drop <script src="quill-widget.js" defer></script> into any page.
(function () {
  const CSS = `
    .quill-fab {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 48px; height: 48px; border-radius: 50%;
      background: #002910; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.18);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .quill-fab:hover { transform: scale(1.08); box-shadow: 0 6px 18px rgba(0,0,0,0.24); }
    .quill-fab i { font-size: 22px; color: #00ff64; }
    .quill-fab.open { display: none; }

    .quill-panel {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 400px; height: 520px;
      background: #fff; border: 1px solid #ecedef; border-radius: 12px;
      box-shadow: 0 1px 3px rgba(16,24,40,0.1);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'Inter', 'Saans', -apple-system, sans-serif;
    }
    .quill-panel.open { display: flex; }

    .quill-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 11px 16px; border-bottom: 1px solid #ecedef;
      flex-shrink: 0;
    }
    .quill-header-left { display: flex; align-items: center; gap: 8px; }
    .quill-header-icon {
      width: 20px; height: 20px; background: #dfeae3; border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; color: #002910;
    }
    .quill-header-title { font-size: 14px; font-weight: 600; color: #09090b; }
    .quill-header-actions { display: flex; align-items: center; gap: 8px; }
    .quill-header-btn {
      width: 26px; height: 26px; border-radius: 6px;
      background: rgba(9,9,11,0.04); border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #676c79; font-size: 14px; padding: 0;
    }
    .quill-header-btn:hover { background: rgba(9,9,11,0.08); }
    .quill-header-sep { width: 1px; height: 20px; background: #ecedef; }
    .quill-close-btn {
      width: 26px; height: 26px; border-radius: 6px;
      background: #fff; border: 1px solid rgba(9,9,11,0.08);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #676c79; font-size: 14px; padding: 0;
    }
    .quill-close-btn:hover { background: #f5f5f5; }

    .quill-body {
      flex: 1; overflow-y: auto; padding: 24px 16px 12px 8px;
      display: flex; flex-direction: column; gap: 16px; justify-content: flex-end;
    }
    .quill-msg-user {
      align-self: flex-end; max-width: 262px;
      background: #dfeae3; border-radius: 8px; padding: 8px;
      font-size: 13px; line-height: 16px; color: #09090b;
    }
    .quill-msg-ai {
      padding: 0 8px; font-size: 13px; line-height: 20px; color: #09090b;
    }
    .quill-msg-ai p { margin: 0 0 4px; }
    .quill-msg-ai ul { margin: 8px 0; padding-left: 20px; }
    .quill-msg-ai li { margin-bottom: 12px; line-height: 20px; }
    .quill-msg-ai li:last-child { margin-bottom: 0; }

    .quill-input-wrap { padding: 12px 16px; flex-shrink: 0; }
    .quill-input-box {
      border: 1px solid #ecedef; border-radius: 8px; padding: 8px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .quill-chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .quill-chip {
      display: inline-flex; align-items: center; gap: 5px;
      border: 1px solid rgba(9,9,11,0.08); border-radius: 6px;
      padding: 1px 6px; font-size: 12px; color: #525254; background: #fff;
    }
    .quill-chip svg { width: 12px; height: 12px; opacity: 0.5; }
    .quill-textarea {
      border: none; outline: none; resize: none;
      font-size: 13px; line-height: 20px; color: #09090b;
      font-family: inherit; width: 100%; min-height: 20px;
    }
    .quill-textarea::placeholder { color: #808593; }
    .quill-input-footer {
      display: flex; align-items: center; justify-content: space-between;
    }
    .quill-add-btn {
      width: 24px; height: 24px; border: none; background: #fff;
      border-radius: 6px; cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      color: #676c79; font-size: 16px; padding: 0;
    }
    .quill-add-btn:hover { background: rgba(9,9,11,0.04); }
    .quill-footer-right { display: flex; align-items: center; gap: 8px; }
    .quill-model-btn {
      display: flex; align-items: center; gap: 6px;
      background: #fff; border: none; border-radius: 6px;
      padding: 2px 8px; font-size: 12px; color: #676c79;
      cursor: pointer; font-family: inherit;
    }
    .quill-model-btn:hover { background: rgba(9,9,11,0.04); }
    .quill-model-btn svg { width: 10px; height: 10px; }
    .quill-send-btn {
      width: 24px; height: 24px; border-radius: 6px;
      background: #2f2f37; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; padding: 0;
    }
    .quill-send-btn svg { width: 10px; height: 10px; }

    @media (max-width: 480px) {
      .quill-panel { width: calc(100vw - 32px); height: 70vh; right: 16px; bottom: 16px; }
    }
  `;

  const HTML = `
    <button class="quill-fab" id="quillFab" aria-label="Open Quill chat">
      <i class="ri-quill-pen-line"></i>
    </button>
    <div class="quill-panel" id="quillPanel">
      <div class="quill-header">
        <div class="quill-header-left">
          <div class="quill-header-icon">
            <i class="ri-quill-pen-line"></i>
          </div>
          <span class="quill-header-title">Quill</span>
        </div>
        <div class="quill-header-actions">
          <button class="quill-header-btn" title="New chat">+</button>
          <button class="quill-header-btn" title="Minimize">&minus;</button>
          <div class="quill-header-sep"></div>
          <button class="quill-close-btn" id="quillClose" title="Close">&minus;</button>
        </div>
      </div>
      <div class="quill-body">
        <div class="quill-msg-ai">
          <p>Hi! I'm Quill - your learning assistant. Feel free to ask me questions as you embark on your AirOps learning journey! You can ask me things like...</p>
          <ul>
            <li>What is AEO and how is it different from SEO?</li>
            <li>How do I set up my first Brand Kit?</li>
            <li>What's the CITED framework?</li>
            <li>How do I track AI citations for my brand?</li>
          </ul>
        </div>
      </div>
      <div class="quill-input-wrap">
        <div class="quill-input-box">
          <div class="quill-chip-row">
            <span class="quill-chip">
              <svg viewBox="0 0 12 12" fill="none"><path d="M2 1.5h5.5a1 1 0 011 1v8l-3-1.5L2 10.5v-9z" stroke="currentColor" stroke-width="1"/></svg>
              Blog Refresh
              <svg viewBox="0 0 12 12" fill="none" style="cursor:pointer"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" stroke="currentColor" stroke-width="1"/></svg>
            </span>
          </div>
          <textarea class="quill-textarea" rows="1" placeholder="Ask Quill, @ for context"></textarea>
          <div class="quill-input-footer">
            <button class="quill-add-btn" title="Add context">+</button>
            <div class="quill-footer-right">
              <button class="quill-model-btn">
                Opus 4.6
                <svg viewBox="0 0 10 10" fill="none"><path d="M2.5 4L5 6.5 7.5 4" stroke="currentColor" stroke-width="1.2"/></svg>
              </button>
              <button class="quill-send-btn" title="Send">
                <svg viewBox="0 0 10 10" fill="none"><path d="M5 8V2M5 2L2.5 4.5M5 2l2.5 2.5" stroke="#fff" stroke-width="1.2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Inject Remix Icon CDN if not already loaded
  if (!document.querySelector('link[href*="remixicon"]')) {
    const riLink = document.createElement('link');
    riLink.rel = 'stylesheet';
    riLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css';
    document.head.appendChild(riLink);
  }

  // Inject agentation loader if not already loaded
  if (!document.querySelector('script[src*="agentation-loader"]')) {
    const agScript = document.createElement('script');
    agScript.src = 'agentation-loader.js';
    agScript.defer = true;
    document.head.appendChild(agScript);
  }

  // Inject
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.innerHTML = HTML;
  document.body.appendChild(container);

  // Toggle
  const fab = document.getElementById('quillFab');
  const panel = document.getElementById('quillPanel');
  const close = document.getElementById('quillClose');

  fab.addEventListener('click', () => {
    fab.classList.add('open');
    panel.classList.add('open');
  });
  close.addEventListener('click', () => {
    panel.classList.remove('open');
    fab.classList.remove('open');
  });
})();
