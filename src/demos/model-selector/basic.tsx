import { SiAnthropic, SiGoogle, SiOpenai } from "react-icons/si";
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

export default function Basic() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <ModelSelector items={groups}>
        <ModelSelectorInput placeholder="Search models" />
        <ModelSelectorEmpty>No models match your search.</ModelSelectorEmpty>
        <ModelSelectorList>
          {(group: Group) => (
            <ModelSelectorGroup items={group.items} key={group.value}>
              <ModelSelectorGroupLabel>{group.value}</ModelSelectorGroupLabel>
              <ModelSelectorCollection>
                {(item: Model) => (
                  <ModelSelectorItem value={item} key={item.value}>
                    <ModelSelectorItemIcon>{group.icon}</ModelSelectorItemIcon>
                    <ModelSelectorItemText>{item.label}</ModelSelectorItemText>
                    <ModelSelectorItemMeta>{item.meta}</ModelSelectorItemMeta>
                  </ModelSelectorItem>
                )}
              </ModelSelectorCollection>
            </ModelSelectorGroup>
          )}
        </ModelSelectorList>
      </ModelSelector>
    </div>
  );
}
