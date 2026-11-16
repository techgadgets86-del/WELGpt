"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export type AgentState = "idle" | "listening" | "thinking" | "speaking";

export interface VoiceAgentOptions {
  persona?: "operator" | "stoic" | "compassionate";
  onSpeechRecognized?: (transcript: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
}

// Gentle pleasant chime using Web Audio API
export function playVoiceChime(type: "listen" | "stop" | "success" = "listen") {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === "listen") {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } else if (type === "stop") {
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(270, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (_e) {}
}

/**
 * Strips markdown and special characters for natural text-to-speech pronunciation
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return "";
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "Code block omitted.")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove markdown headers
    .replace(/^#+\s+/gm, "")
    // Remove bullet points / checkmarks
    .replace(/^[*-•]\s+/gm, "")
    .replace(/^\[[ xX]\]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    // Remove bold/italic markdown
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    // Remove URLs
    .replace(/https?:\/\/\S+/g, "")
    // Remove markdown links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove emojis (optional, clean up surrogate pairs)
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    // Clean up excessive whitespace
    .replace(/\s+/g, " ")
    .trim();
}

export function useVoiceTalkingAgent(options: VoiceAgentOptions = {}) {
  const { persona = "operator", onSpeechRecognized } = options;

  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isHandsFreeEnabled, setIsHandsFreeEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [speechRate, setSpeechRate] = useState(1.04);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioAnimationRef = useRef<number | null>(null);
  const currentUtterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
  const isSpeakingRef = useRef(false);
  const isHandsFreeRef = useRef(isHandsFreeEnabled);
  isHandsFreeRef.current = isHandsFreeEnabled;

  // Initialize available TTS voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // Prefer high quality English voices
      const enVoices = voices.filter((v) => v.lang.startsWith("en"));
      const best =
        enVoices.find((v) => /Google US English|Samantha|Daniel|Natural|Karen|Alex/i.test(v.name)) ||
        enVoices[0] ||
        voices[0];

      if (best) setSelectedVoice(best);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // Update speech rate based on persona
  useEffect(() => {
    if (persona === "operator") {
      setSpeechRate(1.06); // Crisp, high-speed executive
    } else if (persona === "stoic") {
      setSpeechRate(0.98); // Grounded, measured cadence
    } else {
      setSpeechRate(0.94); // Soothing, calm cadence
    }
  }, [persona]);

  // Audio level visualizer ticker
  useEffect(() => {
    if (agentState === "speaking" || agentState === "listening") {
      const updateLevel = () => {
        // Organic simulated audio waveform oscillation
        const base = agentState === "speaking" ? 55 : 35;
        const jitter = Math.sin(Date.now() / 90) * 25 + Math.random() * 20;
        setAudioLevel(Math.max(10, Math.min(100, Math.round(base + jitter))));
        audioAnimationRef.current = requestAnimationFrame(updateLevel);
      };
      audioAnimationRef.current = requestAnimationFrame(updateLevel);
    } else {
      setAudioLevel(0);
      if (audioAnimationRef.current) cancelAnimationFrame(audioAnimationRef.current);
    }

    return () => {
      if (audioAnimationRef.current) cancelAnimationFrame(audioAnimationRef.current);
    };
  }, [agentState]);

  // Setup SpeechRecognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onstart = () => {
      setAgentState("listening");
      setInterimTranscript("");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        setTranscript(final);
        // Reset silence timer
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          commitTranscript(final);
        }, 1200);
      } else if (interim) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          commitTranscript(interim);
        }, 2200);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (err: any) => {
      console.warn("[VoiceAgent] Recognition error:", err.error);
      if (err.error !== "no-speech") {
        setAgentState("idle");
      }
    };

    recognition.onend = () => {
      // If we are still supposed to be listening and not speaking/thinking
      if (agentState === "listening" && isHandsFreeRef.current && isVoiceModeOpen) {
        try {
          recognition.start();
        } catch (_e) {
          setAgentState("idle");
        }
      } else if (agentState === "listening") {
        setAgentState("idle");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (_e) {}
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [isVoiceModeOpen, agentState]);

  const commitTranscript = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      try {
        recognitionRef.current?.stop();
      } catch (_e) {}

      setAgentState("thinking");
      setTranscript(text.trim());
      setInterimTranscript("");
      playVoiceChime("success");

      if (onSpeechRecognized) {
        onSpeechRecognized(text.trim());
      }
    },
    [onSpeechRecognized]
  );

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    // Cancel any active speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;

    if (!recognitionRef.current) {
      alert("Live voice input is supported in Google Chrome, Safari, and Edge.");
      return;
    }

    try {
      playVoiceChime("listen");
      setTranscript("");
      setInterimTranscript("");
      setAgentState("listening");
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Could not start recognition:", e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    try {
      recognitionRef.current?.stop();
    } catch (_e) {}
    setAgentState("idle");
    playVoiceChime("stop");
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    currentUtterancesRef.current = [];
    setAgentState("idle");
  }, []);

  /**
   * Speaks text aloud using SpeechSynthesis with chunking and voice parameters
   */
  const speakText = useCallback(
    (rawText: string, onDone?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        if (onDone) onDone();
        return;
      }

      // Stop any existing speech
      window.speechSynthesis.cancel();
      isSpeakingRef.current = true;
      setAgentState("speaking");

      const clean = cleanTextForSpeech(rawText);
      if (!clean) {
        isSpeakingRef.current = false;
        setAgentState("idle");
        if (onDone) onDone();
        return;
      }

      // Split into digestible sentences for natural rhythm and to prevent browser timeout
      const sentences = clean
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // Limit length if extremely long so it speaks executive summary
      const sentencesToSpeak = sentences.slice(0, 5);

      let currentIdx = 0;

      const speakNextSentence = () => {
        if (!isSpeakingRef.current || currentIdx >= sentencesToSpeak.length) {
          isSpeakingRef.current = false;
          setAgentState("idle");

          if (onDone) onDone();

          // If hands-free is enabled and voice mode is open, auto-resume listening!
          if (isHandsFreeRef.current && isVoiceModeOpen) {
            setTimeout(() => {
              startListening();
            }, 600);
          }
          return;
        }

        const sentenceText = sentencesToSpeak[currentIdx];
        currentIdx++;

        const utterance = new SpeechSynthesisUtterance(sentenceText);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = speechRate;
        utterance.pitch = persona === "compassionate" ? 0.95 : persona === "stoic" ? 0.92 : 1.0;

        utterance.onend = () => {
          speakNextSentence();
        };

        utterance.onerror = (e) => {
          console.warn("[VoiceAgent] Utterance error:", e);
          speakNextSentence();
        };

        currentUtterancesRef.current.push(utterance);
        window.speechSynthesis.speak(utterance);
      };

      speakNextSentence();
    },
    [isVoiceModeOpen, persona, selectedVoice, speechRate, startListening]
  );

  return {
    isVoiceModeOpen,
    setIsVoiceModeOpen,
    agentState,
    setAgentState,
    transcript,
    interimTranscript,
    audioLevel,
    isHandsFreeEnabled,
    setIsHandsFreeEnabled,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    selectedVoice,
  };
}
