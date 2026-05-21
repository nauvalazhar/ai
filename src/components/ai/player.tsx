"use client";

import { useRender } from "@base-ui/react/use-render";
import ReactPlayer from "react-player";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { cn } from "#/lib/utils";

type PlayerContextValue = {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  setMediaEl: (el: HTMLMediaElement | null) => void;
  jumpTo: (seconds: number) => void;
  seekBy: (delta: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (next: number) => void;
  toggleMute: () => void;
  subscribeTime: (listener: () => void) => () => void;
  getTime: () => number;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

function usePlayerContext() {
  const ctx = use(PlayerContext);
  if (!ctx) {
    throw new Error("Player parts must be rendered inside <Player>.");
  }
  return ctx;
}

export function usePlayer() {
  return usePlayerContext();
}

export function formatTimestamp(
  seconds: number,
  totalDurationHint?: number,
): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  const usesHours =
    totalDurationHint != null ? totalDurationHint >= 3600 : hours > 0;
  if (usesHours) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function Player({ children }: { children?: React.ReactNode }) {
  const [mediaEl, setMediaEl] = useState<HTMLMediaElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMutedState] = useState(false);
  const lastVolumeRef = useRef(1);
  const timeRef = useRef(0);
  const timeSubsRef = useRef<Set<() => void>>(new Set());

  const writeTime = useCallback((next: number) => {
    if (next === timeRef.current) return;
    timeRef.current = next;
    setCurrentTime(next);
    timeSubsRef.current.forEach((fn) => fn());
  }, []);

  const subscribeTime = useCallback((listener: () => void) => {
    const subs = timeSubsRef.current;
    subs.add(listener);
    return () => {
      subs.delete(listener);
    };
  }, []);

  const getTime = useCallback(() => timeRef.current, []);

  useEffect(() => {
    if (!mediaEl) {
      writeTime(0);
      setDuration(0);
      setIsPlaying(false);
      return;
    }
    const readDuration = () =>
      setDuration(Number.isFinite(mediaEl.duration) ? mediaEl.duration : 0);
    const readTime = () => writeTime(mediaEl.currentTime);
    readDuration();
    readTime();
    setIsPlaying(!mediaEl.paused);
    setVolumeState(mediaEl.volume);
    setMutedState(mediaEl.muted);

    // timeupdate covers paused-seek and native-control changes; the RAF loop
    // below upgrades to ~60Hz during playback.
    const onTimeUpdate = () => writeTime(mediaEl.currentTime);
    const onDuration = () => readDuration();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onVolume = () => {
      setMutedState(mediaEl.muted);
    };
    mediaEl.addEventListener("timeupdate", onTimeUpdate);
    mediaEl.addEventListener("durationchange", onDuration);
    mediaEl.addEventListener("loadedmetadata", onDuration);
    mediaEl.addEventListener("play", onPlay);
    mediaEl.addEventListener("pause", onPause);
    mediaEl.addEventListener("ended", onEnded);
    mediaEl.addEventListener("volumechange", onVolume);
    return () => {
      mediaEl.removeEventListener("timeupdate", onTimeUpdate);
      mediaEl.removeEventListener("durationchange", onDuration);
      mediaEl.removeEventListener("loadedmetadata", onDuration);
      mediaEl.removeEventListener("play", onPlay);
      mediaEl.removeEventListener("pause", onPause);
      mediaEl.removeEventListener("ended", onEnded);
      mediaEl.removeEventListener("volumechange", onVolume);
    };
  }, [mediaEl, writeTime]);

  useEffect(() => {
    if (!mediaEl || !isPlaying) return;
    let raf = 0;
    const tick = () => {
      writeTime(mediaEl.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mediaEl, isPlaying, writeTime]);

  const jumpTo = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, seconds);
      writeTime(clamped);
      if (mediaEl) mediaEl.currentTime = clamped;
    },
    [mediaEl, writeTime],
  );

  const seekBy = useCallback(
    (delta: number) => {
      const next = Math.max(0, timeRef.current + delta);
      writeTime(next);
      if (mediaEl) mediaEl.currentTime = next;
    },
    [mediaEl, writeTime],
  );

  const play = useCallback(() => {
    void mediaEl?.play();
  }, [mediaEl]);

  const pause = useCallback(() => {
    mediaEl?.pause();
  }, [mediaEl]);

  const toggle = useCallback(() => {
    if (!mediaEl) return;
    if (mediaEl.paused) void mediaEl.play();
    else mediaEl.pause();
  }, [mediaEl]);

  const setVolume = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(1, next));
      setVolumeState(clamped);
      if (clamped > 0) {
        lastVolumeRef.current = clamped;
        setMutedState(false);
      }
      if (mediaEl) {
        mediaEl.volume = clamped;
        if (clamped > 0 && mediaEl.muted) mediaEl.muted = false;
      }
    },
    [mediaEl],
  );

  const toggleMute = useCallback(() => {
    if (volume === 0) {
      setVolume(lastVolumeRef.current || 1);
      return;
    }
    const next = !muted;
    setMutedState(next);
    if (mediaEl) mediaEl.muted = next;
  }, [mediaEl, muted, volume, setVolume]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      currentTime,
      duration,
      isPlaying,
      volume,
      muted,
      setMediaEl,
      jumpTo,
      seekBy,
      play,
      pause,
      toggle,
      setVolume,
      toggleMute,
      subscribeTime,
      getTime,
    }),
    [
      currentTime,
      duration,
      isPlaying,
      volume,
      muted,
      jumpTo,
      seekBy,
      play,
      pause,
      toggle,
      setVolume,
      toggleMute,
      subscribeTime,
      getTime,
    ],
  );

  return <PlayerContext value={value}>{children}</PlayerContext>;
}

export function PlayerAudio({ ...props }: React.ComponentProps<"audio">) {
  const { setMediaEl } = usePlayerContext();
  return (
    <audio
      data-slot="player-audio"
      ref={setMediaEl}
      preload="metadata"
      {...props}
    />
  );
}

type PlayerVideoProps = Omit<ComponentProps<typeof ReactPlayer>, "ref"> & {
  className?: string;
};

export function PlayerVideo({
  className,
  controls = true,
  ...props
}: PlayerVideoProps) {
  const { setMediaEl, volume, muted } = usePlayerContext();
  return (
    <ReactPlayer
      data-slot="player-video"
      ref={setMediaEl}
      controls={controls}
      volume={volume}
      muted={muted}
      className={cn("block bg-black w-full! aspect-video! h-auto!", className)}
      {...props}
    />
  );
}

type PlayerPlayPauseProps = useRender.ComponentProps<"button"> & {
  playIcon?: React.ReactNode;
  pauseIcon?: React.ReactNode;
};

export function PlayerPlayPause({
  playIcon,
  pauseIcon,
  onClick,
  render,
  className,
  children,
  ...props
}: PlayerPlayPauseProps) {
  const { isPlaying, toggle } = usePlayerContext();
  const icon = isPlaying ? pauseIcon : playIcon;

  return useRender({
    render,
    defaultTagName: "button",
    props: {
      type: "button",
      "aria-label": isPlaying ? "Pause" : "Play",
      "aria-pressed": isPlaying,
      ...props,
      "data-slot": "player-play-pause",
      "data-playing": isPlaying ? "" : undefined,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        toggle();
      },
      className: cn(
        "inline-flex items-center justify-center cursor-pointer",
        "[&_svg]:size-4",
        className,
      ),
      children: children ?? icon,
    },
  });
}

type PlayerSeekButtonProps = useRender.ComponentProps<"button"> & {
  seek: number;
};

export function PlayerSeekButton({
  seek,
  onClick,
  render,
  className,
  ...props
}: PlayerSeekButtonProps) {
  const { seekBy } = usePlayerContext();
  return useRender({
    render,
    defaultTagName: "button",
    props: {
      type: "button",
      "aria-label":
        seek >= 0
          ? `Forward ${seek} seconds`
          : `Back ${Math.abs(seek)} seconds`,
      ...props,
      "data-slot": "player-seek-button",
      "data-direction": seek >= 0 ? "forward" : "back",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        seekBy(seek);
      },
      className: cn(
        "inline-flex items-center justify-center cursor-pointer",
        "[&_svg]:size-4",
        className,
      ),
    },
  });
}

type PlayerCurrentTimeProps = React.ComponentProps<"span"> & {
  format?: (seconds: number, duration: number) => string;
};

export function PlayerCurrentTime({
  format,
  className,
  ...props
}: PlayerCurrentTimeProps) {
  const { currentTime, duration } = usePlayerContext();
  return (
    <span
      data-slot="player-current-time"
      className={cn("text-xs tabular-nums text-muted-foreground", className)}
      {...props}
    >
      {(format ?? formatTimestamp)(currentTime, duration)}
    </span>
  );
}

type PlayerDurationProps = React.ComponentProps<"span"> & {
  format?: (seconds: number, duration: number) => string;
};

export function PlayerDuration({
  format,
  className,
  ...props
}: PlayerDurationProps) {
  const { duration } = usePlayerContext();
  return (
    <span
      data-slot="player-duration"
      className={cn("text-xs tabular-nums text-muted-foreground", className)}
      {...props}
    >
      {(format ?? formatTimestamp)(duration, duration)}
    </span>
  );
}

function useDragSeek(
  ref: React.RefObject<HTMLElement | null>,
  onSeek: (ratio: number) => void,
) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    },
    [],
  );

  return useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;
      const compute = (clientX: number) => {
        const rect = el.getBoundingClientRect();
        const r = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        onSeek(r);
      };
      compute(event.clientX);
      const target = event.currentTarget;
      const pointerId = event.pointerId;
      target.setPointerCapture(pointerId);
      const onMove = (e: PointerEvent) => compute(e.clientX);
      const finish = () => {
        try {
          target.releasePointerCapture(pointerId);
        } catch {
          // pointer may already be released
        }
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", finish);
        target.removeEventListener("pointercancel", finish);
        cleanupRef.current = null;
      };
      cleanupRef.current?.();
      cleanupRef.current = finish;
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", finish);
      target.addEventListener("pointercancel", finish);
    },
    [ref, onSeek],
  );
}

type PlayerProgressProps = React.ComponentProps<"div">;

export function PlayerProgress({
  className,
  onPointerDown,
  ...props
}: PlayerProgressProps) {
  const { currentTime, duration, jumpTo } = usePlayerContext();
  const ref = useRef<HTMLDivElement>(null);
  const ratio = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  const startDrag = useDragSeek(ref, (r) => jumpTo(r * duration));

  return (
    <div
      ref={ref}
      data-slot="player-progress"
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.max(duration, 0)}
      aria-valuenow={currentTime}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented) return;
        startDrag(event);
      }}
      className={cn(
        "group/player-progress relative h-1.5 w-full cursor-pointer rounded-full bg-muted-foreground/20 touch-none",
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary"
        style={{ width: `${ratio * 100}%` }}
      />
      <div
        className={cn(
          "absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-primary shadow",
          "opacity-0 transition-opacity group-hover/player-progress:opacity-100",
        )}
        style={{ left: `calc(${ratio * 100}% - 6px)` }}
      />
    </div>
  );
}

export function PlayerTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="player-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

export function PlayerMeta({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="player-meta"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

type PlayerMuteProps = useRender.ComponentProps<"button"> & {
  muteIcon?: React.ReactNode;
  unmuteIcon?: React.ReactNode;
};

export function PlayerMute({
  muteIcon,
  unmuteIcon,
  onClick,
  render,
  className,
  children,
  ...props
}: PlayerMuteProps) {
  const { muted, volume, toggleMute } = usePlayerContext();
  const isSilent = muted || volume === 0;
  const icon = isSilent ? muteIcon : unmuteIcon;

  return useRender({
    render,
    defaultTagName: "button",
    props: {
      type: "button",
      "aria-label": isSilent ? "Unmute" : "Mute",
      "aria-pressed": isSilent,
      ...props,
      "data-slot": "player-mute",
      "data-muted": isSilent ? "" : undefined,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        toggleMute();
      },
      className: cn(
        "inline-flex items-center justify-center cursor-pointer",
        "[&_svg]:size-4",
        className,
      ),
      children: children ?? icon,
    },
  });
}

type PlayerVolumeProps = React.ComponentProps<"div">;

export function PlayerVolume({
  className,
  onPointerDown,
  ...props
}: PlayerVolumeProps) {
  const { volume, muted, setVolume } = usePlayerContext();
  const ref = useRef<HTMLDivElement>(null);
  const ratio = muted ? 0 : volume;

  const startDrag = useDragSeek(ref, (r) => setVolume(r));

  return (
    <div
      ref={ref}
      data-slot="player-volume"
      role="slider"
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={ratio}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented) return;
        startDrag(event);
      }}
      className={cn(
        "relative h-1 w-20 cursor-pointer rounded-full bg-muted-foreground/30 touch-none",
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-foreground"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}

const PEAKS_CACHE_LIMIT = 16;
const peaksCache = new Map<string, Promise<number[]>>();

function touchPeaksCache(key: string, value: Promise<number[]>) {
  peaksCache.delete(key);
  peaksCache.set(key, value);
  while (peaksCache.size > PEAKS_CACHE_LIMIT) {
    const oldest = peaksCache.keys().next().value;
    if (oldest === undefined) break;
    peaksCache.delete(oldest);
  }
}

async function loadPeaks(src: string, samples: number): Promise<number[]> {
  const key = `${src}::${samples}`;
  const cached = peaksCache.get(key);
  if (cached) {
    touchPeaksCache(key, cached);
    return cached;
  }

  const promise = (async () => {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    try {
      const buf = await fetch(src).then((r) => r.arrayBuffer());
      const audio = await ctx.decodeAudioData(buf);
      const channel = audio.getChannelData(0);
      const samplesPerBar = Math.max(1, Math.floor(channel.length / samples));
      const peaks: number[] = [];
      let absMax = 0;
      for (let i = 0; i < samples; i++) {
        let max = 0;
        const start = i * samplesPerBar;
        const end = Math.min(start + samplesPerBar, channel.length);
        for (let j = start; j < end; j++) {
          const v = Math.abs(channel[j]);
          if (v > max) max = v;
        }
        peaks.push(max);
        if (max > absMax) absMax = max;
      }
      const normalize = absMax > 0 ? 1 / absMax : 1;
      return peaks.map((p) => p * normalize);
    } finally {
      void ctx.close();
    }
  })();

  touchPeaksCache(key, promise);
  try {
    return await promise;
  } catch (err) {
    peaksCache.delete(key);
    throw err;
  }
}

type PlayerWaveformProps = React.ComponentProps<"div"> & {
  src?: string;
  peaks?: number[];
  samples?: number;
  barWidth?: number;
  barGap?: number;
  minHeight?: number;
};

export function PlayerWaveform({
  src,
  peaks: peaksProp,
  samples = 96,
  barWidth = 2,
  barGap = 2,
  minHeight = 2,
  className,
  onPointerDown,
  ...props
}: PlayerWaveformProps) {
  const { currentTime, duration, jumpTo } = usePlayerContext();
  const ref = useRef<HTMLDivElement>(null);
  const [decodedPeaks, setDecodedPeaks] = useState<number[]>([]);
  const peaks = peaksProp ?? decodedPeaks;

  useEffect(() => {
    if (peaksProp || !src) return;
    let cancelled = false;
    loadPeaks(src, samples)
      .then((p) => {
        if (!cancelled) setDecodedPeaks(p);
      })
      .catch(() => {
        if (!cancelled) setDecodedPeaks([]);
      });
    return () => {
      cancelled = true;
    };
  }, [src, samples, peaksProp]);

  const startDrag = useDragSeek(ref, (r) => jumpTo(r * duration));
  const playedRatio = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const isLoading = peaks.length === 0;
  const barCount = isLoading ? samples : peaks.length;

  return (
    <div
      ref={ref}
      data-slot="player-waveform"
      data-loading={isLoading ? "" : undefined}
      role="slider"
      aria-label="Seek waveform"
      aria-valuemin={0}
      aria-valuemax={Math.max(duration, 0)}
      aria-valuenow={currentTime}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented) return;
        if (duration > 0) startDrag(event);
      }}
      className={cn(
        "relative flex h-12 w-full cursor-pointer items-center justify-between touch-none",
        className,
      )}
      style={{ gap: `${barGap}px` }}
      {...props}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const peak = isLoading ? 0 : peaks[i];
        const x = (i + 0.5) / barCount;
        const isPlayed = !isLoading && x <= playedRatio;
        const heightPercent = isLoading ? 40 : Math.max(peak * 100, minHeight);
        return (
          <div
            key={i}
            className={cn(
              "origin-center rounded-full transition-[height,background-color] duration-500 ease-out",
              isLoading
                ? "bg-muted-foreground/40"
                : isPlayed
                  ? "bg-primary"
                  : "bg-muted-foreground/40",
            )}
            style={{
              width: barWidth,
              height: `${heightPercent}%`,
              minHeight,
              animation: isLoading
                ? "player-waveform-loading 1.2s ease-in-out infinite"
                : undefined,
              animationDelay: isLoading ? `${i * 35}ms` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
