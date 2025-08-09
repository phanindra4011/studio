
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bot, User, Volume2, Loader2, AlertTriangle } from 'lucide-react';
import { textToSpeechAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const handleTextToSpeech = async () => {
    if (typeof message.content !== 'string' || !message.content) return;
    setIsSpeaking(true);
    try {
      const { audioDataUri } = await textToSpeechAction({ text: message.content });
      const audio = new Audio(audioDataUri);
      audio.play();
      audio.onended = () => setIsSpeaking(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Text-to-Speech Failed',
        description: 'Could not play the audio. Please try again.',
      });
      setIsSpeaking(false);
    }
  };

  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn('flex items-start gap-4', isAssistant ? 'justify-start' : 'justify-end')}>
      {isAssistant && (
        <Avatar className="h-9 w-9 border-2 border-primary/50">
           <AvatarImage src="/vidyarthi-logo.png" alt="Vidyarthi AI" />
          <AvatarFallback className="bg-primary/20 text-primary">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xl rounded-lg p-4 text-base shadow-sm',
          isAssistant
            ? 'bg-card'
            : 'bg-primary text-primary-foreground',
          message.isError && 'bg-destructive text-destructive-foreground'
        )}
      >
        {message.isError && <AlertTriangle className="inline-block mr-2 h-4 w-4" />}
        <div className="prose prose-base dark:prose-invert max-w-none whitespace-pre-wrap">{message.content}</div>
        {isAssistant && typeof message.content === 'string' && message.content && !message.isError && (
          <Button
            size="sm"
            variant="ghost"
            className="mt-2 h-7 px-2 text-muted-foreground"
            onClick={handleTextToSpeech}
            disabled={isSpeaking}
            aria-label="Read message aloud"
          >
            {isSpeaking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            <span className="ml-1.5 text-xs">Listen</span>
          </Button>
        )}
      </div>
      {!isAssistant && (
        <Avatar className="h-9 w-9 border">
           <AvatarImage src="/user-avatar.png" alt="User" />
          <AvatarFallback className="bg-secondary">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
