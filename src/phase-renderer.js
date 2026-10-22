// ============================================================
//  phase-renderer.js — Phase space diagram with time-gradient trail
// ============================================================
function renderPhaseSpace() {
  var c = phaseCanvas, ww = parseFloat(c.style.width), wh = 180;
  phaseCtx.clearRect(0, 0, ww, wh);
  phaseCtx.fillStyle = '#fcfaf7';
  phaseCtx.fillRect(0, 0, ww, wh);

  if (phaseData.length < 2) {
    phaseCtx.fillStyle = '#bbb';
    phaseCtx.font = '12px -apple-system,sans-serif';
    phaseCtx.textAlign = 'center';
    phaseCtx.textBaseline = 'middle';
    phaseCtx.fillText(T[lang].phaseWait || 'Collecting data…', ww / 2, wh / 2);
    drawPhaseAxes(ww, wh);
    return;
  }

  var pad = { t: 10, b: 22, l: 32, r: 8 };
  var pw = ww - pad.l - pad.r, ph = wh - pad.t - pad.b;

  var xs = phaseData.map(function (d) { return d.x; }), ys = phaseData.map(function (d) { return d.y; });
  var xMin = Math.min.apply(null, xs), xMax = Math.max.apply(null, xs);
  var yMin = Math.min.apply(null, ys), yMax = Math.max.apply(null, ys);
  var xPad = (xMax - xMin) * 0.1 || 0.1, yPad = (yMax - yMin) * 0.1 || 0.1;
  xMin -= xPad; xMax += xPad; yMin -= yPad; yMax += yPad;

  // Pre-compute all screen coordinates
  var pts = [];
  for (var i = 0; i < phaseData.length; i++) {
    pts.push({
      x: pad.l + (phaseData[i].x - xMin) / (xMax - xMin) * pw,
      y: pad.t + ph - (phaseData[i].y - yMin) / (yMax - yMin) * ph
    });
  }

  // Grid
  phaseCtx.save();
  for (var i = 0; i < 4; i++) {
    var gy = pad.t + ph * i / 4, gx = pad.l + pw * i / 4;
    phaseCtx.strokeStyle = '#eee';
    phaseCtx.lineWidth = 0.5;
    phaseCtx.beginPath();
    phaseCtx.moveTo(pad.l, gy);
    phaseCtx.lineTo(ww - pad.r, gy);
    phaseCtx.stroke();
    phaseCtx.beginPath();
    phaseCtx.moveTo(gx, pad.t);
    phaseCtx.lineTo(gx, pad.t + ph);
    phaseCtx.stroke();
  }
  if (xMin < 0 && xMax > 0) {
    var zx = pad.l + (0 - xMin) / (xMax - xMin) * pw;
    phaseCtx.strokeStyle = '#ddd';
    phaseCtx.lineWidth = 0.6;
    phaseCtx.setLineDash([3, 2]);
    phaseCtx.beginPath();
    phaseCtx.moveTo(zx, pad.t);
    phaseCtx.lineTo(zx, pad.t + ph);
    phaseCtx.stroke();
    phaseCtx.setLineDash([]);
  }
  if (yMin < 0 && yMax > 0) {
    var zy = pad.t + ph - (0 - yMin) / (yMax - yMin) * ph;
    phaseCtx.strokeStyle = '#ddd';
    phaseCtx.lineWidth = 0.6;
    phaseCtx.setLineDash([3, 2]);
    phaseCtx.beginPath();
    phaseCtx.moveTo(pad.l, zy);
    phaseCtx.lineTo(ww - pad.r, zy);
    phaseCtx.stroke();
    phaseCtx.setLineDash([]);
  }
  phaseCtx.restore();

  // Time-gradient trajectory: oldest=faint, newest=deep
  var n = pts.length;
  for (var i = 0; i < n - 1; i++) {
    var alpha = 0.15 + 0.85 * (i / (n - 1)); // 0.15 → 1.0
    phaseCtx.strokeStyle = 'rgba(30,58,95,' + alpha.toFixed(3) + ')';
    phaseCtx.lineWidth = 1.5;
    phaseCtx.beginPath();
    phaseCtx.moveTo(pts[i].x, pts[i].y);
    phaseCtx.lineTo(pts[i + 1].x, pts[i + 1].y);
    phaseCtx.stroke();
  }

  // Current state marker + direction arrow
  var last = pts[n - 1], prev = pts[n - 2];
  var lx = last.x, ly = last.y;
  var ppx = prev.x, ppy = prev.y;

  // Direction arrow
  var dx = lx - ppx, dy = ly - ppy;
  var dlen = Math.sqrt(dx * dx + dy * dy);
  if (dlen > 0.5) {
    var ux = dx / dlen, uy = dy / dlen;
    var arrowLen = CONFIG.PHASE_ARROW_LEN;
    var ax = lx + ux * 2, ay = ly + uy * 2;
    phaseCtx.save();
    phaseCtx.strokeStyle = '#e74c3c';
    phaseCtx.fillStyle = '#e74c3c';
    phaseCtx.lineWidth = 2;
    phaseCtx.lineCap = 'round';
    phaseCtx.beginPath();
    phaseCtx.moveTo(lx, ly);
    phaseCtx.lineTo(ax, ay);
    phaseCtx.stroke();
    // Arrowhead
    var tipX = ax, tipY = ay;
    var perpX = -uy, perpY = ux;
    phaseCtx.beginPath();
    phaseCtx.moveTo(tipX, tipY);
    phaseCtx.lineTo(tipX - ux * arrowLen + perpX * arrowLen * 0.4, tipY - uy * arrowLen + perpY * arrowLen * 0.4);
    phaseCtx.lineTo(tipX - ux * arrowLen - perpX * arrowLen * 0.4, tipY - uy * arrowLen - perpY * arrowLen * 0.4);
    phaseCtx.closePath();
    phaseCtx.fill();
    phaseCtx.restore();
  }

  // State marker dot (drawn last, on top of everything)
  phaseCtx.save();
  phaseCtx.fillStyle = '#e74c3c';
  phaseCtx.beginPath();
  phaseCtx.arc(lx, ly, CONFIG.PHASE_MARKER_R, 0, 6.283);
  phaseCtx.fill();
  phaseCtx.strokeStyle = '#fff';
  phaseCtx.lineWidth = 1.5;
  phaseCtx.stroke();
  phaseCtx.restore();

  // Axis labels
  var p = mode === MODE.PENDULUM;
  phaseCtx.save();
  phaseCtx.fillStyle = '#999';
  phaseCtx.font = '9px -apple-system,sans-serif';
  phaseCtx.textAlign = 'center';
  phaseCtx.textBaseline = 'top';
  phaseCtx.fillText(p ? 'θ (rad)' : 'x (m)', ww / 2, pad.t + ph + 9);
  phaseCtx.save();
  phaseCtx.translate(pad.l - 18, wh / 2);
  phaseCtx.rotate(-Math.PI / 2);
  phaseCtx.fillText(p ? 'ω (rad/s)' : 'v (m/s)', 0, 0);
  phaseCtx.restore();

  phaseCtx.fillStyle = '#bbb';
  phaseCtx.font = '7px -apple-system,sans-serif';
  phaseCtx.textAlign = 'right';
  phaseCtx.textBaseline = 'bottom';
  phaseCtx.fillText(xMax.toFixed(2), ww - pad.r, pad.t + ph + 8);
  phaseCtx.fillText(xMin.toFixed(2), pad.l, pad.t + ph + 8);
  phaseCtx.restore();
}

function drawPhaseAxes(ww, wh) {
  var pad = { t: 10, b: 22, l: 32, r: 8 };
  phaseCtx.save();
  phaseCtx.strokeStyle = '#ddd';
  phaseCtx.lineWidth = 0.6;
  phaseCtx.beginPath();
  phaseCtx.moveTo(pad.l, pad.t);
  phaseCtx.lineTo(pad.l, pad.t + wh - pad.t - pad.b);
  phaseCtx.stroke();
  phaseCtx.beginPath();
  phaseCtx.moveTo(pad.l, pad.t + wh - pad.t - pad.b);
  phaseCtx.lineTo(ww - pad.r, pad.t + wh - pad.t - pad.b);
  phaseCtx.stroke();
  phaseCtx.fillStyle = '#bbb';
  phaseCtx.font = '9px -apple-system,sans-serif';
  phaseCtx.textAlign = 'center';
  phaseCtx.textBaseline = 'top';
  var p = mode === MODE.PENDULUM;
  phaseCtx.fillText(p ? 'θ (rad)' : 'x (m)', ww / 2, pad.t + wh - pad.t - pad.b + 9);
  phaseCtx.restore();
}
