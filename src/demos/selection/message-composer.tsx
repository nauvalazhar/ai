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

const reply = `Selection toolbars are a small bet on directness. Instead of a generic menu, every action you offer is already framed by what the user just chose. Quote and share become trivial. Highlight and annotate become possible. The toolbar is the answer to "what now?" applied to a slice of text.`;

export default function MessageComposer() {
  const [quoted, setQuoted] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-8">
      <Message type="outgoing">
        <MessageContent>
          <MessageText variant="bubble">What is selection?</MessageText>
        </MessageContent>
      </Message>
      <Selection>
        <SelectionContent>
          <Message type="incoming">
            <MessageContent>
              <MessageText>{reply}</MessageText>
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
              : "Select text above to quote"
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
  );
}
