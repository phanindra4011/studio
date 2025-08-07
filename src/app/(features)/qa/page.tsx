
'use client';

import { useState } from 'react';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import type { Message } from '@/lib/types';
import { getAnswerAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { BotMessageSquare, Sparkles } from 'lucide-react';

export default function QAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateId = () => Math.random().toString(36).substring(2, 15);

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
        <Sparkles className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold font-headline mb-2">Welcome to Vidyarthi AI!</h2>
      <p className="text-muted-foreground max-w-md">
        Your personal AI tutor for Telangana textbooks. Select your grade, share how you're feeling, and ask me anything about your lessons!
      </p>
    </div>
  );

  return (
    <main className="flex flex-col h-[calc(100svh-3.5rem)]">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? welcomeScreen : <ChatMessages messages={messages} isLoading={isLoading} />}
        </div>
      <div className="p-4 bg-background/70 backdrop-blur-sm border-t">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
