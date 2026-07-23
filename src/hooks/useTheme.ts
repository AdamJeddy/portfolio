'use client'

import { useEffect, useState, useCallback } from 'react'

interface SitePreferences {
  appearance: 'dark' | 'light'
}

const STORAGE_KEY = 'site'
const DEFAULT_PREFS: SitePreferences = {
  appearance: 'dark',
}

function load(): SitePreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { appearance: parsed.appearance ?? DEFAULT_PREFS.appearance }
    }
  } catch {
    // corrupted localStorage — fall through to defaults
  }
  return DEFAULT_PREFS
}

function apply(prefs: SitePreferences) {
  const html = document.documentElement
  html.classList.add('js')

  if (prefs.appearance === 'dark') {
    html.classList.add('dark')
    html.classList.remove('light')
  } else {
    html.classList.add('light')
    html.classList.remove('dark')
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

  useEffect(() => {
    const saved = load()
    // Preferences come from browser storage after hydration, so this state update
    // intentionally synchronizes React with that external source.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  return { preferences, setAppearance }
}
