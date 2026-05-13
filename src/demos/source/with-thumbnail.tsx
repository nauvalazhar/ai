import {
  Source,
  SourceDescription,
  SourceName,
  SourceTitle,
} from "#/components/ai/source";

export default function WithThumbnail() {
  return (
    <div className="mx-auto max-w-2xl py-12 grid gap-3 sm:grid-cols-2">
      <Source
        render={
          <a
            href="https://www.theguardian.com"
            target="_blank"
            rel="noreferrer"
          />
        }
      >
        <img
          data-slot="source-thumbnail"
          src="https://picsum.photos/seed/guardian/800/450"
          alt=""
        />
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
        <SourceDescription>May 8, 2026</SourceDescription>
      </Source>

      <Source
        render={
          <a href="https://www.reuters.com" target="_blank" rel="noreferrer" />
        }
      >
        <img
          data-slot="source-thumbnail"
          src="https://picsum.photos/seed/reuters/800/450"
          alt=""
        />
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
        <SourceDescription>May 8, 2026</SourceDescription>
      </Source>

      <Source
        render={
          <a href="https://www.nytimes.com" target="_blank" rel="noreferrer" />
        }
      >
        <img
          data-slot="source-thumbnail"
          src="https://picsum.photos/seed/nytimes/800/450"
          alt=""
        />
        <SourceName>
          <img
            src="https://www.google.com/s2/favicons?domain=nytimes.com&sz=64"
            alt=""
          />
          The New York Times
        </SourceName>
        <SourceTitle>
          White House calls for restraint as the Gulf situation unfolds
        </SourceTitle>
        <SourceDescription>May 8, 2026</SourceDescription>
      </Source>

      <Source
        render={
          <a href="https://www.bbc.com" target="_blank" rel="noreferrer" />
        }
      >
        <img
          data-slot="source-thumbnail"
          src="https://picsum.photos/seed/bbc/800/450"
          alt=""
        />
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
