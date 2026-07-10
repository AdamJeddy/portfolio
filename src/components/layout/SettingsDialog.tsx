'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/hooks/useTheme'
import type { VisualMode } from '@/hooks/useTheme'

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { preferences, setAppearance, setMode } = useTheme()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) dialog.showModal()
    } else {
      if (dialog.open) dialog.close()
    }
  }, [open])

  // Close on backdrop click
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose()
    }
    dialog.addEventListener('click', handleClick)
    return () => dialog.removeEventListener('click', handleClick)
  }, [onClose])

  const modeLabels: Record<VisualMode, string> = {
    image: 'Image',
    text: 'Text',
    overlay: 'Overlay',
  }

  return (
    <dialog
      ref={dialogRef}
      id="side-dialog"
      data-dialog="settings"
      onClose={onClose}
    >
      <div className="dialog-header">
        <span>Settings</span>
        <button onClick={onClose} aria-label="Close settings">
          Close
        </button>
      </div>

      <div>
        {/* Mood */}
        <h3>Mood</h3>
        <ul>
          <li className={preferences.appearance === 'dark' ? 'active' : ''}>
            <button onClick={() => setAppearance('dark')}>
              {preferences.appearance === 'dark' ? '●' : '○'} Dark
            </button>
          </li>
          <li className={preferences.appearance === 'light' ? 'active' : ''}>
            <button onClick={() => setAppearance('light')}>
              {preferences.appearance === 'light' ? '●' : '○'} Light
            </button>
          </li>
        </ul>

        {/* Mode */}
        <h3>Img</h3>
        <ul>
          {(Object.keys(modeLabels) as VisualMode[]).map((mode) => (
            <li key={mode} className={preferences.mode === mode ? 'active' : ''}>
              <button onClick={() => setMode(mode)}>
                {preferences.mode === mode ? '●' : '○'} {modeLabels[mode]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  )
}
