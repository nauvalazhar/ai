import { useState } from "react";
import {
  ArrowUpIcon,
  BotIcon,
  CpuIcon,
  GaugeIcon,
  ZapIcon,
} from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Composer,
  ComposerSubmit,
  ComposerToolbar,
  ComposerToolbarSpacer,
} from "#/components/ai/composer";
import {
  ComposerRichInput,
  ComposerSuggestions,
  type ComposerItem,
} from "#/components/ai/composer-rich";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "#/components/ai/menu";
import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ai/select";

type ReasoningLevel = "low" | "medium" | "high";
type Choice =
  | { kind: "model"; model: string }
  | { kind: "reasoning"; level: ReasoningLevel };

const commands: ComposerItem<Choice>[] = [
  {
    id: "model",
    label: "Model",
    description: "Pick the model",
    icon: <BotIcon />,
    children: [
      {
        id: "gpt-5",
        label: "GPT-5",
        description: "Most capable",
        icon: <CpuIcon />,
        data: { kind: "model", model: "GPT-5" },
      },
      {
        id: "gpt-5-mini",
        label: "GPT-5 mini",
        description: "Fast and cheap",
        icon: <ZapIcon />,
        data: { kind: "model", model: "GPT-5 mini" },
      },
      {
        id: "gpt-5-codex",
        label: "GPT-5 Codex",
        description: "Tuned for code",
        icon: <CpuIcon />,
        data: { kind: "model", model: "GPT-5 Codex" },
      },
    ],
  },
  {
    id: "reasoning",
    label: "Reasoning",
    description: "Adjust thinking depth",
    icon: <GaugeIcon />,
    children: [
      {
        id: "low",
        label: "Low",
        icon: <GaugeIcon />,
        data: { kind: "reasoning", level: "low" },
      },
      {
        id: "medium",
        label: "Medium",
        icon: <GaugeIcon />,
        data: { kind: "reasoning", level: "medium" },
      },
      {
        id: "high",
        label: "High",
        icon: <GaugeIcon />,
        data: { kind: "reasoning", level: "high" },
      },
    ],
  },
];

const reasoningLabels: Record<ReasoningLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function Submenu() {
  const [model, setModel] = useState("GPT-5 Codex");
  const [reasoning, setReasoning] = useState<ReasoningLevel>("medium");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
      <p className="text-sm text-muted-foreground">
        Type <code>/model</code> or <code>/reasoning</code> to drill into a
        submenu, or click the toolbar controls. Both update the same state.
      </p>
      <Composer>
        <ComposerRichInput
          placeholder="Type /model or /reasoning to drill into a submenu"
          triggers={{
            "/": {
              items: commands,
              onSelect: (item, ctx) => {
                const data = (item as ComposerItem<Choice>).data;
                if (data?.kind === "model") setModel(data.model);
                if (data?.kind === "reasoning") setReasoning(data.level);
                ctx.clearTrigger();
                ctx.close();
              },
            },
          }}
        />
        <ComposerSuggestions
          renderHeader={({ parents }) =>
            parents.length > 0 ? (
              <div className="px-2 pt-1.5 pb-1 text-xs text-muted-foreground">
                {parents.map((p) => p.label).join(" / ")}
              </div>
            ) : null
          }
        />
        <ComposerToolbar>
          <Select
            value={model}
            onValueChange={(v) => {
              const next =
                typeof v === "object" && v !== null && "value" in v
                  ? (v as { value: string }).value
                  : (v as string);
              setModel(next);
            }}
          >
            <SelectTrigger
              variant="plain"
              className="w-auto text-muted-foreground"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectPopup side="top" align="start">
              <SelectList>
                <SelectItem value="GPT-5">
                  <CpuIcon />
                  GPT-5
                </SelectItem>
                <SelectItem value="GPT-5 mini">
                  <ZapIcon />
                  GPT-5 mini
                </SelectItem>
                <SelectItem value="GPT-5 Codex">
                  <CpuIcon />
                  GPT-5 Codex
                </SelectItem>
              </SelectList>
            </SelectPopup>
          </Select>

          <Menu>
            <MenuTrigger
              render={
                <Button variant="ghost" className="text-muted-foreground" />
              }
            >
              <GaugeIcon />
              {reasoningLabels[reasoning]}
            </MenuTrigger>
            <MenuPopup side="top" align="start">
              <MenuGroup>
                <MenuGroupLabel>Reasoning</MenuGroupLabel>
                <MenuRadioGroup
                  value={reasoning}
                  onValueChange={(v) => setReasoning(v as ReasoningLevel)}
                >
                  <MenuRadioItem value="low">Low</MenuRadioItem>
                  <MenuRadioItem value="medium">Medium</MenuRadioItem>
                  <MenuRadioItem value="high">High</MenuRadioItem>
                </MenuRadioGroup>
              </MenuGroup>
            </MenuPopup>
          </Menu>

          <ComposerToolbarSpacer>
            <ComposerSubmit
              render={<Button iconOnly className="rounded-full" />}
            >
              <ArrowUpIcon />
            </ComposerSubmit>
          </ComposerToolbarSpacer>
        </ComposerToolbar>
      </Composer>
    </div>
  );
}
