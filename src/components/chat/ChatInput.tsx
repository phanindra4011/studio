
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Send, Loader2, Square, AlertTriangle } from 'lucide-react';
import { useRecorder } from '@/hooks/use-recorder';
import { speechToTextAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '../ui/alert';

interface ChatInputProps {
  onSubmit: (input: string, grade: string, emotion: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [grade, setGrade] = useState('5');
  const [emotion, setEmotion] = useState('Curious');
  const [isRecordingLoading, setIsRecordingLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleStopRecording = useCallback(async (blob: Blob) => {
    setIsRecordingLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const result = await speechToTextAction({ audioDataUri: base64Audio });
        setInput(prev => prev ? `${prev} ${result.text}` : result.text);
      };
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'స్పీచ్-టు-టెక్స్ట్ విఫలమైంది',
        description: (error as Error).message || 'ఆడియోను ప్రాసెస్ చేయడం సాధ్యపడలేదు.',
      });
    } finally {
      setIsRecordingLoading(false);
    }
  }, [toast]);

  const { isRecording, toggleRecording } = useRecorder({ onStop: handleStopRecording });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= 3000) {
      setInput(text);
    } else {
        toast({
            title: "పద పరిమితికి చేరుకుంది",
            description: "ఇన్‌పుట్ 3000 పదాలకు పరిమితం చేయబడింది.",
        })
    }
  };
  
  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSubmit(input, grade, emotion);
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex w-full items-end gap-2 rounded-lg border bg-card p-2 shadow-sm">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="ఏదైనా అడగండి..."
          className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 max-h-48 bg-transparent"
          rows={1}
        />
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant={isRecording ? 'destructive' : 'ghost'}
            onClick={toggleRecording}
            disabled={isRecordingLoading}
            aria-label={isRecording ? "రికార్డింగ్ ఆపండి" : "రికార్డింగ్ ప్రారంభించండి"}
          >
            {isRecordingLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isRecording ? (
              <Square className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="సందేశం పంపండి"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <Alert className="py-2 bg-transparent border-0 px-0">
        <AlertDescription className="text-xs text-muted-foreground text-center">
            తెలుగు తోడు తప్పులు చేయగలదు. దయచేసి సమాచారాన్ని రెండుసార్లు తనిఖీ చేయండి.
        </AlertDescription>
      </Alert>
    </div>
  );
}
