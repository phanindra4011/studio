
'use client';

import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { summarizeContentAction } from '@/lib/actions';
import { Loader2, BookText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const summarizeSchema = z.object({
  textbookContent: z.string().min(50, 'Please enter at least 50 characters to summarize.').max(3000, 'Content must be 3000 characters or less.'),
  gradeLevel: z.string({ required_error: 'Please select a grade.' }),
  file: z.any().optional(),
});

type FormValues = z.infer<typeof summarizeSchema>;

export default function SummarizePage() {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(summarizeSchema),
    defaultValues: {
      textbookContent: '',
      gradeLevel: '5',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a file smaller than 1MB.',
        });
        return;
      }
      if (file.type !== 'text/plain') {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: 'Please upload a plain text (.txt) file.',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        form.setValue('textbookContent', text.slice(0, 3000));
        if (text.length > 3000) {
            toast({
                title: "Content truncated",
                description: "The document content was truncated to 3000 characters."
            });
        }
      };
      reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
        });
      };
      reader.readAsText(file);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeContentAction({
        textbookContent: data.textbookContent,
        gradeLevel: parseInt(data.gradeLevel),
      });
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: (error as Error).message || 'Could not summarize the content. Please try again.',
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
            <CardTitle>Content Summarization</CardTitle>
            <CardDescription>
              Paste a long passage from your textbook, or upload a .txt file. I'll summarize it into key points suitable for your grade level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="textbookContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Textbook Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the textbook content here, or upload a file below..."
                          className="min-h-[200px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>Upload Document</FormLabel>
                       <FormControl>
                            <div className="relative">
                                <Input
                                    type="file"
                                    accept=".txt"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary/10 file:text-primary
                                    hover:file:bg-primary/20"
                                />
                            </div>
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((grade) => (
                            <SelectItem key={grade} value={String(grade)}>
                              Grade {grade}
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
                      Summarizing...
                    </>
                  ) : (
                    'Summarize Content'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isLoading || summary) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookText className="text-primary" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                    <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {summary}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
