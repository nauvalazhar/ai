import { ArrowUp, CornerDownRightIcon, Quote, X } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ai/button";
import {
  Composer,
  ComposerInput,
  ComposerQuote,
  ComposerQuoteContent,
  ComposerQuoteDismiss,
  ComposerQuoteIcon,
  ComposerSubmit,
  ComposerToolbar,
  ComposerToolbarSpacer,
} from "#/components/ai/composer";
import { Message, MessageContent, MessageText } from "#/components/ai/message";
import {
  Selection,
  SelectionButton,
  SelectionContent,
  SelectionToolbar,
} from "#/components/ai/selection";

const passages = [
  "A selection toolbar is a small bet on directness. Instead of routing every action through a global menu or a right-click affordance, the interface lets the user's gesture itself frame what comes next. The text they have chosen becomes the subject, and the buttons become the predicates. Quote, share, define, translate, cite. Each verb only makes sense when there is a noun underneath it, and the noun is whatever the user just dragged across.",
  "What makes the pattern feel direct is that the toolbar appears exactly where attention already is. There is no flicker across the screen, no modal, no jump to a corner. The toolbar tracks the start of the selection and stays close to the user's gaze. When the selection collapses or the user clicks elsewhere, it leaves. This is a small piece of restraint that the interface earns the right to be insistent only while there is real intent on the page.",
  "The hardest part of building one is not the visuals. The visuals settle quickly: a rounded surface, a row of icon buttons, a faint shadow that lifts it off the page. The hard part is the lifecycle. When does it appear? After mouseup, not during the drag, because following the cursor mid-selection is nauseating. When does it disappear? When the selection collapses, when the user scrolls past it, when they press Escape, when they tap outside, when the page resizes the layout out from under it. Each of these is its own listener, and getting them to cooperate is the actual work.",
  "Mobile complicates things further. The native callout fights for the same space. Long-press starts the selection, then the user adjusts the handles, then the OS shows its own menu of copy and look up. The custom toolbar has to coexist with this without confusing the user. The pragmatic answer is to render below the OS menu, accept that the two are visible together for a moment, and rely on the user dismissing whichever one they do not want. Touch events fire in an order that is subtly different from mouse events, so the listeners have to be written defensively.",
  "Once the lifecycle is right, the toolbar becomes one of those features that nobody notices and everybody depends on. Quoting a paragraph into a reply takes one drag and one tap. Highlighting a sentence to share to a friend takes the same. The interface fades into the background and the action stays in the foreground, which is the entire point of a good user interface.",
];

export default function LongText() {
  const [quoted, setQuoted] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-8">
      <Selection>
        <SelectionContent className="flex flex-col gap-4">
          <Message type="incoming">
            <MessageContent>
              <MessageText className="flex flex-col gap-4">
                {passages.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </MessageText>
            </MessageContent>
          </Message>
        </SelectionContent>
        <SelectionToolbar>
          <SelectionButton onSelect={(text) => setQuoted(text)}>
            <Quote />
            Quote in reply
          </SelectionButton>
        </SelectionToolbar>
      </Selection>

      <div className="sticky bottom-4">
        <Composer>
          {quoted && (
            <ComposerQuote>
              <ComposerQuoteIcon>
                <CornerDownRightIcon />
              </ComposerQuoteIcon>
              <ComposerQuoteContent>{quoted}</ComposerQuoteContent>
              <ComposerQuoteDismiss
                onClick={() => setQuoted(null)}
                aria-label="Remove quote"
              >
                <X />
              </ComposerQuoteDismiss>
            </ComposerQuote>
          )}
          <ComposerInput
            placeholder={
              quoted
                ? "Reply to the quoted text..."
                : "Select any passage to quote"
            }
            onSubmit={() => setQuoted(null)}
          />
          <ComposerToolbar>
            <ComposerToolbarSpacer>
              <ComposerSubmit
                render={<Button iconOnly className="rounded-full" />}
              >
                <ArrowUp />
              </ComposerSubmit>
            </ComposerToolbarSpacer>
          </ComposerToolbar>
        </Composer>
      </div>
    </div>
  );
}
