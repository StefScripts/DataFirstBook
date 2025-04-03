import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogPost {
  title: string;
  content: string;
  publishedAt: string;
  tags: string[];
}

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog-posts', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Skeleton className='h-12 w-3/4 mb-4' />
        <Skeleton className='h-6 w-1/4 mb-8' />
        <Skeleton className='h-64 w-full' />
      </div>
    );
  }

  if (!post) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold'>Blog post not found</h1>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card>
        <CardContent className='p-6'>
          <h1 className='text-4xl font-bold mb-4'>{post.title}</h1>

          {/* {post.featuredImage && <img src={post.featuredImage} alt={post.title} className='w-full h-auto rounded-lg mb-6' />} */}
          <div className='prose prose-lg max-w-none' dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.tags && post.tags.length > 0 && (
            <div className='mt-8 flex gap-2'>
              {post.tags.map((tag) => (
                <span key={tag} className='px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm'>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
