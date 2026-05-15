(function () {
  'use strict';

  const DEFAULTS = { baseColor: '#ff6600', brightness: 100, enabled: true };

  let originalHref = null;

  function getFaviconEl() {
    return (
      document.querySelector("link[rel~='icon']") ||
      document.querySelector("link[rel='shortcut icon']")
    );
  }

  function saveOriginalFavicon() {
    if (originalHref !== null) return;
    const el = getFaviconEl();
    originalHref = el ? el.href : '';
  }

  function setFavicon(url) {
    let el = getFaviconEl();
    if (!el) {
      el = document.createElement('link');
      el.rel = 'icon';
      document.head.appendChild(el);
    }
    el.href = url;
  }

  function hexToRgb(hex) {
    const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  function coloredSquare(baseColor, brightness) {
    const rgb = hexToRgb(baseColor) ?? { r: 255, g: 102, b: 0 };
    const f   = brightness / 100;
    const r   = Math.min(255, Math.round(rgb.r * f));
    const g   = Math.min(255, Math.round(rgb.g * f));
    const b   = Math.min(255, Math.round(rgb.b * f));
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 32;
    const ctx = canvas.getContext('2d');
    // Rounded square
    const radius = 6;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.beginPath();
    ctx.roundRect(0, 0, 32, 32, radius);
    ctx.fill();
    return canvas.toDataURL();
  }

  function refresh() {
    chrome.storage.sync.get(DEFAULTS, (s) => {
      const enabled    = s.enabled    ?? DEFAULTS.enabled;
      const baseColor  = s.baseColor  ?? DEFAULTS.baseColor;
      const brightness = s.brightness ?? DEFAULTS.brightness;

      if (!enabled || document.visibilityState === 'visible') {
        // Active tab — restore original favicon
        if (originalHref) setFavicon(originalHref);
      } else {
        // Inactive tab — show coloured square in tab strip
        setFavicon(coloredSquare(baseColor, brightness));
      }
    });
  }

  // Capture the original favicon once the DOM is ready, then apply initial state
  saveOriginalFavicon();
  refresh();

  document.addEventListener('visibilitychange', refresh);
  chrome.storage.onChanged.addListener(refresh);
})();
