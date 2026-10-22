// ============================================================
//  pendulum-renderer.js — Pendulum scene rendering
// ============================================================
function renderPendulum() {
  var w = parseFloat(canvas.style.width), h = parseFloat(canvas.style.height);
  var cx = w / 2, pivotY = CONFIG.PIVOT_Y, scale = (h - pivotY - 20) / CONFIG.PENDULUM_SCALE_DIV;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fcfaf7';
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.strokeStyle = '#f0ede8';
  ctx.lineWidth = 0.5;
  for (var r = 0; r < 10; r++) {
    var y = pivotY + (h - pivotY - 10) * (r / 10);
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(w - 10, y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = '#d0ccc6';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx, pivotY);
  ctx.lineTo(cx, h - 8);
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, pivotY, 4, 0, 6.283);
  ctx.fillStyle = '#555';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, pivotY, 6, 0, 6.283);
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  if (Math.abs(pend.theta) > 0.005) {
    var ar = 30, a0 = Math.PI / 2, a1 = Math.PI / 2 - pend.theta;
    ctx.save();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = '#b0aaa4';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(cx, pivotY, ar, Math.min(a0, a1), Math.max(a0, a1));
    ctx.stroke();
    ctx.restore();
    var mid = Math.PI / 2 - pend.theta / 2, lr = ar + 12;
    ctx.save();
    ctx.fillStyle = '#8a8480';
    ctx.font = '10px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((pend.theta * 180 / Math.PI).toFixed(1) + '°', cx + lr * Math.cos(mid), pivotY + lr * Math.sin(mid));
    ctx.restore();
  }

  var bx = cx + L * scale * Math.sin(pend.theta), by = pivotY + L * scale * Math.cos(pend.theta);
  var off = CONFIG.DUAL_OFFSET, bx2 = cx + off + L * scale * Math.sin(pend2.theta), by2 = pivotY + L * scale * Math.cos(pend2.theta);
  var DUAL_MASS = CONFIG.DUAL_MASS;

  if (dualMode) {
    ctx.save();
    ctx.globalAlpha = 0.85;
    drawPendulum(cx + off, pivotY, scale, pend2.theta, DUAL_MASS, false);
    ctx.restore();
    drawPendulum(cx - off, pivotY, scale, pend.theta, mass, true);
    ctx.save();
    ctx.font = '10px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#1e3a5f';
    ctx.fillText('m₁=' + mass.toFixed(2) + 'kg', cx - off, Math.min(by, h - 22) + 4);
    ctx.fillStyle = '#c45a3c';
    ctx.fillText('m₂=' + DUAL_MASS.toFixed(2) + 'kg', cx + off, Math.min(by2, h - 22) + 4);
    ctx.restore();
  } else {
    drawPendulum(cx, pivotY, scale, pend.theta, mass, true);
  }

  if (showForces) {
    var mg = mass * g, mg2 = DUAL_MASS * g;
    var fScale = CONFIG.FORCE_SCALE / Math.max(mg * 1.3, 1e-6);
    var tMag = mg * Math.cos(pend.theta) + mass * L * pend.omega * pend.omega;
    var tDx = -(bx - cx), tDy = -(by - pivotY);
    var tLen = Math.sqrt(tDx * tDx + tDy * tDy) || 1;
    drawArrow(bx, by, tDx / tLen * tMag, tDy / tLen * tMag, '#e74c3c', 'T', fScale);
    drawArrow(bx, by, 0, mg, '#f39c12', 'mg', fScale);
    var rF = mg * Math.sin(Math.abs(pend.theta));
    var tDir = (pend.theta > 0 ? -1 : 1);
    var nx = Math.cos(pend.theta), ny = -Math.sin(pend.theta);
    if (rF > 0.001) drawArrow(bx, by, nx * rF * tDir, ny * rF * tDir, '#2ecc71', 'Fᵣ', fScale);
    if (dualMode) {
      var tMag2 = mg2 * Math.cos(pend2.theta) + DUAL_MASS * L * pend2.omega * pend2.omega;
      var tDx2 = -(bx2 - (cx + off)), tDy2 = -(by2 - pivotY);
      var tLen2 = Math.sqrt(tDx2 * tDx2 + tDy2 * tDy2) || 1;
      drawArrow(bx2, by2, tDx2 / tLen2 * tMag2, tDy2 / tLen2 * tMag2, '#ff7675', 'T', fScale);
      drawArrow(bx2, by2, 0, mg2, '#f9ca24', 'mg', fScale);
      var rF2 = mg2 * Math.sin(Math.abs(pend2.theta));
      var tDir2 = (pend2.theta > 0 ? -1 : 1);
      var nx2 = Math.cos(pend2.theta), ny2 = -Math.sin(pend2.theta);
      if (rF2 > 0.001) drawArrow(bx2, by2, nx2 * rF2 * tDir2, ny2 * rF2 * tDir2, '#55efc4', 'Fᵣ', fScale);
    }
  }

  if (zeta > 0.005) {
    ctx.save();
    ctx.fillStyle = '#9a958f';
    ctx.font = '10px -apple-system,sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('ζ = ' + zeta.toFixed(2), w - 12, h - 6);
    ctx.restore();
  }
}

function drawPendulum(px, py, sc, t, mb, pr) {
  var x = px + L * sc * Math.sin(t), y = py + L * sc * Math.cos(t);
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(x, y);
  ctx.strokeStyle = pr ? '#555' : '#b0a8a0';
  ctx.lineWidth = pr ? 1.5 : 1.2;
  ctx.stroke();
  var r = CONFIG.BOB_RADIUS_FACTOR * Math.pow(mb, 0.35), gr = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, 1, x, y, r);
  if (pr) {
    gr.addColorStop(0, '#609abf');
    gr.addColorStop(0.6, '#2c5f7c');
    gr.addColorStop(1, '#1a3a52');
  } else {
    gr.addColorStop(0, '#f0a078');
    gr.addColorStop(0.6, '#d4774a');
    gr.addColorStop(1, '#b05030');
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 6.283);
  ctx.fillStyle = gr;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.12)';
  ctx.lineWidth = 1;
  ctx.stroke();
}
