import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addDays, startOfDay, formatTime, formatDate, formatCompactDate, formatWeekday, TIME_SLOTS } from '@/lib/dateUtils';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Metadata from '@/components/Metadata';
import Head from '@/components/php-components/Head';

// Type definitions for API responses
interface NextAvailableDateResponse {
  nextAvailableDate: string;
}

interface AvailabilityResponse {
  unavailableTimes: string[];
}

interface CombinedResponse {
  nextAvailableDate: string;
  availability: AvailabilityResponse;
}

const FREE_EMAIL_DOMAINS = [
  // 'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'proton.me',
  'protonmail.com',
  'zoho.com'
];

const isBusinessEmail = (email: string) => {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain && !FREE_EMAIL_DOMAINS.includes(domain);
};

const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').refine(isBusinessEmail, {
    message: 'Please use your business email address.'
  }),
  company: z.string().min(1, 'Company name is required'),
  message: z.string().optional(),
  date: z.date({
    required_error: 'Please select a date'
  }),
  time: z.string({
    required_error: 'Please select a time slot'
  })
});

type BookingForm = z.infer<typeof bookingSchema>;

export default function Book() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // New UI state variables for progressive loading
  const [calendarReady, setCalendarReady] = useState(false);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      message: ''
    }
  });

  // Combined query - gets next available date and its availability in one request
  const { data: combinedData, isLoading: loadingCombined } = useQuery<CombinedResponse>({
    queryKey: ['/api/availability/combined'],
    queryFn: async () => {
      try {
        // Show calendar UI while waiting for data
        setCalendarReady(true);

        const response = await fetch('/api/availability/combined');
        if (!response.ok) {
          if (response.status === 404) {
            return { nextAvailableDate: null, availability: { unavailableTimes: [] } };
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching combined data:', error);
        return { nextAvailableDate: null, availability: { unavailableTimes: [] } };
      } finally {
        // Ensure calendar becomes ready even in case of error
        setCalendarReady(true);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });

  // Set form values when combined data arrives
  useEffect(() => {
    if (combinedData?.nextAvailableDate) {
      const date = new Date(combinedData.nextAvailableDate);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        setSelectedDate(date);
        form.setValue('date', date);
      }
    }
  }, [combinedData, form]);

  // Only fetch additional availability data when user selects a different date
  const { data: availability, isLoading: checkingAvailability } = useQuery<AvailabilityResponse>({
    queryKey: ['/api/availability', selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return { unavailableTimes: [] };

      setLoadingTimeSlots(true);
      try {
        // Check if this date is already in combined data
        if (combinedData?.nextAvailableDate) {
          const combinedDateStr = new Date(combinedData.nextAvailableDate).toDateString();
          const selectedDateStr = selectedDate.toDateString();

          // If the selected date matches the combined data date, use that availability
          if (combinedDateStr === selectedDateStr) {
            return combinedData.availability;
          }
        }

        // Otherwise fetch it separately
        const response = await fetch(`/api/availability?date=${selectedDate.toISOString()}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching availability:', error);
        return { unavailableTimes: [] };
      } finally {
        setLoadingTimeSlots(false);
      }
    },
    enabled:
      !!selectedDate && (!combinedData?.nextAvailableDate || selectedDate.toDateString() !== new Date(combinedData.nextAvailableDate).toDateString()),
    staleTime: 2 * 60 * 1000 // 2 minutes
  });

  const mutation = useMutation({
    mutationFn: async (data: BookingForm) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        console.error('Error response:', responseData);
        throw new Error(responseData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return responseData;
    },
    onSuccess: () => {
      toast({
        title: 'Consultation Booked!',
        description: "We'll send you a confirmation email with meeting details."
      });
      form.reset();
      if (combinedData?.nextAvailableDate) {
        const date = new Date(combinedData.nextAvailableDate);
        setSelectedDate(date);
        form.setValue('date', date);
      }
    },
    onError: (error: Error) => {
      console.error('Booking error:', error);

      toast({
        title: 'Booking Failed',
        description: error.message || 'Please try again or contact us directly.',
        variant: 'destructive'
      });
    }
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return date < today || date > addDays(today, 30) || date.getDay() === 0 || date.getDay() === 6;
  };

  // Calculate a default month to show - use nextAvailableDate if available, otherwise current month
  const defaultMonth = combinedData?.nextAvailableDate ? new Date(combinedData.nextAvailableDate) : new Date();

  // Get the current unavailable times to display
  const currentUnavailableTimes =
    availability?.unavailableTimes ||
    (selectedDate && combinedData?.nextAvailableDate && selectedDate.toDateString() === new Date(combinedData.nextAvailableDate).toDateString()
      ? combinedData.availability?.unavailableTimes
      : []);

  return (
    <>
      <Head
        title="Book a Free SEO Consultation"
        description="Schedule a free 30-minute SEO consultation with our experts..."
        bodyClass="bg-gray-50"
      />
      <main className="relative bg-white py-24">
        {/* <Metadata
        title="Book a Free SEO Consultation with DataFirst SEO"
        description="Schedule a free 30-minute SEO consultation with our experts to discuss how strategic SEO can help your B2B business attract and convert more high-value clients."
        keywords="DataFirst SEO consultation, SEO consultation, free SEO consultation, B2B SEO consultation, book SEO call"
        canonicalUrl="https://datafirstseo.com/book"
      /> */}
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center mb-16">
            {/* <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Schedule Your Free SEO Consultation</h1> */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 leading-tight">Schedule Your Free SEO Consultation</h1>
            <p className="text-xl text-gray-600 mb-8">
              Book a 30-minute strategy session to discuss how strategic SEO can help your business attract and convert more high-value B2B clients.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Select Your Preferred Time</CardTitle>
                <CardDescription>*Available time slots are shown in PST timezone</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date</FormLabel>
                              <div className="relative">
                                {!calendarReady && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-md">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                  </div>
                                )}
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    if (date && !isDateDisabled(date)) {
                                      setSelectedDate(date);
                                      field.onChange(date);
                                    }
                                  }}
                                  defaultMonth={defaultMonth}
                                  fromDate={startOfDay(new Date())}
                                  disabled={isDateDisabled}
                                  initialFocus
                                  className="rounded-md border w-full [&_.rdp-month]:w-full [&_.rdp-table]:w-full [&_.rdp-day_button]:w-full [&_.rdp-head_cell]:flex-1 [&_.rdp-cell]:flex-1 [&_.rdp-cell:nth-child(6)]:hidden [&_.rdp-cell:nth-child(7)]:hidden [&_.rdp-head_cell:nth-child(6)]:hidden [&_.rdp-head_cell:nth-child(7)]:hidden"
                                  formatters={{
                                    formatWeekdayName: (date) => {
                                      const day = date.getDay();
                                      if (day === 0 || day === 6) return '';
                                      return formatWeekday(date);
                                    }
                                  }}
                                  modifiers={{
                                    weekend: (date) => date.getDay() === 0 || date.getDay() === 6
                                  }}
                                  modifiersClassNames={{
                                    weekend: 'hidden'
                                  }}
                                />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time (in PST)</FormLabel>
                              <div className="grid grid-cols-2 gap-2">
                                {loadingTimeSlots ? (
                                  <div className="col-span-2 flex items-center justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                  </div>
                                ) : (
                                  TIME_SLOTS.filter((slot) => !currentUnavailableTimes?.includes(slot.value)).map(({ value, label }) => (
                                    <Button
                                      key={value}
                                      type="button"
                                      variant={field.value === value ? 'default' : 'outline'}
                                      className={cn('w-full', field.value === value && 'shadow-sm')}
                                      onClick={() => field.onChange(value)}
                                      disabled={!selectedDate}
                                    >
                                      {label}
                                    </Button>
                                  ))
                                )}
                                {!loadingTimeSlots && currentUnavailableTimes?.length === TIME_SLOTS.length && (
                                  <div className="col-span-2 text-center py-4 text-muted-foreground">
                                    No available slots for this date. Please select another date.
                                  </div>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-5">
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
                              <FormLabel>Work Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="you@company.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="website.com" {...field} />
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
                              <FormLabel>Message (Optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Tell us about your SEO goals" className="resize-none min-h-[120px]" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                      size="lg"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        'Schedule Consultation'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
