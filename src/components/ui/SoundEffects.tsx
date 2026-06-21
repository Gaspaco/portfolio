"use client";

import { useEffect, useRef } from "react";

type PlayableSound = {
  play: () => number;
  stop: () => void;
  fade?: (from: number, to: number, duration: number, id?: number) => void;
};

type MenuSoundKey = "click" | "close" | "switch" | "longclick" | "tick" | "homelink" | "aboutlink";

type SoundBank = {
  effects: Record<MenuSoundKey, PlayableSound>;
  ambient: PlayableSound;
};

type HowlerController = {
  mute: (muted: boolean) => void;
};

type SoundPlayEvent = CustomEvent<{ sound?: MenuSoundKey }>;

const SOUND_TARGET_SELECTOR = "[data-sound]:not([data-sound='off'])";
const AUDIO_BASE_URL = process.env.NEXT_PUBLIC_SOUND_BASE_URL || "/sounds";
const MENU_SOUND_KEYS = new Set<MenuSoundKey>([
  "click",
  "close",
  "switch",
  "longclick",
  "tick",
  "homelink",
  "aboutlink",
]);

function makeWavDataUri(samples: Int16Array, sampleRate = 44100) {
  const headerSize = 44;
  const buffer = new ArrayBuffer(headerSize + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  samples.forEach((sample, index) => {
    view.setInt16(headerSize + index * 2, sample, true);
  });

  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return `data:audio/wav;base64,${window.btoa(binary)}`;
}

function makeMenuTickDataUri(kind: "hover" | "click") {
  const sampleRate = 44100;
  const durationSeconds = kind === "hover" ? 0.035 : 0.075;
  const sampleCount = Math.floor(sampleRate * durationSeconds);
  const samples = new Int16Array(sampleCount);
  const gain = kind === "hover" ? 0.065 : 0.11;
  const baseFrequency = kind === "hover" ? 980 : 420;
  let noiseState = 0.17;
  let lowpass = 0;
  let bandpass = 0;

  const random = () => {
    noiseState = (noiseState * 16807) % 2147483647;
    return noiseState / 2147483647 - 0.5;
  };

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const progress = i / sampleCount;
    const transient = Math.exp(-progress * (kind === "hover" ? 18 : 10));
    const body = Math.exp(-progress * (kind === "hover" ? 40 : 18));
    const noise = random();
    lowpass += (noise - lowpass) * 0.18;
    bandpass += (lowpass - bandpass) * 0.5;

    const pitchDrop = baseFrequency * (1 - progress * (kind === "hover" ? 0.1 : 0.32));
    const tone = Math.sin(2 * Math.PI * pitchDrop * t) * body;
    const texture = (bandpass - lowpass * 0.35) * transient;
    const sample = Math.max(-1, Math.min(1, (texture * 0.75 + tone * 0.35) * gain));
    samples[i] = sample * 0x7fff;
  }

  return makeWavDataUri(samples, sampleRate);
}

function getSoundTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const element = target.closest(SOUND_TARGET_SELECTOR) as HTMLElement | null;
  if (!element || element.closest("[data-sound='off']")) return null;
  if (element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true") {
    return null;
  }

  return element;
}

function getSoundKey(element: HTMLElement): MenuSoundKey {
  const sound = element.dataset.sound;
  if (sound && MENU_SOUND_KEYS.has(sound as MenuSoundKey)) {
    return sound as MenuSoundKey;
  }

  return "click";
}

export default function SoundEffects() {
  const soundsRef = useRef<SoundBank | null>(null);
  const loadingRef = useRef<Promise<SoundBank> | null>(null);
  const howlerRef = useRef<HowlerController | null>(null);
  const ambientStartedRef = useRef(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    let disposed = false;

    const loadSounds = async () => {
      if (soundsRef.current) return soundsRef.current;
      if (loadingRef.current) return loadingRef.current;

      loadingRef.current = import("howler").then(({ Howl, Howler }) => {
        howlerRef.current = Howler;
        Howler.mute(mutedRef.current);

        const bank: SoundBank = {
          effects: {
            click: new Howl({
              src: [`${AUDIO_BASE_URL}/click.wav`, makeMenuTickDataUri("click")],
              volume: 1,
              preload: true,
            }),
            close: new Howl({
              src: [`${AUDIO_BASE_URL}/close.wav`],
              volume: 0.95,
              preload: true,
            }),
            switch: new Howl({
              src: [`${AUDIO_BASE_URL}/switch.wav`],
              volume: 0.95,
              preload: true,
            }),
            longclick: new Howl({
              src: [`${AUDIO_BASE_URL}/longclick.wav`],
              volume: 0.9,
              preload: true,
            }),
            tick: new Howl({
              src: [`${AUDIO_BASE_URL}/tick.wav`],
              volume: 0.82,
              preload: true,
            }),
            homelink: new Howl({
              src: [`${AUDIO_BASE_URL}/menu/homelink.wav`],
              volume: 0.9,
              preload: true,
            }),
            aboutlink: new Howl({
              src: [`${AUDIO_BASE_URL}/menu/aboutlink.wav`],
              volume: 0.9,
              preload: true,
            }),
          },
          ambient: new Howl({
            src: [`${AUDIO_BASE_URL}/ambient.mp3`],
            volume: 0,
            loop: true,
            preload: true,
          }),
        };

        soundsRef.current = bank;
        return bank;
      });

      return loadingRef.current;
    };

    const play = async (kind: MenuSoundKey) => {
      const sounds = await loadSounds();
      if (disposed) return;

      sounds.effects[kind].stop();
      sounds.effects[kind].play();
    };

    const startAmbient = async () => {
      if (ambientStartedRef.current || mutedRef.current) return;
      ambientStartedRef.current = true;

      const sounds = await loadSounds();
      if (disposed) return;

      const id = sounds.ambient.play();
      sounds.ambient.fade?.(0, 0.52, 1600, id);
    };

    const setMuted = (muted: boolean) => {
      mutedRef.current = muted;
      howlerRef.current?.mute(muted);
      window.localStorage.setItem("sound-muted", muted ? "1" : "0");
      window.dispatchEvent(new CustomEvent("sound-muted-change", { detail: { muted } }));

      if (!muted) {
        void startAmbient();
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = getSoundTarget(event.target);
      if (!target) return;
      void play(getSoundKey(target));
    };

    const handleFirstInteraction = () => {
      void startAmbient();
    };

    const handleToggleSound = () => {
      setMuted(!mutedRef.current);
    };

    const handleSoundPlay = (event: Event) => {
      const customEvent = event as SoundPlayEvent;
      const sound = customEvent.detail?.sound;
      if (!sound || !MENU_SOUND_KEYS.has(sound)) return;
      void startAmbient();
      void play(sound);
    };

    const storedMuted = window.localStorage.getItem("sound-muted") === "1";
    setMuted(storedMuted);

    document.addEventListener("click", handleClick, true);
    document.addEventListener("pointerdown", handleFirstInteraction, true);
    document.addEventListener("keydown", handleFirstInteraction, true);
    window.addEventListener("sound-toggle", handleToggleSound);
    window.addEventListener("sound-play", handleSoundPlay);

    return () => {
      disposed = true;
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("pointerdown", handleFirstInteraction, true);
      document.removeEventListener("keydown", handleFirstInteraction, true);
      window.removeEventListener("sound-toggle", handleToggleSound);
      window.removeEventListener("sound-play", handleSoundPlay);
      if (soundsRef.current) {
        Object.values(soundsRef.current.effects).forEach((sound) => sound.stop());
      }
      soundsRef.current?.ambient.stop();
    };
  }, []);

  return null;
}
