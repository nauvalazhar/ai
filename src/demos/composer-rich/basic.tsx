import { useState } from "react";
import {
  ArrowUpIcon,
  CameraIcon,
  CodeIcon,
  CompassIcon,
  CpuIcon,
  FileTextIcon,
  GlobeIcon,
  HashIcon,
  ImageIcon,
  MessageSquareIcon,
  MicIcon,
  PaperclipIcon,
  PlusIcon,
  TelescopeIcon,
  TerminalIcon,
  WrenchIcon,
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
  type ComposerValue,
} from "#/components/ai/composer-rich";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "#/components/ai/menu";
import { Switch } from "#/components/ai/switch";
import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ai/select";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "#/components/ai/tooltip";

const commands: ComposerItem[] = [
  {
    id: "chat",
    label: "Chat",
    description: "Quick assistant chat",
    icon: <MessageSquareIcon />,
  },
  { id: "review", label: "Code review", icon: <CodeIcon /> },
  { id: "feedback", label: "Feedback", icon: <CompassIcon /> },
  {
    id: "mcp",
    label: "MCP",
    description: "Show MCP server status",
    icon: <HashIcon />,
  },
];

const mentions: ComposerItem[] = [
  { id: "docs", label: "Documents", icon: <FileTextIcon /> },
  { id: "readme", label: "README.md", icon: <FileTextIcon /> },
  { id: "package", label: "package.json", icon: <FileTextIcon /> },
  { id: "styles", label: "style.css", icon: <HashIcon /> },
  { id: "button", label: "button.tsx", icon: <CodeIcon /> },
  { id: "composer", label: "composer.tsx", icon: <CodeIcon /> },
];

export default function Basic() {
  const [last, setLast] = useState<ComposerValue | null>(null);
  const [webSearch, setWebSearch] = useState(true);
  const [interpreter, setInterpreter] = useState(false);
  const [research, setResearch] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
      <Composer>
        <ComposerRichInput
          placeholder="Ask anything. Type / for commands, @ to mention."
          onSubmit={(value) => setLast(value)}
          triggers={{
            "/": { items: commands },
            "@": { items: mentions, hideOnEmpty: false },
          }}
        />
        <ComposerSuggestions />
        <ComposerToolbar>
          <Menu>
            <MenuTrigger
              render={
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label="Add attachment"
                  className="text-muted-foreground"
                />
              }
            >
              <PlusIcon />
            </MenuTrigger>
            <MenuPopup side="top" align="start">
              <MenuItem>
                <PaperclipIcon />
                Upload file
              </MenuItem>
              <MenuItem>
                <ImageIcon />
                Add image
              </MenuItem>
              <MenuItem>
                <CameraIcon />
                Take screenshot
              </MenuItem>
            </MenuPopup>
          </Menu>

          <Menu>
            <MenuTrigger
              render={<Button variant="ghost" className="text-muted-foreground" />}
            >
              <WrenchIcon />
              Tools
            </MenuTrigger>
            <MenuPopup side="top" align="start">
              <MenuGroup>
                <MenuGroupLabel>Capabilities</MenuGroupLabel>
                <MenuItem
                  closeOnClick={false}
                  onClick={() => setWebSearch((v) => !v)}
                >
                  <GlobeIcon />
                  Web search
                  <Switch
                    size="sm"
                    checked={webSearch}
                    className="pointer-events-none"
                  />
                </MenuItem>
                <MenuItem
                  closeOnClick={false}
                  onClick={() => setInterpreter((v) => !v)}
                >
                  <TerminalIcon />
                  Code interpreter
                  <Switch
                    size="sm"
                    checked={interpreter}
                    className="pointer-events-none"
                  />
                </MenuItem>
                <MenuItem
                  closeOnClick={false}
                  onClick={() => setResearch((v) => !v)}
                >
                  <TelescopeIcon />
                  Deep research
                  <Switch
                    size="sm"
                    checked={research}
                    className="pointer-events-none"
                  />
                </MenuItem>
              </MenuGroup>
            </MenuPopup>
          </Menu>

          <ComposerToolbarSpacer>
            <Select
              defaultValue={{
                value: "sonnet",
                label: "Sonnet 4.6",
                icon: <CpuIcon />,
              }}
            >
              <SelectTrigger
                variant="plain"
                className="w-auto text-muted-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectPopup side="top" align="end">
                <SelectList>
                  <SelectItem
                    value={{
                      value: "opus",
                      label: "Opus 4.7",
                      icon: <CpuIcon />,
                    }}
                  >
                    <CpuIcon />
                    Opus 4.7
                  </SelectItem>
                  <SelectItem
                    value={{
                      value: "sonnet",
                      label: "Sonnet 4.6",
                      icon: <CpuIcon />,
                    }}
                  >
                    <CpuIcon />
                    Sonnet 4.6
                  </SelectItem>
                  <SelectItem
                    value={{
                      value: "haiku",
                      label: "Haiku 4.5",
                      icon: <ZapIcon />,
                    }}
                  >
                    <ZapIcon />
                    Haiku 4.5
                  </SelectItem>
                </SelectList>
              </SelectPopup>
            </Select>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    iconOnly
                    aria-label="Dictate"
                    className="text-muted-foreground"
                  />
                }
              >
                <MicIcon />
              </TooltipTrigger>
              <TooltipPopup>Dictate</TooltipPopup>
            </Tooltip>

            <ComposerSubmit
              render={<Button iconOnly className="rounded-full" />}
            >
              <ArrowUpIcon />
            </ComposerSubmit>
          </ComposerToolbarSpacer>
        </ComposerToolbar>
      </Composer>

      {last ? (
        <div className="rounded-outer border border-border bg-surface p-3 text-xs">
          <div className="mb-1.5 text-muted-foreground">Last submitted</div>
          <pre className="whitespace-pre-wrap text-foreground">{last.text}</pre>
        </div>
      ) : null}
    </div>
  );
}
