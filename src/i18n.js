// ============================================================
//  i18n.js — Translations and language switching
// ============================================================
var T = {
zh:{title:'简谐运动实验室',subtitle:'Simple Harmonic Motion Laboratory',
tabPend:'单摆',tabSpring:'弹簧振子',
badgePend:'周期与质量无关',badgeSpring:'周期与√(m/k)成正比',
formPend:'<i>T</i> = 2π<span class="sqr"><span class="sqr-r">√</span><span class="sqr-c"><i>L</i>/<i>g</i></span></span>',formSpring:'<i>T</i> = 2π<span class="sqr"><span class="sqr-r">√</span><span class="sqr-c"><i>m</i>/<i>k</i></span></span>',
ctrlTitle:'参数控制',measTitle:'实时测量',optsTitle:'选项',
energy:'能量',totalE:'总能量',deltaE:'ΔE',phaseTitle:'相空间',
waveTitle:'波形 · <i>θ</i>(<i>t</i>) / <i>x</i>(<i>t</i>)',
ctrlLen:'摆长 L',ctrlAngle:'初始摆角 θ₀',ctrlK:'劲度系数 k',ctrlDisp:'初始位移 x₀',
ctrlMass:'物块/摆球质量 m',ctrlGrav:'重力加速度 g',ctrlZeta:'阻尼比 ζ',
measPeriodT:'周期 T（理论）',measPeriodM:'周期 T（实测）',measFreq:'频率 f',
measTheta:'角位移 θ',measOmega:'角速度 ω',measX:'位移 x',measV:'速度 v',measA:'加速度 a',measAmp:'振幅 A',
massNote:'改变质量，周期与频率不变',
dualLabel:'双摆对比（不同质量）',forceBtn:'力矢量',forceBtnOn:'力矢量 ✓',pauseBtn:'暂停',pauseBtnOn:'继续',resetBtn:'重置',
tsLabel:'Time Scale',reportBtn:'生成报告',
measWait:'等待中…',
warnTitle:'小角度近似已失效',warnBody:'当摆角较大时，实际周期会略大于理论公式预测值。',
footerPend:'<strong>实验结论：</strong>单摆周期 T = 2π√(L/g) 仅与摆长 L 和重力 g 有关，与摆球质量 m 无关。',
footerSpring:'<strong>实验结论：</strong>弹簧振子周期 T = 2π√(m/k)，与劲度系数 k、物块质量 m 有关，与振幅无关。',
author:'陈泓明',
zetaNone:'0 (无)',waveWait:'正在采集数据…',phaseWait:'正在采集数据…',
reportTitle:'简谐运动实验报告',reportType:'实验类型',reportParams:'实验参数',
reportResults:'实验结果',reportPeriodT:'理论周期',reportPeriodM:'实测周期',
reportFreq:'频率',reportKE:'动能',reportPE:'势能',reportTotalE:'总能量',
reportError:'误差分析',reportEnergyErr:'能量守恒误差',
reportPeriodError:'周期误差',reportAutoConclusion:'自动结论',reportEnergyAnalysis:'能量分析',
reportObservation:'实验观察',
conclusionPerfect:'实验结果与理论值高度一致。',conclusionGood:'实验结果基本符合理论预测。',conclusionPoor:'实验结果与理论值存在明显偏差。',
energyWellMaintained:'能量守恒表现良好。',energyDampingLoss:'阻尼导致系统机械能衰减。',
obsPend:'单摆周期与摆球质量无关，仅与摆长和重力加速度有关。',obsLargeAngle:'观察到大角度效应，实际周期略大于理论公式预测值。',obsSpring:'弹簧振子周期与质量和劲度系数有关；振幅不影响周期。',
reportPend:'单摆',reportSpring:'弹簧振子',
reportPrint:'打印 / 导出 PDF'},

en:{title:'SHM Laboratory',subtitle:'Simple Harmonic Motion Laboratory',
tabPend:'Pendulum',tabSpring:'Spring Oscillator',
badgePend:'Period ∝ √(L/g)',badgeSpring:'Period ∝ √(m/k)',
formPend:'<i>T</i> = 2π<span class="sqr"><span class="sqr-r">√</span><span class="sqr-c"><i>L</i>/<i>g</i></span></span>',formSpring:'<i>T</i> = 2π<span class="sqr"><span class="sqr-r">√</span><span class="sqr-c"><i>m</i>/<i>k</i></span></span>',
ctrlTitle:'Controls',measTitle:'Measurements',optsTitle:'Options',
energy:'Energy',totalE:'Total Energy',deltaE:'ΔE',phaseTitle:'Phase Space',
waveTitle:'Waveform · <i>θ</i>(<i>t</i>) / <i>x</i>(<i>t</i>)',
ctrlLen:'Length L',ctrlAngle:'Initial Angle θ₀',ctrlK:'Spring Const. k',ctrlDisp:'Initial Disp. x₀',
ctrlMass:'Mass m',ctrlGrav:'Gravity g',ctrlZeta:'Damping Ratio ζ',
measPeriodT:'Period T (Theoretical)',measPeriodM:'Period T (Measured)',measFreq:'Frequency f',
measTheta:'Ang. Disp. θ',measOmega:'Ang. Vel. ω',measX:'Disp. x',measV:'Vel. v',measA:'Accel. a',measAmp:'Amplitude A',
massNote:'Changing mass: period & frequency unchanged',
dualLabel:'Dual Pendulum (Different Masses)',forceBtn:'Forces',forceBtnOn:'Forces ✓',pauseBtn:'Pause',pauseBtnOn:'Resume',resetBtn:'Reset',
tsLabel:'Time Scale',reportBtn:'Generate Report',
measWait:'Measuring…',
warnTitle:'Small-angle approximation is no longer valid.',warnBody:'For larger amplitudes, the actual period becomes longer than T = 2π√(L/g).',
footerPend:'<strong>Conclusion:</strong> Pendulum period T = 2π√(L/g) depends only on length L and gravity g, independent of mass m.',
footerSpring:'<strong>Conclusion:</strong> Spring period T = 2π√(m/k) depends on spring constant k and mass m, independent of amplitude.',
author:'Chris',
zetaNone:'0 (none)',waveWait:'Collecting data…',phaseWait:'Collecting data…',
reportTitle:'SHM Experiment Report',reportType:'Experiment Type',reportParams:'Parameters',
reportResults:'Results',reportPeriodT:'Theoretical Period',reportPeriodM:'Measured Period',
reportFreq:'Frequency',reportKE:'Kinetic Energy',reportPE:'Potential Energy',reportTotalE:'Total Energy',
reportError:'Error Analysis',reportEnergyErr:'Energy Conservation Error',
reportPeriodError:'Period Error',reportAutoConclusion:'Automatic Conclusion',reportEnergyAnalysis:'Energy Analysis',
reportObservation:'Observation',
conclusionPerfect:'Experimental results agree very well with theory.',conclusionGood:'Experimental results generally agree with theory.',conclusionPoor:'Noticeable deviation exists between experiment and theory.',
energyWellMaintained:'Energy conservation is well maintained.',energyDampingLoss:'Damping causes mechanical energy loss.',
obsPend:'The period is independent of mass; depends only on length and gravity.',obsLargeAngle:'Large-angle effects were observed; actual period exceeds theoretical prediction.',obsSpring:'The period depends on mass and spring constant; independent of amplitude.',
reportPend:'Pendulum',reportSpring:'Spring Oscillator',
reportPrint:'Print / Export PDF'}};

var lang = 'zh';

function applyLang(l) {
  lang = l;
  document.getElementById('langZh').className = l === 'zh' ? 'on' : 'off';
  document.getElementById('langEn').className = l === 'en' ? 'on' : 'off';
  document.querySelectorAll('[data-i18n]:not([data-i18n-dyn])').forEach(function(el) {
    var k = el.dataset.i18n;
    if (T[l][k]) el.textContent = T[l][k];
  });
  var p = mode === MODE.PENDULUM;
  document.getElementById('badge').textContent = T[l][p ? 'badgePend' : 'badgeSpring'];
  document.getElementById('footerMsg').innerHTML = T[l][p ? 'footerPend' : 'footerSpring'];
  formulaLabel.innerHTML = T[l][p ? 'formPend' : 'formSpring'];
  document.getElementById('waveTitle').innerHTML = T[l].waveTitle;
  document.getElementById('phaseTitle').innerHTML = l === 'zh' ?
    (p ? '相空间 · <i>θ</i>-<i>ω</i>' : '相空间 · <i>x</i>-<i>v</i>') :
    (p ? 'Phase Space · <i>θ</i>-<i>ω</i>' : 'Phase Space · <i>x</i>-<i>v</i>');
  zetaV.textContent = zeta === 0 ? T[l].zetaNone : zeta.toFixed(2);
  var pb = paused && !pausedByVisibility ? T[l].pauseBtnOn : T[l].pauseBtn;
  document.getElementById('pauseBtn').textContent = pb;
  var fb = showForces ? T[l].forceBtnOn : T[l].forceBtn;
  var fbEl = document.getElementById('forceBtn');
  fbEl.textContent = fb;
  fbEl.classList.toggle('on', showForces);
  updateWarnVisibility();
  updateGravityPresetUI();
}

function updateWarnVisibility() {
  if (mode === MODE.PENDULUM && initAngle > CONFIG.SMALL_ANGLE_DEG * Math.PI / 180) {
    document.getElementById('warnTitle').textContent = T[lang].warnTitle;
    document.getElementById('warnBody').textContent = T[lang].warnBody;
    document.getElementById('warnBox').classList.add('visible');
  } else {
    document.getElementById('warnBox').classList.remove('visible');
  }
}
