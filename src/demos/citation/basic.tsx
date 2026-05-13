import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Citation,
  CitationDescription,
  CitationHeader,
  CitationIndicator,
  CitationItem,
  CitationList,
  CitationName,
  CitationNav,
  CitationNext,
  CitationPopup,
  CitationPrev,
  CitationTitle,
  CitationTrigger,
} from "#/components/ai/citation";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <p className="text-sm leading-relaxed text-foreground">
        Tensions between the U.S. and Iran flared dangerously this week, as both
        sides exchanged strikes near the Strait of Hormuz{" "}
        <Citation>
          <CitationTrigger>The Guardian +2</CitationTrigger>
          <CitationPopup>
            <CitationHeader>
              <CitationNav>
                <CitationPrev
                  aria-label="Previous source"
                  render={
                    <Button
                      iconOnly
                      variant="ghost"
                      className="size-7 text-muted-foreground hover:text-foreground -ml-1.5"
                    />
                  }
                >
                  <ChevronLeftIcon />
                </CitationPrev>
                <CitationNext
                  aria-label="Next source"
                  render={
                    <Button
                      iconOnly
                      variant="ghost"
                      className="size-7 text-muted-foreground hover:text-foreground"
                    />
                  }
                >
                  <ChevronRightIcon />
                </CitationNext>
                <CitationIndicator />
              </CitationNav>
            </CitationHeader>
            <CitationList>
              <CitationItem
                render={
                  <a
                    href="https://www.theguardian.com"
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <CitationName>
                  <img
                    src="https://www.google.com/s2/favicons?domain=theguardian.com&sz=64"
                    alt=""
                  />
                  The Guardian
                </CitationName>
                <CitationTitle>
                  US-Iran ceasefire under threat after exchange of strikes in
                  Strait of Hormuz
                </CitationTitle>
                <CitationDescription>
                  May 8, 2026. Tensions between the U.S. and Iran flared
                  dangerously on May 7, 2026, as both sides...
                </CitationDescription>
              </CitationItem>

              <CitationItem
                render={
                  <a
                    href="https://www.reuters.com"
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <CitationName>
                  <img
                    src="https://www.google.com/s2/favicons?domain=reuters.com&sz=64"
                    alt=""
                  />
                  Reuters
                </CitationName>
                <CitationTitle>
                  Oil prices spike as Hormuz stand-off escalates
                </CitationTitle>
                <CitationDescription>
                  May 8, 2026. Brent crude briefly touched $98 a barrel after
                  reports of naval engagements near the strait, before easing on
                  news of...
                </CitationDescription>
              </CitationItem>

              <CitationItem
                render={
                  <a
                    href="https://www.nytimes.com"
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <CitationName>
                  <img
                    src="https://www.google.com/s2/favicons?domain=nytimes.com&sz=64"
                    alt=""
                  />
                  The New York Times
                </CitationName>
                <CitationTitle>
                  White House calls for restraint as the Gulf situation unfolds
                </CitationTitle>
                <CitationDescription>
                  May 8, 2026. Senior officials briefed reporters that
                  diplomatic backchannels remain open and that further
                  escalation is...
                </CitationDescription>
              </CitationItem>
            </CitationList>
          </CitationPopup>
        </Citation>
        .
      </p>
    </div>
  );
}
