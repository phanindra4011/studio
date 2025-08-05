import { config } from 'dotenv';
config();

import '@/ai/flows/adapt-ai-to-user-emotion.ts';
import '@/ai/flows/convert-text-to-speech.ts';
import '@/ai/flows/answer-questions-from-textbook.ts';
import '@/ai/flows/generate-image-from-textbook.ts';
import '@/ai/flows/summarize-textbook-content.ts';
import '@/ai/flows/convert-speech-to-text.ts';