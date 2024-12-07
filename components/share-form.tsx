'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/lib/api';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const formSchema = z.object({
  cookie: z.string().min(1, 'Cookie is required'),
  url: z.string()
    .url('Must be a valid Facebook URL')
    .refine((url) => url.includes('facebook.com'), 'Must be a Facebook URL'),
  amount: z.number()
    .min(1, 'Minimum amount is 1')
    .max(50000, 'Maximum amount is 50000'),
  interval: z.number()
    .min(1, 'Minimum interval is 1 second')
    .max(30, 'Maximum interval is 30 seconds'),
});

export function ShareForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cookie: '',
      url: '',
      amount: 100,
      interval: 2,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.submitShare(values);
      toast({
        title: 'Success',
        description: 'Share boost task started successfully',
      });
      form.reset();
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Make sure you're using a valid Facebook cookie and the post URL is publicly accessible.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="cookie"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Facebook Cookie
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Paste your Facebook session cookie here</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Paste your Facebook cookie here" 
                  className="font-mono text-sm min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Post URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://facebook.com/..." 
                  {...field}
                  className="font-mono text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={50000}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Number of shares (1-50000)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interval (seconds)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Time between shares (1-30s)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isLoading ? 'Starting Boost...' : 'Start Share Boost'}
        </Button>
      </form>
    </Form>
  );
}