import { FastForward, Pause, Play, Rewind } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Player,
  PlayerCurrentTime,
  PlayerDuration,
  PlayerPlayPause,
  PlayerProgress,
  PlayerSeekButton,
  PlayerVideo,
} from "#/components/ai/player";
import {
  Transcript,
  TranscriptContent,
  TranscriptItem,
  TranscriptList,
  TranscriptText,
  TranscriptTime,
} from "#/components/ai/transcript";

const lines = [
  { start: 0, text: "Opening shot: waves rolling in from the horizon." },
  {
    start: 4,
    text: "Cut underwater. Sunlight cuts through the surface in slow shafts.",
  },
  { start: 9, text: "A school of small silver fish drifts across the frame." },
  {
    start: 14,
    text: "Push toward a coral wall textured with anemones and sponges.",
  },
  {
    start: 19,
    text: "Wide angle on the reef. Color saturates as the camera settles.",
  },
  { start: 24, text: "A larger fish glides past, almost brushing the lens." },
  {
    start: 30,
    text: "Cut to a slow ascent toward the surface, bubbles rising.",
  },
  { start: 35, text: "Surface again. Setting sun gilds the swell." },
];

export default function Video() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Player>
        <Transcript className="h-180">
          <PlayerVideo
            src="https://vjs.zencdn.net/v/oceans.mp4"
            controls={false}
            className="bg-black"
          />
          <div className="flex items-center gap-1 border-y border-border bg-surface-elevated px-4 py-3">
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
          <TranscriptContent>
            <TranscriptList>
              {lines.map((line) => (
                <TranscriptItem key={line.start} start={line.start}>
                  <TranscriptTime className="pt-0.5" />
                  <TranscriptText>{line.text}</TranscriptText>
                </TranscriptItem>
              ))}
            </TranscriptList>
          </TranscriptContent>
        </Transcript>
      </Player>
    </div>
  );
}
