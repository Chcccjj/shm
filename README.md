# Interactive Computational Physics Laboratory · 交互式计算物理实验室

> **Physics + Numerical Methods + Simulation + Data Analysis + Visualization** — in one dependency-free HTML file.

一个纯前端的交互式计算物理实验台:单摆、弹簧振子、**耦合双振子**与受迫振动实时模拟,内置 RK4 数值积分、周期测量、能量守恒分析、FFT 频谱、共振实验、参数扫描与 CSV 导出。Canvas 渲染,双击即用,无需安装。

*An interactive computational-physics workbench: real-time simulation of pendulums, spring oscillators, **coupled oscillators** and driven resonance — with RK4 integration, period measurement, energy analysis, FFT spectra, resonance scans, parameter sweeps and CSV export. Single dependency-free HTML file, double-click to run.*

---

## Overview · 总览

| 层 | 内容 |
|---|---|
| Physics | 单摆(含大角度)、弹簧振子、耦合双振子(简正模)、受迫振动、阻尼 |
| Numerical | 半隐式欧拉 (RK1) / RK4,dt 可调,解析对照与误差分析 |
| Analysis | 波形、相空间、能量守恒、FFT 频谱、周期/频率测量 |
| Experiment | T²–L / T²–m 回归、频响扫描、共振识别、数值验证 |
| Data | 智能报告、CSV 导出(Excel/Sheets/Python/MATLAB 可读) |

---

## Features · 功能

- 三种实时模拟模式 + 阻尼比、时间缩放、双摆对比、重力预设(地球/月球/火星)
- **真 RK4**（默认）与半隐式欧拉可选,带 dt 收敛性演示
- 中英双语、深色/浅色主题
- 每模式**模型方程说明条**(theory strip)
- 全部数据来自真实数值积分,**不造假**

---

## Physics Models · 物理模型

### 单摆 Pendulum
小角近似 `T = 2π√(L/g)`,大角度用精确非线性 `θ″ = −(g/L) sin θ`,能量用精确 `1−cos θ`。

### 弹簧振子 Spring Oscillator
`m x″ + b x′ + k x = 0`,`T = 2π√(m/k)`,Hooke 定律 `F = −kx` 实时显示。

### 耦合双振子 Coupled Pair
对称双质量系统(`m₁ = m₂ = m`,`k₁ = k₂ = k`):

```
m x₁″ = −k x₁ + k_c (x₂ − x₁)
m x₂″ = −k x₂ − k_c (x₂ − x₁)
```

**简正模 Normal modes**(坐标 `X_s = (x₁+x₂)/√2`,`X_a = (x₁−x₂)/√2` 解耦):

| 模式 | 坐标 | 刚度 | 角频率 |
|---|---|---|---|
| 同相 in-phase | X_s | k | `ω_in = √(k/m)` |
| 反相 out-of-phase | X_a | k + 2k_c | `ω_out = √((k+2k_c)/m)` |

UI 提供「同相 / 反相 / 拍频」初态注入按钮:一般初态(如仅 x₁ 位移)会产生**拍频**,能量在两振子间周期交换,拍频 ≈ `(ω_out − ω_in)/2π`。

### 受迫振动 Driven Oscillator(实验区)
`m x″ + b x′ + k x = F₀ cos(ω_d t)`,稳态幅频响应 `A(ω_d) = F₀/m / √((ω₀²−ω_d²)² + (2ζω₀ω_d)²)`,共振峰 `ω_r = ω₀√(1−2ζ²)`。

---

## Numerical Methods · 数值方法

- **半隐式(辛)欧拉 RK1**:能量长期无漂移、相位误差 O(dt)
- **RK4**:四阶 Runge–Kutta,截断误差 O(dt⁴);收敛阶经实测 ≈ 16(每减半步长误差 ÷16)
- **积分器选择**:实时动画顶部可切换 Euler / RK4；固定物理步长与屏幕刷新率解耦
- **数值验证**:同一条 ODE 下对比两种方法 × 三种 dt(每周期 120/480/1920 步)的位置误差与能量漂移

所有单位采用 SI;canvas 像素仅是渲染,不是物理单位。

---

## Data Analysis · 数据分析

- **波形**:位移+速度(或耦合双轨迹 x₁/x₂)
- **相空间**:θ–ω / x–v,耦合模式同屏绘制 (x₁,v₁)·(x₂,v₂) 双轨道
- **能量**:KE / PE /(耦合 U_c)实时条 + `ΔE` 守恒漂移百分比
- **周期测量**:零交叉检测,自动给出理论 / 实测 / 绝对与相对误差,无需手动计数

---

## Experiments · 实验(右栏)

| 实验 | 说明 |
|---|---|
| 单摆 T²–L | 扫摆长,拟合 `T² = (4π²/g)·L`,斜率≈4.024(g=9.81),R² 与误差 |
| 弹簧 T²–m | 扫质量,拟合 `T² = (4π²/k)·m`,斜率≈3.948(k=10) |
| 能量记录 | 无阻尼守恒 / 阻尼衰减曲线 |
| 受迫 · 时域/FFT | F₀cos(ω_d t) 稳态时域 + 频谱,标注主导频率与理论 f₀ |
| 频响 · 共振 | 扫 ω_d,丢弃瞬态测稳态幅,标注自然/共振频率与最大幅 |
| FFT 验证 | 对已知正弦 `A cos(2πft)` 检测频率与幅值 |

频响/共振扫描异步分块执行,不阻塞动画。

---

## FFT · 频域分析

- 自写 **radix-2 Cooley–Tukey FFT**(无第三方依赖)
- 物理正确频率轴:`f_k = k·f_s/N`,采样率随 dt 档位为 60/120/240 Hz,分辨率 Δf = f_s/N,DC 已处理
- Hann 窗抑制频谱泄漏，主峰用对数抛物线插值细分；已知正弦的幅值/频率误差 < 0.1%

---

## Resonance · 共振

频响曲线随阻尼变化:ζ 增大 → 峰变钝且左移 √(1−2ζ²)。理论 `A(ω_d)` 曲线叠加参考。稳态振幅在**丢弃瞬态后**测量(默认 25 个自然周期),不把瞬态误当稳态。

---

## Coupled Oscillators · 耦合双振子

- 墙—弹簧—m₁—耦合—m₂—弹簧—墙 场景,位移由弹簧伸缩表达
- 同相/反相注入后系统保持在对应简正模(数值验证 x₁−x₂≡0 或 x₁+x₂≡0)
- 耦合能量含 `U_c = ½k_c(x₁−x₂)²`,理想无阻尼下守恒(误差 < 0.5%)

---

## Technical Architecture · 技术架构

单个 HTML 文件内按注释横幅分模块(var 共享,非 ES module,兼容 `file://`):

```
config → i18n → physics → integrators(+coupled) → driven
→ fourier/FFT → verification → renderers(pend/spring/coupled/wave/phase)
→ report → experiment(ui) → controls → main(状态/tick)
```

物理引擎与渲染解耦:渲染器不含运动方程,实验引擎只读全局快照、不写回动画状态。

### 运行 Run
```bash
# 双击,或:
open simple-harmonic-motion-laboratory.html
```

### 测试 Test

运行测试需要 Node.js、Playwright 与可用的 Chrome/Chromium：

```bash
npm install
npm test
```

测试覆盖刷新率无关的计时、三种模型切换、数值积分、能量守恒、简正模、FFT、实验工作流、双语与主题切换。

### GitHub Pages
仓库静态文件即完整应用,无需构建服务器。在仓库 **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `/ (root)` → Save** 即可上线。之后访问 `https://<user>.github.io/simple-harmonic-motion-simulation/`。

---

## Demo · 演示

打开后:顶部切换 单摆 / 弹簧振子 / 耦合双振子;拖滑块调参;「实验」开合实验区;「数值验证」看 dt 精度;「生成报告」导出实验报告;「导出 CSV」下载数据。

## Screenshots · 截图

*(Screenshots to be added — 实现后补充)*

---

## Known Limitations · 已知局限

- 单摆 FFT/受迫分析针对弹簧系统;实验区需单摆或弹簧模式(耦合模式观察简正模)。
- FFT 以有限采样窗分析数据；相距小于频率分辨率的近邻谱线仍无法可靠分离。
- 耦合为对称双振子(等质量等刚度);非对称推广属后续工作。

## Future Improvements · 未来方向

- 非对称耦合 / N 振子链 / 一维晶格简正模
- 多窗函数选择与 Goertzel 指定频率分析
- 将实验脚本迁移 Web Worker 以支持更大规模扫描

---

© 陈泓明 (Chris) · [github.com/Chcccjj/simple-harmonic-motion-simulation](https://github.com/Chcccjj/simple-harmonic-motion-simulation)
