import TextCanvas from '@/components/TextCanvas'

const homeWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus',
  'error', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem', 'aperiam', 'eaque',
  'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis', 'quasi', 'architecto', 'beatae',
]

export default function Home() {
  return (
    <main aria-label="Landing canvas">
      <TextCanvas
        words={homeWords}
        highlights={[
          { text: ' PROJECTS ', href: '/projects', zone: 'upper' },
          { text: ' WRITING ', href: '/content', zone: 'upper' },
          { text: ' THE PERSON ', href: '/the-person', zone: 'upper' },
          { text: ' by Adam ', zone: 'center', glitch: true },
        ]}
      />
    </main>
  )
}
