
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
  text: z.string().min(2, 'Please enter at least 2 characters to translate.').max(3000, "Text must be 3000 characters or less."),
  targetLanguage: z.string({ required_error: 'Please select a language.' }),
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
        title: 'Translation Failed',
        description: (error as Error).message || 'Could not translate the text. Please try again.',
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
            <CardTitle>Translate Text</CardTitle>
            <CardDescription>
              Enter some text and choose a language to translate it into.
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
                      <FormLabel>Text to Translate</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the text you want to translate..."
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
                      <FormLabel>Target Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
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
                      Translating...
                    </>
                  ) : (
                    <>
                     <ArrowRightLeft className="mr-2"/>
                      Translate
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
                Translated Text
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
