import {
  Citation,
  CitationAction,
  CitationContent,
  CitationHeader,
  CitationItem,
  CitationList,
  CitationPopup,
  CitationTitle,
  CitationTrigger,
} from "#/components/ai/citation";
import { ArrowRightIcon } from "lucide-react";

export default function Excerpt() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <p className="text-sm leading-relaxed text-foreground">
        Large numbers of strangers cooperate well only when they share a common
        belief in stories that exist purely in their imagination{" "}
        <Citation>
          <CitationTrigger>1 source</CitationTrigger>
          <CitationPopup>
            <CitationHeader>
              <CitationTitle>Sapiens</CitationTitle>
            </CitationHeader>
            <CitationList>
              <CitationItem>
                <CitationContent>
                  <p>
                    The truly unique feature of our language is not its ability
                    to transmit information about men and lions. Rather, it's
                    the ability to transmit information about things that do not
                    exist at all.
                  </p>
                  <p>
                    You could never convince a monkey to give you a banana by
                    promising him limitless bananas after death in monkey
                    heaven.
                  </p>
                  <p>
                    But why is this important? After all, fiction can be
                    dangerously misleading or distracting.
                  </p>
                  <p>
                    The real difference between us and chimpanzees is the
                    mythical glue that binds together large numbers of
                    individuals, families and groups. This glue has made us the
                    masters of creation.
                  </p>
                </CitationContent>
                <CitationAction>
                  <a
                    href="#"
                    className="no-underline hover:underline inline-flex items-center gap-0.5 text-sm"
                  >
                    View Source <ArrowRightIcon className="w-4 ml-1" />
                  </a>
                </CitationAction>
              </CitationItem>
            </CitationList>
          </CitationPopup>
        </Citation>
        .
      </p>
    </div>
  );
}
