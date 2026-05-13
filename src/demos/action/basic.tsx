import { SiReact } from "react-icons/si";
import {
  Action,
  ActionContent,
  ActionIcon,
  ActionLabel,
  ActionTrigger,
} from "#/components/ai/action";
import { Chip } from "#/components/ai/chip";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl">
      <Action defaultOpen>
        <ActionTrigger>
          <ActionIcon>
            <SiReact />
          </ActionIcon>
          <ActionLabel>Read</ActionLabel>
          <Chip size="sm">package.json</Chip>
        </ActionTrigger>
        <ActionContent>
          Read 42 lines from package.json. Detected React 19, TanStack Router,
          and Tailwind v4.
        </ActionContent>
      </Action>
    </div>
  );
}
