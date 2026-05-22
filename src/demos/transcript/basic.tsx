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
} from "#/components/ai/transcript";

const lines = [
  {
    start: 0.2,
    end: 11.6,
    speaker: "Maya",
    text: "So the galaxy is 13 billion years old, hundreds of billions of stars. The math says we should be tripping over civilizations. Where is everyone?",
  },
  {
    start: 12.74,
    end: 23.6,
    speaker: "Theo",
    text: "Yeah, that's Fermi's question. And there are the polite answers. Life is rare. Intelligence is rarer. Maybe the radio window closes fast.",
  },
  {
    start: 23.6,
    end: 26.94,
    speaker: "Maya",
    text: "Polite. You don't believe any of them.",
  },
  {
    start: 26.94,
    end: 29.72,
    speaker: "Theo",
    text: "I believe one of them, just not the polite version.",
  },
  {
    start: 31.62,
    end: 38.38,
    speaker: "Theo",
    text: "Imagine the galaxy as a forest at night. Every civilization is a hunter walking through it.",
  },
  { start: 38.38, end: 38.7, speaker: "Maya", text: "Okay." },
  {
    start: 40.34,
    end: 46.92,
    speaker: "Theo",
    text: "You can't tell who's friendly. You can't tell who's stronger. You can't even tell who's listening. So what do you do?",
  },
  { start: 48, end: 51.22, speaker: "Maya", text: "You don't make a sound." },
  {
    start: 51.22,
    end: 60.38,
    speaker: "Theo",
    text: "You don't make a sound. And if you hear something move, you shoot first, because by the time you finish saying hello, the arrow's already on its way.",
  },
  {
    start: 61.42,
    end: 64.48,
    speaker: "Maya",
    text: "So the silence isn't an absence.",
  },
  {
    start: 64.48,
    end: 69.7,
    speaker: "Theo",
    text: "The silence is the strategy. Everyone who didn't figure that out is already gone.",
  },
  {
    start: 70.76,
    end: 74.52,
    speaker: "Maya",
    text: "And we've been broadcasting since 1936.",
  },
];

export default function Basic() {
  return (
    <div className="mx-auto flex h-130 w-full max-w-2xl flex-col">
      <Player>
        <Transcript className="h-full">
          <PlayerAudio src="/dialogue.mp3" />
          <TranscriptContent>
            <TranscriptList>
              {lines.map((line) => (
                <TranscriptItem
                  key={line.start}
                  start={line.start}
                  end={line.end}
                >
                  <TranscriptTime />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <TranscriptSpeaker>{line.speaker}</TranscriptSpeaker>
                    <TranscriptText>{line.text}</TranscriptText>
                  </div>
                </TranscriptItem>
              ))}
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
