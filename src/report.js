// ============================================================
//  report.js — Smart experiment report with auto-analysis
// ============================================================
function generateReport() {
  var p = mode === MODE.PENDULUM;
  var e = p ? pendEnergy(pend.theta, pend.omega, mass, L, g) : springEnergy(springS.x, springS.v, mass, k);
  var Tt = p ? theoT(L, g) : theoS(k, mass);
  var deltaE = initialEnergy > 0 ? ((e.total - initialEnergy) / initialEnergy * 100) : 0;
  var t = T[lang];

  // Period error analysis
  var periodError = measuredPeriod !== null ? Math.abs(measuredPeriod - Tt) / Tt * 100 : null;

  // Auto conclusion from period error
  var conclusionKey;
  if (periodError === null) {
    conclusionKey = null;
  } else if (periodError < 1) {
    conclusionKey = 'conclusionPerfect';
  } else if (periodError <= 5) {
    conclusionKey = 'conclusionGood';
  } else {
    conclusionKey = 'conclusionPoor';
  }

  // Energy analysis
  var energyNoteKey = Math.abs(deltaE) < 0.1 ? 'energyWellMaintained' : Math.abs(deltaE) > 1 ? 'energyDampingLoss' : null;

  // Observation
  var obsKeys = [];
  if (p) {
    obsKeys.push('obsPend');
    if (initAngle > CONFIG.SMALL_ANGLE_DEG * Math.PI / 180) obsKeys.push('obsLargeAngle');
  } else {
    obsKeys.push('obsSpring');
  }

  var typeName = p ? t.reportPend : t.reportSpring;
  var params = [
    [t.ctrlLen, L.toFixed(2) + ' m'],
    [t.ctrlMass, mass.toFixed(2) + ' kg'],
    [t.ctrlGrav, g.toFixed(2) + ' m/s²']
  ];
  if (!p) {
    params.push([t.ctrlK, k.toFixed(1) + ' N/m'], [t.ctrlDisp, initDisp.toFixed(2) + ' m']);
  } else {
    params.push([t.ctrlAngle, (initAngle * 180 / Math.PI).toFixed(0) + '°']);
  }
  params.push([t.ctrlZeta, zeta === 0 ? t.zetaNone : zeta.toFixed(2)]);

  var warnNote = (p && initAngle > CONFIG.SMALL_ANGLE_DEG * Math.PI / 180) ? t.warnTitle + ': ' + t.warnBody : '';

  var win = window.open('', '_blank', 'width=800,height=700');
  win.document.write('<!DOCTYPE html><html lang="' + lang + '"><head><meta charset="UTF-8"><title>' + t.reportTitle + '</title>');
  win.document.write('<style>');
  win.document.write('*{margin:0;padding:0;box-sizing:border-box}');
  win.document.write('body{font-family:Georgia,"Times New Roman",serif;color:#222;background:#fff;padding:40px 50px;max-width:800px;margin:0 auto}');
  win.document.write('h1{font-size:1.4rem;color:#1e3a5f;border-bottom:2px solid #1e3a5f;padding-bottom:6px;margin-bottom:4px}');
  win.document.write('.sub{font-size:.8rem;color:#888;margin-bottom:20px}');
  win.document.write('h2{font-size:1rem;color:#1e3a5f;margin:18px 0 8px;border-bottom:1px solid #ddd;padding-bottom:3px}');
  win.document.write('table{width:100%;border-collapse:collapse;margin-bottom:12px;font-size:.85rem}');
  win.document.write('td{padding:4px 8px;border-bottom:1px solid #eee}td:first-child{color:#888;width:220px}td:last-child{font-weight:600}');
  win.document.write('.err{color:#c45a3c}.good{color:#27ae60}.warn{color:#f39c12}');
  win.document.write('.note{background:#fef9e7;border-left:3px solid #f39c12;padding:8px 12px;font-size:.8rem;margin:10px 0}');
  win.document.write('.conclusion{background:#f0f8f0;border-left:3px solid #27ae60;padding:10px 14px;font-size:.85rem;margin:10px 0;line-height:1.6}');
  win.document.write('.conclusion.warn{background:#fef9e7;border-left-color:#f39c12}');
  win.document.write('.obs-item{font-size:.82rem;color:#555;padding:3px 0;padding-left:12px;position:relative}');
  win.document.write('.obs-item::before{content:"•";position:absolute;left:0;color:#1e3a5f}');
  win.document.write('.print-btn{background:#1e3a5f;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:.8rem;margin:20px 0}');
  win.document.write('@media print{.print-btn{display:none}}');
  win.document.write('</style></head><body>');

  // Title
  win.document.write('<h1>' + t.reportTitle + '</h1>');
  win.document.write('<div class="sub">' + t.author + ' &middot; ' + new Date().toISOString().slice(0, 10) + '</div>');

  // Experiment Type
  win.document.write('<h2>' + t.reportType + '</h2><p>' + typeName + '</p>');

  // Parameters
  win.document.write('<h2>' + t.reportParams + '</h2><table>');
  params.forEach(function (r) { win.document.write('<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'); });
  win.document.write('</table>');

  // Results
  win.document.write('<h2>' + t.reportResults + '</h2><table>');
  win.document.write('<tr><td>' + t.reportPeriodT + '</td><td>' + Tt.toFixed(4) + ' s</td></tr>');
  win.document.write('<tr><td>' + t.reportPeriodM + '</td><td>' + (measuredPeriod !== null ? measuredPeriod.toFixed(4) + ' s' : 'N/A') + '</td></tr>');
  win.document.write('<tr><td>' + t.reportFreq + '</td><td>' + (1 / Tt).toFixed(4) + ' Hz</td></tr>');
  win.document.write('<tr><td>' + t.reportKE + '</td><td>' + e.ke.toFixed(4) + ' J</td></tr>');
  win.document.write('<tr><td>' + t.reportPE + '</td><td>' + e.pe.toFixed(4) + ' J</td></tr>');
  win.document.write('<tr><td>' + t.reportTotalE + '</td><td>' + e.total.toFixed(4) + ' J</td></tr>');
  win.document.write('</table>');

  // Period Error Analysis
  win.document.write('<h2>' + t.reportPeriodError + '</h2><table>');
  if (periodError !== null) {
    var peClass = periodError < 1 ? 'good' : periodError <= 5 ? 'warn' : 'err';
    win.document.write('<tr><td>' + t.reportPeriodM + ' vs ' + t.reportPeriodT + '</td><td class="' + peClass + '">' + (periodError >= 0 ? '+' : '') + periodError.toFixed(3) + '%</td></tr>');
  } else {
    win.document.write('<tr><td>' + t.reportPeriodError + '</td><td>N/A (insufficient data)</td></tr>');
  }
  win.document.write('</table>');

  // Energy Analysis
  win.document.write('<h2>' + t.reportEnergyAnalysis + '</h2><table>');
  win.document.write('<tr><td>' + t.reportEnergyErr + '</td><td class="' + (Math.abs(deltaE) < 0.1 ? 'good' : Math.abs(deltaE) < 1 ? 'warn' : 'err') + '">' + (deltaE >= 0 ? '+' : '') + deltaE.toFixed(3) + '%</td></tr>');
  if (energyNoteKey) {
    win.document.write('<tr><td></td><td>' + t[energyNoteKey] + '</td></tr>');
  }
  win.document.write('</table>');

  // Automatic Conclusion
  win.document.write('<h2>' + t.reportAutoConclusion + '</h2>');
  if (conclusionKey) {
    var ccClass = conclusionKey === 'conclusionPerfect' ? '' : conclusionKey === 'conclusionGood' ? 'warn' : 'warn';
    win.document.write('<div class="conclusion' + (ccClass ? ' ' + ccClass : '') + '">' + t[conclusionKey] + '</div>');
  } else {
    win.document.write('<div class="conclusion warn">Insufficient data for automatic conclusion.</div>');
  }

  // Observation
  win.document.write('<h2>' + t.reportObservation + '</h2>');
  for (var i = 0; i < obsKeys.length; i++) {
    win.document.write('<div class="obs-item">' + t[obsKeys[i]] + '</div>');
  }

  if (warnNote) win.document.write('<div class="note">' + warnNote + '</div>');

  // Print button
  win.document.write('<button class="print-btn" onclick="window.print()">' + t.reportPrint + '</button>');
  win.document.write('</body></html>');
  win.document.close();
}
