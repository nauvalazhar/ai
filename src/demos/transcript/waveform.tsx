"use client";

import { Fragment, useEffect, useState } from "react";
import {
  FastForward,
  Pause,
  Play,
  Rewind,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Player,
  PlayerAudio,
  PlayerCurrentTime,
  PlayerDuration,
  PlayerMute,
  PlayerPlayPause,
  PlayerSeekButton,
  PlayerVolume,
  PlayerWaveform,
} from "#/components/ai/player";
import {
  Transcript,
  TranscriptContent,
  TranscriptItem,
  TranscriptList,
  TranscriptSpeaker,
  TranscriptText,
  TranscriptTime,
  TranscriptWord,
} from "#/components/ai/transcript";

type Word = { text: string; start_time: number; end_time: number };

type Segment = {
  text: string;
  start_time: number;
  end_time: number;
  speaker: { id: string; name: string };
  words: Word[];
};

const AUDIO_SRC = "/dialogue.mp3";

const speakers: Record<string, string> = {
  speaker_0: "Maya",
  speaker_1: "Theo",
};

export default function Waveform() {
  const [segments, setSegments] = useState<Segment[] | null>(null);

  useEffect(() => {
    fetch("/dialogue-transcribe.json")
      .then((r) => r.json())
      .then((d) => setSegments(d.segments));
  }, []);

  return (
    <div className="mx-auto flex h-130 w-full max-w-2xl flex-col">
      <Player>
        <Transcript className="h-full">
          <PlayerAudio src={AUDIO_SRC} />
          <div className="flex flex-col gap-3 border-b border-border bg-surface-elevated px-4 pt-4 pb-3">
            <PlayerWaveform src={AUDIO_SRC} />
            <div className="flex items-center justify-between">
              <PlayerCurrentTime />
              <PlayerDuration />
            </div>
            <div className="flex items-center gap-1">
              <PlayerSeekButton
                seek={-5}
                render={<Button iconOnly variant="ghost" />}
              >
                <Rewind />
              </PlayerSeekButton>
              <PlayerPlayPause
                playIcon={<Play />}
                pauseIcon={<Pause />}
                render={
                  <Button
                    iconOnly
                    variant="primary"
                    className="size-10 rounded-full"
                  />
                }
              />
              <PlayerSeekButton
                seek={5}
                render={<Button iconOnly variant="ghost" />}
              >
                <FastForward />
              </PlayerSeekButton>
              <div className="ml-auto flex items-center gap-2 text-muted-foreground">
                <PlayerMute
                  muteIcon={<VolumeX />}
                  unmuteIcon={<Volume2 />}
                  render={<Button iconOnly variant="ghost" />}
                />
                <PlayerVolume />
              </div>
            </div>
          </div>
          <TranscriptContent>
            <TranscriptList>
              {segments?.map((seg) => {
                const words = seg.words.filter(
                  (w) => w.text.trim().length > 0,
                );
                return (
                  <TranscriptItem
                    key={seg.start_time}
                    start={seg.start_time}
                    end={seg.end_time}
                  >
                    <TranscriptTime />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <TranscriptSpeaker>
                        {speakers[seg.speaker.id] ?? seg.speaker.name}
                      </TranscriptSpeaker>
                      <TranscriptText>
                        {words.map((w, i) => (
                          <Fragment key={`${seg.start_time}-${i}`}>
                            <TranscriptWord
                              start={w.start_time}
                              end={w.end_time}
                            >
                              {w.text}
                            </TranscriptWord>
                            {i < words.length - 1 && " "}
                          </Fragment>
                        ))}
                      </TranscriptText>
                    </div>
                  </TranscriptItem>
                );
              })}
            </TranscriptList>
          </TranscriptContent>
        </Transcript>
      </Player>
    </div>
  );
}
