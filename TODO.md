## Todo

- [x] media (image, etc) generated card with action (download, edit) toolbar and image
- [x] model selector
- [x] feedback bar
- [x] selection toolbar
- [x] transcript
- [ ] speak

### Code

- [x] web preview (iframe, adress bar, refresh, navigation, element selector)
- [x] console log
- [x] exception
- [x] environtment variables
- [x] sandbox (code + output result, also covers https://tanstack.com/ai/latest/docs/code-mode/client-integration)
- [x] file tree
- [x] diff
- monaco editor [could be just an example]
- dependency (package json info) [not sure for what]
- artifact (code + toolbar) [could be just a new demo on code block]

---

## TanStack AI integration

Goal: ship aikit as the first-class copy-paste UI for [TanStack AI](https://tanstack.com/ai/). TanStack AI is logic-heavy / UI-light by design — they ship hooks (`useChat`, `useRealtimeChat`, generation hooks) and a near-empty `@tanstack/ai-react-ui` (just `Chat`, `ChatMessage`, `ChatInput`, `ThinkingPart`, `ToolApproval`). Their `UIMessage.parts` is the contract — discriminator on `type`: `text | image | audio | video | document | thinking | tool-call | tool-result | structured-output`, with rich lifecycle states (tool-call has 6, tool-result has 3, chat client has 4, connection has 4).

### Starting a session

Paste this into a fresh Claude Code session to pick up the work:

```
Read TODO.md (the TanStack AI section is the spec) and CONVENTIONS.md.
We're working on Phase <N> item <N> from the build order.
Build it following the Expected criteria. Don't ask clarifying questions
 — make the reasonable call.
```

What I will pull on my own (no need to mention):
- `node_modules/@tanstack/ai*/dist/esm/*.d.ts` for type verification (the four packages are devDependencies — see `package.json`).
- The relevant `src/components/ai/<x>.tsx` source if the item extends an existing component.
- `registry.config.ts` and `src/styles/tokens.css` when registering a new component.
- The existing demos for the touched family (`src/demos/<family>/*.tsx`) to match the style.

What auto-loads (memory; no need to mention):
- "No em dashes", docs writing style, inline prop types, dev server on port 3300, isolation over DRY, kit composition rules, etc.

What to mention only if it applies to your session:
- "Plan first, then approve before code" → triggers plan mode.
- A specific design constraint not in TODO.md or CONVENTIONS.md.
- A different model preference.

### Hard rules to respect across all items

- **No data contract in components.** Per `CONVENTIONS.md`, components in `src/components/ai/` never know about message shape, parts arrays, or SDK types. Anything TanStack-specific lives in `src/demos/` (recipes) or `src/docs/` (prose), never inside a kit component.
- **Track TanStack version pins.** Their schema is pre-1.0 and already churning (e.g. `body` is deprecated in favor of `forwardedProps`). Each demo should declare which `@tanstack/ai-react` version it was written against, in a top comment.
- **Copy-paste only.** No new npm package. The "adapter" is a folder of demos plus minor extensions to existing components.
- **One file per component family.** Don't fragment into many tiny files.

### Demo strategy

Every demo under `src/demos/tanstack-chat/**` (and any TanStack-touching demo elsewhere) follows one strategy. This is non-negotiable so the playground works without API keys, screenshots are stable, and we exercise the real `useChat` not a parallel fake.

1. **Mock the adapter, not the hook.** When a demo needs `useChat`, build a `createMockAdapter(script)` that conforms to `ConnectionAdapter` and emits AG-UI events on a timer. Plug it into the real `useChat`. The hook is exercised end-to-end; only the network is faked. Same rule for voice: mock the realtime connection layer, not `useRealtimeChat` itself.
2. **Skip `useChat` entirely when you can.** Demos that just show a component in visual state X (e.g. `<Tool state="approval">`, `<GeneratedImage state="generating">`, the four `ConnectionStatus` chips) should not import `useChat` at all — pass props or drive local state with `setInterval`. `useChat` only earns its place when a demo needs the full message → parts → render flow.
3. **Import types from the installed package.** `import type { UIMessage, ConnectionAdapter, ... } from '@tanstack/ai-react'` (and `@tanstack/ai` for `MessagePart`, `ContentPartSource`, etc.). Any schema drift at install time becomes a TypeScript error in the demo file. Never inline-redefine TanStack types in a demo.
4. **One `live.tsx` per family is optional.** Same shape as the basic demo but documented in a top comment as "requires an API key + server endpoint — uncomment to run live". Commented out by default so the playground never tries to call out. Skip it unless the family has something a fake can't show (e.g. real tool execution timing).
5. **Shared helpers go in `src/demos/tanstack-chat/_mock/`.** `_mock/adapter.ts` (chat connection), `_mock/realtime-adapter.ts` (voice), `_mock/scripts.ts` (reusable scripted streams). Underscore prefix keeps them out of the playground sidebar. Land these as part of item 1; every later item reuses them.

### Reference: TanStack AI data shapes

This is the schema the items below build against. **Verified against installed `.d.ts` files** — `@tanstack/ai@0.21.3`, `@tanstack/ai-client@0.11.7`, `@tanstack/ai-react@0.11.7`, `@tanstack/ai-react-ui@0.8.1`. Re-verify against `node_modules/@tanstack/ai*/dist/esm/*.d.ts` if shapes look off in the future (these are devDependencies).

**Packages.**
- `@tanstack/ai` (core types + server adapters) — `dist/esm/types.d.ts` is the source of truth for `UIMessage`, all parts, `ContentPart`, `ModelMessage`, `StreamChunk`.
- `@tanstack/ai-client` (logic core) — `dist/esm/types.d.ts` wraps the core types with `TTools` narrowing and defines `ChatClientOptions`, `ChatClientState`, `ConnectionStatus`, `MultimodalContent`. Also: `chat-client.ts`, `connection-adapters.ts`, `events.ts`, `sse-parser.ts`, `tool-types.ts`, `generation-client.ts`, `realtime-client.ts`.
- `@tanstack/ai-react` (React hooks) — `dist/esm/types.d.ts` defines `UseChatOptions` and `UseChatReturn`. Hooks: `use-chat.ts`, `use-realtime-chat.ts`, `use-generation.ts`, `use-generate-{audio,image,speech,video}.ts`, `use-summarize.ts`, `use-transcription.ts`.
- `@tanstack/ai-react-ui` (their minimal headless UI — what we are replacing/extending) — `chat.tsx`, `chat-input.tsx`, `chat-message.tsx`, `chat-messages.tsx`, `text-part.tsx`, `thinking-part.tsx`, `tool-approval.tsx`, `markdown-plugins.ts`.
- `@tanstack/ai-code-mode` + `ai-isolate-{cloudflare,node,quickjs}` — code execution. UI is fully open territory.
- `@tanstack/ai-devtools` + `{react,preact,solid}-ai-devtools` — dev event inspector.
- Adapters: `ai-openai`, `ai-anthropic`, `ai-gemini`, `ai-openrouter`, `ai-grok`, `ai-groq`, `ai-ollama`, `ai-elevenlabs`, `ai-fal`.

**UIMessage (what `useChat().messages` returns — the ai-client wrapper with `TTools` narrowing).**

```ts
interface UIMessage<TTools = any, TData = unknown> {
  id: string
  role: 'system' | 'user' | 'assistant'
  parts: Array<MessagePart<TTools, TData>>
  createdAt?: Date
}

type MessagePart<TTools, TData> =
  | TextPart
  | ImagePart | AudioPart | VideoPart | DocumentPart
  | ThinkingPart
  | ToolCallPart<TTools>
  | ToolResultPart
  | StructuredOutputPart<TData>
```

Note: the core `@tanstack/ai` exports a simpler `UIMessage<TData>` without `TTools` — but consumers of `useChat` always get the ai-client wrapped form above.

**Each part shape (discriminator is `type`).**

```ts
interface TextPart {
  type: 'text'
  content: string
  metadata?: unknown                       // present on core type; ai-client wrapper omits it
}

interface ThinkingPart {
  type: 'thinking'
  content: string
  stepId?: string                          // present on core type; absent on ai-client wrapper
  signature?: string                       // ditto
}

// Media parts all share the same { type, source, metadata? } shape.
interface ImagePart    { type: 'image';    source: ContentPartSource; metadata?: unknown }
interface AudioPart    { type: 'audio';    source: ContentPartSource; metadata?: unknown }
interface VideoPart    { type: 'video';    source: ContentPartSource; metadata?: unknown }
interface DocumentPart { type: 'document'; source: ContentPartSource; metadata?: unknown }

type ContentPartSource = ContentPartDataSource | ContentPartUrlSource
interface ContentPartDataSource {
  type: 'data'                             // inline (base64-encoded) — NOT the string 'base64'
  value: string                            // base64 payload
  mimeType: string                         // required
}
interface ContentPartUrlSource {
  type: 'url'
  value: string                            // HTTP(S) URL or data URI
  mimeType?: string                        // optional
}

interface ToolCallPart<TTools = any> {     // typed via TTools when supplied
  type: 'tool-call'
  id: string
  name: string                             // narrows to T['name'] when TTools is typed
  arguments: string                        // JSON string, MAY BE INCOMPLETE while state === 'input-streaming'
  input?: InferToolInput<T>                // parsed input (typed if TTools provided)
  state: ToolCallState
  approval?: { id: string; needsApproval: boolean; approved?: boolean }
  output?: InferToolOutput<T>              // present for client tools or after approval+execution
}

interface ToolResultPart {
  type: 'tool-result'
  toolCallId: string                       // matches ToolCallPart.id
  content: string                          // string or JSON-stringified result
  state: ToolResultState
  error?: string                           // populated when state === 'error'
}

interface StructuredOutputPart<TData = unknown> {
  type: 'structured-output'
  status: 'streaming' | 'complete' | 'error'   // own lifecycle, separate from ToolCallState/ToolResultState
  partial?: DeepPartial<TData>             // progressive parse, populated while streaming AND after complete
  data?: TData                             // validated final — only when status === 'complete'
  raw: string                              // accumulating JSON buffer, source of truth for wire round-trip
  reasoning?: string                       // optional chain-of-thought from reasoning models
  errorMessage?: string                    // populated when status === 'error'
}
```

**Lifecycle state unions (the source of "rich states" we map to in items 2, 8, 10).**

```ts
type ToolCallState =
  | 'awaiting-input'      // start received, no args yet
  | 'input-streaming'     // partial args arriving
  | 'input-complete'      // all args received
  | 'approval-requested'  // waiting on user approval
  | 'approval-responded'  // user approved/denied
  | 'complete'            // result is in

type ToolResultState =
  | 'streaming' | 'complete' | 'error'

type ChatClientState =
  | 'ready' | 'submitted' | 'streaming' | 'error'

type ConnectionStatus =
  | 'disconnected' | 'connecting' | 'connected' | 'error'

// StructuredOutputPart has its own status union — see the part definition above.

type StreamChunk = AGUIEvent              // re-export from @ag-ui/core
```

**ModelMessage (the wire-side message, distinct from UIMessage).**

```ts
interface ModelMessage<TContent = string | null | Array<ContentPart>> {
  role: 'user' | 'assistant' | 'tool'      // NOTE: no 'system' here — system prompts go elsewhere
  content: TContent
  name?: string
  toolCalls?: Array<ToolCall>
  toolCallId?: string
  thinking?: Array<{ content: string; signature?: string }>
}

interface ToolCall<TMetadata = unknown> {
  id: string
  type: 'function'
  function: { name: string; arguments: string }
  metadata?: TMetadata
}
```

Used by `append(message: ModelMessage | UIMessage)`.

**`useChat` (the React entry point we wire against). Verified from `ai-react/dist/esm/types.d.ts`.**

```ts
type UseChatOptions<TTools, TSchema> = Omit<
  ChatClientOptions<TTools>,
  | 'onMessagesChange' | 'onLoadingChange' | 'onErrorChange' | 'onStatusChange'
  | 'onSubscriptionChange' | 'onConnectionStatusChange' | 'onSessionGeneratingChange'
> & {
  live?: boolean                          // subscribe mode (AG-UI)
  outputSchema?: TSchema                  // standard-schema-compatible — see partial/final in return
}

// ChatClientOptions (inherited via the Omit above)
interface ChatClientOptions<TTools> {
  connection: ConnectionAdapter           // SSE / fetch / custom — mutually exclusive modes: connect() OR subscribe()+send()
  initialMessages?: Array<UIMessage<TTools>>
  id?: string                             // client instance id
  threadId?: string                       // persists across sends in a session
  forwardedProps?: Record<string, any>    // server-side per-session opts (preferred)
  body?: Record<string, any>              // DEPRECATED — values are merged into forwardedProps + mirrored under `data`
  tools?: ReadonlyArray<AnyClientTool>    // client-executed tools (further down in the .d.ts)
  onResponse?: (r?: Response) => void | Promise<void>
  onChunk?: (chunk: StreamChunk) => void
  onFinish?: (m: UIMessage<TTools>) => void
  onError?: (e: Error) => void
  // state-change callbacks omitted in useChat (React state replaces them)
}

// Return type — base shape + extras when outputSchema is supplied
interface BaseUseChatReturn<TTools, TData> {
  messages: Array<UIMessage<TTools, TData>>
  sendMessage: (content: string | MultimodalContent) => Promise<void>
  append: (m: ModelMessage | UIMessage<TTools, TData>) => Promise<void>
  addToolResult: (r: {
    toolCallId: string
    tool: string
    output: any
    state?: 'output-available' | 'output-error'
    errorText?: string
  }) => Promise<void>
  addToolApprovalResponse: (r: { id: string; approved: boolean }) => Promise<void>
  reload: () => Promise<void>             // regenerate last assistant message
  stop: () => void                        // abort streaming
  clear: () => void
  setMessages: (msgs: Array<UIMessage<TTools, TData>>) => void   // NOTE: setMessages, not setMessagesManually
  isLoading: boolean
  error: Error | undefined
  status: ChatClientState
  isSubscribed: boolean
  connectionStatus: ConnectionStatus
  sessionGenerating: boolean              // derived from RUN_STARTED/FINISHED/ERROR, visible across tabs
}

// When outputSchema is supplied, the return is ALSO augmented with:
//   partial: DeepPartial<InferSchemaType<TSchema>>   // live progressive object
//   final:   InferSchemaType<TSchema> | null         // validated terminal payload, null until complete
// Both reset on every new sendMessage/reload.
```

**Multimodal send input.**

```ts
interface MultimodalContent {
  content: string | Array<ContentPart>     // ContentPart = TextPart | ImagePart | AudioPart | VideoPart | DocumentPart
  id?: string                              // optional custom message id
}
```

**Other hooks (signatures to look up when their items come up — files exist under `@tanstack/ai-react/dist/esm/`).**
- `useRealtimeChat(options)` — voice loop. Used by item 6.
- `useGenerateImage(options)` / `useGenerateAudio` / `useGenerateSpeech` / `useGenerateVideo` — media generation lifecycle. Used by item 10.
- `useTranscription(options)` — used by item 11.
- `useSummarize(options)`, `useGeneration(options)` — general one-shots.

**Their `@tanstack/ai-react-ui` reference (what their bare-bones UI provides — for comparison).**

```tsx
<Chat connection={...}>
  <Chat.Messages />
  <Chat.Input />
</Chat>

// <ChatMessage> supports these renderer overrides:
//   textPartRenderer, thinkingPartRenderer,
//   toolsRenderer: { [toolName]: (props) => ReactNode },
//   defaultToolRenderer, toolResultRenderer
// <ToolApproval> wraps approval UI; consumes useChatContext().addToolApprovalResponse.
// <ThinkingPart> auto-collapses when a later text part appears in the same message.
```

We are replacing this surface (except `<ToolApproval>` which is logic — we wrap `Confirmation` around it in item 3).

**Note for item 5 (partial-JSON viewer).** TanStack already exposes progressive structured-output parsing via the hook-level `partial` field AND on each `StructuredOutputPart.partial`. Item 5 should focus on `tool-call.arguments` (the raw JSON string that streams in during `input-streaming`), since that's the one place there isn't already a helper.

### Tracking

- [ ] 1. End-to-end reference demo (the bridge)
- [ ] 2. Tool-call state mapping
- [ ] 3. Confirmation wired to tool approval
- [ ] 4. Streaming markdown renderer (`markdown` component)
- [ ] 5. Partial-JSON argument viewer
- [ ] 6. Voice / realtime UI family
- [ ] 7. Agent run container
- [ ] 8. Connection status surface
- [ ] 9. Stop / regenerate composer pattern
- [ ] 10. Media generation progress states
- [ ] 11. Transcription live state
- [ ] 12. Event-stream inspector (devtools)
- [ ] 13. Token / cost meter
- [ ] 14. Long-history virtualization
- [ ] 15. Full canonical chat demo
- [ ] 16. Notes: schema-pinning, AG-UI, `forwardedProps` migration

---

### 1. End-to-end reference demo (the bridge)

**Issue.** TanStack AI gives you `messages: UIMessage[]`, where each message has a `parts` array discriminated by `type`. There is no built-in renderer that picks the right UI per part. Today a user wiring TanStack to aikit has to write the `messages.map → parts.map → switch(part.type)` themselves, and they will get it subtly wrong (forgetting `thinking` mid-stream, mis-keying tool calls, dropping `structured-output`).

**What we have.** Every leaf component exists (`message`, `reasoning`, `tool`, `confirmation`, `generated-image`, etc.) but no example shows them composed against a real `UIMessage[]`.

**Improvement.** A single demo file that is the canonical "this is how you render TanStack's `UIMessage[]`": one `switch` over `part.type` dispatching to the right aikit component, plus role-based message wrapping. Becomes the thing users copy and edit.

**How.**
- New folder `src/demos/tanstack-chat/` (this is a *demo family*, not a component family — the playground will treat it like any other entry).
- Add `tanstack-chat` entry to `registry.config.ts`.
- File: `src/demos/tanstack-chat/basic.tsx` — minimal `useChat` + `<Conversation>` + a local `renderPart(part)` function with one branch per part type, each calling the matching aikit component.
- Use the existing `Message`/`MessageContent`/`MessageText` wrappers, with `data-role` derived from `message.role`.
- Build the shared `src/demos/tanstack-chat/_mock/adapter.ts` helper (`createMockAdapter(script)`) here — it implements `ConnectionAdapter` and emits AG-UI events on a timer. All later items reuse it. See "Demo strategy" above.
- Keep `renderPart` in the same file — do NOT extract it to `src/components/ai/`. It is user code by design.

**Expected.** Demo loads in the playground, plays a scripted stream end-to-end, and renders at minimum: a user text message, an assistant text part, a thinking part that auto-collapses, one tool-call with a tool-result. No imports from `@tanstack/ai*` appear inside `src/components/ai/`. The `renderPart` switch covers all 9 part types (even if some branches just render placeholder text).

**Notes.** This is item 15 in shrunken form. Build this first; everything else slots into it.

---

### 2. Tool-call state mapping

**Issue.** Our `tool` component has three states: `running | success | error`. TanStack tool-call has six: `awaiting-input | input-streaming | input-complete | approval-requested | approval-responded | complete`. Plus a separate `tool-result` lifecycle: `streaming | complete | error`. A naive mapping loses the "waiting for arguments to finish streaming" and "waiting for user approval" states, which are visually distinct.

**What we have.** `src/components/ai/tool.tsx` — `ToolState = "running" | "success" | "error"`, drives `data-state` and a destructive ring when errored.

**Improvement.** Extend `ToolState` to cover the meaningful visual states (not all six TanStack states need a distinct look — collapse them):
- `pending` — awaiting-input, input-streaming, input-complete (before execution starts). Subtle pulse on the trigger.
- `approval` — approval-requested. Distinct accent (use primary ring) to draw the eye; pairs with `<Confirmation>` inside `<ToolContent>`.
- `running` — execution underway (tool-result.state === "streaming"). Existing look.
- `success` — complete with no error. Existing look.
- `error` — anything errored. Existing look.

Plus a docs recipe in `src/docs/tool.mdx` titled "Mapping TanStack AI tool-call states" with a small table: TanStack state → aikit `state` prop.

**How.**
- Edit `src/components/ai/tool.tsx`: widen `ToolState` union, add the new `data-[state=pending]` and `data-[state=approval]` Tailwind selectors on the root and on `ToolTrigger` (subtle muted pulse for pending, primary ring for approval).
- New demo `src/demos/tool/states.tsx` that shows all five states side-by-side.
- Update `src/docs/tool.mdx` with the mapping table.
- Do NOT import any TanStack types — the component only knows the five visual states. The mapping is documentation.

**Expected.** `<Tool state="pending|approval|running|success|error">` produces five visually distinct results in the `states.tsx` demo. Pending shows a subtle pulse; approval shows a primary-accent ring; success and error keep their current look. Docs page contains a table with one row per TanStack state mapping to one aikit state. No breaking change to existing `Tool` usage.

---

### 3. Confirmation wired to tool approval

**Issue.** TanStack emits `tool-call` parts with `approval: { id, needsApproval, approved? }` and exposes `addToolApprovalResponse({ id, approved })` on the chat context. Our `<Confirmation>` has the right surface (`ConfirmationAccept`, `ConfirmationReject`, `ConfirmationPending/Approved/Rejected` content slots) but is not pre-wired to that callback — every user has to glue it themselves.

**What we have.** `src/components/ai/confirmation.tsx` with internal state and `onAccept`/`onReject` callbacks. `<Tool>` exists separately.

**Improvement.** A demo showing the canonical wiring: `<Tool state="approval">` containing `<Confirmation>` whose `onAccept`/`onReject` call `addToolApprovalResponse({ id: approval.id, approved })` from `useChatContext()`. No new component — just the pattern, clearly named.

**How.**
- New demo: `src/demos/tool/with-approval.tsx`. Wire `useChat` with `createMockAdapter` from `tanstack-chat/_mock/adapter.ts` running a script that produces a tool-call needing approval. See "Demo strategy".
- When a tool-call part has `approval.needsApproval && approval.approved === undefined`, render `<Tool state="approval">` with `<Confirmation>` inside `<ToolContent>`.
- Pass `approval.id` through `Confirmation`'s callbacks: `onAccept={() => addToolApprovalResponse({ id: approval.id, approved: true })}`.
- Mention this pattern in `src/docs/confirmation.mdx` under a "TanStack AI" section, linking to the demo.

**Expected.** In the demo, clicking Accept calls `addToolApprovalResponse({ id, approved: true })` and the mock stream advances to produce a tool-result; clicking Reject denies and the tool-call settles in a denied state without crashing the stream. `<Confirmation>` swaps from its pending content to the approved/rejected content correctly. No state is duplicated between `Confirmation`'s internal state and the chat client.

---

### 4. Streaming markdown renderer (`markdown` component)

**Issue.** TanStack streams text part `content` incrementally. They ship `markdown-plugins.ts` but no actual renderer; `@tanstack/ai-react-ui`'s `<TextPart>` is plain text. aikit also has no markdown component — `MessageText` renders a plain `<div>`. Every TanStack chat needs streaming markdown (code fences, lists, inline code) and currently every user has to inline `react-markdown` or `streamdown` themselves.

**What we have.** Nothing. `CONVENTIONS.md` explicitly anticipates this: "Heavy renderers are siblings, not internals. `<Markdown>`, `<CodeBlock>`, `<Math>` are first-class kit components."

**Improvement.** A new first-class component family `markdown` that renders incomplete markdown gracefully (does not flicker as fences open/close) and reuses our existing `code-block` for fenced code. Sibling to `Message`, not inside it — so users who don't render markdown don't pay for it.

**How.**
- New file `src/components/ai/markdown.tsx` exporting `Markdown` (and any small subparts like `MarkdownCode` if needed).
- Use `streamdown` (purpose-built for streaming) or `react-markdown` with `remark-gfm`. Lean toward `streamdown` since it solves the half-open-fence problem out of the box.
- For code fences, render via aikit's existing `CodeBlock` rather than a built-in `<pre>`. Pass language through.
- Add `data-slot="markdown"`. No `cva` variants needed initially — typography styling comes from a `prose`-like utility set you already use in `MessageText`.
- Add tokens: nothing new; rely on `text-foreground`, `text-muted-foreground`, `bg-muted` for inline code.
- Demos:
  - `src/demos/markdown/basic.tsx` — paragraph + list + inline code
  - `src/demos/markdown/streaming.tsx` — fake stream that types content char-by-char including an unfinished code fence
  - `src/demos/markdown/with-code.tsx` — multi-language fenced blocks
- Register in `registry.config.ts`.
- Update `src/components/ai/message.tsx` docs to recommend `<Markdown>` inside `<MessageContent>`.

**Expected.** `<Markdown>{content}</Markdown>` renders GFM correctly (headings, lists, tables, inline code, links). Fenced code blocks render through aikit's `<CodeBlock>` with language preserved. The streaming demo types content char-by-char including a multi-line fence and no layout flicker occurs while the fence is half-open. Registry install step adds the chosen dep. Components folder gains exactly one new file (`markdown.tsx`).

**Notes.** Be careful with bundle size — pick one of `streamdown` / `react-markdown` and stick with it. Setup step in `registry.json` should add it as a dep when the user installs `markdown`.

---

### 5. Partial-JSON argument viewer

**Issue.** Tool calls stream the `arguments` field as an incomplete JSON string (TanStack states `input-streaming`). Rendering it raw with `JSON.parse` throws until the stream completes. Users want to see args progressively (e.g. so an "Editing file: src/..." appears the moment the filename token arrives), but doing so requires a partial-JSON parser.

**What we have.** `code-block` can render the raw JSON string but does not understand partial structure. `spec` renders key/value pairs from a complete object.

**Improvement.** A small primitive — likely a new `tool-arguments` part exported from `tool.tsx`, or a `code-block` variant `partial-json` — that:
- Accepts a possibly-incomplete JSON string
- Renders best-effort using a partial-JSON parser
- Shows a subtle "streaming" indicator while incomplete

**How.**
- Add `ToolArguments` export inside `src/components/ai/tool.tsx`. Props: `value: string` (raw JSON string), `state?: "streaming" | "complete"`.
- Use a tiny partial-JSON parser (`partial-json` or `best-effort-json-parser` — ~1KB) to get the most-complete object, fall back to raw string if parse fails entirely.
- Render as a compact key/value list (reuse `spec` styling) with the streaming indicator (a faint pulse on the last value) when `state === "streaming"`.
- Demo `src/demos/tool/streaming-arguments.tsx` — a scripted stream that drips arguments in and shows the viewer updating.
- No SDK types imported.

**Expected.** `<ToolArguments value="{ \"file\":" state="streaming" />` renders the `file` key without throwing. As more JSON tokens arrive, fields appear progressively without remounting (animation of new keys, not full re-render). When `state === "complete"`, the streaming indicator disappears. Feeding a fully malformed string falls back to raw text rather than crashing.

---

### 6. Voice / realtime UI family

**Issue.** TanStack ships `useRealtimeChat`, full voice loop, push-to-talk, transcription. aikit has zero voice surface. This is the biggest visual gap and the most clearly *aikit-shaped* opportunity (the kit is already opinionated about chat-style surfaces).

**What we have.** `transcript` (static), `player` (passive playback). Nothing live.

**Improvement.** A new component family `voice` (or split into `mic-button` + `waveform` + `voice-meter` if they prove independently useful). Covers:
- **Mic button** with three states: `idle | listening | muted`. Tap-to-talk and hold-to-talk modes.
- **Voice activity indicator** (VAD): a waveform or bouncing-dot row driven by an external level value (0..1) the user feeds from their audio context.
- **Realtime status** chip: `connecting | live | reconnecting | ended`.
- **Live caption** strip: shows interim + final transcription text, where interim is greyed.

**How.**
- New file `src/components/ai/voice.tsx` exporting `Voice`, `VoiceMicButton`, `VoiceWaveform`, `VoiceStatus`, `VoiceCaption`.
- Mic button uses Base UI `Toggle` for press state; visuals via `data-state`.
- Waveform: SVG with N bars (default 16), each scaled from a `levels: number[]` prop the user updates externally (do NOT include audio capture inside the component — that belongs to user code).
- Caption: just typography with `data-interim` for the in-progress span.
- Demos:
  - `src/demos/voice/basic.tsx` — mic button cycling through states on click
  - `src/demos/voice/waveform.tsx` — animated waveform driven by a fake level signal
  - `src/demos/voice/realtime.tsx` — full layout (mic + status + caption) wired to the real `useRealtimeChat` against a mock realtime connection (`tanstack-chat/_mock/realtime-adapter.ts`). Audio capture is not invoked; the mock supplies fake interim/final transcription events on a timer. See "Demo strategy".
- Register in `registry.config.ts`.

**Expected.** `VoiceMicButton` cycles through `idle | listening | muted` on click in the basic demo. `VoiceWaveform` animates smoothly when fed a 16-element `levels` array updated at ~30fps. `VoiceStatus` renders four states with appropriate colors. `VoiceCaption` styles interim spans distinctly (muted/italic) from final spans. The realtime demo composes all four with a mocked `useRealtimeChat` and no real microphone access.

**Notes.** Resist capturing audio inside the component. The audio source is application territory (web audio context, OPUS encoding, server endpoint). The component is presentation only.

---

### 7. Agent run container

**Issue.** Agentic flows produce a *run* = (assistant message text) + (sequence of tool calls and results) + (final message). Today users render those as flat parts inside one message, which works but loses the "this is one logical run" framing. There's no container with elapsed time, step count, or run status.

**What we have.** `chain-of-thought` (steps with state), `task` (single task item), `todo` (list with checkboxes). Close, but none of them is "a run".

**Improvement.** A new component `run` (or extend `chain-of-thought`) that wraps a sequence of steps with: title, status chip, elapsed time, optional token/cost meter slot. Collapsible. Each step is a slot users fill — usually with `<Tool>`, sometimes with text.

**How.**
- Prefer extending `chain-of-thought` over adding a new family — they're 80% the same. Add a `Run`/`RunHeader`/`RunMeta` set if `chain-of-thought` doesn't fit cleanly after a real attempt.
- New props: `status?: "running" | "completed" | "failed" | "stopped"`, `elapsed?: string` (user-formatted), `stepCount?: number`.
- Header layout: title + status chip + meta (steps · elapsed · tokens slot).
- Demo `src/demos/chain-of-thought/agent-run.tsx` showing a 3-step run with tool calls.

**Expected.** The demo renders a single run with a header showing title + status chip + step count + elapsed time. The body collapses/expands. Each step slot accepts a `<Tool>` and renders correctly. Existing `chain-of-thought` demos still pass without modification.

---

### 8. Connection status surface

**Issue.** TanStack exposes `ConnectionStatus = "disconnected" | "connecting" | "connected" | "error"`. Users currently improvise with `chip` or `callout`. There's no canonical "you are offline / reconnecting" banner.

**What we have.** `chip` (small status pill), `callout` (banner), `loader` (spinner). All atomic.

**Improvement.** A small composed pattern `connection-status` (could just be a new demo on `chip` + `callout`). Shows the four states with appropriate iconography and accent.

**How.**
- Strong preference: ship this as a demo, not a component. `src/demos/chip/connection-status.tsx` and `src/demos/callout/connection-status.tsx`.
- If real estate matters (e.g. a top banner only appears on `disconnected`/`error`), document the conditional render pattern.
- Only escalate to a real `connection-status.tsx` component if the demo proves it needs shared logic (it shouldn't).

**Expected.** Two demos exist, each showing all four states. No file added under `src/components/ai/`. Pattern is referenced from `src/docs/chip.mdx` (or callout) under a TanStack AI section.

---

### 9. Stop / regenerate composer pattern

**Issue.** While the model is streaming, the composer's send button should toggle to a stop button, calling `stop()` from `useChat()`. After completion, a regenerate affordance often appears next to the last message (`reload()`). aikit has the atoms (`action`, `button`, `composer`) but no canonical wiring.

**What we have.** `composer` with submit handling; `action` for icon buttons; `feedback-bar` for after-message actions.

**Improvement.** Two demos and a short docs note. No new component.

**How.**
- `src/demos/composer/send-stop.tsx` — composer whose submit button switches between Send and Stop icons based on `status === "streaming"`. Clicking Stop calls `stop()`. Wire to real `useChat` + `createMockAdapter` (see "Demo strategy").
- `src/demos/feedback-bar/regenerate.tsx` — last-assistant-message footer with regenerate, copy, thumbs up/down. Regenerate calls `reload()`. Same mock-adapter wiring.
- Mention the pattern in `src/docs/composer.mdx`.

**Expected.** In `send-stop.tsx`, the submit icon swaps to a stop icon while `status === "streaming"` and clicking it interrupts the mock stream. In `regenerate.tsx`, the regenerate action calls `reload()` and the last assistant message is replaced with a new generation. Neither demo introduces a new component.

---

### 10. Media generation progress states

**Issue.** TanStack's `useGenerateImage/Audio/Video` go through `queued | streaming | complete | error` lifecycles. `generated-image` currently assumes the asset is already there.

**What we have.** `src/components/ai/generated-image.tsx` — static media card with toolbar.

**Improvement.** Add an explicit `state` prop and slots: `GeneratedImagePlaceholder`, `GeneratedImageProgress`, `GeneratedImageError`. Same shape as `Confirmation`'s `Pending/Approved/Rejected` content slots — only the matching one renders.

**How.**
- Edit `src/components/ai/generated-image.tsx`: add `state?: "queued" | "generating" | "complete" | "error"` to the root, drive `data-state`.
- Add the three new content components that only render when `data-state` matches (CSS selector based, same trick as `Confirmation`).
- Generating state shows a subtle shimmer overlay over the eventual asset slot; queued shows a placeholder; error shows a callout-like message.
- Demos:
  - `src/demos/generated-image/states.tsx` — all four side-by-side
  - `src/demos/generated-image/streaming.tsx` — auto-cycles queued → generating → complete on a timer

**Expected.** `<GeneratedImage state="...">` renders four visually distinct states. `GeneratedImagePlaceholder`, `GeneratedImageProgress`, `GeneratedImageError` only render when the matching `data-state` is set on the root (CSS-driven, same as `Confirmation`). Pre-existing `generated-image` demos still render correctly without specifying `state`.

---

### 11. Transcription live state

**Issue.** `transcript` is static — designed for after-the-fact transcripts. Live transcription (interim + final tokens) and a recording indicator are missing.

**What we have.** `src/components/ai/transcript.tsx`.

**Improvement.** Add live-state slots without breaking existing usage:
- `TranscriptLine` already exists; add `data-interim` styling for unconfirmed text (italic + muted).
- Add `TranscriptStatus` showing `recording | paused | stopped`, with a pulsing red dot for `recording`.

**How.**
- Edit `src/components/ai/transcript.tsx`.
- Demo `src/demos/transcript/live.tsx` — fake stream of interim tokens that get promoted to final after a delay.

**Expected.** In the live demo, interim text appears in muted italic and is replaced in place by final text without scroll jump. `TranscriptStatus state="recording"` shows a pulsing red dot; `paused` and `stopped` show static neutral colors. Existing static transcript demos continue to render identically.

---

### 12. Event-stream inspector (devtools)

**Issue.** TanStack ships `react-ai-devtools` for the raw event stream. Useful, but it's a separate dev surface. For aikit users debugging integrations, an in-page inspector showing each SSE event as it arrives is invaluable.

**What we have.** `console` (log lines), nothing structured for typed events.

**Improvement.** A `event-inspector` component (or just a demo on `console`) that renders a virtualized list of events with type pill, timestamp, and expandable JSON payload.

**How.**
- Start as a demo on `console`: `src/demos/console/event-inspector.tsx`. If shared logic emerges, extract a small component.
- Each row: `<ConsoleLog>` with a leading type chip and a collapsible JSON body (use existing `code-block`).
- Source events from `useChat({ onChunk })` wired to `createMockAdapter` with a richly-scripted stream so the inspector shows the full event variety. See "Demo strategy".

**Expected.** Demo renders a scrollable feed of events with type pill (color-coded by event type), timestamp, and a collapsible JSON body. New events append at the bottom and auto-scroll if the user is already at the bottom (reuses `Conversation` behavior). Handles a 10 events/sec stream without dropped frames in the playground.

---

### 13. Token / cost meter

**Issue.** Common UI ask for AI apps: show token usage and estimated cost per message or per session. Nothing in aikit covers it.

**What we have.** `chip` for compact stats. Nothing dedicated.

**Improvement.** A small `usage-meter` component: a row of stat pills (input tokens, output tokens, optional $ cost), optionally with a progress bar against a context limit.

**How.**
- New file `src/components/ai/usage-meter.tsx`.
- `UsageMeter` (row container), `UsageStat` (label + value pair), `UsageBar` (filled bar with `value`/`max`).
- Demos:
  - `src/demos/usage-meter/basic.tsx` — three stats
  - `src/demos/usage-meter/with-bar.tsx` — context usage bar
  - `src/demos/usage-meter/per-message.tsx` — small footer on a `<Message>` showing per-call usage

**Expected.** `<UsageMeter>` renders a row of `<UsageStat>` items with consistent spacing. `<UsageBar value max>` clamps correctly at 0% and 100% and visually distinguishes when value exceeds 80% of max. The per-message demo shows the meter sitting unobtrusively in a message footer without changing message layout.

---

### 14. Long-history virtualization

**Issue.** `conversation` handles scroll/stick-to-bottom but renders every message. Beyond ~500 messages, rendering cost is noticeable.

**What we have.** `src/components/ai/conversation.tsx` with full `ConversationContent` rendering its children.

**Improvement.** Don't bake virtualization into the component (it'd force a render-prop API on every user). Instead, ship a demo using `@tanstack/react-virtual` inside `<ConversationContent>` showing the pattern.

**How.**
- Demo `src/demos/conversation/virtualized.tsx` — 5,000 fake messages, virtualized rows, sticks to bottom on new message append.
- Add a docs note in `src/docs/conversation.mdx` linking to the demo and explaining when to virtualize.
- Reconsider component changes only if multiple users hit the same paper cut.

**Expected.** Demo holds 5,000 fake messages, scrolls at 60fps on a mid-range laptop, and sticks to bottom when new messages are appended at the bottom. `conversation.tsx` source is unchanged. Docs page links to the demo.

---

### 15. Full canonical chat demo

**Issue.** Even with items 1–14, there's no single demo that shows the whole TanStack + aikit story end to end. Without it, the "first-class adapter" framing is unbacked.

**What we have.** (After 1 lands) a basic `tanstack-chat/basic.tsx`. Nothing that exercises tools, approval, voice, attachments, markdown, generated media, structured output all in one place.

**Improvement.** `src/demos/tanstack-chat/full.tsx` — a single demo wiring `useChat` with a mock multi-tool agent: one weather tool (auto-approved), one file-write tool (needs approval), one image-generation tool, plus streaming markdown and a thinking part. This is the demo that goes in the README screenshot.

**How.**
- Build after items 1, 2, 3, 4, 10 are done (they're the surfaces this demo uses).
- Reuse `tanstack-chat/_mock/adapter.ts` with the canonical script — no separate mock here. See "Demo strategy" for why we never mock the hook.
- Keep it under ~300 lines — if it grows beyond that, the bridge is too verbose and items 1/2/3 need revisiting.

**Expected.** A single self-contained demo (under ~300 lines, no API keys required) shows: streaming markdown response, a thinking part that auto-collapses, an auto-approved weather tool with a tool-result card, an approval-required file-write tool wired to `<Confirmation>`, and a generated image with state transitions. This is the demo we screenshot for the README.

---

### 16. Cross-cutting notes

**Schema pinning.** TanStack AI is pre-1.0. Each demo's first comment must declare the version it was tested against, e.g. `// tested against @tanstack/ai-react@0.x.y`. When we bump, sweep all demos.

**`body` → `forwardedProps`.** `body` is deprecated. All demos should use `forwardedProps` from day one. Add a `npm` lint or a `grep` check (`rg "\\bbody:" src/demos/tanstack-chat`) in CI when this folder exists.

**AG-UI compatibility.** TanStack's wire protocol is AG-UI. Some users will use AG-UI servers without TanStack's client. Demos should not import anything beyond `@tanstack/ai-react` so the patterns translate (the components don't care either way, but the demos shouldn't pull TanStack-only helpers).

**Optional thin npm package.** Resist for v1. Revisit only if a true bridge utility emerges that can't live as copy-paste (e.g. a non-trivial partial-JSON-aware `renderPart` function used identically by everyone). The whole project's value proposition is copy-paste; an npm package would split the story.

**Memory entry to add when items 1–4 land.** Save a `project` memory: "aikit ships first-class TanStack AI bridge as demos under `src/demos/tanstack-chat`. Components stay SDK-agnostic per CONVENTIONS.md `No data contract` rule. Bridge code is user code by design."

---

### Build order

The 16 items above are reference-ordered, not build-ordered. The order below is **components-first**: polish each leaf in isolation (with non-TanStack demos that need no mock adapter), then wire the bridge, then ship the canonical showcase. Rationale: each intermediate ship is independently useful, and by the time the bridge lands every component already has the visual states it needs.

**Phase 1 — Component polish (no TanStack required).**
1. **Item 4** — streaming markdown (`markdown` component). Biggest perceived-quality jump; needed everywhere. Demo with local `setInterval` typing.
2. **Item 2** — tool-call state mapping. Extends `Tool` with `pending` and `approval` states. Demo passes `state` prop directly.
3. **Item 5** — partial-JSON viewer (`ToolArguments`). Demo grows a JSON string with a timer.
4. **Item 10** — media generation states on `<GeneratedImage>`. Demo cycles states on a timer.

**Phase 2 — Bridge infrastructure.**
5. **Item 1** — basic bridge demo. Ships `src/demos/tanstack-chat/_mock/adapter.ts` (the shared helper everything below reuses) and the `switch(part.type)` reference. Now consumes the already-polished components from Phase 1.
6. **Item 3** — confirmation wired to tool approval. Reuses the mock adapter from item 1 plus `<Tool state="approval">` from item 2.

**Phase 3 — Bridge polish.**
7. **Item 9** — stop / regenerate composer pattern. Two demos against the mock adapter.
8. **Item 12** — event-stream inspector. Mock adapter with a rich script.
9. **Item 13** — token / cost meter. Pure component; useful in Phase 4's canonical demo footer.

**Phase 4 — Canonical showcase.**
10. **Item 15** — full canonical chat demo. The README screenshot. Now genuinely showcases the whole kit.

**Phase 5 — Second-order improvements (by demand).**
11. **Item 7** — agent run container.
12. **Item 8** — connection status surface (demos only).
13. **Item 11** — transcription live state.
14. **Item 14** — long-history virtualization.

**Phase 6 — Big standalone additions.**
15. **Item 6** — voice / realtime UI family. Biggest single addition; do it as its own focused session, not interleaved with anything else.

**Cross-cutting (revisit during every phase).**
- **Item 16** — schema-pinning notes, `forwardedProps` migration, AG-UI compatibility. Not a build item; reread when bumping `@tanstack/ai*` versions.

Phases 1 and 2 are the critical path to a credible "first-class TanStack AI adapter" claim. Everything after Phase 4 is upside.
