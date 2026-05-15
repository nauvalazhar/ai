import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Extension, Node, mergeAttributes } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
  type Editor,
  type ReactNodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Suggestion from "@tiptap/suggestion";
import {
  useComposerContext,
  useComposerExtensionContext,
} from "#/components/ai/composer";
import { cn } from "#/lib/utils";

export type ComposerItem<T = unknown> = {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  children?: ComposerItem<T>[];
  data?: T;
  disabled?: boolean;
  keywords?: string[];
  group?: string;
};

type SelectContext<T = unknown> = {
  trigger: string;
  query: string;
  insertChip: (item: ComposerItem<T>) => void;
  close: () => void;
  clearTrigger: () => void;
};

export type ComposerTrigger<T = unknown> = {
  items:
    | ComposerItem<T>[]
    | ((query: string) => ComposerItem<T>[] | Promise<ComposerItem<T>[]>);
  action?: "execute" | "insert";
  onSelect?: (item: ComposerItem<T>, ctx: SelectContext<T>) => void;
  filter?: (item: ComposerItem<T>, query: string) => boolean;
  renderChip?: (item: ComposerItem<T>) => React.ReactNode;
  hideOnEmpty?: boolean;
};

export type ComposerSegment<T = unknown> =
  | { type: "text"; value: string }
  | { type: "chip"; trigger: string; item: ComposerItem<T> };

export type ComposerValue<T = unknown> = {
  text: string;
  segments: ComposerSegment<T>[];
};

function defaultFilter(item: ComposerItem, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  if (item.label.toLowerCase().includes(q)) return true;
  if (item.description?.toLowerCase().includes(q)) return true;
  if (item.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
  return false;
}

function applyFilter(
  items: ComposerItem[],
  query: string,
  custom?: (item: ComposerItem, query: string) => boolean,
) {
  const fn = custom ?? defaultFilter;
  return items.filter((it) => fn(it, query));
}

const ComposerChipNode = Node.create({
  name: "composerChip",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      trigger: { default: "@" },
      chipId: { default: "" },
      itemId: { default: "" },
      label: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-composer-chip]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        {
          "data-composer-chip": "",
          "data-trigger": node.attrs.trigger,
          "data-chip-id": node.attrs.chipId,
        },
        HTMLAttributes,
      ),
      node.attrs.label,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChipView);
  },
});

type ChipStorage = {
  items?: Map<string, ComposerItem>;
};

function getChipStorage(editor: Editor): ChipStorage {
  const slot = editor.storage as unknown as Record<string, unknown>;
  if (!slot.composerChip) slot.composerChip = {} satisfies ChipStorage;
  return slot.composerChip as ChipStorage;
}

const TriggersRefContext = createContext<React.RefObject<
  Record<string, ComposerTrigger>
> | null>(null);

function ChipView(props: ReactNodeViewProps<HTMLElement>) {
  const { node, editor } = props;
  const trigger = node.attrs.trigger as string;
  const label = node.attrs.label as string;
  const itemId = node.attrs.itemId as string;
  const chipId = node.attrs.chipId as string;
  const storage = getChipStorage(editor);
  const triggersRef = useContext(TriggersRefContext);
  const renderFn = triggersRef?.current?.[trigger]?.renderChip;
  const item =
    storage.items?.get(chipId) ??
    ({ id: itemId, label } satisfies ComposerItem);

  return (
    <NodeViewWrapper
      as="span"
      data-composer-chip=""
      data-trigger={trigger}
      data-chip-id={chipId}
      className={cn(
        "inline-flex align-middle items-center px-1.5 py-0 mx-0.5 rounded",
        "text-sm text-primary bg-primary/10",
        "ring ring-primary/20 select-none cursor-default",
      )}
    >
      {renderFn ? renderFn(item) : <DefaultChipContent item={item} />}
    </NodeViewWrapper>
  );
}

function DefaultChipContent({ item }: { item: ComposerItem }) {
  return (
    <>
      {item.icon ? (
        <span aria-hidden className="mr-1 inline-block [&>svg]:size-3.5">
          {item.icon}
        </span>
      ) : null}
      {item.label}
    </>
  );
}

function makeChipId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

function pruneChipStorage(editor: Editor) {
  const storage = getChipStorage(editor);
  if (!storage.items || storage.items.size === 0) return;
  const inUse = new Set<string>();
  editor.state.doc.descendants((node) => {
    if (node.type.name === "composerChip") {
      inUse.add(node.attrs.chipId as string);
      return false;
    }
    return true;
  });
  for (const key of storage.items.keys()) {
    if (!inUse.has(key)) storage.items.delete(key);
  }
}

function isEditorBlank(editor: Editor): boolean {
  let hasChip = false;
  editor.state.doc.descendants((node) => {
    if (node.type.name === "composerChip") {
      hasChip = true;
      return false;
    }
    return true;
  });
  if (hasChip) return false;
  return editor.getText().trim().length === 0;
}

function serializeEditor(editor: Editor): ComposerValue {
  const segments: ComposerSegment[] = [];
  let text = "";
  let buffer = "";

  const flush = () => {
    if (!buffer) return;
    segments.push({ type: "text", value: buffer });
    text += buffer;
    buffer = "";
  };

  let firstBlock = true;
  editor.state.doc.forEach((block) => {
    if (!firstBlock) buffer += "\n";
    firstBlock = false;
    block.descendants((node) => {
      if (node.type.name === "composerChip") {
        flush();
        const storage = getChipStorage(editor);
        const item =
          storage.items?.get(node.attrs.chipId as string) ??
          ({
            id: node.attrs.itemId as string,
            label: node.attrs.label as string,
          } satisfies ComposerItem);
        segments.push({
          type: "chip",
          trigger: node.attrs.trigger,
          item,
        });
        text += `{{${node.attrs.trigger}:${item.id}}}`;
        return false;
      }
      if (node.type.name === "hardBreak") {
        buffer += "\n";
        return false;
      }
      if (node.isText) {
        buffer += node.text ?? "";
      }
      return true;
    });
  });
  flush();

  return { text, segments };
}

type SuggestionPopup = {
  trigger: string;
  query: string;
  items: ComposerItem[];
  loading: boolean;
  parents: ComposerItem[];
  range: { from: number; to: number };
  highlighted: number;
  command: (item: ComposerItem) => void;
} | null;

type RichExtState = {
  popup: SuggestionPopup;
  setHighlighted: (i: number) => void;
  popFrame: () => void;
  pickItem: (item: ComposerItem) => void;
  triggers: Record<string, ComposerTrigger>;
  listboxId: string;
};

function buildTriggerExtension(
  char: string,
  ctlRef: React.RefObject<{
    onStart: (char: string, props: SuggestionRenderProps) => void;
    onUpdate: (char: string, props: SuggestionRenderProps) => void;
    onKeyDown: (char: string, e: KeyboardEvent) => boolean;
    onExit: (char: string) => void;
    getItems: (
      char: string,
      query: string,
    ) => Promise<ComposerItem[]> | ComposerItem[];
    onCommand: (
      char: string,
      props: {
        editor: Editor;
        range: { from: number; to: number };
        props: ComposerItem;
      },
    ) => void;
  }>,
) {
  return Extension.create({
    name: `composerTrigger_${char.charCodeAt(0)}`,
    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          char,
          allowSpaces: true,
          startOfLine: false,
          pluginKey: new PluginKey(`composerTrigger_${char.charCodeAt(0)}`),
          command: (args) => ctlRef.current?.onCommand(char, args),
          items: ({ query }) =>
            Promise.resolve(ctlRef.current?.getItems(char, query) ?? []),
          render: () => ({
            onStart: (props) =>
              ctlRef.current?.onStart(char, props as SuggestionRenderProps),
            onUpdate: (props) =>
              ctlRef.current?.onUpdate(char, props as SuggestionRenderProps),
            onKeyDown: (props) =>
              ctlRef.current?.onKeyDown(char, props.event) ?? false,
            onExit: () => ctlRef.current?.onExit(char),
          }),
        }),
      ];
    },
  });
}

type SuggestionRenderProps = {
  query: string;
  items: unknown[];
  range: { from: number; to: number };
  command: (item: unknown) => void;
  clientRect: (() => DOMRect | null) | null;
};

export function ComposerRichInput({
  triggers = {},
  onSubmit,
  onValueChange,
  placeholder,
  autoFocus = false,
  className,
}: {
  triggers?: Record<string, ComposerTrigger>;
  onSubmit?: (value: ComposerValue) => void;
  onValueChange?: (value: ComposerValue) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  const ctx = useComposerContext();
  const extCtx = useComposerExtensionContext();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();

  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const triggersRef = useRef(triggers);
  triggersRef.current = triggers;

  const [popup, setPopup] = useState<SuggestionPopup>(null);
  const popupRef = useRef<SuggestionPopup>(null);
  popupRef.current = popup;

  const reqRef = useRef(0);
  const framesRef = useRef<Record<string, ComposerItem[]>>({});
  const parentsRef = useRef<ComposerItem[]>([]);

  const setHighlighted = useCallback((i: number) => {
    setPopup((p) => (p ? { ...p, highlighted: i } : p));
  }, []);

  const resolveItems = useCallback(
    async (char: string, query: string): Promise<ComposerItem[]> => {
      const cfg = triggersRef.current[char];
      if (!cfg) return [];
      const frame = framesRef.current[char];
      if (frame) {
        return applyFilter(frame, query, cfg.filter);
      }
      const source = cfg.items;
      if (typeof source === "function") {
        return applyFilter(await source(query), query, cfg.filter);
      }
      return applyFilter(source, query, cfg.filter);
    },
    [],
  );

  const updatePopupItems = useCallback(
    async (
      char: string,
      query: string,
      range: { from: number; to: number },
      command: (item: ComposerItem) => void,
    ) => {
      const cfg = triggersRef.current[char];
      if (!cfg) return;
      const id = ++reqRef.current;

      const frame = framesRef.current[char];
      const source = cfg.items;
      const raw = frame
        ? frame
        : typeof source === "function"
          ? source(query)
          : source;

      const base = {
        trigger: char,
        query,
        parents: parentsRef.current,
        range,
        highlighted: 0,
        command,
      };

      if (raw instanceof Promise) {
        setPopup({ ...base, items: [], loading: true });
        const resolved = await raw;
        if (id !== reqRef.current) return;
        const items = applyFilter(resolved, query, cfg.filter);
        setPopup({ ...base, items, loading: false });
        return;
      }

      const items = applyFilter(raw, query, cfg.filter);
      setPopup({ ...base, items, loading: false });
    },
    [],
  );

  const popFrame = useCallback(() => {
    const popped = parentsRef.current.slice(0, -1);
    parentsRef.current = popped;
    const top = popped[popped.length - 1];
    const char = popupRef.current?.trigger;
    if (!char) return;
    if (top?.children) {
      framesRef.current[char] = top.children;
    } else {
      delete framesRef.current[char];
    }
    const cur = popupRef.current;
    if (cur) {
      updatePopupItems(cur.trigger, cur.query, cur.range, cur.command);
    }
  }, [updatePopupItems]);

  const pickItem = useCallback(
    (item: ComposerItem) => {
      const cur = popupRef.current;
      if (!cur || item.disabled) return;

      if (item.children && item.children.length > 0) {
        parentsRef.current = [...parentsRef.current, item];
        framesRef.current[cur.trigger] = item.children;
        updatePopupItems(cur.trigger, "", cur.range, cur.command);
        return;
      }

      cur.command(item);
    },
    [updatePopupItems],
  );

  const ctlRef = useRef({
    onStart: (char: string, props: SuggestionRenderProps) => {
      parentsRef.current = [];
      delete framesRef.current[char];
      updatePopupItems(
        char,
        props.query,
        props.range,
        props.command as (item: ComposerItem) => void,
      );
    },
    onUpdate: (char: string, props: SuggestionRenderProps) => {
      updatePopupItems(
        char,
        props.query,
        props.range,
        props.command as (item: ComposerItem) => void,
      );
    },
    onKeyDown: (_char: string, e: KeyboardEvent) => {
      const cur = popupRef.current;
      if (!cur) return false;
      if (e.key === "ArrowDown") {
        setHighlighted(Math.min(cur.items.length - 1, cur.highlighted + 1));
        return true;
      }
      if (e.key === "ArrowUp") {
        setHighlighted(Math.max(0, cur.highlighted - 1));
        return true;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        const item = cur.items[cur.highlighted];
        if (item) {
          pickItem(item);
          return true;
        }
      }
      if (e.key === "ArrowRight") {
        const item = cur.items[cur.highlighted];
        if (item?.children && item.children.length > 0) {
          pickItem(item);
          return true;
        }
      }
      if (e.key === "ArrowLeft" && parentsRef.current.length > 0) {
        popFrame();
        return true;
      }
      if (e.key === "Escape") {
        if (parentsRef.current.length > 0) {
          popFrame();
        } else {
          setPopup(null);
        }
        return true;
      }
      return false;
    },
    onExit: () => {
      parentsRef.current = [];
      framesRef.current = {};
      setPopup(null);
    },
    getItems: (char: string, query: string) => resolveItems(char, query),
    onCommand: (
      char: string,
      args: {
        editor: Editor;
        range: { from: number; to: number };
        props: ComposerItem;
      },
    ) => {
      const cfg = triggersRef.current[char];
      if (!cfg) return;
      const action = cfg.action ?? (char === "@" ? "insert" : "execute");
      const item = args.props;

      const insertChip = (it: ComposerItem) => {
        const chipId = `chip-${makeChipId()}`;
        const storage = getChipStorage(args.editor);
        if (!storage.items) storage.items = new Map();
        storage.items.set(chipId, it);
        args.editor
          .chain()
          .focus()
          .insertContentAt(args.range, [
            {
              type: "composerChip",
              attrs: {
                trigger: char,
                chipId,
                itemId: it.id,
                label: it.label,
              },
            },
            { type: "text", text: " " },
          ])
          .run();
      };

      const selectCtx: SelectContext = {
        trigger: char,
        query: popupRef.current?.query ?? "",
        insertChip,
        close: () => setPopup(null),
        clearTrigger: () => {
          args.editor.chain().focus().deleteRange(args.range).run();
        },
      };

      if (cfg.onSelect) {
        cfg.onSelect(item, selectCtx);
      } else if (action === "insert") {
        insertChip(item);
      } else {
        args.editor.chain().focus().deleteRange(args.range).run();
      }
      setPopup(null);
    },
  });

  const extensions = useMemo(() => {
    const list = [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
      ComposerChipNode,
    ];
    for (const char of Object.keys(triggers)) {
      list.push(buildTriggerExtension(char, ctlRef));
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(triggers).join(""), placeholder]);

  const editor = useEditor({
    extensions,
    autofocus: autoFocus,
    editable: !ctx.disabled,
    editorProps: {
      attributes: {
        "data-slot": "composer-rich-input",
        role: "textbox",
        "aria-multiline": "true",
        class: cn(
          "outline-none min-h-9 max-h-60 overflow-y-auto",
          "px-2 py-1.5 text-sm leading-relaxed text-foreground",
          "[&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]",
          "[&_p.is-editor-empty:first-child]:before:text-muted-foreground",
          "[&_p.is-editor-empty:first-child]:before:pointer-events-none",
          "[&_p.is-editor-empty:first-child]:before:float-left",
          "[&_p.is-editor-empty:first-child]:before:h-0",
        ),
      },
      handleKeyDown: (_view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          const cur = popupRef.current;
          const hideOnEmpty =
            cur && (triggersRef.current[cur.trigger]?.hideOnEmpty ?? true);
          if (!cur || (hideOnEmpty && !cur.loading && cur.items.length === 0)) {
            event.preventDefault();
            ctx.triggerSubmit();
            return true;
          }
        }
        return false;
      },
    },
    onCreate: ({ editor }) => {
      ctx.setEmpty(isEditorBlank(editor));
    },
    onUpdate: ({ editor }) => {
      pruneChipStorage(editor);
      ctx.setEmpty(isEditorBlank(editor));
      onValueChangeRef.current?.(serializeEditor(editor));
    },
    onFocus: () => ctx.setFocused(true),
    onBlur: () => ctx.setFocused(false),
  });

  useEffect(() => {
    if (!editor) return;
    return ctx.registerSubmit(() => {
      if (isEditorBlank(editor)) return;
      const value = serializeEditor(editor);
      onSubmitRef.current?.(value);
      editor.commands.clearContent();
      ctx.setEmpty(true);
    });
  }, [editor, ctx]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!ctx.disabled);
  }, [editor, ctx.disabled]);

  const setExtState = extCtx.setState;
  useEffect(() => {
    const state: RichExtState = {
      popup,
      setHighlighted,
      popFrame,
      pickItem,
      triggers,
      listboxId,
    };
    setExtState(state);
    return () => setExtState(null);
  }, [
    setExtState,
    popup,
    setHighlighted,
    popFrame,
    pickItem,
    triggers,
    listboxId,
  ]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    let dom: HTMLElement;
    try {
      dom = editor.view.dom;
    } catch {
      return;
    }
    if (popup) {
      dom.setAttribute("aria-controls", listboxId);
      dom.setAttribute("aria-expanded", "true");
      dom.setAttribute("aria-haspopup", "listbox");
      const item = popup.items[popup.highlighted];
      if (item && !item.disabled) {
        dom.setAttribute(
          "aria-activedescendant",
          `${listboxId}-option-${item.id}`,
        );
      } else {
        dom.removeAttribute("aria-activedescendant");
      }
    } else {
      dom.removeAttribute("aria-controls");
      dom.removeAttribute("aria-activedescendant");
      dom.removeAttribute("aria-expanded");
      dom.removeAttribute("aria-haspopup");
    }
  }, [editor, popup, listboxId]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {editor ? (
        <TriggersRefContext.Provider value={triggersRef}>
          <EditorContent editor={editor} />
        </TriggersRefContext.Provider>
      ) : (
        <div
          aria-hidden
          data-slot="composer-rich-input-skeleton"
          className={cn(
            "min-h-9 max-h-60 px-2 py-1.5 text-sm leading-relaxed",
            "text-muted-foreground select-none pointer-events-none",
          )}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}

const SUGGESTIONS_MAX_HEIGHT = 288;
const SUGGESTIONS_GAP = 6;

type SuggestionsAnchor = {
  top: number;
  bottom: number;
  left: number;
  width: number;
  placement: "top" | "bottom";
};

function useSuggestionsAnchor(
  rootRef: React.RefObject<HTMLDivElement | null>,
  isOpen: boolean,
): SuggestionsAnchor | null {
  const [anchor, setAnchor] = useState<SuggestionsAnchor | null>(null);
  useLayoutEffect(() => {
    if (!isOpen) {
      setAnchor(null);
      return;
    }
    const update = () => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const spaceAbove = rect.top - SUGGESTIONS_GAP;
      const spaceBelow = window.innerHeight - rect.bottom - SUGGESTIONS_GAP;
      const placement: "top" | "bottom" =
        spaceAbove >= SUGGESTIONS_MAX_HEIGHT
          ? "top"
          : spaceBelow > spaceAbove
            ? "bottom"
            : "top";
      setAnchor({
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        placement,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isOpen, rootRef]);
  return anchor;
}

export function ComposerSuggestions({
  renderItem,
  renderEmpty,
  renderLoading,
  renderHeader,
  renderGroup,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  renderItem?: (
    item: ComposerItem,
    state: {
      highlighted: boolean;
      trigger: string;
      query: string;
      depth: number;
    },
  ) => React.ReactNode;
  renderEmpty?: (state: { trigger: string; query: string }) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderHeader?: (state: {
    trigger: string;
    query: string;
    parents: ComposerItem[];
  }) => React.ReactNode;
  renderGroup?: (
    label: string,
    state: { trigger: string; query: string },
  ) => React.ReactNode;
}) {
  const ctx = useComposerContext();
  const extCtx = useComposerExtensionContext();
  const internal = extCtx.state as RichExtState | null;
  const popup = internal?.popup ?? null;
  const hideOnEmpty =
    popup && internal
      ? (internal.triggers[popup.trigger]?.hideOnEmpty ?? true)
      : true;
  const isHidden =
    !!popup && hideOnEmpty && !popup.loading && popup.items.length === 0;
  const anchor = useSuggestionsAnchor(ctx.containerRef, !!popup && !isHidden);
  if (typeof document === "undefined") return null;
  if (!internal || !popup || isHidden) return null;

  const { trigger, query, items, loading, parents, highlighted } = popup;
  const depth = parents.length;
  const listboxId = internal.listboxId;

  const node = (
    <div
      data-slot="composer-suggestions"
      data-placement={anchor?.placement ?? "top"}
      role="listbox"
      id={listboxId}
      aria-orientation="vertical"
      onMouseDown={(e) => e.preventDefault()}
      style={
        anchor
          ? {
              position: "fixed",
              left: anchor.left,
              width: anchor.width,
              ...(anchor.placement === "top"
                ? {
                    bottom: window.innerHeight - anchor.top + SUGGESTIONS_GAP,
                  }
                : { top: anchor.bottom + SUGGESTIONS_GAP }),
            }
          : { position: "fixed", visibility: "hidden", pointerEvents: "none" }
      }
      className={cn(
        "z-50",
        "data-[placement=top]:origin-bottom",
        "data-[placement=bottom]:origin-top",
        "max-h-72 overflow-y-auto",
        "flex flex-col p-1 gap-0.5",
        "rounded-outer border border-border bg-surface-elevated shadow-lg",
        "transition-[opacity,transform] duration-100",
        className,
      )}
      {...props}
    >
      {renderHeader?.({ trigger, query, parents })}
      {loading ? (
        renderLoading ? (
          renderLoading()
        ) : (
          <DefaultLoading />
        )
      ) : items.length === 0 ? (
        renderEmpty ? (
          renderEmpty({ trigger, query })
        ) : (
          <DefaultEmpty trigger={trigger} query={query} />
        )
      ) : (
        renderGroupedItems({
          items,
          highlighted,
          trigger,
          query,
          depth,
          listboxId,
          renderItem,
          renderGroup,
          onHover: (i) => internal.setHighlighted(i),
          onPick: (it) => internal.pickItem(it),
        })
      )}
    </div>
  );

  return createPortal(node, document.body);
}

function renderGroupedItems(args: {
  items: ComposerItem[];
  highlighted: number;
  trigger: string;
  query: string;
  depth: number;
  listboxId: string;
  renderItem?: (
    item: ComposerItem,
    state: {
      highlighted: boolean;
      trigger: string;
      query: string;
      depth: number;
    },
  ) => React.ReactNode;
  renderGroup?: (
    label: string,
    state: { trigger: string; query: string },
  ) => React.ReactNode;
  onHover: (index: number) => void;
  onPick: (item: ComposerItem) => void;
}): React.ReactNode[] {
  const {
    items,
    highlighted,
    trigger,
    query,
    depth,
    listboxId,
    renderItem,
    renderGroup,
    onHover,
    onPick,
  } = args;
  const rows: React.ReactNode[] = [];
  let lastGroup: string | undefined | null = null;
  let groupIdx = 0;
  items.forEach((item, idx) => {
    const g = item.group;
    if (g !== lastGroup) {
      if (g) {
        rows.push(
          <div
            key={`group-${groupIdx++}-${g}`}
            data-slot="composer-suggestions-group"
            role="presentation"
          >
            {renderGroup ? (
              renderGroup(g, { trigger, query })
            ) : (
              <DefaultGroupHeader label={g} />
            )}
          </div>,
        );
      }
      lastGroup = g;
    }
    const isOn = idx === highlighted;
    const content = renderItem ? (
      renderItem(item, { highlighted: isOn, trigger, query, depth })
    ) : (
      <DefaultRow item={item} highlighted={isOn} />
    );
    rows.push(
      <SuggestionRow
        key={item.id}
        id={`${listboxId}-option-${item.id}`}
        highlighted={isOn}
        disabled={item.disabled}
        onMouseEnter={() => onHover(idx)}
        onClick={() => onPick(item)}
      >
        {content}
      </SuggestionRow>,
    );
  });
  return rows;
}

function DefaultGroupHeader({ label }: { label: string }) {
  return (
    <div className="px-2.5 pt-2 pb-1 text-xs text-muted-foreground">
      {label}
    </div>
  );
}

function SuggestionRow({
  id,
  highlighted,
  disabled,
  onMouseEnter,
  onClick,
  children,
}: {
  id: string;
  highlighted: boolean;
  disabled?: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (highlighted) ref.current?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);
  return (
    <div
      ref={ref}
      id={id}
      role="option"
      aria-selected={highlighted}
      data-highlighted={highlighted ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
}

function DefaultLoading() {
  return (
    <div className="px-3 py-2 text-sm text-muted-foreground">Loading…</div>
  );
}

function DefaultEmpty({ trigger, query }: { trigger: string; query: string }) {
  return (
    <div className="px-3 py-2 text-sm text-muted-foreground">
      No results for {trigger}
      {query}
    </div>
  );
}

function DefaultRow({
  item,
  highlighted,
}: {
  item: ComposerItem;
  highlighted: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm",
        highlighted ? "bg-accent text-foreground" : "text-foreground",
        item.disabled && "opacity-50",
      )}
    >
      {item.icon ? (
        <span className="inline-flex items-center text-muted-foreground [&>svg]:size-4">
          {item.icon}
        </span>
      ) : null}
      <span>{item.label}</span>
      {item.description ? (
        <span className="text-muted-foreground truncate">
          {item.description}
        </span>
      ) : null}
      {item.children && item.children.length > 0 ? (
        <span className="ml-auto text-muted-foreground" aria-hidden>
          ›
        </span>
      ) : null}
    </div>
  );
}
