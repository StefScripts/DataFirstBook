import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link, useLocation } from 'wouter';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDays, formatTime, formatDate, formatDateAndTime, safeParseDate, TIME_SLOTS } from '@/lib/dateUtils';
import { Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
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

const bookingSchema = z.object({
  date: z.date({
    required_error: 'Please select a date'
  }),
  time: z.string({
    required_error: 'Please select a time slot'
  })
});

type BookingForm = z.infer<typeof bookingSchema>;

export default function ManageBooking() {
  const { token } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema)
  });

  // Handle automatic confirmation when accessed via confirmation link
  useEffect(() => {
    // Check if we're on the confirmation path
    if (location.includes('/booking/confirm/')) {
      // Make the confirmation API call
      fetch(`/api/bookings/confirm/${token}`)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to confirm booking');
          return response.json();
        })
        .then((data) => {
          toast({
            title: 'Booking Confirmed',
            description: 'Your consultation has been successfully confirmed.'
          });
          // Redirect to the management page
          setLocation(`/booking/manage/${token}`);
        })
        .catch((error) => {
          toast({
            title: 'Confirmation Failed',
            description: error.message,
            variant: 'destructive'
          });
        });
    }
  }, [token, location, setLocation, toast]);

  // Fetch booking details with proper timezone handling
  const { data: booking, isLoading: loadingBooking } = useQuery({
    queryKey: ['/api/bookings', token],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${token}`);
      if (!response.ok) throw new Error('Failed to fetch booking');
      const data = await response.json();

      // Use the safeParseDate utility for consistent date handling
      return {
        ...data,
        // This handles potential parsing errors and timezone issues more consistently
        date: safeParseDate(data.date) || new Date()
      };
    }
  });

  // Fetch availability for selected date
  const { data: availability, isLoading: checkingAvailability } = useQuery({
    queryKey: ['/api/availability', selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return null;
      const response = await fetch(`/api/availability?date=${selectedDate.toISOString()}`);
      if (!response.ok) throw new Error('Failed to fetch availability');
      return response.json();
    },
    enabled: !!selectedDate
  });

  // Update booking mutation
  const updateMutation = useMutation({
    mutationFn: async (data: BookingForm) => {
      const response = await fetch(`/api/bookings/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: data.date.toISOString(),
          time: data.time
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update booking');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Booking Updated',
        description: 'Your booking has been successfully rescheduled.'
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/bookings/${token}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel booking');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been successfully cancelled.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Cancellation Failed',
        description: error.message || 'Please try again.',
        variant: 'destructive'
      });
    }
  });

  const onSubmit = form.handleSubmit((data) => {
    updateMutation.mutate(data);
  });

  if (loadingBooking) {
    return (
      <div className='min-h-screen py-20'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className='min-h-screen py-20'>
        <div className='container mx-auto px-4'>
          <Card>
            <CardHeader>
              <CardTitle>Booking Not Found</CardTitle>
              <CardDescription>This booking may have been cancelled or the link is invalid.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Show cancelled status if the booking has been cancelled
  if (booking.cancelled) {
    return (
      <div className='min-h-screen py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <Card>
              <CardHeader>
                <CardTitle>Booking Cancelled</CardTitle>
                <CardDescription>
                  This booking was cancelled on {formatDate(booking.date)}. If you'd like to schedule a new consultation, please visit our booking
                  page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href='/book'>
                  <Button className='w-full'>Schedule New Consultation</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Convert booking time to local time for display
  const formattedTime = formatTime(booking.time);

  return (
    <main className='min-h-screen py-20'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold mb-4'>Manage Your Booking</h1>
            <p className='text-xl text-muted-foreground'>Reschedule or cancel your consultation</p>
          </div>

          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>Current Booking</CardTitle>
              <CardDescription>
                Your consultation is scheduled for {formatDate(booking.date)} at {formatTime(booking.time)} PST.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reschedule Consultation</CardTitle>
              <CardDescription>Select a new date and time for your consultation</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={onSubmit} className='space-y-8'>
                  <FormField
                    control={form.control}
                    name='date'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>New Date</FormLabel>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          modifiers={{
                            weekend: (date) => date.getDay() === 0 || date.getDay() === 6
                          }}
                          modifiersClassNames={{
                            weekend: 'hidden'
                          }}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              setSelectedDate(date);
                            }
                          }}
                          disabled={(date) => date < new Date() || date > addDays(new Date(), 30) || date.getDay() === 0 || date.getDay() === 6}
                          className='rounded-md border'
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='time'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Time (PST)</FormLabel>
                        <div className='grid grid-cols-2 gap-2'>
                          {checkingAvailability ? (
                            <div className='col-span-2 flex items-center justify-center py-4'>
                              <Loader2 className='h-6 w-6 animate-spin' />
                            </div>
                          ) : (
                            TIME_SLOTS.filter((slot) => !availability?.unavailableTimes?.includes(slot.value)).map(({ value, label }) => (
                              <Button
                                key={value}
                                type='button'
                                variant={field.value === value ? 'default' : 'outline'}
                                className='w-full'
                                onClick={() => field.onChange(value)}
                                disabled={!selectedDate}
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

                  <div className='flex gap-4'>
                    <Button type='submit' className='flex-1' disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? 'Updating...' : 'Reschedule Booking'}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='destructive' className='flex-1'>
                          Cancel Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Consultation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel your consultation? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                          <AlertDialogAction onClick={() => cancelMutation.mutate()} className='bg-destructive text-destructive-foreground'>
                            {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel Booking'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
