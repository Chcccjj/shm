// ============================================================
//  spring-renderer.js — Spring oscillator scene rendering
// ============================================================
function drawSpringCoils(cx, ty, by, coils, amp) {
  var h = by - ty, verts = coils * 2;
  ctx.save();
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, ty);
  for (var i = 1; i < verts; i++) ctx.lineTo(cx + (i % 2 === 1 ? -amp : amp), ty + h * i / verts);
  ctx.lineTo(cx, by);
  ctx.stroke();
  ctx.restore();
}

function drawBlock(cx, ty, m, gc) {
  var w = CONFIG.BLOCK_WIDTH_BASE + m * 4, h = CONFIG.BLOCK_HEIGHT, x = cx - w / 2, gr = ctx.createLinearGradient(x, ty, x + w, ty + h);
  gr.addColorStop(0, gc[0]);
  gr.addColorStop(1, gc[1]);
  ctx.fillStyle = gr;
  ctx.fillRect(x, ty, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,.12)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, ty, w, h);
}

function drawScale(cx, ry, cy, h) {
  ctx.save();
  ctx.fillStyle = '#9a958f';
  ctx.font = '9px -apple-system,sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (var i = -8; i <= 8; i += 2) {
    var y = ry + i * 20;
    if (y < 45 || y > h - 10) continue;
    if (i === 0) {
      ctx.strokeStyle = '#bbb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 18, y);
      ctx.lineTo(cx + 18, y);
      ctx.stroke();
      ctx.fillStyle = '#999';
      ctx.fillText('x=0', cx - 22, y);
    } else {
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - 8, y);
      ctx.lineTo(cx + 8, y);
      ctx.stroke();
      ctx.fillStyle = '#bbb';
      var v = (-i * 0.05).toFixed(2);
      ctx.fillText((v > 0 ? '+' : '') + v + 'm', cx - 12, y);
    }
  }
  if (Math.abs(cy - ry) > 3) {
    ctx.strokeStyle = '#c45a3c';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx + 28, ry);
    ctx.lineTo(cx + 28, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#c45a3c';
    ctx.font = 'bold 9px -apple-system,sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var p = -(cy - ry) / CONFIG.SPRING_SCALE, l = p >= 0 ? 'x=+' + p.toFixed(3) + 'm' : 'x=' + p.toFixed(3) + 'm';
    ctx.fillText(l, cx + 32, (cy + ry) / 2);
  }
  ctx.restore();
}

function renderSpring() {
  var w = parseFloat(canvas.style.width), h = parseFloat(canvas.style.height);
  var cx = w / 2, sy = CONFIG.SPRING_SUPPORT_Y, av = h - sy - 35, ry = sy + av * CONFIG.SPRING_AVAIL_DIV, by = ry - springS.x * CONFIG.SPRING_SCALE;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fcfaf7';
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.strokeStyle = '#f0ede8';
  ctx.lineWidth = 0.5;
  for (var r = 0; r < 10; r++) {
    var y = sy + (h - sy - 10) * (r / 10);
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(w - 10, y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = '#555';
  ctx.fillRect(cx - 46, sy - 3, 92, 6);
  ctx.fillRect(cx - 50, sy - 1, 4, 4);
  ctx.fillRect(cx + 46, sy - 1, 4, 4);
  drawScale(cx, ry, by, h);
  ctx.save();
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(cx - 24, ry);
  ctx.lineTo(w - 10, ry);
  ctx.stroke();
  ctx.restore();

  var st = sy + 8, bh = CONFIG.BLOCK_HEIGHT + mass * 2, bt = by - bh / 2;
  drawSpringCoils(cx, st, bt, CONFIG.SPRING_COILS, CONFIG.SPRING_AMP);
  drawBlock(cx, bt, mass, ['#5a8aaa', '#2a5070']);

  if (showForces) {
    var blockCx = cx, blockCy = bt + bh / 2, mg = mass * g;
    var springForce = k * Math.abs(springS.x);
    var maxF = Math.max(mg, springForce, 1e-6);
    var fs = CONFIG.FORCE_SCALE / maxF;
    drawArrow(blockCx, blockCy, 0, mg, '#f39c12', 'mg', fs);
    var dir = springS.x > 0 ? -1 : 1;
    if (Math.abs(springS.x) > 0.0005) drawArrow(blockCx, blockCy, 0, springForce * dir, '#2ecc71', 'F=−kx', fs);
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
