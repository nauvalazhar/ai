import {
  Source,
  SourceDescription,
  SourceName,
  SourceTitle,
} from "#/components/ai/source";

export default function Minimal() {
  return (
    <div className="mx-auto max-w-md py-12 flex flex-col gap-1">
      <Source
        variant="plain"
        render={
          <a
            href="https://www.theguardian.com"
            target="_blank"
            rel="noreferrer"
          />
        }
      >
        <SourceName>
          <img
            src="https://www.google.com/s2/favicons?domain=theguardian.com&sz=64"
            alt=""
          />
          The Guardian
        </SourceName>
        <SourceTitle>
          US-Iran ceasefire under threat after exchange of strikes in Strait of
          Hormuz
        </SourceTitle>
      </Source>

      <Source
        variant="plain"
        render={
          <a href="https://www.reuters.com" target="_blank" rel="noreferrer" />
        }
      >
        <SourceName>
          <img
            src="https://www.google.com/s2/favicons?domain=reuters.com&sz=64"
            alt=""
          />
          Reuters
        </SourceName>
        <SourceTitle>
          Oil prices spike as Hormuz stand-off escalates
        </SourceTitle>
        <SourceDescription>
          Brent crude briefly touched $98 a barrel after reports of naval
          engagements near the strait, before easing on news of renewed
          backchannel talks.
        </SourceDescription>
      </Source>

      <Source
        variant="plain"
        render={
          <a href="https://www.bbc.com" target="_blank" rel="noreferrer" />
        }
      >
        <SourceName>
          <img
            src="https://www.google.com/s2/favicons?domain=bbc.com&sz=64"
            alt=""
          />
          BBC News
        </SourceName>
        <SourceTitle>
          Diplomatic backchannels remain open between Washington and Tehran
        </SourceTitle>
        <SourceDescription>May 8, 2026</SourceDescription>
      </Source>
    </div>
  );
}
