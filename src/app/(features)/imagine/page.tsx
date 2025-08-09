
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
  textbookDescription: z.string().min(10, 'వివరణ కనీసం 10 అక్షరాలు ఉండాలి.'),
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
        textbookDescription: `పాఠశాల పాఠ్యపుస్తకం కోసం ఒక సులభమైన బొమ్మ: ${data.textbookDescription}`,
      });
      if (!result.imageUrl) {
        throw new Error('AI చిత్రం ఇవ్వలేదు. దయచేసి వేరే వివరణతో ప్రయత్నించండి.');
      }
      setImageUrl(result.imageUrl);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'చిత్రం తయారీలో లోపం',
        description: (error as Error).message || 'చిత్రాన్ని తయారు చేయడం సాధ్యపడలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.',
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
            <CardTitle>చిత్రాన్ని ఊహించుకోండి</CardTitle>
            <CardDescription>
              మీ పాఠ్య పుస్తకం నుండి ఒక అంశాన్ని వివరిస్తే, నేను దాని చిత్రాన్ని గీస్తాను.
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
                      <FormLabel>వివరణ</FormLabel>
                      <FormControl>
                        <Input placeholder="ఉదా., కిరణజన్య సంయోగక్రియ గురించి ఒక బొమ్మ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      తయారుచేస్తున్నాము...
                    </>
                  ) : (
                    'చిత్రాన్ని గీయండి'
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
                తయారుచేసిన చిత్రం
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
            <AlertTitle>గమనిక</AlertTitle>
            <AlertDescription>
                AI తప్పులు చేయగలదు. దయచేసి ఇచ్చే సమాచారాన్ని సరిచూసుకోండి.
            </AlertDescription>
        </Alert>
      </div>
    </main>
  );
}
