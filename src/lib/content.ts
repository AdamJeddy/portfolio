import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ProjectMatter {
  title: string
  description: string
  technologies: string[]
  github?: string
  demo?: string
  image?: string
  featured?: boolean
  date: string
}

export interface PostMatter {
  title: string
  category: 'book' | 'tech' | 'others'
  description: string
  date: string
  readTime?: string
  external?: string
  image?: string
  tags?: string[]
}

export interface Project {
  slug: string
  content: string
  data: ProjectMatter
}

export interface Post {
  slug: string
  content: string
  data: PostMatter
}

const projectsDirectory = path.join(process.cwd(), 'content/projects')
const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getProjects(): Project[] {
  try {
    const fileNames = fs.readdirSync(projectsDirectory)
    const projects = fileNames
      .filter(name => name.endsWith('.md'))
      .map((name) => {
        const slug = name.replace(/\.md$/, '')
        const fullPath = path.join(projectsDirectory, name)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          content,
          data: data as ProjectMatter,
        }
      })
      .sort((a, b) => {
        // Sort by date, newest first, then by featured status
        const dateA = new Date(a.data.date).getTime()
        const dateB = new Date(b.data.date).getTime()
        
        if (a.data.featured && !b.data.featured) return -1
        if (!a.data.featured && b.data.featured) return 1
        
        return dateB - dateA
      })

    return projects
  } catch (error) {
    console.warn('No projects directory found or error reading projects:', error)
    return []
  }
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      data: data as ProjectMatter,
    }
  } catch (error) {
    return null
  }
}

export function getPosts(): Post[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const posts = fileNames
      .filter(name => name.endsWith('.md'))
      .map((name) => {
        const slug = name.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, name)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          content,
          data: data as PostMatter,
        }
      })
      .sort((a, b) => {
        // Sort by date, newest first
        const dateA = new Date(a.data.date).getTime()
        const dateB = new Date(b.data.date).getTime()
        return dateB - dateA
      })

    return posts
  } catch (error) {
    console.warn('No posts directory found or error reading posts:', error)
    return []
  }
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      data: data as PostMatter,
    }
  } catch (error) {
    return null
  }
}

export function getPostsByCategory(category: PostMatter['category']): Post[] {
  const posts = getPosts()
  return posts.filter(post => post.data.category === category)
}

export function getFeaturedProjects(): Project[] {
  const projects = getProjects()
  return projects.filter(project => project.data.featured)
}
