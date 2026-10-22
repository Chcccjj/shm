// ============================================================
//  physics.js — Equations of motion and energy
// ============================================================
function stepPendulum(theta, omega, L, g, z, dt) {
  var w0 = Math.sqrt(g / L), gamma = 2 * z * w0, alpha = -(g / L) * Math.sin(theta) - gamma * omega;
  omega += alpha * dt;
  theta += omega * dt;
  return { theta: theta, omega: omega };
}

function stepSpring(x, v, k, m, z, dt) {
  var w0 = Math.sqrt(k / m), gamma = 2 * z * w0, a = -(k / m) * x - gamma * v;
  v += a * dt;
  x += v * dt;
  return { x: x, v: v };
}

function theoT(len, grav) {
  return grav > 0 ? 2 * Math.PI * Math.sqrt(len / grav) : Infinity;
}

function theoS(k, m) {
  return k > 0 && m > 0 ? 2 * Math.PI * Math.sqrt(m / k) : Infinity;
}

function pendEnergy(t, om, m, L, g) {
  var v = L * om;
  return { ke: 0.5 * m * v * v, pe: m * g * L * (1 - Math.cos(t)), total: 0.5 * m * v * v + m * g * L * (1 - Math.cos(t)) };
}

function springEnergy(x, v, m, k) {
  return { ke: 0.5 * m * v * v, pe: 0.5 * k * x * x, total: 0.5 * m * v * v + 0.5 * k * x * x };
}
