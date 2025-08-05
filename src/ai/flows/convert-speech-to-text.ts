'use server';
/**
 * @fileOverview Converts speech to text.
 *
 * - convertSpeechToText - A function that converts speech to text.
 * - ConvertSpeechToTextInput - The input type for the convertSpeechToText function.
 * - ConvertSpeechToTextOutput - The return type for the convertSpeechToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertSpeechToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ConvertSpeechToTextInput = z.infer<typeof ConvertSpeechToTextInputSchema>;

const ConvertSpeechToTextOutputSchema = z.object({
  text: z.string().describe('The converted text from the audio.'),
});
export type ConvertSpeechToTextOutput = z.infer<typeof ConvertSpeechToTextOutputSchema>;

export async function convertSpeechToText(input: ConvertSpeechToTextInput): Promise<ConvertSpeechToTextOutput> {
  return convertSpeechToTextFlow(input);
}

const convertSpeechToTextPrompt = ai.definePrompt({
  name: 'convertSpeechToTextPrompt',
  input: {schema: ConvertSpeechToTextInputSchema},
  output: {schema: ConvertSpeechToTextOutputSchema},
  prompt: `Convert the following audio to text:\n\n{{media url=audioDataUri}}`,
});

const convertSpeechToTextFlow = ai.defineFlow(
  {
    name: 'convertSpeechToTextFlow',
    inputSchema: ConvertSpeechToTextInputSchema,
    outputSchema: ConvertSpeechToTextOutputSchema,
  },
  async input => {
    const {output} = await convertSpeechToTextPrompt(input);
    return output!;
  }
);
