export interface ProjectItem {
  slug: string
  title: string
  description: string
  body?: string
  tech: string[]
  github: string
  live?: string
  image?: string
  year?: number
  words: string[]
}

export const projects: ProjectItem[] = [
  {
    slug: 'agentic-research-lab',
    title: 'Agentic Research Lab',
    description: 'Autonomous research workflows with retrieval, planning, and verification loops.',
    body: 'Built a research automation platform that chains LLM calls with retrieval-augmented generation, planning modules, and verification loops. The system handles document ingestion, semantic chunking, vector embedding, and multi-step reasoning across large corpora. Results are validated through citation tracing and confidence scoring before surfacing to the user.',
    tech: ['TypeScript', 'Next.js', 'LangChain', 'Vector DB', 'Cloudflare'],
    github: 'https://github.com/yourname/agentic-research-lab',
    live: 'https://example.com/agentic-research-lab',
    image: 'https://picsum.photos/seed/agentic/800/600',
    year: 2025,
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
    body: 'Designed and implemented a real-time monitoring dashboard that ingests high-frequency telemetry data through Kafka streams. The system applies statistical anomaly detection algorithms against sliding windows, surfaces outliers through a FastAPI backend, and renders interactive visualizations in the browser. Deployed with Docker across a PostgreSQL-backed data layer.',
    tech: ['Python', 'FastAPI', 'Kafka', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/yourname/signal-anomaly-dash',
    image: 'https://picsum.photos/seed/signal/800/600',
    year: 2024,
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
    body: 'Created a personal knowledge management tool that combines traditional note-taking with semantic search and graph-based navigation. Notes are automatically tagged through embedding similarity, and relationships between topics form a navigable knowledge graph. Built with a lightweight SQLite backend for zero-config deployment and instant search across thousands of entries.',
    tech: ['React', 'Node.js', 'SQLite', 'Embeddings', 'Tailwind'],
    github: 'https://github.com/yourname/semantic-notebook',
    live: 'https://example.com/semantic-notebook',
    image: 'https://picsum.photos/seed/semantic/800/600',
    year: 2024,
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
