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

function createSound(src: string, volume: number, loop = false): PlayableSound {
  let audio: HTMLAudioElement | null = null;
  let fadeFrame = 0;

  const getAudio = () => {
    if (!audio) {
      audio = new Audio(src);
      audio.preload = "none";
      audio.volume = volume;
      audio.loop = loop;
    }

    return audio;
  };

  return {
    play: () => {
      const element = getAudio();
      window.cancelAnimationFrame(fadeFrame);
      element.currentTime = 0;
      element.volume = volume;
      void element.play().catch(() => undefined);
      return 0;
    },
    stop: () => {
      if (!audio) return;
      window.cancelAnimationFrame(fadeFrame);
      audio.pause();
      audio.currentTime = 0;
    },
    fade: (from, to, duration) => {
      const element = getAudio();
      const start = performance.now();
      element.volume = from;

      const tick = (time: number) => {
        const progress = Math.min(1, (time - start) / duration);
        element.volume = from + (to - from) * progress;
        if (progress < 1) fadeFrame = window.requestAnimationFrame(tick);
      };

      fadeFrame = window.requestAnimationFrame(tick);
    },
  };
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
  const ambientStartedRef = useRef(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    let disposed = false;

    const loadSounds = async () => {
      if (soundsRef.current) return soundsRef.current;
      if (loadingRef.current) return loadingRef.current;

      loadingRef.current = Promise.resolve().then(() => {
        const bank: SoundBank = {
          effects: {
            click: createSound(`${AUDIO_BASE_URL}/click.wav`, 1),
            close: createSound(`${AUDIO_BASE_URL}/close.wav`, 0.95),
            switch: createSound(`${AUDIO_BASE_URL}/switch.wav`, 0.95),
            longclick: createSound(`${AUDIO_BASE_URL}/longclick.wav`, 0.9),
            tick: createSound(`${AUDIO_BASE_URL}/tick.wav`, 0.82),
            homelink: createSound(`${AUDIO_BASE_URL}/menu/homelink.wav`, 0.9),
            aboutlink: createSound(`${AUDIO_BASE_URL}/menu/aboutlink.wav`, 0.9),
          },
          ambient: createSound(`${AUDIO_BASE_URL}/ambient.mp3`, 0.52, true),
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

    const setMuted = (muted: boolean, startWhenUnmuted = true) => {
      mutedRef.current = muted;
      window.localStorage.setItem("sound-muted", muted ? "1" : "0");
      window.dispatchEvent(new CustomEvent("sound-muted-change", { detail: { muted } }));

      if (muted) {
        soundsRef.current?.ambient.stop();
        ambientStartedRef.current = false;
      } else if (startWhenUnmuted) {
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
    mutedRef.current = storedMuted;
    window.dispatchEvent(new CustomEvent("sound-muted-change", { detail: { muted: storedMuted } }));

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
