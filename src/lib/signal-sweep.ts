export interface SignalSweepTheme {
  background: string
  foreground: string
}

export interface SignalSweepNavigation {
  destinationPath: string
  currentPath: string
  hasModifier: boolean
  target: string
  download: boolean
}

const studioTheme: SignalSweepTheme = {
  background: '#ddf46a',
  foreground: '#080907',
}

export function getSignalSweepTheme(pathname: string): SignalSweepTheme {
  if (pathname.startsWith('/projects/layla-ai')) {
    return { background: '#003b32', foreground: '#fff8ed' }
  }

  if (pathname.startsWith('/projects/qeemat')) {
    return { background: '#0047ff', foreground: '#ffffff' }
  }

  return studioTheme
}

export function shouldSignalSweep({
  destinationPath,
  currentPath,
  hasModifier,
  target,
  download,
}: SignalSweepNavigation) {
  return destinationPath !== currentPath && !hasModifier && !target && !download
}
