"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "#/lib/utils";

type ItemKind = "file" | "folder";

type FileTreeContextValue = {
  expanded: string[];
  setExpanded: (next: string[]) => void;
  isExpanded: (value: string) => boolean;
  toggleExpanded: (value: string) => void;
  selected: string | null;
  setSelected: (next: string | null) => void;
  highlight: boolean;
  highlighted: string | null;
  setHighlighted: (next: string | null) => void;
  onActivate?: (value: string, kind: ItemKind) => void;
};

const FileTreeContext = createContext<FileTreeContextValue | null>(null);

export function useFileTree() {
  const ctx = useContext(FileTreeContext);
  if (!ctx) {
    throw new Error("useFileTree must be used inside <FileTree>.");
  }
  return ctx;
}

type FileTreeProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (next: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (next: string | null) => void;
  highlight?: boolean;
  highlighted?: string | null;
  defaultHighlighted?: string | null;
  onHighlightedChange?: (next: string | null) => void;
  onActivate?: (value: string, kind: ItemKind) => void;
  guides?: boolean;
};

export function FileTree({
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  highlight = false,
  highlighted: highlightedProp,
  defaultHighlighted = null,
  onHighlightedChange,
  onActivate,
  guides = false,
  className,
  onKeyDown,
  ...props
}: FileTreeProps) {
  const [expandedState, setExpandedState] = useState<string[]>(
    defaultExpanded ?? [],
  );
  const isExpandedControlled = expandedProp !== undefined;
  const expanded = isExpandedControlled ? expandedProp : expandedState;

  const setExpanded = (next: string[]) => {
    if (!isExpandedControlled) setExpandedState(next);
    onExpandedChange?.(next);
  };

  const isExpanded = (value: string) => expanded.includes(value);
  const toggleExpanded = (value: string) => {
    setExpanded(
      isExpanded(value)
        ? expanded.filter((v) => v !== value)
        : [...expanded, value],
    );
  };

  const [selectedState, setSelectedState] = useState<string | null>(
    defaultSelected,
  );
  const isSelectedControlled = selectedProp !== undefined;
  const selected = isSelectedControlled ? selectedProp : selectedState;
  const setSelected = (next: string | null) => {
    if (!isSelectedControlled) setSelectedState(next);
    onSelectedChange?.(next);
  };

  const [highlightedState, setHighlightedState] = useState<string | null>(
    defaultHighlighted,
  );
  const isHighlightedControlled = highlightedProp !== undefined;
  const highlighted = isHighlightedControlled
    ? highlightedProp
    : highlightedState;
  const setHighlighted = (next: string | null) => {
    if (!isHighlightedControlled) setHighlightedState(next);
    onHighlightedChange?.(next);
  };

  const rootRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!highlight || event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const rows = Array.from(
      root.querySelectorAll<HTMLElement>('[data-slot="file-tree-row"]'),
    );
    if (rows.length === 0) return;

    const currentIndex =
      highlighted === null
        ? -1
        : rows.findIndex((row) => row.dataset.value === highlighted);

    const moveTo = (index: number) => {
      const row = rows[index];
      if (!row || row.dataset.value === undefined) return;
      setHighlighted(row.dataset.value);
      row.focus();
    };

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveTo(
          currentIndex < 0 ? 0 : Math.min(rows.length - 1, currentIndex + 1),
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        moveTo(currentIndex < 0 ? 0 : Math.max(0, currentIndex - 1));
        break;
      case "ArrowRight": {
        event.preventDefault();
        if (currentIndex < 0) {
          moveTo(0);
          break;
        }
        const row = rows[currentIndex];
        const value = row.dataset.value;
        const isFolder = row.dataset.kind === "folder";
        const isOpen = row.dataset.expanded !== undefined;
        if (isFolder && !isOpen && value !== undefined) {
          setExpanded([...expanded, value]);
        } else {
          moveTo(Math.min(rows.length - 1, currentIndex + 1));
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        if (currentIndex < 0) {
          moveTo(0);
          break;
        }
        const row = rows[currentIndex];
        const value = row.dataset.value;
        const isFolder = row.dataset.kind === "folder";
        const isOpen = row.dataset.expanded !== undefined;
        const depth = Number(row.dataset.depth ?? 0);
        if (isFolder && isOpen && value !== undefined) {
          setExpanded(expanded.filter((v) => v !== value));
        } else if (depth > 0) {
          for (let i = currentIndex - 1; i >= 0; i--) {
            if (Number(rows[i].dataset.depth ?? 0) < depth) {
              moveTo(i);
              break;
            }
          }
        }
        break;
      }
      case "Enter":
      case " ":
        event.preventDefault();
        if (currentIndex >= 0) rows[currentIndex].click();
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(rows.length - 1);
        break;
    }
  };

  const value: FileTreeContextValue = {
    expanded,
    setExpanded,
    isExpanded,
    toggleExpanded,
    selected,
    setSelected,
    highlight,
    highlighted,
    setHighlighted,
    onActivate,
  };

  return (
    <FileTreeContext.Provider value={value}>
      <div
        ref={rootRef}
        role="tree"
        data-slot="file-tree"
        data-highlight={highlight || undefined}
        data-guides={guides || undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          "group/file-tree",
          "bg-surface ring ring-border rounded-outer p-1 flex flex-col",
          "text-sm text-foreground select-none",
          className,
        )}
        {...props}
      />
    </FileTreeContext.Provider>
  );
}

const DepthContext = createContext(0);

type ItemContextValue = {
  value: string;
  kind: ItemKind;
  depth: number;
  expanded: boolean;
  selected: boolean;
  highlighted: boolean;
  renaming: boolean;
  activate: () => void;
};

const ItemContext = createContext<ItemContextValue | null>(null);

function useItem() {
  const ctx = useContext(ItemContext);
  if (!ctx) {
    throw new Error(
      "<FileTreeRow> must be used inside <FileTreeFolder> or <FileTreeFile>.",
    );
  }
  return ctx;
}

type FileTreeFolderProps = React.ComponentProps<"div"> & {
  value: string;
  renaming?: boolean;
};

export function FileTreeFolder({
  value,
  renaming = false,
  className,
  ...props
}: FileTreeFolderProps) {
  const root = useFileTree();
  const depth = useContext(DepthContext);
  const expanded = root.isExpanded(value);
  const selected = root.selected === value;
  const highlighted = root.highlighted === value;

  const activate = () => {
    root.toggleExpanded(value);
    root.setSelected(value);
    if (root.highlight) root.setHighlighted(value);
    root.onActivate?.(value, "folder");
  };

  const ctx: ItemContextValue = {
    value,
    kind: "folder",
    depth,
    expanded,
    selected,
    highlighted,
    renaming,
    activate,
  };

  return (
    <ItemContext.Provider value={ctx}>
      <div
        data-slot="file-tree-folder"
        data-value={value}
        data-expanded={expanded || undefined}
        className={cn("flex flex-col", className)}
        {...props}
      />
    </ItemContext.Provider>
  );
}

type FileTreeFileProps = React.ComponentProps<"div"> & {
  value: string;
  renaming?: boolean;
};

export function FileTreeFile({
  value,
  renaming = false,
  className,
  ...props
}: FileTreeFileProps) {
  const root = useFileTree();
  const depth = useContext(DepthContext);
  const selected = root.selected === value;
  const highlighted = root.highlighted === value;

  const activate = () => {
    root.setSelected(value);
    if (root.highlight) root.setHighlighted(value);
    root.onActivate?.(value, "file");
  };

  const ctx: ItemContextValue = {
    value,
    kind: "file",
    depth,
    expanded: false,
    selected,
    highlighted,
    renaming,
    activate,
  };

  return (
    <ItemContext.Provider value={ctx}>
      <div
        data-slot="file-tree-file"
        data-value={value}
        className={cn("flex flex-col", className)}
        {...props}
      />
    </ItemContext.Provider>
  );
}

export function FileTreeFolderPanel({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const item = useItem();
  if (!item.expanded) return null;
  return (
    <DepthContext.Provider value={item.depth + 1}>
      <div
        role="group"
        data-slot="file-tree-folder-panel"
        style={{
          "--ai-file-tree-guide": `calc(${item.depth} * 0.875rem + 0.8125rem)`,
          ...style,
        } as CSSProperties}
        className={cn(
          "flex flex-col",
          "group-data-guides/file-tree:relative",
          "group-data-guides/file-tree:before:content-['']",
          "group-data-guides/file-tree:before:absolute",
          "group-data-guides/file-tree:before:left-(--ai-file-tree-guide)",
          "group-data-guides/file-tree:before:inset-y-0",
          "group-data-guides/file-tree:before:w-px",
          "group-data-guides/file-tree:before:bg-border",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </DepthContext.Provider>
  );
}

const INDENT_STEP = "0.875rem";
const ROW_PAD_START = "0.375rem";

function rowIndentStyle(depth: number): CSSProperties {
  return {
    paddingInlineStart: `calc(${depth} * ${INDENT_STEP} + ${ROW_PAD_START})`,
  };
}

type FileTreeRowProps = React.ComponentProps<"div">;

export function FileTreeRow({
  className,
  children,
  onClick,
  style,
  ...props
}: FileTreeRowProps) {
  const item = useItem();
  const root = useFileTree();

  const tabIndex = root.highlight ? (item.highlighted ? 0 : -1) : undefined;

  return (
    <div
      role="treeitem"
      aria-selected={item.selected || undefined}
      aria-expanded={item.kind === "folder" ? item.expanded : undefined}
      data-slot="file-tree-row"
      data-value={item.value}
      data-kind={item.kind}
      data-depth={item.depth}
      data-expanded={(item.kind === "folder" && item.expanded) || undefined}
      data-selected={item.selected || undefined}
      data-highlighted={item.highlighted || undefined}
      data-renaming={item.renaming || undefined}
      tabIndex={tabIndex}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (item.renaming) return;
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement
        ) {
          return;
        }
        item.activate();
      }}
      style={{ ...rowIndentStyle(item.depth), ...style }}
      className={cn(
        "group/file-tree-row",
        "flex items-center gap-1.5 h-7 pr-2 rounded cursor-pointer",
        "text-foreground/85",
        "hover:bg-accent/60 hover:text-foreground",
        "data-selected:bg-accent data-selected:text-foreground",
        "data-highlighted:bg-accent data-highlighted:text-foreground",
        "data-renaming:bg-accent data-renaming:cursor-text",
        "focus-visible:outline-none",
        "transition-colors",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="size-3.5 shrink-0 inline-flex items-center justify-center text-muted-foreground"
      >
        {item.kind === "folder" && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "size-3 transition-transform duration-150",
              "group-data-expanded/file-tree-row:rotate-90",
            )}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        )}
      </span>
      {children}
    </div>
  );
}

export function FileTreeIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="file-tree-icon"
      className={cn(
        "shrink-0 inline-flex items-center justify-center size-4",
        "text-muted-foreground",
        "[&>svg]:size-4",
        "group-data-selected/file-tree-row:text-foreground",
        "group-data-highlighted/file-tree-row:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function FileTreeLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-tree-label"
      className={cn("min-w-0 flex-1 truncate", className)}
      {...props}
    />
  );
}

type FileTreeNewProps = React.ComponentProps<"div">;

export function FileTreeNew({
  className,
  style,
  children,
  ...props
}: FileTreeNewProps) {
  const depth = useContext(DepthContext);
  return (
    <div
      data-slot="file-tree-new"
      style={{ ...rowIndentStyle(depth), ...style }}
      className={cn("flex items-center gap-1.5 h-7 pr-2 rounded", className)}
      {...props}
    >
      <span aria-hidden className="size-3.5 shrink-0" />
      {children}
    </div>
  );
}
