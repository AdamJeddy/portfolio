export interface ProjectItem {
  slug: string
  title: string
  description: string
  tech: string[]
  github: string
  live?: string
  words: string[]
}

export const projects: ProjectItem[] = [
  {
    slug: 'agentic-research-lab',
    title: 'Agentic Research Lab',
    description: 'Autonomous research workflows with retrieval, planning, and verification loops.',
    tech: ['TypeScript', 'Next.js', 'LangChain', 'Vector DB', 'Cloudflare'],
    github: 'https://github.com/yourname/agentic-research-lab',
    live: 'https://example.com/agentic-research-lab',
    words: [
      'agent', 'plan', 'retrieve', 'rank', 'rerank', 'context', 'reason', 'trace', 'tool', 'chain',
      'workflow', 'citation', 'validate', 'memory', 'loop', 'inference', 'latency', 'prompt', 'token',
      'cache', 'session', 'graph', 'query', 'vector', 'embedding', 'index', 'chunk', 'synthesis',
    ],
  },
  {
    slug: 'signal-anomaly-dash',
    title: 'Signal Anomaly Dash',
    description: 'Real-time anomaly detection dashboard for high-volume telemetry streams.',
    tech: ['Python', 'FastAPI', 'Kafka', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/yourname/signal-anomaly-dash',
    words: [
      'stream', 'window', 'event', 'sensor', 'anomaly', 'threshold', 'outlier', 'baseline', 'metric',
      'query', 'offset', 'consumer', 'producer', 'partition', 'throughput', 'alert', 'monitor',
      'runtime', 'incident', 'timeline', 'drilldown', 'payload', 'schema', 'normalize', 'backfill',
    ],
  },
  {
    slug: 'semantic-notebook',
    title: 'Semantic Notebook',
    description: 'Searchable personal knowledge base with semantic tagging and graph links.',
    tech: ['React', 'Node.js', 'SQLite', 'Embeddings', 'Tailwind'],
    github: 'https://github.com/yourname/semantic-notebook',
    live: 'https://example.com/semantic-notebook',
    words: [
      'note', 'topic', 'edge', 'graph', 'link', 'semantic', 'cluster', 'memory', 'relation', 'tag',
      'search', 'snippet', 'preview', 'index', 'node', 'context', 'archive', 'journal', 'capture',
      'iterate', 'refine', 'highlight', 'insight', 'outline', 'draft', 'mapping',
    ],
  },
]

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}
