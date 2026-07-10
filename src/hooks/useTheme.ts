'use client'

import { useEffect, useState, useCallback } from 'react'

export type VisualMode = 'image' | 'text' | 'overlay'

interface SitePreferences {
  appearance: 'dark' | 'light'
  mode: VisualMode
}

const STORAGE_KEY = 'site'
const DEFAULT_PREFS: SitePreferences = {
  appearance: 'dark',
  mode: 'image',
}

function load(): SitePreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_PREFS, ...parsed }
    }
  } catch {
    // corrupted localStorage — fall through to defaults
  }
  return DEFAULT_PREFS
}

function apply(prefs: SitePreferences) {
  const html = document.documentElement
  html.classList.add('js')

  // Appearance
  if (prefs.appearance === 'dark') {
    html.classList.add('dark')
    html.classList.remove('light')
  } else {
    html.classList.add('light')
    html.classList.remove('dark')
  }

  // Mode
  html.classList.remove('textmode', 'pixelmode', 'overlay')
  if (prefs.mode === 'text') {
    html.classList.add('textmode')
  } else if (prefs.mode === 'overlay') {
    html.classList.add('textmode', 'overlay')
  }
}

function persist(prefs: SitePreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function useTheme() {
  const [preferences, setPreferences] = useState<SitePreferences>(DEFAULT_PREFS)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = load()
    setPreferences(saved)
    apply(saved)
  }, [])

  const setAppearance = useCallback((appearance: 'dark' | 'light') => {
    setPreferences((prev) => {
      const next = { ...prev, appearance }
      apply(next)
      persist(next)
      return next
    })
  }, [])

  const setMode = useCallback((mode: VisualMode) => {
    setPreferences((prev) => {
      const next = { ...prev, mode }
      apply(next)
      persist(next)
      return next
    })
  }, [])

  return { preferences, setAppearance, setMode }
}
