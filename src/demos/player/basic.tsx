import {
  BookmarkIcon,
  FastForwardIcon,
  Pause,
  Play,
  RewindIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Player,
  PlayerAudio,
  PlayerCurrentTime,
  PlayerDuration,
  PlayerMeta,
  PlayerMute,
  PlayerPlayPause,
  PlayerProgress,
  PlayerSeekButton,
  PlayerTitle,
  PlayerVolume,
} from "#/components/ai/player";

export default function Basic() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Player>
        <PlayerAudio src="/dialogue.mp3" />
        <div className="flex flex-col gap-2.5 rounded-outer bg-surface p-3.5 ring ring-border">
          <div className="flex items-center">
            <div className="flex flex-col gap-1">
              <PlayerTitle>Dialogue.mp3</PlayerTitle>
              <PlayerMeta>Local Source</PlayerMeta>
            </div>
            <Button
              iconOnly
              variant="ghost"
              className="ml-auto text-muted-foreground hover:text-foreground size-8 [&>svg]:size-4.5"
            >
              <BookmarkIcon />
            </Button>
          </div>
          <PlayerProgress />
          <div className="flex items-center justify-between">
            <PlayerCurrentTime />
            <PlayerDuration />
          </div>
          <div className="flex items-center">
            <div className="w-1/3" />
            <div className="flex items-center justify-center gap-1.5 w-1/3">
              <PlayerSeekButton
                seek={-5}
                render={
                  <Button
                    iconOnly
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RewindIcon />
                  </Button>
                }
              />
              <PlayerPlayPause
                playIcon={<Play />}
                pauseIcon={<Pause />}
                render={
                  <Button iconOnly variant="primary" className="rounded-full" />
                }
              />
              <PlayerSeekButton
                seek={5}
                render={
                  <Button
                    iconOnly
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <FastForwardIcon />
                  </Button>
                }
              />
            </div>
            <div className="flex items-center gap-1.5 w-1/3 justify-end">
              <PlayerMute
                muteIcon={<VolumeX />}
                unmuteIcon={<Volume2 />}
                render={<Button iconOnly variant="ghost" />}
              />
              <PlayerVolume className="w-14" />
            </div>
          </div>
        </div>
      </Player>
    </div>
  );
}
