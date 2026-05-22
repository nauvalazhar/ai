"use client";

import { Fragment, useEffect, useState } from "react";
import { FastForward, Pause, Play, Rewind } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Player,
  PlayerAudio,
  PlayerCurrentTime,
  PlayerDuration,
  PlayerPlayPause,
  PlayerProgress,
  PlayerSeekButton,
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

type TranscriptData = { segments: Segment[] };

const speakers: Record<string, string> = {
  speaker_0: "Maya",
  speaker_1: "Theo",
};

export default function WordHighlight() {
  const [data, setData] = useState<TranscriptData | null>(null);

  useEffect(() => {
    fetch("/dialogue-transcribe.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div className="mx-auto flex h-[520px] w-full max-w-2xl flex-col">
      <Player>
        <Transcript className="h-full">
          <PlayerAudio src="/dialogue.mp3" />
          <TranscriptContent>
            <TranscriptList>
              {data?.segments.map((seg) => {
                const words = seg.words.filter((w) => w.text.trim().length > 0);
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
          <div className="flex items-center gap-1 border-t border-border bg-surface-elevated px-4 py-3">
            <PlayerSeekButton
              seek={-10}
              render={
                <Button
                  iconOnly
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                />
              }
            >
              <Rewind />
            </PlayerSeekButton>
            <PlayerPlayPause
              playIcon={<Play />}
              pauseIcon={<Pause />}
              render={<Button iconOnly variant="ghost" />}
            />
            <PlayerSeekButton
              seek={10}
              render={
                <Button
                  iconOnly
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                />
              }
            >
              <FastForward />
            </PlayerSeekButton>
            <PlayerProgress className="flex-1" />
            <div className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
              <PlayerCurrentTime /> / <PlayerDuration />
            </div>
          </div>
        </Transcript>
      </Player>
    </div>
  );
}
