import {
  Source,
  SourceDescription,
  SourceName,
  SourceTitle,
} from "#/components/ai/source";

export default function Basic() {
  return (
    <div className="mx-auto max-w-md py-12 flex flex-col gap-1">
      <Source
        variant="plain"
        render={
          <a href="https://phys.org" target="_blank" rel="noreferrer" />
        }
      >
        <SourceName>
          <img
            src="https://www.google.com/s2/favicons?domain=phys.org&sz=64"
            alt=""
          />
          Phys.org
        </SourceName>
        <SourceTitle>
          Study suggests people are losing 338 spoken words every year and have
          been for at least 15 years
        </SourceTitle>
        <SourceDescription>April 1, 2026</SourceDescription>
      </Source>

      <Source
        variant="plain"
        render={
          <a href="https://news.arizona.edu" target="_blank" rel="noreferrer" />
        }
      >
        <SourceName>
          <img
            src="https://www.google.com/s2/favicons?domain=arizona.edu&sz=64"
            alt=""
          />
          University of Arizona News
        </SourceName>
        <SourceTitle>
          Are we talking less? A Q&amp;A with psychologist Matthias Mehl
        </SourceTitle>
        <SourceDescription>March 28, 2026</SourceDescription>
      </Source>

      <Source
        variant="plain"
        render={
          <a
            href="https://www.sciencefocus.com"
            target="_blank"
            rel="noreferrer"
          />
        }
      >
        <SourceName>
          <img
            src="https://www.google.com/s2/favicons?domain=sciencefocus.com&sz=64"
            alt=""
          />
          Science Focus
        </SourceName>
        <SourceTitle>
          We&rsquo;re losing 338 spoken words every day, BBC Science Focus
          Magazine reports
        </SourceTitle>
        <SourceDescription>March 30, 2026</SourceDescription>
      </Source>

      <Source
        variant="plain"
        render={
          <a href="https://www.kcur.org" target="_blank" rel="noreferrer" />
        }
      >
        <SourceName>
          <img
            src="https://www.google.com/s2/favicons?domain=kcur.org&sz=64"
            alt=""
          />
          KCUR
        </SourceName>
        <SourceTitle>
          Are people talking less? Kansas City researcher finds we&rsquo;ve lost
          338 spoken words per day
        </SourceTitle>
        <SourceDescription>April 2, 2026</SourceDescription>
      </Source>
    </div>
  );
}
