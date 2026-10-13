const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (value: number) => value * value * (3 - 2 * value)

export function getScrollProgress(scroll: number, start: number, travel: number) {
  return travel > 0 ? clamp((scroll - start) / travel) : 0
}

// x/y are percentages of a sheet. Fixed stacking order prevents layer pops.
// Reading holds separate the fan gathering and the two page handoffs.
const poses = [
  [[-30, 0, -8, -18, 1, 1], [4, 2, 1, -22, 1, 1], [40, 7, 10, -26, 1, 1]],
  [[-18, 0, -2, 0, 1.02, 1], [14, 3, 5, -12, 0.95, 1], [42, 6, 11, -18, 0.9, 1]],
  [[-36, 1, -6, -72, 0.94, 0], [-10, 0, -2, 0, 1.02, 1], [24, 4, 7, -12, 0.94, 1]],
  [[-40, 1, -6, -78, 0.94, 0], [-36, 1, -6, -72, 0.94, 0], [-10, 0, -2, 0, 1.02, 1]],
]
const frames = [
  { at: 0, pose: 0 }, { at: 0.12, pose: 0 },
  { at: 0.30, pose: 1 }, { at: 0.43, pose: 1 },
  { at: 0.61, pose: 2 }, { at: 0.74, pose: 2 },
  { at: 0.92, pose: 3 }, { at: 1, pose: 3 },
]
export const chapterProgress = [0.36, 0.67, 0.96]

export function getPaperPose(progress: number, sheet: number) {
  const position = clamp(progress)
  const segment = frames.findIndex((frame, index) =>
    index < frames.length - 1 && position < frames[index + 1].at,
  )
  const from = frames[segment < 0 ? frames.length - 2 : segment]
  const to = frames[segment < 0 ? frames.length - 1 : segment + 1]
  const fraction = smooth(clamp((position - from.at) / (to.at - from.at)))
  const values = poses[from.pose][sheet].map((value, index) =>
    value + (poses[to.pose][sheet][index] - value) * fraction,
  )
  return { x: values[0], y: values[1], rotate: values[2], tilt: values[3], scale: values[4], opacity: values[5] }
}

const copyWindows = [
  [0, 0, 0.12, 0.205],
  [0.205, 0.30, 0.43, 0.515],
  [0.515, 0.61, 0.74, 0.825],
  [0.825, 0.92, 1, 1],
]

export function getCopyPose(progress: number, scene: number) {
  const [enterStart, enterEnd, exitStart, exitEnd] = copyWindows[scene]
  const entering = enterStart === enterEnd ? 1 : smooth(clamp((progress - enterStart) / (enterEnd - enterStart)))
  const leaving = exitStart === exitEnd ? 0 : smooth(clamp((progress - exitStart) / (exitEnd - exitStart)))
  return { opacity: entering * (1 - leaving), y: (1 - entering) * 28 - leaving * 20 }
}

export function getActiveScene(progress: number) {
  return progress < 0.205 ? 0 : progress < 0.515 ? 1 : progress < 0.825 ? 2 : 3
}

// Time-based damping feels consistent on 60Hz and 120Hz displays.
export function settleProgress(current: number, target: number, elapsed: number) {
  const next = current + (target - current) * (1 - Math.exp(-Math.max(0, elapsed) / 85))
  return Math.abs(next - target) < 0.0001 ? target : next
}
