
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
  textbookContent: z.string().min(50, 'సంగ్రహం కోసం కనీసం 50 అక్షరాలు నమోదు చేయండి.').max(3000, 'టెక్స్ట్ 3000 అక్షరాలకు మించకూడదు.'),
  gradeLevel: z.string({ required_error: 'దయచేసి మీ తరగతిని ఎంచుకోండి.' }),
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
          title: 'ఫైల్ పరిమాణం చాలా పెద్దది',
          description: 'దయచేసి 1MB కంటే చిన్న ఫైల్‌ను అప్‌లోడ్ చేయండి.',
        });
        return;
      }
      if (file.type !== 'text/plain') {
        toast({
          variant: 'destructive',
          title: 'ఫైల్ రకం సరికాదు',
          description: 'దయచేసి టెక్స్ట్ (.txt) ఫైల్‌ను మాత్రమే అప్‌లోడ్ చేయండి.',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        form.setValue('textbookContent', text.slice(0, 3000));
        if (text.length > 3000) {
            toast({
                title: "టెక్స్ట్ కుదించబడింది",
                description: "మీరు ఇచ్చిన టెక్స్ట్ 3000 అక్షరాలకు కుదించబడింది."
            });
        }
      };
      reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'ఫైల్ చదవడంలో లోపం',
            description: 'ఫైల్‌ను చదవడం సాధ్యపడలేదు.',
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
        title: 'సంగ్రహంలో లోపం',
        description: (error as Error).message || 'టెక్స్ట్‌ను సంగ్రహించడం సాధ్యపడలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.',
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
            <CardTitle>టెక్స్ట్ సంగ్రహం</CardTitle>
            <CardDescription>
              మీ పాఠం నుండి టెక్స్ట్‌ను ఇక్కడ అతికించండి లేదా .txt ఫైల్‌ను అప్‌లోడ్ చేయండి. నేను దానిని మీ తరగతికి తగినట్లుగా சுలభంగా సంగ్రహిస్తాను.
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
                      <FormLabel>పాఠం టెక్స్ట్</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="పాఠం టెక్స్ట్‌ను ఇక్కడ అతికించండి లేదా ఫైల్‌ను అప్‌లోడ్ చేయండి..."
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
                      <FormLabel>ఫైల్ అప్‌లోడ్ చేయండి</FormLabel>
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
                      <FormLabel>తరగతి</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="మీ తరగతిని ఎంచుకోండి" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((grade) => (
                            <SelectItem key={grade} value={String(grade)}>
                              {grade}వ తరగతి
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
                      సంగ్రహిస్తున్నాము...
                    </>
                  ) : (
                    'సంగ్రహించండి'
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
                సారాంశం
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
