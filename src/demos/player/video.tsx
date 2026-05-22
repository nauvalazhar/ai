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
  PlayerCurrentTime,
  PlayerDuration,
  PlayerMeta,
  PlayerMute,
  PlayerPlayPause,
  PlayerProgress,
  PlayerSeekButton,
  PlayerTitle,
  PlayerVideo,
  PlayerVolume,
} from "#/components/ai/player";

const VIDEO_SRC = "https://vjs.zencdn.net/v/oceans.mp4";

export default function Video() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Player>
        <div className="overflow-hidden rounded-outer bg-surface ring ring-border">
          <PlayerVideo src={VIDEO_SRC} controls={false} />
          <div className="flex flex-col gap-2.5 p-4">
            <div className="flex items-center">
              <div className="flex flex-col gap-1">
                <PlayerTitle>Oceans</PlayerTitle>
                <PlayerMeta>MP4 Source</PlayerMeta>
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
              <div className="flex w-1/3 items-center justify-center gap-1.5">
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
                    <Button
                      iconOnly
                      variant="primary"
                      className="rounded-full"
                    />
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
              <div className="flex w-1/3 items-center justify-end gap-1.5">
                <PlayerMute
                  muteIcon={<VolumeX />}
                  unmuteIcon={<Volume2 />}
                  render={<Button iconOnly variant="ghost" />}
                />
                <PlayerVolume className="w-14" />
              </div>
            </div>
          </div>
        </div>
      </Player>
    </div>
  );
}
