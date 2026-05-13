import {
  Citation,
  CitationDescription,
  CitationItem,
  CitationList,
  CitationName,
  CitationPopup,
  CitationTitle,
  CitationTrigger,
} from "#/components/ai/citation";

export default function Single() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <p className="text-sm leading-relaxed text-foreground">
        Anthropic and SpaceX announced a major partnership today, sharing
        compute and research efforts as the demand for training capacity keeps
        climbing{" "}
        <Citation>
          <CitationTrigger>NBC News</CitationTrigger>
          <CitationPopup>
            <CitationList>
              <CitationItem
                render={
                  <a
                    href="https://www.nbcnews.com"
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <CitationTitle>
                  Anthropic and SpaceX announce major partnership as AI compute
                  needs grow
                </CitationTitle>
                <CitationDescription>
                  2 days ago. Elon Musk's SpaceX will give Anthropic access to
                  its massive Colossus 1 artificial intelligence data center,
                  bringing together two of the...
                </CitationDescription>
                <CitationName>
                  <img
                    src="https://www.google.com/s2/favicons?domain=nbcnews.com&sz=64"
                    alt=""
                  />
                  NBC News
                </CitationName>
              </CitationItem>
            </CitationList>
          </CitationPopup>
        </Citation>
        .
      </p>
    </div>
  );
}
