import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Mail, MapPin, Phone } from 'lucide-react';
import Metadata from '@/components/Metadata';

// Validation schema for the contact form
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(1, 'Company name is required'),
  message: z.string().min(10, 'Message is too short').max(1000, 'Message is too long')
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      message: ''
    }
  });

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
        title: 'Message Sent',
        description: "Thank you for your message. We'll get back to you soon!"
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Error Sending Message',
        description: 'Please try again later or contact us directly via email.',
        variant: 'destructive'
      });
    }
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <main className="min-h-screen py-20">
      <Metadata
        title="Contact Us | DataFirst SEO"
        description="Contact DataFirst SEO or visiting our booking page to schedule your free SEO consultation."
        keywords=""
        canonicalUrl="https://datafirstseo.com/contact"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">Have questions about our SEO services? We're here to help you grow your B2B business.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Contact information */}
          <div className="lg:col-span-5">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Feel free to reach out through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Our Office</h4>
                    <p className="text-muted-foreground">#209-418 East Broadway</p>
                    <p className="text-muted-foreground">Vancouver, BC V5T 1X2</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a href="mailto:stefan@datafirstseo.com" className="text-muted-foreground hover:text-primary transition-colors">
                      stefan@datafirstseo.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Social</h4>
                    <a href="https://www.facebook.com/DataFirstSEO" className="text-muted-foreground hover:text-primary transition-colors">
                      Facebook
                    </a>
                    <br></br>
                    <a href="https://ca.linkedin.com/company/datafirstseo" className="text-muted-foreground hover:text-primary transition-colors">
                      LinkedIn
                    </a>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-medium mb-2">Office Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM PST</p>
                  <p className="text-muted-foreground">Weekend: Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell us about your SEO needs..." className="min-h-[150px] resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map or additional info could go here */}
        <div className="max-w-6xl mx-auto mt-16">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Ready to improve your B2B search visibility?</h2>
              <p className="text-muted-foreground">
                Whether you want to schedule a consultation or just have a quick question about our services, we're here to help your business grow
                through strategic SEO. Fill out the form above, and we'll get back to you promptly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
