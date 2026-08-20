"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { musicPlaybackStore } from "../lib/music-playback-store";
import { isTimeInRanges } from "../lib/music-seeking";
import {
  getActiveLyricIndex,
  getNextLyricDelayMs,
} from "../lib/music-lyrics";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  pic: string;
  url: string;
  lrc: string;
  lyric?: string;
  lyrics?: LyricLine[];
}

export interface LyricLine {
  time: number; // seconds
  text: string;
}

type PlayMode = "loop" | "single" | "random";

interface MusicContextValue {
  playlist: Song[];
  currentIndex: number;
  currentSong: Song;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;

  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seekToSeconds: (seconds: number) => void;
  seekToPercent: (percent: number) => void;
  playSong: (index: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  togglePlayMode: () => void;
}

const FALLBACK_SONGS: Song[] = [];

function parseLrc(lrc: string): LyricLine[] {
  const lines = lrc.split("\n");
  const result: LyricLine[] = [];

  for (const line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const ms = parseInt(match[3], 10);
      const time =
        minutes * 60 + seconds + ms / (match[3].length === 3 ? 1000 : 100);
      const text = line
        .replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, "")
        .trim();
      if (text) {
        result.push({ time, text });
      }
    }
  }

  return result;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingPlayRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);
  const lyricSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lyricSyncCallbackRef = useRef<() => void>(() => {});
  const autoplayAttemptedRef = useRef(false);
  const gestureResumeRef = useRef<(() => void) | null>(null);
  // 手势恢复保护标志：本次交互（pointerdown 恢复播放 → 松手 → click）中的
  // 首次 togglePlay 暂停请求被忽略，避免"长按才响、一松手就停"
  const gestureResumeGuardRef = useRef(false);
  // 跨标签页互斥：messere.cn 域名下任意时刻只允许一个标签页发声
  const tabIdRef = useRef<string>(
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
  );
  const musicChannelRef = useRef<BroadcastChannel | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>("loop");
  const [parsedLyrics, setParsedLyrics] = useState<LyricLine[]>([]);
  const [songs, setSongs] = useState<Song[]>(FALLBACK_SONGS);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    const controller = new AbortController();

    // 跨标签页互斥：收到其他标签页的播放广播时，立即静音自己
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel('mblog-music');
      musicChannelRef.current = channel;
      channel.onmessage = (event: MessageEvent) => {
        const { type, tabId } = event.data || {};
        if (type === 'play' && tabId !== tabIdRef.current) {
          const audio = audioRef.current;
          if (audio && !audio.paused) {
            pendingPlayRef.current = false;
            audio.pause();
            setIsPlaying(false);
          }
        }
      };
    }

    fetch('/api/songs', { signal: controller.signal })
      .then(res => res.json())
      .then((data: Song[]) => {
        if (controller.signal.aborted) return;
        if (Array.isArray(data) && data.length > 0) {
          setSongs(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => {
      controller.abort();
      if (channel) {
        channel.onmessage = null;
        channel.close();
        if (musicChannelRef.current === channel) musicChannelRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentSong) setParsedLyrics(parseLrc(currentSong.lrc));
  }, [currentSong]);

  const lastLyricRef = useRef("");

  const lyricAt = useCallback((time: number) => {
    const index = getActiveLyricIndex(parsedLyrics, time);
    return index >= 0 ? parsedLyrics[index].text : "";
  }, [parsedLyrics]);

  const requestPlayback = useCallback((deferUntilCanPlay = false) => {
    pendingPlayRef.current = true;
    setIsPlaying(true);

    const audio = audioRef.current;
    if (!audio || deferUntilCanPlay) return;

    audio.play()
      .then(() => {
        pendingPlayRef.current = false;
        setIsPlaying(true);
      })
      .catch(() => {
        pendingPlayRef.current = false;
        setIsPlaying(false);
        // 被浏览器自动播放策略拦截：注册一次性手势监听，首次交互时恢复播放
        if (autoplayAttemptedRef.current && !gestureResumeRef.current && !audio.ended) {
          const options = { capture: true } as const;
          const onGesture = () => {
            cleanupListeners();
            gestureResumeRef.current = null;
            if (audioRef.current && !audioRef.current.ended && audioRef.current.paused) {
              // 置保护标志：click 在 pointerup/keyup 之后同步派发，届时标志仍为 true，
              // 同一交互中随后的 togglePlay 暂停请求被忽略；本次交互结束后再清除
              gestureResumeGuardRef.current = true;
              const clearGuard = () => {
                setTimeout(() => { gestureResumeGuardRef.current = false; }, 0);
              };
              window.addEventListener('pointerup', clearGuard, { capture: true, once: true });
              window.addEventListener('keyup', clearGuard, { capture: true, once: true });
              requestPlayback();
            }
          };
          const cleanupListeners = () => {
            window.removeEventListener('pointerdown', onGesture, options);
            window.removeEventListener('keydown', onGesture, options);
            window.removeEventListener('touchstart', onGesture, options);
          };
          gestureResumeRef.current = onGesture;
          window.addEventListener('pointerdown', onGesture, options);
          window.addEventListener('keydown', onGesture, options);
          window.addEventListener('touchstart', onGesture, options);
        }
      });
  }, []);

  // 打开网页自动播放：歌单就绪后尝试播放；被策略拦截时由首次交互恢复（见 requestPlayback）
  useEffect(() => {
    if (songs.length === 0 || autoplayAttemptedRef.current) return;
    autoplayAttemptedRef.current = true;
    requestPlayback(true);
  }, [songs.length, requestPlayback]);

  const switchSong = useCallback((nextIndex: number, shouldPlay: boolean) => {
    if (nextIndex < 0 || nextIndex >= songs.length) return;

    audioRef.current?.pause();
    if (shouldPlay) {
      requestPlayback(true);
    } else {
      pendingPlayRef.current = false;
      setIsPlaying(false);
    }
    setCurrentIndex(nextIndex);
  }, [requestPlayback, songs.length]);

  useEffect(() => {
    if (!currentSong) return;
    lastLyricRef.current = "";
    pendingSeekRef.current = null;
    if (lyricSyncTimerRef.current !== null) {
      clearTimeout(lyricSyncTimerRef.current);
      lyricSyncTimerRef.current = null;
    }
    musicPlaybackStore.reset();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.preload = "metadata";
    }
  }, [currentIndex, currentSong]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const lastUpdateTimeRef = useRef(0);
  const isPageVisibleRef = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleDurationChange = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration;
    if (Number.isFinite(dur) && dur > 0) {
      musicPlaybackStore.update({ duration: dur });
    }
  };

  const clearLyricSyncTimer = useCallback(() => {
    if (lyricSyncTimerRef.current === null) return;
    clearTimeout(lyricSyncTimerRef.current);
    lyricSyncTimerRef.current = null;
  }, []);

  const syncLyricTimeline = useCallback(() => {
    const audio = audioRef.current;
    clearLyricSyncTimer();
    if (!audio || parsedLyrics.length === 0) return;

    const currentTime = audio.currentTime;
    const nextLyric = lyricAt(currentTime);
    if (nextLyric !== lastLyricRef.current) {
      lastLyricRef.current = nextLyric;
      musicPlaybackStore.update({ currentTime, currentLyric: nextLyric });
    }

    if (audio.paused || audio.ended) return;
    const delayMs = getNextLyricDelayMs(parsedLyrics, currentTime);
    if (delayMs === null) return;

    lyricSyncTimerRef.current = setTimeout(
      () => lyricSyncCallbackRef.current(),
      Math.max(16, delayMs),
    );
  }, [clearLyricSyncTimer, lyricAt, parsedLyrics]);

  useEffect(() => {
    lyricSyncCallbackRef.current = syncLyricTimeline;
    syncLyricTimeline();
    return clearLyricSyncTimer;
  }, [clearLyricSyncTimer, syncLyricTimeline]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    syncLyricTimeline();

    const now = performance.now();
    if (!isPageVisibleRef.current || now - lastUpdateTimeRef.current < 200) return;
    lastUpdateTimeRef.current = now;

    const t = audio.currentTime;
    const dur = audio.duration;
    const playbackPatch: Partial<ReturnType<typeof musicPlaybackStore.getSnapshot>> = {
      currentTime: t,
    };

    if (Number.isFinite(dur) && dur > 0) {
      playbackPatch.duration = dur;
    }

    musicPlaybackStore.update(playbackPatch);
  };

  const retryPendingSeek = useCallback(() => {
    const audio = audioRef.current;
    const target = pendingSeekRef.current;
    if (!audio || target === null || !Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const clamped = Math.max(0, Math.min(target, audio.duration - 0.05));
    if (!isTimeInRanges(audio.buffered, clamped)) return;

    audio.currentTime = clamped;
    audio.preload = "metadata";
    pendingSeekRef.current = null;
    const nextLyric = lyricAt(clamped);
    lastLyricRef.current = nextLyric;
    musicPlaybackStore.update({
      currentTime: clamped,
      duration: audio.duration,
      currentLyric: nextLyric,
    });
    syncLyricTimeline();
    setIsLoading(false);

    if (pendingPlayRef.current) requestPlayback();
  }, [lyricAt, requestPlayback, syncLyricTimeline]);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);

    if (pendingSeekRef.current !== null) {
      retryPendingSeek();
      if (pendingSeekRef.current !== null) {
        const audio = audioRef.current;
        if (audio) audio.preload = "auto";
        setIsLoading(true);
      }
      return;
    }

    if (!pendingPlayRef.current) return;
    requestPlayback();
  }, [requestPlayback, retryPendingSeek]);

  const handleSeeked = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsLoading(false);

    const target = pendingSeekRef.current;
    if (target === null || Math.abs(audio.currentTime - target) > 0.75) return;
    pendingSeekRef.current = null;
    audio.preload = "metadata";
    syncLyricTimeline();
  }, [syncLyricTimeline]);

  const handlePlaying = useCallback(() => {
    pendingPlayRef.current = false;
    setIsLoading(false);
    setIsPlaying(true);
    syncLyricTimeline();
    // 广播：我已开始发声，其他标签页请静音
    musicChannelRef.current?.postMessage({ type: 'play', tabId: tabIdRef.current });
  }, [syncLyricTimeline]);

  const handleAudioError = useCallback(() => {
    pendingPlayRef.current = false;
    setIsLoading(false);
    setIsPlaying(false);
  }, []);

  const handleEnded = useCallback(() => {
    const audio = audioRef.current;
    if (playMode === "single" || (playMode === "loop" && songs.length === 1)) {
      // 单曲循环 / 歌单仅一首时走原生 loop（audio.loop），这里兜底重播
      if (audio) {
        audio.currentTime = 0;
        requestPlayback();
      }
    } else if (playMode === "random") {
      switchSong(Math.floor(Math.random() * songs.length), true);
    } else {
      switchSong((currentIndex + 1) % songs.length, true);
    }
  }, [currentIndex, playMode, requestPlayback, switchSong, songs.length]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      // 手势恢复保护期内忽略暂停请求（同一交互序列 pointerdown 播放 → 松手 click）
      if (gestureResumeGuardRef.current) return;
      pendingPlayRef.current = false;
      audio.pause();
      setIsPlaying(false);
    } else {
      requestPlayback();
    }
  }, [isPlaying, requestPlayback]);

  const nextSong = useCallback(() => {
    if (playMode === 'single') {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        requestPlayback();
      }
    } else if (playMode === 'random') {
      switchSong(Math.floor(Math.random() * songs.length), isPlaying);
    } else {
      switchSong((currentIndex + 1) % songs.length, isPlaying);
    }
  }, [currentIndex, isPlaying, playMode, requestPlayback, songs.length, switchSong]);

  const prevSong = useCallback(() => {
    if (playMode === 'single') {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        requestPlayback();
      }
    } else if (playMode === 'random') {
      switchSong(Math.floor(Math.random() * songs.length), isPlaying);
    } else {
      switchSong((currentIndex - 1 + songs.length) % songs.length, isPlaying);
    }
  }, [currentIndex, isPlaying, playMode, requestPlayback, songs.length, switchSong]);

  const seekToSeconds = useCallback((requestedSeconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
      pendingSeekRef.current = requestedSeconds;
      return;
    }
    if (audio.readyState < HTMLMediaElement.HAVE_METADATA) {
      pendingSeekRef.current = requestedSeconds;
      return;
    }

    const target = Math.max(
      0,
      Math.min(requestedSeconds, Math.max(0, audio.duration - 0.05)),
    );
    pendingSeekRef.current = target;

    const canSeekImmediately =
      isTimeInRanges(audio.seekable, target) || isTimeInRanges(audio.buffered, target);
    if (!canSeekImmediately) {
      pendingPlayRef.current = true;
      setIsPlaying(true);
      setIsLoading(true);
      audio.pause();
      audio.preload = "auto";
      audio.load();
      return;
    }

    audio.currentTime = target;
    pendingSeekRef.current = null;
    const nextLyric = lyricAt(target);
    lastLyricRef.current = nextLyric;
    musicPlaybackStore.update({
      currentTime: target,
      duration: audio.duration,
      currentLyric: nextLyric,
    });
    requestPlayback();
  }, [lyricAt, requestPlayback]);

  const seekToPercent = useCallback((percent: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const normalized = Math.max(0, Math.min(100, percent));
    seekToSeconds(audio.duration * normalized / 100);
  }, [seekToSeconds]);

  const playSong = useCallback((index: number) => {
    if (index < 0 || index >= songs.length) return;
    if (index === currentIndex) {
      requestPlayback();
      return;
    }
    switchSong(index, true);
  }, [currentIndex, requestPlayback, songs.length, switchSong]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.min(1, Math.max(0, v)));
    setIsMuted(false);
  }, []);
  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);
  const togglePlayMode = useCallback(() => {
    setPlayMode((prev) => prev === "loop" ? "single" : prev === "single" ? "random" : "loop");
  }, []);

  const value: MusicContextValue = useMemo(() => ({
    playlist: songs,
    currentIndex,
    currentSong,
    isPlaying,
    isLoading,
    volume,
    isMuted,
    playMode,

    togglePlay,
    nextSong,
    prevSong,
    seekToSeconds,
    seekToPercent,
    playSong,
    setVolume,
    toggleMute,
    togglePlayMode,
  }), [
    songs,
    currentIndex,
    currentSong,
    isPlaying,
    isLoading,
    volume,
    isMuted,
    playMode,
    togglePlay,
    nextSong,
    prevSong,
    seekToSeconds,
    seekToPercent,
    playSong,
    setVolume,
    toggleMute,
    togglePlayMode,
  ]);

  return (
    <MusicContext.Provider value={value}>
      {children}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          preload="metadata"
          crossOrigin="anonymous"
          loop={songs.length === 1 || playMode === "single"}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleDurationChange}
          onDurationChange={handleDurationChange}
          onProgress={retryPendingSeek}
          onSeeking={() => setIsLoading(true)}
          onSeeked={handleSeeked}
          onPause={clearLyricSyncTimer}
          onWaiting={() => setIsLoading(true)}
          onCanPlay={handleCanPlay}
          onPlaying={handlePlaying}
          onError={handleAudioError}
          onEnded={handleEnded}
        />
      )}
    </MusicContext.Provider>
  );
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return ctx;
}

export function useMusicPlayback() {
  const snapshot = useSyncExternalStore(
    musicPlaybackStore.subscribe,
    musicPlaybackStore.getSnapshot,
    musicPlaybackStore.getSnapshot,
  );
  return {
    ...snapshot,
    progress: snapshot.duration > 0 ? snapshot.currentTime / snapshot.duration * 100 : 0,
  };
}

export function useCurrentLyric(): string {
  return useSyncExternalStore(
    musicPlaybackStore.subscribe,
    () => musicPlaybackStore.getSnapshot().currentLyric,
    () => "",
  );
}
