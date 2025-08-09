
'use server';

import { z } from 'zod';
import { answerQuestionsFromTextbook } from '@/ai/flows/answer-questions-from-textbook';
import { summarizeTextbookContent } from '@/ai/flows/summarize-textbook-content';
import { generateImageFromTextbook } from '@/ai/flows/generate-image-from-textbook';
import { convertSpeechToText } from '@/ai/flows/convert-speech-to-text';
import { convertTextToSpeech } from '@/ai/flows/convert-text-to-speech';

const qaSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty.'),
  grade: z.number().min(1).max(10),
  emotionalTone: z.string(),
});

export async function getAnswerAction(input: z.infer<typeof qaSchema>) {
  const validatedInput = qaSchema.parse(input);
  return await answerQuestionsFromTextbook(validatedInput);
}

const summarizeSchema = z.object({
  textbookContent: z.string().min(1, 'Content cannot be empty.'),
  gradeLevel: z.number().min(1).max(10),
});

export async function summarizeContentAction(input: z.infer<typeof summarizeSchema>) {
  const validatedInput = summarizeSchema.parse(input);
  return await summarizeTextbookContent(validatedInput);
}

const imagineSchema = z.object({
  textbookDescription: z.string().min(1, 'Description cannot be empty.'),
});

export async function generateImageAction(input: z.infer<typeof imagineSchema>) {
  const validatedInput = imagineSchema.parse(input);
  return await generateImageFromTextbook(validatedInput);
}

const speechToTextSchema = z.object({
  audioDataUri: z.string(),
});

export async function speechToTextAction(input: z.infer<typeof speechToTextSchema>) {
  const validatedInput = speechToTextSchema.parse(input);
  return await convertSpeechToText(validatedInput);
}

const textToSpeechSchema = z.object({
  text: z.string(),
});

export async function textToSpeechAction(input: z.infer<typeof textToSpeechSchema>) {
    const validatedInput = textToSpeechSchema.parse(input);
    return await convertTextToSpeech(validatedInput);
}
