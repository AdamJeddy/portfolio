const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function getHeroProgress(top: number, height: number) {
  return height > 0 ? clamp(-top / height) : 0
}

export function getRevealProgress(top: number, viewport: number) {
  const start = viewport * 0.9
  const settle = viewport * 0.15
  const progress = viewport > 0 ? clamp((start - top) / (start - settle)) : 1
  return progress * progress * (3 - 2 * progress)
}
