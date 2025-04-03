import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be lowercase letters, numbers, and hyphens only'
    }),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
  tags: z.array(z.string()),
  published: z.boolean().default(false)
});

type BlogPostForm = z.infer<typeof blogPostSchema>;

interface BlogEditorProps {
  postId?: number;
  onSuccess?: () => void;
}

export default function BlogEditor({ postId, onSuccess }: BlogEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTag, setNewTag] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      metaDescription: '',
      tags: [],
      // featuredImage: '',
      published: false
    }
  });

  const { data: existingPost, isLoading: loadingPost } = useQuery({
    queryKey: ['/api/admin/blog-posts', postId],
    queryFn: async () => {
      if (!postId) return null;
      const response = await fetch(`/api/admin/blog-posts/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch blog post');
      const data = await response.json();
      console.log('Fetched post data:', data);
      return data;
    },
    enabled: !!postId
  });

  useEffect(() => {
    if (existingPost && !loadingPost) {
      console.log('Setting form values with:', existingPost);
      const formValues = {
        title: existingPost.title || '',
        slug: existingPost.slug || '',
        content: existingPost.content || '',
        excerpt: existingPost.excerpt || '',
        metaDescription: existingPost.metaDescription || '',
        tags: Array.isArray(existingPost.tags) ? existingPost.tags : [],
        featuredImage: existingPost.featuredImage || '',
        published: existingPost.published || false
      };
      form.reset(formValues);
    }
  }, [existingPost, loadingPost, form]);

  const mutation = useMutation({
    mutationFn: async (data: BlogPostForm) => {
      const response = await fetch(postId ? `/api/admin/blog-posts/${postId}` : '/api/admin/blog-posts', {
        method: postId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save blog post');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: `Blog Post ${postId ? 'Updated' : 'Created'}`,
        description: `Your blog post has been ${postId ? 'updated' : 'saved'} successfully.`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save blog post',
        variant: 'destructive'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/blog-posts/${postId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete blog post');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Blog Post Deleted',
        description: 'The blog post has been deleted successfully.'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete blog post',
        variant: 'destructive'
      });
    }
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log('Submitting form with data:', data);
    mutation.mutate(data);
  });

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const currentTags = form.getValues('tags') || [];
      if (!currentTags.includes(newTag.trim())) {
        form.setValue('tags', [...currentTags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue(
      'tags',
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSlugify = () => {
    const title = form.getValues('title');
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    form.setValue('slug', slug);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // const handleImageUpload = async (file: File) => {
  //   try {
  //     setIsUploading(true);
  //     const formData = new FormData();
  //     formData.append('image', file);

  //     const response = await fetch('/api/upload', {
  //       method: 'POST',
  //       body: formData
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to upload image');
  //     }

  //     const data = await response.json();
  //     return data.url;
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to upload image",
  //       variant: "destructive"
  //     });
  //     return null;
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  // const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const url = await handleImageUpload(file);
  //   if (url) {
  //     form.setValue("featuredImage", url);
  //   }
  // };

  if (loadingPost) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
        <CardTitle>{postId ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
        {postId && (
          <Button variant='destructive' size='sm' onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Delete Post'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='edit'>
          <TabsList className='grid w-full grid-cols-2 mb-6'>
            <TabsTrigger value='edit'>Edit</TabsTrigger>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
          </TabsList>

          <TabsContent value='edit'>
            <Form {...form}>
              <form onSubmit={onSubmit} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} onBlur={handleSlugify} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          onImageUpload={handleImageUpload}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='excerpt'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='metaDescription'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Input {...field} placeholder="Image URL" />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFeaturedImageUpload}
                                disabled={isUploading}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                disabled={isUploading}
                              >
                                {isUploading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                                <span className="ml-2">Upload</span>
                              </Button>
                            </div>
                          </div>
                          {field.value && (
                            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                              <img
                                src={field.value}
                                alt="Featured image preview"
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <div className='space-y-2'>
                  <FormLabel>Tags</FormLabel>
                  <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={handleAddTag} placeholder='Press Enter to add a tag' />
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {form.watch('tags')?.map((tag) => (
                      <Badge key={tag} variant='secondary' className='flex items-center gap-1'>
                        {tag}
                        <button type='button' onClick={() => removeTag(tag)} className='ml-1 hover:text-destructive'>
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='published'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>{field.value ? 'Published' : 'Draft'}</FormLabel>
                        <div className='text-sm text-muted-foreground'>
                          {field.value ? 'This post is visible to everyone' : 'This post is only visible to you'}
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full' disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {postId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : postId ? (
                    'Update Blog Post'
                  ) : (
                    'Create Blog Post'
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value='preview' className='bg-white rounded-lg border p-6'>
            <article className='prose max-w-none'>
              <h1>{form.watch('title')}</h1>
              <div dangerouslySetInnerHTML={{ __html: form.watch('content') }} />
              {form.watch('tags')?.length > 0 && (
                <div className='mt-8 flex gap-2 not-prose'>
                  {form.watch('tags').map((tag) => (
                    <Badge key={tag} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </article>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
