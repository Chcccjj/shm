// ============================================================
//  config.js — All magic numbers and constants
// ============================================================
var CONFIG = {
  DT: 1/60,
  PIVOT_Y: 52,
  PENDULUM_SCALE_DIV: 3.5,
  SPRING_SUPPORT_Y: 48,
  SPRING_AVAIL_DIV: 0.4,
  SPRING_SCALE: 400,
  FORCE_SCALE: 50,
  WAVE_MAX: 300,
  PHASE_MAX: 500,
  BOB_RADIUS_FACTOR: 14,
  BLOCK_WIDTH_BASE: 38,
  BLOCK_HEIGHT: 24,
  SPRING_COILS: 10,
  SPRING_AMP: 10,
  DUAL_MASS: 3,
  DUAL_OFFSET: 14,
  SMALL_ANGLE_DEG: 15,
  PER_SAMPLES: 3,
  GRAVITY_PRESETS: {
    earth: 9.81, moon: 1.62, mars: 3.71
  },
  PHASE_MARKER_R: 5,
  PHASE_ARROW_LEN: 10
};

var MODE = { PENDULUM: 'pendulum', SPRING: 'spring' };
