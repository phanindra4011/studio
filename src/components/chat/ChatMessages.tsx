
'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import ChatMessage from './ChatMessage';
import { Loader2 } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollAreaRef} className="flex-1 space-y-6 overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && messages[messages.length-1]?.role === 'user' && (
         <div className="flex justify-start">
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
                 <div className="max-w-xl rounded-lg p-3 text-sm shadow-sm bg-card">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
         </div>
      )}
    </div>
  );
}
