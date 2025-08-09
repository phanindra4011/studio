
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { translateTextAction } from '@/lib/actions';
import { Loader2, Languages, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const translateSchema = z.object({
  text: z.string().min(2, 'అనువదించడానికి దయచేసి కనీసం 2 అక్షరాలను నమోదు చేయండి.').max(3000, "టెక్స్ట్ తప్పనిసరిగా 3000 అక్షరాలు లేదా అంతకంటే తక్కువగా ఉండాలి."),
  targetLanguage: z.string({ required_error: 'దయచేసి భాషను ఎంచుకోండి.' }),
});

type FormValues = z.infer<typeof translateSchema>;

const LANGUAGES = [
    "English", "Spanish", "French", "German", "Hindi", "Telugu", "Tamil", "Chinese (Simplified)"
]

export default function TranslatePage() {
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(translateSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setTranslatedText('');
    try {
      const result = await translateTextAction({
        text: data.text,
        targetLanguage: data.targetLanguage,
      });
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'అనువాదం విఫలమైంది',
        description: (error as Error).message || 'టెక్స్ట్‌ని అనువదించడం సాధ్యపడలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 md:p-8 overflow-y-auto h-[calc(100svh-3.5rem)]">
      <div className="max-w-4xl mx-auto grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>టెక్స్ట్‌ని అనువదించండి</CardTitle>
            <CardDescription>
              కొంత టెక్స్ట్‌ని నమోదు చేసి, దానిని అనువదించడానికి భాషను ఎంచుకోండి.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>అనువదించాల్సిన టెక్స్ట్</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="మీరు అనువదించాలనుకుంటున్న టెక్స్ట్‌ని నమోదు చేయండి..."
                          className="min-h-[150px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>లక్ష్య భాష</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="భాషను ఎంచుకోండి" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      అనువదిస్తున్నాము...
                    </>
                  ) : (
                    <>
                     <ArrowRightLeft className="mr-2"/>
                      అనువదించు
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isLoading || translatedText) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="text-primary" />
                అనువదించబడిన టెక్స్ట్
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                    <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {translatedText}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
