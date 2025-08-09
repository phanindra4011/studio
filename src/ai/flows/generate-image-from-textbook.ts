'use server';
/**
 * @fileOverview Generates an image based on a description from the textbook.
 *
 * - generateImageFromTextbook - A function that generates an image from a textbook description.
 * - GenerateImageFromTextbookInput - The input type for the generateImageFromTextbook function.
 * - GenerateImageFromTextbookOutput - The return type for the generateImageFromTextbook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageFromTextbookInputSchema = z.object({
  textbookDescription: z
    .string()
    .describe('A description of content from the textbook to generate an image from.'),
});
export type GenerateImageFromTextbookInput = z.infer<
  typeof GenerateImageFromTextbookInputSchema
>;

const GenerateImageFromTextbookOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageFromTextbookOutput = z.infer<
  typeof GenerateImageFromTextbookOutputSchema
>;

export async function generateImageFromTextbook(
  input: GenerateImageFromTextbookInput
): Promise<GenerateImageFromTextbookOutput> {
  return generateImageFromTextbookFlow(input);
}

const generateImagePrompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: {schema: GenerateImageFromTextbookInputSchema},
  output: {schema: GenerateImageFromTextbookOutputSchema},
  prompt: `You are an AI that generates images based on textbook descriptions.

  Generate an image based on the following description:
  {{textbookDescription}}
  `,
});

const generateImageFromTextbookFlow = ai.defineFlow(
  {
    name: 'generateImageFromTextbookFlow',
    inputSchema: GenerateImageFromTextbookInputSchema,
    outputSchema: GenerateImageFromTextbookOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.textbookDescription,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!media || !media.url) {
      throw new Error('No image was generated.');
    }

    return {imageUrl: media.url};
  }
);
