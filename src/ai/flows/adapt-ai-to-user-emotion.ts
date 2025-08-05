'use server';
/**
 * @fileOverview Adapts the AI's response based on the user's emotional state.
 *
 * - adaptAiToUserEmotion - A function that takes user input and emotion and adjusts the AI response accordingly.
 * - AdaptAiToUserEmotionInput - The input type for the adaptAiToUserEmotion function.
 * - AdaptAiToUserEmotionOutput - The return type for the adaptAiToUserEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptAiToUserEmotionInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
  emotion: z.string().describe('The detected emotion of the user (e.g., happy, sad, confused).'),
  gradeLevel: z.string().describe('The grade level of the student.'),
});
export type AdaptAiToUserEmotionInput = z.infer<typeof AdaptAiToUserEmotionInputSchema>;

const AdaptAiToUserEmotionOutputSchema = z.object({
  adaptedResponse: z.string().describe('The AI response adapted to the user emotion and grade level.'),
});
export type AdaptAiToUserEmotionOutput = z.infer<typeof AdaptAiToUserEmotionOutputSchema>;

export async function adaptAiToUserEmotion(input: AdaptAiToUserEmotionInput): Promise<AdaptAiToUserEmotionOutput> {
  return adaptAiToUserEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptAiToUserEmotionPrompt',
  input: {schema: AdaptAiToUserEmotionInputSchema},
  output: {schema: AdaptAiToUserEmotionOutputSchema},
  prompt: `You are an AI tutor designed to help students learn from Telangana state textbooks for grades 1-10.
You should respond to the student in a way that takes into account their emotional state, adapting the language used in order to properly support the student.
The response must be in Telugu.

Grade Level: {{{gradeLevel}}}
Student Emotion: {{{emotion}}}
Student Query: {{{query}}}

Adapted Response:`,  
});

const adaptAiToUserEmotionFlow = ai.defineFlow(
  {
    name: 'adaptAiToUserEmotionFlow',
    inputSchema: AdaptAiToUserEmotionInputSchema,
    outputSchema: AdaptAiToUserEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
