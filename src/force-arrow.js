// ============================================================
//  force-arrow.js — Vector arrow with white outline
// ============================================================
function drawArrow(x, y, dx, dy, color, label, scale) {
  var len = Math.sqrt(dx * dx + dy * dy) * scale;
  if (len < 4) return;
  var a = Math.atan2(dy, dx), hl = Math.min(9, len * 0.35);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.strokeStyle = 'rgba(255,255,255,.85)';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len, 0);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len, 0);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(len, 0);
  ctx.lineTo(len - hl, -5);
  ctx.lineTo(len - hl, 5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.85)';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();
  if (label) {
    ctx.fillStyle = color;
    ctx.font = 'bold 11px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, len / 2, -6);
  }
  ctx.restore();
}
