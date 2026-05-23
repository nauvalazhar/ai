# Component plan

The roadmap of components for this AI app UI kit. Use this as the source of truth for what to build, what each piece does, and how its parts compose. Read `CONVENTIONS.md` for the rules every component follows (compound parts, `data-slot`, tokens, etc.) — this file is _what to build_, not _how_.

## References

Component scope synthesized from four reference kits. Where they overlap is the strongest signal that a primitive belongs here.

- [ai-sdk elements](https://elements.ai-sdk.dev/) — Vercel's official AI SDK kit
- [assistant-ui](https://www.assistant-ui.com/) — runtime + UI for chat threads
- [shadcn/ai](https://www.shadcn.io/ai) — shadcn-style AI block registry
- [prompt-kit](https://www.prompt-kit.com/) — building blocks for prompt UIs

## Status legend

- ✅ shipped — already in `src/components/ai/`
- 🟡 next — first wave, build these to reach a usable chat surface
- ⚪ later — second wave, extends the surface (citations, agentic, media)
- ⛔ out of scope — explicitly not building (yet)

## Build order rationale

The first wave (🟡) is the smallest set that lets a user assemble a real chat: list of messages → markdown body → input. The second wave (⚪) extends with capabilities that not every app needs (citations, tool calls, file uploads). Within each wave, items are roughly ordered so later components can compose earlier ones.

---

## Shipped

### `Message` ✅

Chat row with role-aware layout. User messages flip to the right; system messages center and mute.

```tsx
<Message role="assistant">
  <MessageAvatar fallback="AI" />
  <MessageContent>Hello!</MessageContent>
  <MessageActions>…</MessageActions>
</Message>
```

Parts: `Message`, `MessageAvatar`, `MessageContent`, `MessageActions`.

### `CodeBlock` ✅

Code surface with header (title + actions) and content body. Syntax highlighting renders inside `CodeBlockContent` via `react-shiki` — siblings supply the highlighter, the kit only owns the chrome.

```tsx
<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>app.tsx</CodeBlockTitle>
    <CodeBlockAction>
      <CopyButton />
    </CodeBlockAction>
  </CodeBlockHeader>
  <CodeBlockContent>
    <pre>…</pre>
  </CodeBlockContent>
</CodeBlock>
```

Parts: `CodeBlock`, `CodeBlockHeader`, `CodeBlockTitle`, `CodeBlockAction`, `CodeBlockContent`.

### `Loader` ✅

Inline loading indicator. `dots` for typing/thinking, `pulse` for attention.

```tsx
<Loader variant="dots" size="md" />
```

Single part, `variant` + `size` props.

### `Spec` ✅

Documentation primitive — collapsible rows for prop tables, schema fields, etc. Used by `<Props>` in MDX docs.

Parts: `Spec`, `SpecHeader`, `SpecItem`, `SpecTrigger`, `SpecContent`, `SpecField`, `SpecFieldLabel`, `SpecFieldValue`.

---

## Wave 1 — chat surface 🟡

Minimum to assemble a working chat UI. Build in this order.

### `Conversation` 🟡

Scrollable container for a thread of messages. Owns the scroll viewport and stick-to-bottom behavior; wraps Base UI's `ScrollArea` so users get native-feeling scrollbars without owning the math. The `ScrollButton` (separate component) docks to its bottom-right when the user has scrolled away from the latest message.

```tsx
<Conversation>
  <ConversationContent>
    <Message role="user">…</Message>
    <Message role="assistant">…</Message>
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>
```

Parts:

- `Conversation` — root, `ScrollArea.Root` wrapper.
- `ConversationContent` — inner column, `ScrollArea.Viewport` with vertical flex spacing between messages.
- `ConversationScrollButton` — floating "scroll to latest" button. Hides when already at the bottom (`data-at-bottom`).

### `Markdown` 🟡

Markdown renderer for assistant output. Standalone — a sibling of `MessageContent`, not an internal — so users only pay for it when they render markdown. Defers code fences to `CodeBlock` and math to `Math` (later wave). Likely `react-markdown` + remark/rehype underneath.

```tsx
<MessageContent>
  <Markdown>{streaming}</Markdown>
</MessageContent>
```

Parts:

- `Markdown` — root. Accepts a `children` string and renders typographic block elements with kit tokens (uses `prose`-equivalent inline classes, no Tailwind typography plugin needed at render time).

Hooks for the user: pass a `components` map override for headings/links/etc. Default code-fence renderer points at `CodeBlock`.

### `PromptInput` 🟡

The composer. Auto-growing textarea, submit on Enter (Shift+Enter for newline), action toolbar slot below for attachments / model picker / send.

```tsx
<PromptInput onSubmit={…}>
  <PromptInputTextarea placeholder="Ask anything…" />
  <PromptInputToolbar>
    <PromptInputTools>
      <PromptInputAction><PaperclipIcon /></PromptInputAction>
      <PromptInputModelSelect />
    </PromptInputTools>
    <PromptInputSubmit />
  </PromptInputToolbar>
</PromptInput>
```

Parts:

- `PromptInput` — root `<form>`. Owns the `onSubmit`. Wraps a card-like surface with focus ring forwarding from the textarea inside.
- `PromptInputTextarea` — auto-resizing textarea. Submits on Enter; Shift+Enter inserts a newline.
- `PromptInputToolbar` — bottom row container, `flex justify-between`.
- `PromptInputTools` — left cluster, holds attachment/tool buttons.
- `PromptInputAction` — single icon button (paperclip, mic, etc.). Styled `<button>`.
- `PromptInputSubmit` — send button. `data-state="ready"|"streaming"|"disabled"` so the user can swap icons (arrow ↔ stop ↔ disabled).
- `PromptInputModelSelect` — Base UI `Select` wrapper for model picker. Optional convenience; users can drop their own select in.

### `Actions` 🟡

Generic icon-button row used under a message (copy, regenerate, thumbs up/down, share). `MessageActions` is currently a layout div; this promotes the button itself into a part. Keep both — `MessageActions` is the slot, `Action` is the button styling.

```tsx
<MessageActions>
  <Action label="Copy">
    <CopyIcon />
  </Action>
  <Action label="Regenerate">
    <RefreshIcon />
  </Action>
</MessageActions>
```

Parts:

- `Action` — small ghost icon button with tooltip support via `aria-label`. Keep the API minimal; users wrap with their own tooltip primitive when they want one.

### `Suggestion` 🟡

Tappable suggestion chips shown above an empty composer or after a response.

```tsx
<Suggestions>
  <Suggestion onClick={…}>Summarize this PR</Suggestion>
  <Suggestion onClick={…}>Explain this error</Suggestion>
</Suggestions>
```

Parts:

- `Suggestions` — flex-wrap container.
- `Suggestion` — single chip, styled `<button>`.

### `Avatar` 🟡

Standalone circular avatar — `MessageAvatar` is a thin styling wrapper around the Message slot, but a generic `Avatar` is useful in headers, sources, attachments, anywhere a face/icon is shown.

```tsx
<Avatar>
  <AvatarImage src={url} alt="…" />
  <AvatarFallback>AI</AvatarFallback>
</Avatar>
```

Parts: `Avatar` (root span/div with overflow-hidden), `AvatarImage`, `AvatarFallback`. Mirrors shadcn's avatar API so existing themes work.

### `Welcome` / `EmptyState` 🟡

The empty thread surface — heading, subhead, and a slot below for `Suggestions`. Rendered before the first message is sent.

```tsx
<Welcome>
  <WelcomeIcon>
    <SparklesIcon />
  </WelcomeIcon>
  <WelcomeTitle>How can I help today?</WelcomeTitle>
  <WelcomeDescription>
    Ask anything, paste a link, or drop a file.
  </WelcomeDescription>
  <Suggestions>…</Suggestions>
</Welcome>
```

Parts: `Welcome`, `WelcomeIcon`, `WelcomeTitle`, `WelcomeDescription`. Plain divs.

### `ResponseStream` 🟡

Streaming text wrapper with a blinking cursor at the tail. Sibling of `Markdown` — wrap a streaming string and it appends a `data-streaming` cursor element until you stop. Distinct from `Markdown` because not every streamed response needs markdown parsing (raw answers, tool args, etc.).

```tsx
<ResponseStream isStreaming={isStreaming}>{text}</ResponseStream>
```

Parts: `ResponseStream` (root), `ResponseStreamCursor` (the blinking element, exposed so users can swap it). `data-streaming` toggles the cursor.

---

## Wave 2 — capabilities ⚪

AI-specific surfaces beyond plain chat. Build as needed.

### `Reasoning` ✅

Collapsible chain-of-thought block. Same pattern as `Spec` — wraps Base UI's `Collapsible`. Header lays out as a `1fr / auto` grid so an optional stop button docks to the right while streaming.

```tsx
<Reasoning defaultOpen>
  <ReasoningTrigger>Thinking…</ReasoningTrigger>
  <ReasoningSkipButton onClick={onSkip}>Skip thinking</ReasoningSkipButton>
  <ReasoningContent>
    <Markdown>{thoughtStream}</Markdown>
  </ReasoningContent>
</Reasoning>
```

Parts: `Reasoning` (Collapsible.Root), `ReasoningTrigger` (Collapsible.Trigger with chevron), `ReasoningSkipButton` (optional button on the right), `ReasoningContent` (Collapsible.Panel).

### `ChainOfThought` ⚪

Structured cousin of `Reasoning`. Where `Reasoning` is a single free-form block, `ChainOfThought` is an ordered list of discrete reasoning steps, each independently expandable. Two layers of collapsibles: an outer one wrapping the whole chain (header toggles every step at once) and an inner one per step (its trigger toggles just that step's detail). A vertical dotted rail with dots runs down the left through both layers, so the header sits visually on the same line as the steps. Style follows `Reasoning`. Distinct from `Task`: ChainOfThought steps are reasoning narration, Task steps are concrete to-dos with completion.

```tsx
<ChainOfThought defaultOpen>
  <ChainOfThoughtHeader>Working through the request</ChainOfThoughtHeader>
  <ChainOfThoughtContent>
    <ChainOfThoughtStep>
      <ChainOfThoughtStepTrigger>
        <ChainOfThoughtStepIcon />
        Analyzing the user's request
      </ChainOfThoughtStepTrigger>
      <ChainOfThoughtStepContent>…</ChainOfThoughtStepContent>
    </ChainOfThoughtStep>

    <ChainOfThoughtStep defaultOpen>
      <ChainOfThoughtStepTrigger>
        <ChainOfThoughtStepIcon />
        Selecting the best approach
      </ChainOfThoughtStepTrigger>
      <ChainOfThoughtStepContent>
        Given the educational context, I'll demonstrate merge sort for its
        clarity. It shows the divide-and-conquer principle effectively.
      </ChainOfThoughtStepContent>
    </ChainOfThoughtStep>
  </ChainOfThoughtContent>
</ChainOfThought>
```

Parts:

- `ChainOfThought` — outer `Collapsible.Root`. Owns the rail column.
- `ChainOfThoughtHeader` — outer `Collapsible.Trigger`. Topmost row on the rail; toggles all steps. Named `Header` instead of `Trigger` so it doesn't collide semantically with the per-step trigger below.
- `ChainOfThoughtContent` — outer `Collapsible.Panel`. Wraps the step list.
- `ChainOfThoughtStep` — inner `Collapsible.Root`. One row plus its detail.
- `ChainOfThoughtStepTrigger` — inner `Collapsible.Trigger`. Dot + label + chevron row.
- `ChainOfThoughtStepIcon` — the leading dot. Default filled circle; users render any icon as `children` (spinner, check, custom glyph) for status without baking an enum into the API.
- `ChainOfThoughtStepContent` — inner `Collapsible.Panel`. Indented detail under the step.

### `ToolCall` ⚪

Tool invocation block — name, arguments, result/error. One row per call, collapsible to reveal the raw payload.

```tsx
<ToolCall data-state="success">
  <ToolCallTrigger>
    <ToolCallName>get_weather</ToolCallName>
    <ToolCallStatus /> {/* spinner / check / x */}
  </ToolCallTrigger>
  <ToolCallContent>
    <ToolCallInput>{argsJson}</ToolCallInput>
    <ToolCallOutput>{resultJson}</ToolCallOutput>
  </ToolCallContent>
</ToolCall>
```

Parts: `ToolCall`, `ToolCallTrigger`, `ToolCallName`, `ToolCallStatus`, `ToolCallContent`, `ToolCallInput`, `ToolCallOutput`. `data-state` is `running | success | error`.

### `Task` ⚪

Agentic to-do list — a checklist of subtasks with live status, like Cursor/Claude Code's plan view. Useful for multi-step agents.

```tsx
<Task>
  <TaskTrigger>Building feature</TaskTrigger>
  <TaskContent>
    <TaskItem data-state="done">Read schema</TaskItem>
    <TaskItem data-state="running">Generate migration</TaskItem>
    <TaskItem data-state="pending">Run tests</TaskItem>
  </TaskContent>
</Task>
```

Parts: `Task`, `TaskTrigger`, `TaskContent`, `TaskItem`. State is `pending | running | done | error`. Built on Collapsible.

### `Branch` ⚪

Branch picker — when the assistant has multiple regenerated answers, lets the user page through them.

```tsx
<Branch current={2} total={4}>
  <BranchPrev />
  <BranchIndicator /> {/* "2 / 4" */}
  <BranchNext />
</Branch>
```

Parts: `Branch` (root with role=group), `BranchPrev`, `BranchNext`, `BranchIndicator`. No Base UI dependency — it's just three buttons + a span.

### `Sources` ⚪

Citation list, typically rendered under an assistant message for a RAG response. A list of clickable links/cards, each pointing at a source document.

```tsx
<Sources>
  <SourcesTrigger>4 sources</SourcesTrigger>
  <SourcesContent>
    <Source href="…">
      <SourceFavicon />
      <SourceTitle>React docs</SourceTitle>
      <SourceDescription>Hooks reference</SourceDescription>
    </Source>
    {/* more */}
  </SourcesContent>
</Sources>
```

Parts: `Sources`, `SourcesTrigger`, `SourcesContent`, `Source`, `SourceFavicon`, `SourceTitle`, `SourceDescription`. Collapsible-based; opens to reveal the full list.

### `InlineCitation` ⚪

Footnote-style citation marker inside markdown — `[1]`, `[2]` etc. — that opens a popover showing the source on hover/click. Wraps Base UI's `Popover`.

```tsx
The sky is blue<InlineCitation index={1}>
  <InlineCitationCard>
    <InlineCitationTitle>Atmospheric scattering</InlineCitationTitle>
    <InlineCitationDescription>…</InlineCitationDescription>
  </InlineCitationCard>
</InlineCitation>.
```

Parts: `InlineCitation` (Popover.Root + superscript trigger), `InlineCitationCard` (Popover.Popup), `InlineCitationTitle`, `InlineCitationDescription`.

### `WebPreview` ⚪

URL preview card — favicon, title, description, hostname, optional og-image. Often rendered alongside a `Source`.

```tsx
<WebPreview href="https://anthropic.com">
  <WebPreviewImage />
  <WebPreviewBody>
    <WebPreviewTitle>Anthropic</WebPreviewTitle>
    <WebPreviewDescription>AI safety company</WebPreviewDescription>
    <WebPreviewHost>anthropic.com</WebPreviewHost>
  </WebPreviewBody>
</WebPreview>
```

Parts: `WebPreview` (anchor), `WebPreviewImage`, `WebPreviewBody`, `WebPreviewTitle`, `WebPreviewDescription`, `WebPreviewHost`.

### `Image` ⚪

Generated/uploaded image display with loading and error states. Thin wrapper over `<img>` that adds the kit's chrome (border, radius, optional caption slot).

```tsx
<Image src={url} alt="…">
  <ImageCaption>Generated by sora</ImageCaption>
</Image>
```

Parts: `Image` (figure), `ImageCaption` (figcaption).

### `Attachment` ⚪

File chip for _sent_ attachments — what the user sees on a posted message. Compact row with icon, name, size.

```tsx
<Attachment>
  <AttachmentIcon /> {/* mime-based */}
  <AttachmentBody>
    <AttachmentName>resume.pdf</AttachmentName>
    <AttachmentMeta>284 KB</AttachmentMeta>
  </AttachmentBody>
</Attachment>
```

Parts: `Attachment`, `AttachmentIcon`, `AttachmentBody`, `AttachmentName`, `AttachmentMeta`.

### `FilePreview` ⚪

Pending-upload chip — the same shape as `Attachment` but with progress and a remove button, shown inside the composer before submit. Distinct because the states it tracks are different (uploading, error, removable).

```tsx
<FilePreview data-state="uploading">
  <FilePreviewIcon />
  <FilePreviewBody>
    <FilePreviewName>resume.pdf</FilePreviewName>
    <FilePreviewProgress value={0.62} />
  </FilePreviewBody>
  <FilePreviewRemove />
</FilePreview>
```

Parts: `FilePreview`, `FilePreviewIcon`, `FilePreviewBody`, `FilePreviewName`, `FilePreviewProgress`, `FilePreviewRemove`. State: `uploading | ready | error`.

### `FileUpload` ⚪

The dropzone — accept-files-here surface. Wraps the composer (or replaces its body) when the user drags a file over the window. Renders a hint and an outline.

```tsx
<FileUpload onFiles={…} accept="image/*,application/pdf">
  <FileUploadTrigger>Attach files</FileUploadTrigger>
  <FileUploadDropzone>
    <FileUploadHint>Drop files to attach</FileUploadHint>
  </FileUploadDropzone>
</FileUpload>
```

Parts: `FileUpload` (root, manages drag state), `FileUploadTrigger` (clickable button that opens the picker), `FileUploadDropzone` (visual target — `data-dragging` toggles the highlight), `FileUploadHint`.

### `Math` ⚪

Inline + block KaTeX renderer. Sibling of `Markdown` — lazy-loaded, only paid for when used. Supports `$inline$` and `$$block$$` shapes.

```tsx
<Math>{`E = mc^2`}</Math>
<Math display="block">{`\\int_0^\\infty e^{-x^2}\\,dx`}</Math>
```

Parts: `Math` (single component, `display` prop selects inline vs block).

### `Artifact` ⚪

Side-panel surface for editable assistant output — code, document, canvas. Twin-pane chat layouts (Claude artifacts, ChatGPT canvas) need a host for this. Header with title + actions, body for the content, optional version control.

```tsx
<Artifact>
  <ArtifactHeader>
    <ArtifactTitle>app.tsx</ArtifactTitle>
    <ArtifactActions>
      <ArtifactVersionPicker />
      <ArtifactClose />
    </ArtifactActions>
  </ArtifactHeader>
  <ArtifactContent>
    <CodeBlock>…</CodeBlock>
  </ArtifactContent>
</Artifact>
```

Parts: `Artifact`, `ArtifactHeader`, `ArtifactTitle`, `ArtifactActions`, `ArtifactVersionPicker`, `ArtifactClose`, `ArtifactContent`.

### `Context` ⚪

Context chips — what the assistant currently has access to (files, URLs, selections, repos). Sits at the top of the composer or in the thread header.

```tsx
<Context>
  <ContextItem>
    <ContextItemIcon>
      <FileIcon />
    </ContextItemIcon>
    <ContextItemLabel>app.tsx</ContextItemLabel>
    <ContextItemRemove />
  </ContextItem>
</Context>
```

Parts: `Context` (flex-wrap row), `ContextItem`, `ContextItemIcon`, `ContextItemLabel`, `ContextItemRemove`.

### `OpenInChat` ⚪

"Open this conversation in ChatGPT/Claude/Gemini" share button — single chip-button with a provider icon. Useful for tools that bridge into hosted assistants.

```tsx
<OpenInChat>
  <OpenInChatTrigger>Open in</OpenInChatTrigger>
  <OpenInChatProvider href="…" provider="claude" />
  <OpenInChatProvider href="…" provider="chatgpt" />
</OpenInChat>
```

Parts: `OpenInChat` (Popover.Root), `OpenInChatTrigger`, `OpenInChatProvider` (anchor with provider icon).

---

## Wave 3 — extras ⚪

### `JSXPreview` ⚪

Render-trusted-JSX preview pane (prompt-kit has this). Useful for "generate component" demos. Defer until we have a real use case here.

---

## Out of scope ⛔

- **App shell / layout / sidebar / thread list / chat header** — too app-specific. Every product wants a different shell. Users compose the kit's primitives inside their own layout, sidebar, and header. The kit is for _what goes in the chat surface_, not the surface around it.
- **Auth flows, settings panels, billing** — not generic primitives, not part of an AI UI kit.
- **Backend / runtime / state stores** — this kit is presentational only. Users plug their own SDK (Vercel AI SDK, assistant-ui runtime, custom) into the components.
- **Voice recorder / waveform** — not in three of the four references; defer until requested.
- **Slash-command menu inside `PromptInput`** — users can drop their own command-palette primitive into the textarea slot. Revisit if a demo needs it natively.

---

## Naming and pattern reminders

When adding a new component, double-check it follows `CONVENTIONS.md`:

- File at `src/components/ai/<component>.tsx`, demos under `src/demos/<component>/`, doc at `src/docs/<component>.mdx`.
- Compound parts as flat exports: `Foo`, `FooTrigger`, `FooContent`. No namespace exports.
- `data-slot` always set; `data-role` for semantics; `data-state` for transient state.
- `cva` only for visual variants (size, density). Never for state/role.
- Wrap a Base UI primitive only when the part is interactive (Collapsible for expandable sections, Popover for citations/sources, Dialog for modals, ScrollArea for the conversation viewport, Select for the model picker). Otherwise plain `div`/`button`/`span`.
- `rounded-md` everywhere; `rounded-full` only for circles. No raw colors — only token classes.

## Spacing

- if root has p-1, the parts should be px-3 py-2 (header could be h-11)
- if root has no padding, the parts should be px-4 py-3
- for smaller components that's non-card, px-3 py-2 will works fine
