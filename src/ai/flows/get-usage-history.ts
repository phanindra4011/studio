'use server';
/**
 * @fileOverview Retrieves usage history data.
 *
 * - getUsageHistory - A function that returns mock usage data for the chart.
 * - GetUsageHistoryOutput - The return type for the getUsageHistory function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UsageHistorySchema = z.object({
    name: z.string(),
    qa: z.number(),
    summarize: z.number(),
    imagine: z.number(),
    translate: z.number(),
});

const GetUsageHistoryOutputSchema = z.array(UsageHistorySchema);

export type GetUsageHistoryOutput = z.infer<typeof GetUsageHistoryOutputSchema>;

// This is a mock implementation. In a real application, you would fetch this from a database.
const usageData: GetUsageHistoryOutput = [
    { name: 'Mon', qa: 4, summarize: 3, imagine: 2, translate: 1 },
    { name: 'Tue', qa: 3, summarize: 2, imagine: 4, translate: 2 },
    { name: 'Wed', qa: 2, summarize: 2, imagine: 1, translate: 3 },
    { name: 'Thu', qa: 5, summarize: 4, imagine: 3, translate: 2 },
    { name: 'Fri', qa: 6, summarize: 3, imagine: 2, translate: 1 },
];

export async function getUsageHistory(): Promise<GetUsageHistoryOutput> {
  return getUsageHistoryFlow();
}

const getUsageHistoryFlow = ai.defineFlow(
  {
    name: 'getUsageHistoryFlow',
    outputSchema: GetUsageHistoryOutputSchema,
  },
  async () => {
    return usageData;
  }
);
