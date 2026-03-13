import TextCanvas from '@/components/TextCanvas'

const personWords = [
  'engineer', 'builder', 'systems', 'software', 'data', 'ai', 'learning', 'analysis', 'design',
  'debug', 'iterate', 'ship', 'maintain', 'refine', 'curiosity', 'discipline', 'clarity', 'craft',
  'python', 'typescript', 'sql', 'pandas', 'nextjs', 'cloudflare', 'postgres', 'api', 'architecture',
  'focus', 'patience', 'depth', 'detail', 'simplicity', 'quality', 'research', 'writing', 'thinking',
]

export default function ThePerson() {
  return (
    <main aria-label="The person canvas">
      <TextCanvas
        words={personWords}
        highlights={[
          { text: ' ← BACK ', href: '/', zone: 'upper' },
          { text: ' ADAM ', zone: 'center', glitch: true },
          { text: ' SOFTWARE ENGINEER ', zone: 'center' },
          { text: ' AI + DATA ', zone: 'center' },
          { text: ' BUILT WITH CURIOSITY ', zone: 'lower' },
        ]}
      />
    </main>
  )
}
