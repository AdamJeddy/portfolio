'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/hooks/useTheme'

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { preferences, setAppearance } = useTheme()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) dialog.showModal()
    } else {
      if (dialog.open) dialog.close()
    }
  }, [open])

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
      </div>
    </dialog>
  )
}
