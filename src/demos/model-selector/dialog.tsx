import { Dialog } from "@base-ui/react/dialog";
import { useState } from "react";
import { SiAnthropic, SiGoogle, SiOpenai } from "react-icons/si";
import { cn } from "#/lib/utils";
import {
  ModelSelector,
  ModelSelectorCollection,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorGroupLabel,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorItemIcon,
  ModelSelectorItemMeta,
  ModelSelectorItemText,
  ModelSelectorList,
} from "#/components/ai/model-selector";
import { Button } from "#/components/ai/button";

type Model = { value: string; label: string; meta: string };
type Group = { value: string; icon: React.ReactNode; items: Model[] };

const groups: Group[] = [
  {
    value: "OpenAI",
    icon: <SiOpenai />,
    items: [
      { value: "gpt-4o", label: "GPT-4o", meta: "128K" },
      { value: "gpt-4-turbo", label: "GPT-4 Turbo", meta: "128K" },
      { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", meta: "16K" },
    ],
  },
  {
    value: "Anthropic",
    icon: <SiAnthropic />,
    items: [
      { value: "claude-opus-4", label: "Claude Opus 4", meta: "200K" },
      { value: "claude-sonnet-4", label: "Claude Sonnet 4", meta: "200K" },
      { value: "claude-haiku-4", label: "Claude Haiku 4", meta: "200K" },
    ],
  },
  {
    value: "Google",
    icon: <SiGoogle />,
    items: [
      { value: "gemini-2.0-pro", label: "Gemini 2.0 Pro", meta: "2M" },
      { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", meta: "1M" },
    ],
  },
];

const flatModels = groups.flatMap((g) => g.items);

export default function DialogDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string>(
    flatModels[0].label,
  );

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 py-10">
      <Dialog.Root
        open={open}
        onOpenChange={setOpen}
        onOpenChangeComplete={(nextOpen) => {
          if (!nextOpen) setQuery("");
        }}
      >
        <Dialog.Trigger render={<Button variant="secondary" />}>
          Switch model
        </Dialog.Trigger>
        <p className="text-xs text-muted-foreground">
          Active: <span className="text-foreground">{selectedLabel}</span>
        </p>
        <Dialog.Portal>
          <Dialog.Backdrop
            className={cn(
              "fixed inset-0 bg-background/60 backdrop-blur-xs",
              "transition-opacity duration-150",
              "data-starting-style:opacity-0 data-ending-style:opacity-0",
            )}
          />
          <Dialog.Popup
            className={cn(
              "fixed left-1/2 top-[15vh] -translate-x-1/2 w-[min(560px,90vw)]",
              "rounded-outer bg-surface ring ring-border shadow-2xl",
              "origin-top transition-[opacity,transform] duration-150",
              "data-starting-style:opacity-0 data-starting-style:-translate-y-2 data-starting-style:scale-95",
              "data-ending-style:opacity-0 data-ending-style:-translate-y-2 data-ending-style:scale-95",
              "focus-visible:outline-none",
            )}
          >
            <ModelSelector
              variant="plain"
              items={groups}
              value={query}
              onValueChange={setQuery}
            >
              <ModelSelectorInput
                placeholder="Search models"
                className="rounded-none px-3 py-2.5"
              />
              <div className="h-px bg-border" />
              <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
              <ModelSelectorList>
                {(group: Group) => (
                  <ModelSelectorGroup items={group.items} key={group.value}>
                    <ModelSelectorGroupLabel>
                      {group.value}
                    </ModelSelectorGroupLabel>
                    <ModelSelectorCollection>
                      {(item: Model) => (
                        <ModelSelectorItem
                          key={item.value}
                          value={item}
                          onClick={() => {
                            setSelectedLabel(item.label);
                            setOpen(false);
                          }}
                        >
                          <ModelSelectorItemIcon>
                            {group.icon}
                          </ModelSelectorItemIcon>
                          <ModelSelectorItemText>
                            {item.label}
                          </ModelSelectorItemText>
                          <ModelSelectorItemMeta>
                            {item.meta}
                          </ModelSelectorItemMeta>
                        </ModelSelectorItem>
                      )}
                    </ModelSelectorCollection>
                  </ModelSelectorGroup>
                )}
              </ModelSelectorList>
            </ModelSelector>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
