import { ChevronDownIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockTrigger,
} from "#/components/ai/code-block";

const code = `import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function useThrottledCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delay = 200,
) {
  const lastRun = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: A) => {
    const now = Date.now();
    const elapsed = now - lastRun.current;

    if (elapsed >= delay) {
      lastRun.current = now;
      callback(...args);
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      lastRun.current = Date.now();
      callback(...args);
    }, delay - elapsed);
  };
}`;

export default function Clip() {
  return (
    <div className="mx-auto max-w-2xl">
      <CodeBlock clip maxHeight={200}>
        <CodeBlockHeader>
          <CodeBlockTitle>hooks.ts</CodeBlockTitle>
          <CodeBlockAction>
            <CodeBlockTrigger
              aria-label="Toggle code"
              render={
                <Button
                  iconOnly
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                />
              }
            >
              <ChevronDownIcon className="group-data-open/code-block:rotate-180" />
            </CodeBlockTrigger>
          </CodeBlockAction>
        </CodeBlockHeader>
        <CodeBlockContent>
          <pre>{code}</pre>
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
