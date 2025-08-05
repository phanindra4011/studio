
"use client";

import { useState, useRef, useCallback } from 'react';
import { useToast } from './use-toast';

export const useRecorder = ({ onStop }: { onStop: (blob: Blob) => void }) => {
    const { toast } = useToast();
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        if (isRecording || !navigator.mediaDevices) {
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                onStop(audioBlob);
                stream.getTracks().forEach(track => track.stop()); // Stop microphone access
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting recording:", err);
            toast({
                variant: "destructive",
                title: "Recording Error",
                description: "Could not start recording. Please ensure microphone permissions are granted.",
            })
        }
    }, [isRecording, onStop, toast]);

    const stopRecording = useCallback(() => {
        if (!isRecording || !mediaRecorderRef.current) {
            return;
        }
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    }, [isRecording]);
    
    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    return { isRecording, toggleRecording };
};
