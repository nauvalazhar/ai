"use client";

import { useEffect, useRef, useState } from "react";
import { Player } from "#/components/ai/player";
import { Status } from "#/components/ai/status";
import {
  Transcript,
  TranscriptContent,
  TranscriptItem,
  TranscriptList,
  TranscriptSpeaker,
  TranscriptText,
} from "#/components/ai/transcript";
import { Button } from "#/components/ai/button";

type Line = {
  id: number;
  speaker: string;
  text: string;
  interim: boolean;
};

const script: Array<{ speaker: string; text: string }> = [
  {
    speaker: "Maya",
    text: "Okay, the recorder is on. Where do you want to start?",
  },
  {
    speaker: "Theo",
    text: "Start with what we know. The model finishes the run, then loses the last two tool results.",
  },
  {
    speaker: "Maya",
    text: "Loses them how? On the server side, or in the client cache?",
  },
  {
    speaker: "Theo",
    text: "Client. The server logs both results going out. The UI never paints them.",
  },
  {
    speaker: "Maya",
    text: "Then it's the reducer. We probably drop late chunks after RUN_FINISHED fires.",
  },
  {
    speaker: "Theo",
    text: "That's my guess too. Let's pull the event timeline for the last failing run.",
  },
];

const CHAR_MS = 28;
const FINAL_PAUSE_MS = 450;
const NEXT_LINE_MS = 250;

export default function Live() {
  const [lines, setLines] = useState<Line[]>([]);
  const [recording, setRecording] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);
  const scriptRef = useRef(0);

  useEffect(() => {
    if (!recording) return;
    let cancelled = false;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(() => {
        if (cancelled) return;
        fn();
      }, delay);
      timers.push(t);
    };

    const runLine = () => {
      const entry = script[scriptRef.current % script.length];
      idRef.current += 1;
      const id = idRef.current;
      setLines((prev) => [
        ...prev,
        { id, speaker: entry.speaker, text: "", interim: true },
      ]);

      const chars = [...entry.text];
      chars.forEach((_, i) => {
        schedule(
          () => {
            const next = chars.slice(0, i + 1).join("");
            setLines((prev) =>
              prev.map((l) => (l.id === id ? { ...l, text: next } : l)),
            );
          },
          CHAR_MS * (i + 1),
        );
      });

      const totalTypingMs = CHAR_MS * chars.length;
      schedule(() => {
        setLines((prev) =>
          prev.map((l) => (l.id === id ? { ...l, interim: false } : l)),
        );
      }, totalTypingMs + FINAL_PAUSE_MS);

      schedule(
        () => {
          scriptRef.current += 1;
          runLine();
        },
        totalTypingMs + FINAL_PAUSE_MS + NEXT_LINE_MS,
      );
    };

    schedule(runLine, 0);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      setLines((prev) => prev.map((l) => ({ ...l, interim: false })));
    };
  }, [recording]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  return (
    <div className="mx-auto flex h-130 w-full max-w-2xl flex-col">
      <Player>
        <Transcript className="h-full" defaultAutoScroll={false}>
          <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-4 py-3">
            <Status state={recording ? "error" : "neutral"} pulse={recording}>
              {recording ? "Recording" : "Stopped"}
            </Status>
            <Button
              onClick={() => setRecording((r) => !r)}
              className="text-xs text-muted-foreground hover:text-foreground"
              variant="ghost"
            >
              {recording ? "Stop" : "Resume"}
            </Button>
          </div>
          <TranscriptContent>
            <TranscriptList>
              {lines.map((line, i) => (
                <TranscriptItem key={line.id} start={i + 1}>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <TranscriptSpeaker>{line.speaker}</TranscriptSpeaker>
                    <TranscriptText
                      interim={line.interim}
                      className="text-foreground"
                    >
                      {line.text || " "}
                    </TranscriptText>
                  </div>
                </TranscriptItem>
              ))}
              <div ref={bottomRef} aria-hidden />
            </TranscriptList>
          </TranscriptContent>
        </Transcript>
      </Player>
    </div>
  );
}
