
'use client';

import { useState } from 'react';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import type { Message } from '@/lib/types';
import { getAnswerAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, ImageIcon, BotMessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

let messageIdCounter = 0;
const generateId = () => {
  messageIdCounter++;
  return messageIdCounter.toString();
};

export default function QAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [activeSuggestion, setActiveSuggestion] = useState<'question' | 'image' | null>(null);

  const handleSubmit = async (input: string, grade: string, emotion: string) => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMessagePlaceholderId = generateId();
    
    try {
      const result = await getAnswerAction({ question: input, grade: parseInt(grade), emotionalTone: emotion });
      const assistantMessage: Message = {
        id: assistantMessagePlaceholderId,
        role: 'assistant',
        content: result.answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: assistantMessagePlaceholderId,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your input and try again.',
        isError: true,
      };
       setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: (error as Error).message || 'Failed to get a response from the AI.',
      })
    } finally {
      setIsLoading(false);
    }
  };
  
  const welcomeScreen = (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Bot className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-3xl font-bold font-headline mb-2">Hello! I'm Telugu Thodu</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Your friendly AI-powered study partner. How can I help you today?
      </p>
      <Card className="max-w-2xl w-full">
        <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" size="lg" className="h-auto py-4" asChild>
                    <Link href="/qa">
                        <div className="flex flex-col items-start w-full">
                            <BotMessageSquare className="w-5 h-5 mb-2 text-primary" />
                            <span className="font-semibold">Ask a Question</span>
                        </div>
                    </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-auto py-4" asChild>
                     <Link href="/imagine">
                        <div className="flex flex-col items-start w-full">
                            <ImageIcon className="w-5 h-5 mb-2 text-primary" />
                            <span className="font-semibold">Create an Image</span>
                        </div>
                    </Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <main className="flex flex-col h-[calc(100svh-3.5rem)]">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? welcomeScreen : <ChatMessages messages={messages} isLoading={isLoading} />}
        </div>
      <div className="p-4 bg-background/80 backdrop-blur-sm border-t">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
