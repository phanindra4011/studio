
'use server';
/**
 * @fileOverview A question answering AI agent for Telangana textbooks.
 *
 * - answerQuestionsFromTextbook - A function that handles the question answering process.
 * - AnswerQuestionsFromTextbookInput - The input type for the answerQuestionsFromTextbook function.
 * - AnswerQuestionsFromTextbookOutput - The return type for the answerQuestionsFromTextbook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsFromTextbookInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
  grade: z.number().describe('The grade level of the student.'),
  emotionalTone: z.string().optional().describe('The emotional tone of the student.'),
});
export type AnswerQuestionsFromTextbookInput = z.infer<typeof AnswerQuestionsFromTextbookInputSchema>;

const AnswerQuestionsFromTextbookOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionsFromTextbookOutput = z.infer<typeof AnswerQuestionsFromTextbookOutputSchema>;

export async function answerQuestionsFromTextbook(input: AnswerQuestionsFromTextbookInput): Promise<AnswerQuestionsFromTextbookOutput> {
  return answerQuestionsFromTextbookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsFromTextbookPrompt',
  input: {schema: AnswerQuestionsFromTextbookInputSchema},
  output: {schema: AnswerQuestionsFromTextbookOutputSchema},
  prompt: `You are a helpful AI assistant designed to answer questions from Telangana state board textbooks for students from grades 1-10.
You should tailor your responses to be appropriate for the student's grade level and emotional tone. Use simple Telugu words.
The response must be in Telugu.

Question: {{{question}}}
Grade: {{{grade}}}
{{#if emotionalTone}}
Emotional Tone: {{{emotionalTone}}}
{{/if}}

Answer:`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const answerQuestionsFromTextbookFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFromTextbookFlow',
    inputSchema: AnswerQuestionsFromTextbookInputSchema,
    outputSchema: AnswerQuestionsFromTextbookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
