"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import styles from "./VideoPlayer.module.scss";

type VideoPlayerProps = {
  src: string;
  poster: string;
  title: string;
  autoPlay?: boolean;
  className?: string;
  caption?: string;
};

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function VideoPlayer({ src, poster, title, autoPlay = false, className = "", caption }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!autoPlay || !videoRef.current) return;
    videoRef.current.play().catch(() => undefined);
  }, [autoPlay, src]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function seek(value: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  }

  function openFullscreen() {
    const element = containerRef.current;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (element?.requestFullscreen) element.requestFullscreen().catch(() => undefined);
    else video?.webkitEnterFullscreen?.();
  }

  return (
    <div ref={containerRef} className={`${styles.player} ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="none"
        muted={muted}
        playsInline
        aria-label={title}
        onClick={togglePlayback}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      {caption && !playing && <span className={styles.caption}>{caption}</span>}
      <button type="button" className={`${styles.centerPlay} ${playing ? styles.hidden : ""}`} onClick={togglePlayback} aria-label="Воспроизвести видео">
        <Play fill="currentColor" />
      </button>
      <div className={styles.controls}>
        <button type="button" onClick={togglePlayback} aria-label={playing ? "Пауза" : "Воспроизвести"}>
          {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        </button>
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Позиция видео"
          style={{ "--progress": `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties}
        />
        <span>{formatTime(duration)}</span>
        <button type="button" onClick={toggleMute} aria-label={muted ? "Включить звук" : "Выключить звук"}>
          {muted ? <VolumeX /> : <Volume2 />}
        </button>
        <button type="button" onClick={openFullscreen} aria-label="На весь экран"><Maximize /></button>
      </div>
    </div>
  );
}
