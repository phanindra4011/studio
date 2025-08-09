
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
  textbookDescription: z.string().min(10, 'వివరణ కోసం దయచేసి కనీసం 10 అక్షరాలను నమోదు చేయండి.'),
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
        textbookDescription: `పాఠశాల పాఠ్యపుస్తకం కోసం ఒక విద్యాపరమైన ఉదాహరణ, సరళమైన మరియు స్పష్టమైన శైలి: ${data.textbookDescription}`,
      });
      if (!result.imageUrl) {
        throw new Error('AI చిత్రం తిరిగి ఇవ్వలేదు. దయచేసి వేరే వివరణను ప్రయత్నించండి.');
      }
      setImageUrl(result.imageUrl);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'చిత్రం జనరేషన్ విఫలమైంది',
        description: (error as Error).message || 'చిత్రాన్ని రూపొందించడం సాధ్యపడలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.',
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
            <CardTitle>చిత్రం జనరేషన్</CardTitle>
            <CardDescription>
              మీ పాఠ్యపుస్తకం నుండి ఒక దృశ్యం లేదా భావనను వివరించండి, మరియు నేను దానిని ఊహించుకోవడంలో మీకు సహాయపడటానికి ఒక చిత్రాన్ని రూపొందిస్తాను.
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
                        <Input placeholder="ఉదా., కిరణజన్య సంయోగక్రియ యొక్క రేఖాచిత్రం" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      రూపొందిస్తున్నాము...
                    </>
                  ) : (
                    'చిత్రాన్ని రూపొందించండి'
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
                రూపొందించబడిన చిత్రం
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
            <AlertTitle>నిరాకరణ</AlertTitle>
            <AlertDescription>
                AI తప్పులు చేయగలదు. దయచేసి రూపొందించబడిన కంటెంట్ యొక్క ఖచ్చితత్వాన్ని రెండుసార్లు తనిఖీ చేయండి.
            </AlertDescription>
        </Alert>
      </div>
    </main>
  );
}
