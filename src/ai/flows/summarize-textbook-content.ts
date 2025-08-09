'use server';

/**
 * @fileOverview Summarizes textbook content to provide key points for students.
 *
 * - summarizeTextbookContent - A function that summarizes textbook content.
 * - SummarizeTextbookContentInput - The input type for the summarizeTextbookContent function.
 * - SummarizeTextbookContentOutput - The return type for the summarizeTextbookContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTextbookContentInputSchema = z.object({
  textbookContent: z
    .string()
    .describe('The content of the textbook to be summarized.'),
  gradeLevel: z
    .number()
    .describe('The grade level of the student using the summarization.'),
  studentQuery: z.string().optional().describe('The specific query or focus of the student.'),
});
export type SummarizeTextbookContentInput = z.infer<typeof SummarizeTextbookContentInputSchema>;

const SummarizeTextbookContentOutputSchema = z.object({
  summary: z.string().describe('The summarized content of the textbook.'),
  progress: z.string().describe('Progress summary of summarization.'),
});
export type SummarizeTextbookContentOutput = z.infer<typeof SummarizeTextbookContentOutputSchema>;

export async function summarizeTextbookContent(input: SummarizeTextbookContentInput): Promise<SummarizeTextbookContentOutput> {
  return summarizeTextbookContentFlow(input);
}

const summarizeTextbookContentPrompt = ai.definePrompt({
  name: 'summarizeTextbookContentPrompt',
  input: {schema: SummarizeTextbookContentInputSchema},
  output: {schema: SummarizeTextbookContentOutputSchema},
  prompt: `You are an expert summarizer for Telangana state board textbooks, skilled at providing simple Telugu summaries for students. You should only respond in Telugu.

  Please provide a concise summary of the following textbook content, tailored to a student in grade {{gradeLevel}}. Make sure the summary uses simple Telugu that is easy for students to understand.

  Here is the textbook content:
  {{textbookContent}}

  {% if studentQuery %}The student has the following specific query: {{studentQuery}}{% endif %}

  Make sure you output the result in simple Telugu. Your summarization should focus on the core concepts. Keep it concise, while not losing key details. Format the summary so that it is very readable.

  It is OK if you make mistakes so please double check the output from the AI.
  `,
});

const summarizeTextbookContentFlow = ai.defineFlow(
  {
    name: 'summarizeTextbookContentFlow',
    inputSchema: SummarizeTextbookContentInputSchema,
    outputSchema: SummarizeTextbookContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeTextbookContentPrompt(input);
    return {
      ...output!,
      progress: 'పాఠ్యపుస్తకంలోని కంటెంట్ విద్యార్థికి అనువైన కీలక అంశాలలో సంగ్రహించబడింది.',
    };
  }
);
