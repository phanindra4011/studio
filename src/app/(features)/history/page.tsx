'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUsageHistoryAction } from '@/lib/actions';
import { GetUsageHistoryOutput } from '@/ai/flows/get-usage-history';
import { Loader2 } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
    qa: {
      label: 'ప్రశ్న-జవాబు',
      color: 'hsl(var(--chart-1))',
    },
    summarize: {
      label: 'సంగ్రహం',
      color: 'hsl(var(--chart-2))',
    },
    imagine: {
      label: 'చిత్రం',
      color: 'hsl(var(--chart-3))',
    },
    translate: {
      label: 'అనువాదం',
      color: 'hsl(var(--chart-4))',
    },
} satisfies ChartConfig;

export default function HistoryPage() {
    const [historyData, setHistoryData] = useState<GetUsageHistoryOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUsageHistoryAction();
                setHistoryData(data);
            } catch (error) {
                console.error('Failed to fetch usage history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100svh-3.5rem)]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!historyData) {
        return (
            <div className="flex items-center justify-center h-[calc(100svh-3.5rem)]">
                <p>మీ వాడుక చరిత్రను చూపడం సాధ్యపడలేదు.</p>
            </div>
        );
    }

    return (
        <main className="p-4 md:p-8 overflow-y-auto h-[calc(100svh-3.5rem)]">
            <div className="max-w-6xl mx-auto grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>మీ వాడుక చరిత్ర</CardTitle>
                        <CardDescription>
                            గత వారం మీరు యాప్‌ను ఎలా ఉపయోగించారో ఇక్కడ చూడండి.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={historyData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        
                                    />
                                    <YAxis />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--muted))' }}
                                        content={<ChartTooltipContent />}
                                    />
                                    <Legend />
                                    <Bar dataKey="qa" stackId="a" fill="var(--color-qa)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="summarize" stackId="a" fill="var(--color-summarize)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="imagine" stackId="a" fill="var(--color-imagine)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="translate" stackId="a" fill="var(--color-translate)" radius={[4, 4, 0, 0]} />
                                 </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
