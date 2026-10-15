import { Inter_Tight } from 'next/font/google'
import './studio.css'

const display = Inter_Tight({ subsets: ['latin'], display: 'swap', variable: '--font-studio' })

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`project-studio ${display.variable}`}>{children}</div>
}
