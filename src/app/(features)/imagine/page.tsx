
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { generateImageAction } from '@/lib/actions';
import { Loader2, ImageIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const imagineSchema = z.object({
  textbookDescription: z.string().min(10, 'Please enter at least 10 characters for the description.'),
});

type FormValues = z.infer<typeof imagineSchema>;

export default function ImaginePage() {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(imagineSchema),
    defaultValues: {
      textbookDescription: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setImageUrl('');
    try {
      const result = await generateImageAction({
        textbookDescription: `An educational illustration for a school textbook, simple and clear style: ${data.textbookDescription}`,
      });
      if (!result.imageUrl) {
        throw new Error('The AI did not return an image. Please try a different description.');
      }
      setImageUrl(result.imageUrl);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Image Generation Failed',
        description: (error as Error).message || 'Could not generate the image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 md:p-8 overflow-y-auto h-[calc(100svh-3.5rem)]">
      <div className="max-w-2xl mx-auto grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Image Generation</CardTitle>
            <CardDescription>
              Describe a scene or concept from your textbook, and I'll generate an image to help you visualize it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="textbookDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., A diagram of photosynthesis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Image'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isLoading || imageUrl) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="text-primary" />
                Generated Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="aspect-square w-full bg-muted rounded-lg animate-pulse flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-muted-foreground animate-spin"/>
                </div>
              ) : imageUrl ? (
                <div className="relative aspect-square w-full">
                  <Image
                    src={imageUrl}
                    alt={form.getValues('textbookDescription')}
                    fill
                    className="object-contain rounded-lg"
                    data-ai-hint="educational illustration"
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}
        <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
                AI can make mistakes. Please double-check the generated content for accuracy.
            </AlertDescription>
        </Alert>
      </div>
    </main>
  );
}
