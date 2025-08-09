import { getPosts } from '@/lib/content'
import ContentList from '@/components/content/ContentList'

export default function ContentPage() {
  const posts = getPosts()
  return <ContentList posts={posts} />
}
