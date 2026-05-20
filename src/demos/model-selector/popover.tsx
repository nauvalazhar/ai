import { useState } from "react";
import { SiAnthropic, SiGoogle, SiOpenai } from "react-icons/si";
import { Popover, PopoverPopup, PopoverTrigger } from "#/components/ai/popover";
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
import { ChevronDownIcon } from "lucide-react";
import { Button } from "#/components/ai/button";

type Model = {
  value: string;
  label: string;
  meta: string;
  icon: React.ReactNode;
};
type Group = { value: string; icon: React.ReactNode; items: Model[] };

const groups: Group[] = [
  {
    value: "OpenAI",
    icon: <SiOpenai />,
    items: [
      { value: "gpt-4o", label: "GPT-4o", meta: "128K", icon: <SiOpenai /> },
      {
        value: "gpt-4-turbo",
        label: "GPT-4 Turbo",
        meta: "128K",
        icon: <SiOpenai />,
      },
      {
        value: "gpt-3.5-turbo",
        label: "GPT-3.5 Turbo",
        meta: "16K",
        icon: <SiOpenai />,
      },
    ],
  },
  {
    value: "Anthropic",
    icon: <SiAnthropic />,
    items: [
      {
        value: "claude-opus-4",
        label: "Claude Opus 4",
        meta: "200K",
        icon: <SiAnthropic />,
      },
      {
        value: "claude-sonnet-4",
        label: "Claude Sonnet 4",
        meta: "200K",
        icon: <SiAnthropic />,
      },
      {
        value: "claude-haiku-4",
        label: "Claude Haiku 4",
        meta: "200K",
        icon: <SiAnthropic />,
      },
    ],
  },
  {
    value: "Google",
    icon: <SiGoogle />,
    items: [
      {
        value: "gemini-2.0-pro",
        label: "Gemini 2.0 Pro",
        meta: "2M",
        icon: <SiGoogle />,
      },
      {
        value: "gemini-2.0-flash",
        label: "Gemini 2.0 Flash",
        meta: "1M",
        icon: <SiGoogle />,
      },
    ],
  },
];

const flatModels = groups.flatMap((g) => g.items);

export default function PopoverDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Model>(flatModels[0]);

  return (
    <div className="mx-auto flex w-full max-w-sm items-center justify-center py-8">
      <Popover
        open={open}
        onOpenChange={setOpen}
        onOpenChangeComplete={(nextOpen) => {
          if (!nextOpen) setQuery("");
        }}
      >
        <PopoverTrigger render={<Button variant="secondary" />}>
          <span className="inline-flex items-center text-muted-foreground [&>svg]:size-3.5">
            {selected.icon}
          </span>
          <span>{selected.label}</span>
          <ChevronDownIcon />
        </PopoverTrigger>
        <PopoverPopup align="start" sideOffset={6} className="w-64 p-1">
          <ModelSelector
            variant="plain"
            items={groups}
            value={query}
            onValueChange={setQuery}
            className="w-full p-0"
          >
            <ModelSelectorInput
              placeholder="Search models"
              className="border-b border-border"
            />
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
                        value={item}
                        key={item.value}
                        onClick={() => {
                          setSelected(item);
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
        </PopoverPopup>
      </Popover>
    </div>
  );
}
