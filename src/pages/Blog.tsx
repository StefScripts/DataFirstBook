import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import Metadata from '@/components/Metadata';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
}

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog-posts');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    }
  });

  return (
    <main className="min-h-screen py-20">
      <Metadata
        title="Blog | DataFirst SEO"
        description="Get insights and learn more about SEO for B2B."
        keywords="SEO blog, DataFirst SEO blog, B2B SEO blog"
        canonicalUrl="https://datafirstseo.com/blog"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">B2B SEO Insights & Strategies</h1>
          <p className="text-xl text-muted-foreground">Expert analysis and actionable strategies to improve your B2B company's search visibility</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardHeader>
                    <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 w-2/3 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : posts?.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="cursor-pointer group transition-all hover:shadow-lg">
                    {/* {post.featuredImage && (
                      <div className='relative h-48 overflow-hidden rounded-t-lg'>
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className='object-cover w-full h-full transition-transform group-hover:scale-105'
                        />
                      </div>
                    )} */}
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </main>
  );
}
