// ============================================================
//  waveform-renderer.js — Dual-curve waveform (displacement + velocity)
// ============================================================
function renderWaveform() {
  var c = wCanvas, ww = parseFloat(c.style.width), wh = 100;
  wCtx.clearRect(0, 0, ww, wh);
  wCtx.fillStyle = '#fcfaf7';
  wCtx.fillRect(0, 0, ww, wh);

  if (waveData.length < 2) {
    wCtx.fillStyle = '#bbb';
    wCtx.font = '12px -apple-system,sans-serif';
    wCtx.textAlign = 'center';
    wCtx.textBaseline = 'middle';
    wCtx.fillText(T[lang].waveWait || 'Collecting data…', ww / 2, wh / 2);
    return;
  }

  var pad = { t: 8, b: 18, l: 6, r: 10 };
  var pw = ww - pad.l - pad.r, ph = wh - pad.t - pad.b;
  var t0 = waveData[0].t, t1 = waveData[waveData.length - 1].t, tr = t1 - t0 || 0.01;

  // Combined auto-scale for both curves
  var dispVals = waveData.map(function (d) { return d.disp; });
  var velVals = waveData.map(function (d) { return d.vel; });
  var mn = Math.min(Math.min.apply(null, dispVals), Math.min.apply(null, velVals));
  var mx = Math.max(Math.max.apply(null, dispVals), Math.max.apply(null, velVals));
  if (mx - mn < 1e-8) { mn -= 0.01; mx += 0.01; }
  var vr = mx - mn;

  // Grid lines
  wCtx.save();
  for (var i = 0; i < 4; i++) {
    var y = pad.t + ph * i / 4;
    wCtx.strokeStyle = '#eee';
    wCtx.lineWidth = 0.5;
    wCtx.beginPath();
    wCtx.moveTo(pad.l, y);
    wCtx.lineTo(ww - pad.r, y);
    wCtx.stroke();
  }
  if (mn < 0 && mx > 0) {
    var zy = pad.t + ph * mx / vr;
    wCtx.strokeStyle = '#ddd';
    wCtx.lineWidth = 0.6;
    wCtx.setLineDash([3, 2]);
    wCtx.beginPath();
    wCtx.moveTo(pad.l, zy);
    wCtx.lineTo(ww - pad.r, zy);
    wCtx.stroke();
    wCtx.setLineDash([]);
  }
  wCtx.restore();

  // Curve 1: Displacement (dark blue #1e3a5f)
  wCtx.save();
  wCtx.strokeStyle = '#1e3a5f';
  wCtx.lineWidth = 1.5;
  wCtx.beginPath();
  for (var i = 0; i < waveData.length; i++) {
    var x = pad.l + (waveData[i].t - t0) / tr * pw;
    var yDisp = pad.t + ph - (waveData[i].disp - mn) / vr * ph;
    i === 0 ? wCtx.moveTo(x, yDisp) : wCtx.lineTo(x, yDisp);
  }
  wCtx.stroke();

  // Curve 2: Velocity (orange #c45a3c)
  wCtx.strokeStyle = '#c45a3c';
  wCtx.lineWidth = 1.5;
  wCtx.beginPath();
  for (var i = 0; i < waveData.length; i++) {
    var x = pad.l + (waveData[i].t - t0) / tr * pw;
    var yVel = pad.t + ph - (waveData[i].vel - mn) / vr * ph;
    i === 0 ? wCtx.moveTo(x, yVel) : wCtx.lineTo(x, yVel);
  }
  wCtx.stroke();
  wCtx.restore();

  // Scale labels
  wCtx.save();
  wCtx.fillStyle = '#1e3a5f';
  wCtx.font = '8px -apple-system,sans-serif';
  wCtx.textAlign = 'right';
  wCtx.textBaseline = 'bottom';
  wCtx.fillText(mx.toFixed(2), pad.l + 1, pad.t + 8);
  wCtx.fillText(mn.toFixed(2), pad.l + 1, pad.t + ph);
  wCtx.textAlign = 'right';
  wCtx.textBaseline = 'top';
  wCtx.fillStyle = '#999';
  wCtx.fillText((t1 - t0).toFixed(1) + 's', ww - pad.r, pad.t + ph + 2);
  wCtx.fillText('0', pad.l, pad.t + ph + 2);
  wCtx.fillStyle = '#999';
  wCtx.textAlign = 'center';
  wCtx.textBaseline = 'top';
  wCtx.fillText('t', ww - pad.r - 10, pad.t + ph + 4);
  wCtx.restore();

  // Legend: two curves
  var p = mode === MODE.PENDULUM;
  var dispLabel = p ? 'θ' : 'x';
  var velLabel = p ? 'ω' : 'v';
  wCtx.save();
  var legX = ww - 62, legY = 4;
  wCtx.fillStyle = 'rgba(255,255,255,.85)';
  wCtx.fillRect(legX - 2, legY, 58, 22);
  // Disp line
  wCtx.strokeStyle = '#1e3a5f';
  wCtx.lineWidth = 1.5;
  wCtx.beginPath();
  wCtx.moveTo(legX, legY + 6);
  wCtx.lineTo(legX + 10, legY + 6);
  wCtx.stroke();
  wCtx.fillStyle = '#555';
  wCtx.font = '7px -apple-system,sans-serif';
  wCtx.textAlign = 'left';
  wCtx.textBaseline = 'middle';
  wCtx.fillText(dispLabel, legX + 13, legY + 6);
  // Vel line
  wCtx.strokeStyle = '#c45a3c';
  wCtx.lineWidth = 1.5;
  wCtx.beginPath();
  wCtx.moveTo(legX, legY + 17);
  wCtx.lineTo(legX + 10, legY + 17);
  wCtx.stroke();
  wCtx.fillStyle = '#555';
  wCtx.fillText(velLabel, legX + 13, legY + 17);
  wCtx.restore();
}
