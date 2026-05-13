import { SiBun, SiReact, SiTailwindcss } from "react-icons/si";
import { Chip } from "#/components/ai/chip";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl flex flex-wrap items-center gap-2">
      <Chip>src/styles.css</Chip>
      <Chip>bun run typecheck</Chip>
      <Chip>components/ai</Chip>
      <Chip>
        <SiTailwindcss />
        styles.css
      </Chip>
      <Chip>
        <SiBun />
        bun run typecheck
      </Chip>
      <Chip>
        <SiReact />
        components/ai
      </Chip>
    </div>
  );
}
