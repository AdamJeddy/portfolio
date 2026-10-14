const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function getHeroProgress(top: number, height: number) {
  return height > 0 ? clamp(-top / height) : 0
}

export function getRevealProgress(top: number, viewport: number) {
  const progress = viewport > 0 ? clamp((viewport - top) / (viewport * 0.75)) : 1
  return progress * progress * (3 - 2 * progress)
}
