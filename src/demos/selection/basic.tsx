import { Copy, Link2, Quote, Share2 } from "lucide-react";
import {
  Selection,
  SelectionButton,
  SelectionContent,
  SelectionSeparator,
  SelectionToolbar,
} from "#/components/ai/selection";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <Selection onSelect={(text) => console.log("selected:", text)}>
        <SelectionContent className="prose-like flex flex-col gap-4 text-sm leading-relaxed text-foreground [&_p]:text-muted-foreground">
          <h2 className="text-lg font-semibold">
            On selecting text in conversations
          </h2>
          <p>
            Try selecting any portion of this paragraph. A toolbar should appear
            right above the beginning of your selection, offering ways to act on
            the highlighted text. The selection itself is just a regular browser
            selection, so it keeps every native affordance you already know.
          </p>
          <p>
            Drag across multiple paragraphs, reverse direction, or use a
            keyboard shift-select. The toolbar tracks the start of the selection
            and repositions when the page scrolls. On touch devices it appears
            after you finish dragging the selection handles.
          </p>
          <p>
            Tapping a toolbar action receives the selected text and dismisses
            the toolbar by default. The actions themselves are unopinionated, so
            the component can host quote and share, code highlights, citation
            footnotes, or anything else worth doing with a slice of prose.
          </p>
        </SelectionContent>

        <SelectionToolbar>
          <SelectionButton
            onSelect={(text) => navigator.clipboard.writeText(text)}
          >
            <Copy />
            Copy
          </SelectionButton>
          <SelectionButton onSelect={(text) => console.log("quote:", text)}>
            <Quote />
            Quote
          </SelectionButton>
          <SelectionSeparator />
          <SelectionButton onSelect={(text) => console.log("share:", text)}>
            <Share2 />
            Share
          </SelectionButton>
          <SelectionButton
            onSelect={(text) => console.log("link:", text)}
            aria-label="Copy link to selection"
          >
            <Link2 />
          </SelectionButton>
        </SelectionToolbar>
      </Selection>
    </div>
  );
}
