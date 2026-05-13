import { useEffect, useState } from "react";
import { ArrowDownIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "#/components/ai/conversation";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageText,
} from "#/components/ai/message";

type Turn = { id: number; type: "incoming" | "outgoing"; text: string };

const seed: Turn[] = [
  { id: 0, type: "outgoing", text: "Tell me a few things about Saturn." },
  {
    id: 1,
    type: "incoming",
    text: "Sure, ask away and I'll cover whatever you're curious about.",
  },
];

const pairs: Array<{ user: string; ai: string }> = [
  {
    user: "How big is its ring system?",
    ai: "The rings stretch about 280,000 km across but are only tens of meters thick. Mostly water ice with a bit of rock dust.",
  },
  {
    user: "Could you stand on the surface?",
    ai: "No. Saturn is a gas giant, so there's no solid ground. The atmosphere just keeps getting denser the deeper you go.",
  },
  {
    user: "How long is a day there?",
    ai: "About 10.7 hours. A year, on the other hand, takes 29 Earth years.",
  },
  {
    user: "Is it really less dense than water?",
    ai: "Yes. If you had a bathtub big enough, Saturn would float. It's the least dense planet in the solar system.",
  },
  {
    user: "What about its moons?",
    ai: "There are at least 146 known. Titan is the famous one, with its own thick atmosphere and lakes of liquid methane.",
  },
  {
    user: "Anything else worth knowing?",
    ai: "The hexagonal storm at the north pole is unusual, and the Cassini mission gave us the best look at the rings up close.",
  },
];

export default function Streaming() {
  const [turns, setTurns] = useState<Turn[]>(seed);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      const pair = pairs[i % pairs.length];
      setTurns((prev) => {
        const next = prev.length;
        return [
          ...prev,
          { id: next, type: "outgoing", text: pair.user },
          { id: next + 1, type: "incoming", text: pair.ai },
        ];
      });
      i += 1;
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <Conversation className="absolute! inset-0">
      <ConversationContent className="py-20 px-2.5">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
          {turns.map((turn) => (
            <Message key={turn.id} type={turn.type}>
              <MessageAvatar>
                {turn.type === "outgoing" ? "N" : "AI"}
              </MessageAvatar>
              <MessageContent>
                <MessageText
                  variant={turn.type === "outgoing" ? "bubble" : "plain"}
                >
                  {turn.text}
                </MessageText>
              </MessageContent>
            </Message>
          ))}
        </div>
      </ConversationContent>
      <ConversationScrollButton
        render={
          <Button
            iconOnly
            variant="outline"
            className="absolute bottom-4 right-1/2 -translate-x-1/2 z-10 size-9 rounded-full bg-surface-elevated shadow-md transition-all data-[at-bottom=true]:pointer-events-none data-[at-bottom=true]:translate-y-1 data-[at-bottom=true]:opacity-0"
          />
        }
      >
        <ArrowDownIcon />
      </ConversationScrollButton>
    </Conversation>
  );
}
