/**
 * Maps pixel brightness (0–255) to an ASCII character.
 * Dark → dense glyphs, Light → sparse glyphs.
 * charset from Aino: ·:+=<?!3I2549AON  (light to dark)
 * We invert for dark-theme: light pixels get dense chars, dark get sparse.
 */
const CHARSET = '·:+=<?!3I2549AON'

export function brightnessToChar(brightness: number): string {
  // brightness 0 = black, 255 = white
  // On dark background: black pixels (bg) → sparse, white pixels (fg) → dense
  const idx = Math.floor((brightness / 255) * (CHARSET.length - 1))
  return CHARSET[Math.min(idx, CHARSET.length - 1)]
}

/**
 * Converts an image element to an ASCII art string.
 * @param img - The loaded HTMLImageElement
 * @param cols - Number of character columns in the output
 * @param rows - Number of character rows in the output
 */
export function imageToAscii(
  img: HTMLImageElement,
  cols: number,
  rows: number,
): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return ''

  canvas.width = cols
  canvas.height = rows
  ctx.drawImage(img, 0, 0, cols, rows)

  const imageData = ctx.getImageData(0, 0, cols, rows)
  const pixels = imageData.data

  const lines: string[] = []
  for (let y = 0; y < rows; y++) {
    let line = ''
    for (let x = 0; x < cols; x++) {
      const offset = (y * cols + x) * 4
      const r = pixels[offset]
      const g = pixels[offset + 1]
      const b = pixels[offset + 2]
      // Perceived brightness (luminance)
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b
      line += brightnessToChar(brightness)
    }
    lines.push(line)
  }

  return lines.join('\n')
}
