const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function getScrollProgress(scroll: number, start: number, travel: number) {
  return travel > 0 ? clamp((scroll - start) / travel) : 0
}

// Each row is a chapter pose: x/y are percentages of the sheet itself.
// Separate images let the paper open in depth without a WebGL dependency.
const poses = [
  [[-30, 0, -8, -18, 1], [4, 2, 1, -22, 1], [40, 7, 10, -26, 1]],
  [[-28, -2, -3, 0, 1.08], [40, 8, 14, -34, 0.91], [69, 14, 20, -40, 0.85]],
  [[-65, 12, -19, 35, 0.85], [-6, -3, -4, 0, 1.08], [66, 9, 17, -30, 0.9]],
  [[-78, 15, -24, 45, 0.78], [-48, 10, -14, 35, 0.88], [6, -2, 1, 0, 1.08]],
]

export function getPaperPose(progress: number, sheet: number) {
  const position = clamp(progress) * (poses.length - 1)
  const from = Math.min(poses.length - 2, Math.floor(position))
  const fraction = position - from
  const eased = fraction * fraction * (3 - 2 * fraction)
  const values = poses[from][sheet].map((value, index) =>
    value + (poses[from + 1][sheet][index] - value) * eased,
  )
  return { x: values[0], y: values[1], rotate: values[2], tilt: values[3], scale: values[4] }
}
