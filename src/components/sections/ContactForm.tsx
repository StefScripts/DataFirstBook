import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export default function ContactForm() {
  const { toast } = useToast();
  const form = useForm<ContactFormData>();

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Message sent successfully',
        description: "We'll get back to you soon!"
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Error sending message',
        description: 'Please try again later',
        variant: 'destructive'
      });
    }
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <section className='py-20' id='contact'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto'>
          <Card>
            <CardContent className='p-6'>
              <div className='text-center mb-8'>
                <h2 className='text-3xl font-bold mb-4'>Get Your Free SEO Consultation</h2>
                <p className='text-muted-foreground'>Let's discuss how we can help grow your B2B business</p>
                <br></br>
                <Link href='/book'>
                  <Button className='w-full'>Let's Chat</Button>
                </Link>
              </div>

              {/* <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Input
                      placeholder="Your Name"
                      {...form.register("name", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Work Email"
                      type="email"
                      {...form.register("email", { required: true })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Company Name"
                    {...form.register("company", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Tell us about your SEO goals"
                    className="min-h-[100px]"
                    {...form.register("message", { required: true })}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Sending..." : "Get Started"}
                </Button>
              </form> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
