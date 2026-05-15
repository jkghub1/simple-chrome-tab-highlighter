(function () {
  'use strict';

  const DEFAULTS = { baseColor: '#ff6600', brightness: 100, enabled: true };

  const els = {
    color:      document.getElementById('color'),
    brightness: document.getElementById('brightness'),
    bval:       document.getElementById('bval'),
    enabled:    document.getElementById('enabled'),
    preview:    document.getElementById('preview'),
  };

  function hexToRgb(hex) {
    const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  function computeColor(baseColor, brightness) {
    const rgb = hexToRgb(baseColor) ?? hexToRgb(DEFAULTS.baseColor);
    const f   = brightness / 100;
    const r   = Math.min(255, Math.round(rgb.r * f));
    const g   = Math.min(255, Math.round(rgb.g * f));
    const b   = Math.min(255, Math.round(rgb.b * f));
    return `rgb(${r},${g},${b})`;
  }

  function updatePreview() {
    els.preview.style.backgroundColor = computeColor(els.color.value, parseInt(els.brightness.value));
    els.bval.textContent = `${els.brightness.value}%`;
  }

  function save() {
    updatePreview();
    chrome.storage.sync.set({
      baseColor:  els.color.value,
      brightness: parseInt(els.brightness.value),
      enabled:    els.enabled.checked,
    });
  }

  chrome.storage.sync.get(DEFAULTS, (s) => {
    els.color.value      = s.baseColor;
    els.brightness.value = s.brightness;
    els.enabled.checked  = s.enabled;
    updatePreview();
  });

  els.color.addEventListener('input', save);
  els.brightness.addEventListener('input', save);
  els.enabled.addEventListener('change', save);
})();
