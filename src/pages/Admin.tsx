import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Calendar as CalendarIcon, Clock, Users, X, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import BlogEditor from '@/components/BlogEditor';
import { Link } from 'wouter';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { addDays, formatDate, formatTime, formatCompactDate, formatDateAndTime, safeParseDate, startOfDay, TIME_SLOTS } from '@/lib/dateUtils';

// Define types for API response
interface SlotData {
  bookedTimes: string[];
  blockedTimes: string[];
}

interface BlockingResult {
  message: string;
  results: {
    successful: Array<{ date: string; times: string[] }>;
    conflicts: Array<{ date: string; times: string[] }>;
  };
}

const blockSlotSchema = z.object({
  dates: z.array(z.date()).min(1, 'Please select at least one date'),
  times: z.array(z.string()).min(1, 'Please select at least one time slot')
});

type BlockSlotForm = z.infer<typeof blockSlotSchema>;

const DAYS_OF_WEEK = [
  { value: '1', label: 'Mon' },
  { value: '2', label: 'Tue' },
  { value: '3', label: 'Wed' },
  { value: '4', label: 'Thu' },
  { value: '5', label: 'Fri' }
] as const;

const recurringBlockSchema = z.object({
  daysOfWeek: z.array(z.string()).min(1, 'Please select at least one day'),
  numberOfWeeks: z.number().min(1).max(12),
  times: z.array(z.string()).min(1, 'Please select at least one time slot')
});

type RecurringBlockForm = z.infer<typeof recurringBlockSchema>;

const BlogPostsSection = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/admin/blog-posts'],
    queryFn: async () => {
      const response = await fetch('/api/admin/blog-posts');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!posts?.length) {
    return <div className="text-center py-8 text-muted-foreground">No blog posts found</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <Card key={post.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{formatDate(new Date(post.createdAt))}</p>
                <div className="flex gap-2">
                  <Badge variant={post.published ? 'default' : 'secondary'}>{post.published ? 'Published' : 'Draft'}</Badge>
                  {post.published && (
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Badge variant="outline">Preview</Badge>
                    </Link>
                  )}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <ScrollArea className="max-h-[80vh]">
                    <div className="p-6">
                      <BlogEditor
                        postId={post.id}
                        onSuccess={() => {
                          // Close dialog after successful edit
                          const closeButton = document.querySelector('[aria-label="Close"]');
                          if (closeButton instanceof HTMLButtonElement) {
                            closeButton.click();
                          }
                        }}
                      />
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [activeTab, setActiveTab] = useState('consultations');

  const form = useForm<BlockSlotForm>({
    resolver: zodResolver(blockSlotSchema),
    defaultValues: {
      dates: [],
      times: []
    }
  });

  const recurringForm = useForm<RecurringBlockForm>({
    resolver: zodResolver(recurringBlockSchema),
    defaultValues: {
      daysOfWeek: [],
      numberOfWeeks: 1,
      times: []
    }
  });

  const { data: slots, isLoading: checkingSlots } = useQuery<SlotData>({
    queryKey: ['/api/admin/blocked-slots', selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return { bookedTimes: [], blockedTimes: [] };

      const response = await fetch(`/api/admin/blocked-slots?date=${selectedDate.toISOString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch slots');
      }

      return response.json();
    },
    enabled: !!selectedDate
  });

  const { data: consultations, isLoading: loadingConsultations } = useQuery({
    queryKey: ['/api/admin/consultations'],
    queryFn: async () => {
      const response = await fetch('/api/admin/consultations');
      if (!response.ok) throw new Error('Failed to fetch consultations');
      return response.json();
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: BlockSlotForm) => {
      const response = await fetch('/api/admin/blocked-slots/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dates: data.dates,
          times: data.times
        })
      });

      if (!response.ok && response.status !== 409) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to block slots');
      }

      return response.json();
    },
    onSuccess: (data: BlockingResult) => {
      const { successful, conflicts } = data.results;
      const successCount = successful.reduce((acc, date) => acc + date.times.length, 0);
      const conflictCount = conflicts.reduce((acc, date) => acc + date.times.length, 0);

      let description = '';
      if (successCount > 0) {
        description += `Successfully blocked ${successCount} time slot${successCount !== 1 ? 's' : ''}.`;
      }
      if (conflictCount > 0) {
        description += `\n${conflictCount} time slot${conflictCount !== 1 ? 's' : ''} had conflicts.`;

        conflicts.forEach(({ date, times }) => {
          const formattedTimes = times.map((t) => formatTime(t)).join(', ');
          description += `\nConflicts on ${formatDate(date)}: ${formattedTimes}`;
        });
      }

      toast({
        title: data.message,
        description
      });

      if (successCount > 0) {
        setSelectedDates([]);
        form.reset();
      }
    },
    onError: (error) => {
      toast({
        title: 'Failed to Block Slots',
        description: error.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  });

  const recurringMutation = useMutation({
    mutationFn: async (data: RecurringBlockForm) => {
      const response = await fetch('/api/admin/blocked-slots/recurring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok && response.status !== 409) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to block recurring slots');
      }

      return response.json();
    },
    onSuccess: (data: BlockingResult) => {
      const { successful, conflicts } = data.results;
      const successCount = successful.reduce((acc, date) => acc + date.times.length, 0);
      const conflictCount = conflicts.reduce((acc, date) => acc + date.times.length, 0);

      let description = '';
      if (successCount > 0) {
        description += `Successfully blocked ${successCount} recurring time slot${successCount !== 1 ? 's' : ''}.`;
      }
      if (conflictCount > 0) {
        description += `\n${conflictCount} time slot${conflictCount !== 1 ? 's' : ''} had conflicts.`;

        conflicts.forEach(({ date, times }) => {
          const formattedTimes = times.map((t) => formatTime(t)).join(', ');
          description += `\nConflicts on ${formatDate(date)}: ${formattedTimes}`;
        });
      }

      toast({
        title: data.message,
        description
      });

      if (successCount > 0) {
        recurringForm.reset();
      }
    },
    onError: (error) => {
      toast({
        title: 'Failed to Block Recurring Slots',
        description: error.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  });

  const unblockMutation = useMutation({
    mutationFn: async ({ date, times }: { date: Date; times: string[] }) => {
      const response = await fetch('/api/admin/blocked-slots', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, times })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unblock slots');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Time Slots Unblocked',
        description: `Successfully unblocked ${data.unblocked.length} time slot(s)`
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to Unblock Slots',
        description: error.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  });

  const deleteConsultationMutation = useMutation({
    mutationFn: async (consultationId: number) => {
      const response = await fetch(`/api/admin/consultations/${consultationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel consultation');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Consultation Cancelled',
        description: 'The consultation has been successfully cancelled.'
      });
      // Refetch the consultations list
      queryClient.invalidateQueries({ queryKey: ['/api/admin/consultations'] });
    },
    onError: (error) => {
      toast({
        title: 'Error Cancelling Consultation',
        description: error.message || 'Please try again later.',
        variant: 'destructive'
      });
    }
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);
    const dateExists = selectedDates.some(
      (d) => d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
    );

    if (!dateExists) {
      const newDates = [...selectedDates, date];
      setSelectedDates(newDates);
      form.setValue('dates', newDates);
    }
  };

  const removeDate = (dateToRemove: Date) => {
    const newDates = selectedDates.filter(
      (d) => d.getFullYear() !== dateToRemove.getFullYear() || d.getMonth() !== dateToRemove.getMonth() || d.getDate() !== dateToRemove.getDate()
    );
    setSelectedDates(newDates);
    form.setValue('dates', newDates);
  };

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  const onSubmitRecurring = recurringForm.handleSubmit((data) => {
    // Keep the days as strings when submitting
    recurringMutation.mutate({
      ...data,
      daysOfWeek: data.daysOfWeek // No conversion needed now
    });
  });

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl text-muted-foreground">Manage your consultations, time slots, and blog posts</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="consultations">Upcoming Consultations</TabsTrigger>
              <TabsTrigger value="calendar">Calendar & Time Slots</TabsTrigger>
              <TabsTrigger value="recurring">Recurring Blocks</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="consultations">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Consultations</CardTitle>
                  <CardDescription>View and manage your scheduled consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingConsultations ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : consultations?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No upcoming consultations</div>
                  ) : (
                    <div className="space-y-4">
                      {consultations?.map((consultation: any) => (
                        <Card key={consultation.id}>
                          <CardContent className="pt-6">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold">{consultation.name}</h3>
                                <p className="text-sm text-muted-foreground">{consultation.company}</p>
                                <p className="text-sm">{consultation.email}</p>
                              </div>
                              <div className="text-right flex flex-col items-end justify-between">
                                <div>
                                  <p className="font-medium">{formatDate(consultation.date)}</p>
                                  <p className="text-sm">{formatTime(consultation.time)}</p>
                                  <Badge className="mt-2" variant={consultation.confirmed ? 'default' : 'secondary'}>
                                    {consultation.confirmed ? 'Confirmed' : 'Pending'}
                                  </Badge>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="mt-4">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Cancel
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancel Consultation</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel this consultation? This action cannot be undone and the client will be
                                        notified via email.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Keep</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteConsultationMutation.mutate(consultation.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        {deleteConsultationMutation.isPending ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Cancelling
                                          </>
                                        ) : (
                                          'Yes, Cancel'
                                        )}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle>Block Time Slots in Bulk</CardTitle>
                  <CardDescription>Select multiple dates and times to block them all at once</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="dates"
                            render={() => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Select Dates</FormLabel>
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={handleDateSelect}
                                  disabled={(date) =>
                                    date < new Date() || date > addDays(new Date(), 120) || date.getDay() === 0 || date.getDay() === 6
                                  }
                                  className="rounded-md border"
                                />
                                <div className="mt-4 space-y-2">
                                  <FormLabel>Selected Dates</FormLabel>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedDates.map((date, index) => (
                                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {formatCompactDate(date)}
                                        <button type="button" onClick={() => removeDate(date)} className="ml-1 hover:text-destructive">
                                          <X className="h-3 w-3" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="times"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Select Time Slots</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                  {checkingSlots ? (
                                    <div className="col-span-2 flex items-center justify-center py-4">
                                      <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                  ) : (
                                    TIME_SLOTS.map(({ value, label }) => (
                                      <Button
                                        key={value}
                                        type="button"
                                        variant={field.value?.includes(value) ? 'default' : 'outline'}
                                        className={cn('w-full', field.value?.includes(value) && 'bg-primary text-primary-foreground')}
                                        onClick={() => {
                                          const newTimes = field.value?.includes(value)
                                            ? field.value.filter((t) => t !== value)
                                            : [...(field.value || []), value];
                                          field.onChange(newTimes);
                                        }}
                                      >
                                        {label}
                                      </Button>
                                    ))
                                  )}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Time Slot Status</h3>
                          <div className="space-y-2">
                            {slots?.bookedTimes?.map((time: string) => (
                              <div key={time} className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  <Users className="h-4 w-4 mr-1" />
                                  {formatTime(time)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">Booked</span>
                              </div>
                            ))}
                            {slots?.blockedTimes?.map((time: string) => (
                              <div key={time} className="flex items-center gap-2">
                                <Badge variant="destructive">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {formatTime(time)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">Blocked</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (selectedDate) {
                                      unblockMutation.mutate({
                                        date: selectedDate,
                                        times: [time]
                                      });
                                    }
                                  }}
                                  disabled={unblockMutation.isPending}
                                  className="h-6 px-2 text-destructive hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={mutation.isPending || selectedDates.length === 0}>
                        {mutation.isPending ? 'Blocking...' : 'Block Selected Time Slots'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recurring">
              <Card>
                <CardHeader>
                  <CardTitle>Set Recurring Time Blocks</CardTitle>
                  <CardDescription>Block time slots that repeat on specific days of the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...recurringForm}>
                    <form onSubmit={onSubmitRecurring} className="space-y-8">
                      <FormField
                        control={recurringForm.control}
                        name="daysOfWeek"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Days of Week</FormLabel>
                            <FormControl>
                              <ToggleGroup type="multiple" value={field.value} onValueChange={field.onChange} className="justify-start">
                                {DAYS_OF_WEEK.map((day) => (
                                  <ToggleGroupItem key={day.value} value={day.value} aria-label={day.label} className="px-3">
                                    {day.label}
                                  </ToggleGroupItem>
                                ))}
                              </ToggleGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={recurringForm.control}
                        name="numberOfWeeks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Weeks</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} max={12} {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={recurringForm.control}
                        name="times"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Time Slots</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                              {TIME_SLOTS.map(({ value, label }) => (
                                <Button
                                  key={value}
                                  type="button"
                                  variant={field.value?.includes(value) ? 'default' : 'outline'}
                                  className={cn('w-full', field.value?.includes(value) && 'bg-primary text-primary-foreground')}
                                  onClick={() => {
                                    const newTimes = field.value?.includes(value)
                                      ? field.value.filter((t) => t !== value)
                                      : [...(field.value || []), value];
                                    field.onChange(newTimes);
                                  }}
                                >
                                  {label}
                                </Button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={recurringMutation.isPending}>
                        {recurringMutation.isPending ? 'Setting up...' : 'Set Recurring Blocks'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog">
              <div className="space-y-6">
                <BlogEditor />

                {/* Blog Posts Management */}
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Blog Posts</CardTitle>
                    <CardDescription>View, edit, and manage your blog posts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BlogPostsSection />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
