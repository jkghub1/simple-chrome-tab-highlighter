(function () {
  'use strict';

  const DEFAULTS = { baseColor: '#ff6600', brightness: 100, height: 6, enabled: true };

  const els = {
    color:      document.getElementById('color'),
    brightness: document.getElementById('brightness'),
    bval:       document.getElementById('bval'),
    height:     document.getElementById('height'),
    hval:       document.getElementById('hval'),
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
    const color = computeColor(els.color.value, parseInt(els.brightness.value));
    els.preview.style.backgroundColor = color;
    els.bval.textContent = `${els.brightness.value}%`;
    els.hval.textContent = `${els.height.value} px`;
  }

  function save() {
    updatePreview();
    chrome.storage.sync.set({
      baseColor:  els.color.value,
      brightness: parseInt(els.brightness.value),
      height:     parseInt(els.height.value),
      enabled:    els.enabled.checked,
    });
  }

  // Load saved settings and populate controls
  chrome.storage.sync.get(DEFAULTS, (s) => {
    els.color.value      = s.baseColor;
    els.brightness.value = s.brightness;
    els.height.value     = s.height;
    els.enabled.checked  = s.enabled;
    updatePreview();
  });

  // Save on any change
  els.color.addEventListener('input', save);
  els.brightness.addEventListener('input', save);
  els.height.addEventListener('input', save);
  els.enabled.addEventListener('change', save);
})();
