"use client";

import { useRef, useState, useCallback } from "react";

type AudioType = "oscillator" | "binaural" | "noise";

export function useAudioFrequencies() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<unknown[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const ensureCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const stopAudio = useCallback(() => {
    activeNodesRef.current.forEach(node => {
      try { (node as { stop?: () => void }).stop?.(); } catch (_e) {}
      try { (node as { disconnect?: () => void }).disconnect?.(); } catch (_e) {}
    });
    activeNodesRef.current = [];
    setPlayingId(null);
  }, []);

  const playTone = useCallback((freq: number) => {
    const ctx = ensureCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1);
    
    osc.start();
    activeNodesRef.current.push(osc, gain);
  }, [ensureCtx]);

  const playBinaural = useCallback((beatFreq: number) => {
    const ctx = ensureCtx();
    const baseFreq = 200;
    const merger = ctx.createChannelMerger(2);
    
    const oscL = ctx.createOscillator();
    oscL.frequency.value = baseFreq;
    oscL.connect(merger, 0, 0);
    
    const oscR = ctx.createOscillator();
    oscR.frequency.value = baseFreq + beatFreq;
    oscR.connect(merger, 0, 1);
    
    const gain = ctx.createGain();
    merger.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1);
    
    oscL.start();
    oscR.start();
    activeNodesRef.current.push(oscL, oscR, gain, merger);
  }, [ensureCtx]);

  const playNoise = useCallback((type: "brown" | "pink" | "white") => {
    const ctx = ensureCtx();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    if (type === "brown") filter.frequency.value = 400;
    else if (type === "pink") filter.frequency.value = 1000;
    else filter.frequency.value = 20000;
    
    const gain = ctx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 1);
    
    noise.start();
    activeNodesRef.current.push(noise, filter, gain);
  }, [ensureCtx]);

  const toggleSound = useCallback((id: string, type: AudioType, value: string | number) => {
    if (playingId === id) {
      stopAudio();
    } else {
      stopAudio();
      if (type === "oscillator") playTone(Number(value));
      else if (type === "binaural") playBinaural(Number(value));
      else if (type === "noise") playNoise(value as "brown" | "pink" | "white");
      setPlayingId(id);
    }
  }, [playingId, stopAudio, playTone, playBinaural, playNoise]);

  return { playingId, toggleSound, stopAudio };
}
