(function () {
  'use strict';

  const DEFAULTS = { baseColor: '#ff6600', brightness: 100, height: 6, enabled: true };

  // Create the bar immediately at document_start — before any page content loads
  const bar = document.createElement('div');
  bar.id = '__athl_bar__';
  bar.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'right:0',
    'z-index:2147483647',
    'pointer-events:none',
    'opacity:0',
    'transition:opacity 0.15s ease',
  ].join(';');
  document.documentElement.appendChild(bar);

  function hexToRgb(hex) {
    const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  function applySettings(s) {
    const baseColor  = s.baseColor  ?? DEFAULTS.baseColor;
    const brightness = s.brightness ?? DEFAULTS.brightness;
    const height     = s.height     ?? DEFAULTS.height;
    const enabled    = s.enabled    ?? DEFAULTS.enabled;

    const rgb = hexToRgb(baseColor) ?? hexToRgb(DEFAULTS.baseColor);
    const f   = brightness / 100;
    const r   = Math.min(255, Math.round(rgb.r * f));
    const g   = Math.min(255, Math.round(rgb.g * f));
    const b   = Math.min(255, Math.round(rgb.b * f));

    bar.style.backgroundColor = `rgb(${r},${g},${b})`;
    bar.style.height           = `${height}px`;
    bar.style.opacity          = (enabled && document.visibilityState !== 'hidden') ? '1' : '0';
  }

  function refresh() {
    chrome.storage.sync.get(DEFAULTS, applySettings);
  }

  // Apply on load, on tab switch, and whenever settings change
  refresh();
  document.addEventListener('visibilitychange', refresh);
  chrome.storage.onChanged.addListener(refresh);
})();
