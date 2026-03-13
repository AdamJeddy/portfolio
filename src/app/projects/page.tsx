import TextCanvas from '@/components/TextCanvas'
import { projects } from '@/lib/projects'

const projectWords = [
  'deploy', 'inference', 'embedding', 'pipeline', 'api', 'model', 'token', 'vector', 'gradient',
  'fine-tune', 'dataset', 'latency', 'runtime', 'schema', 'orm', 'query', 'diff', 'branch', 'merge',
  'hook', 'render', 'bundle', 'cache', 'proxy', 'stream', 'queue', 'event', 'consumer', 'producer',
  'parse', 'serialize', 'deserialize', 'normalize', 'monitor', 'observe', 'trace', 'alert',
]

export default function Projects() {
  return (
    <main aria-label="Projects canvas">
      <TextCanvas
        words={projectWords}
        highlights={[
          { text: ' ← BACK ', href: '/', zone: 'upper' },
          ...projects.map((project) => ({
            text: ` ${project.title.toUpperCase()} `,
            href: `/projects/${project.slug}`,
            zone: 'center' as const,
          })),
        ]}
      />
    </main>
  )
}
