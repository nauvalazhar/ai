import { SiBun, SiReact, SiTailwindcss } from "react-icons/si";
import { Chip } from "#/components/ai/chip";

export default function Interactive() {
  return (
    <div className="mx-auto max-w-2xl flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Chip render={<a href="#" />}>src/styles.css</Chip>
        <Chip render={<button type="button" onClick={() => {}} />}>
          bun run typecheck
        </Chip>
        <Chip render={<a href="#" />}>components/ai</Chip>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Chip render={<a href="#" />}>
          <SiTailwindcss />
          styles.css
        </Chip>
        <Chip render={<button type="button" onClick={() => {}} />}>
          <SiBun />
          bun run typecheck
        </Chip>
        <Chip render={<a href="#" />}>
          <SiReact />
          components/ai
        </Chip>
      </div>
    </div>
  );
}
