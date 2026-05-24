import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type DemoEntry = {
  name: string;
  slug: string;
  Component: LazyExoticComponent<ComponentType>;
};

export type ComponentEntry = {
  name: string;
  slug: string;
  demos: DemoEntry[];
};

export type Group = {
  title: string;
  components: ComponentEntry[];
};

export const registry: Group[] = [
  {
    title: "Components",
    components: [
      {
        name: "Conversation",
        slug: "conversation",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/conversation/basic")),
          },
          {
            name: "Long",
            slug: "long",
            Component: lazy(() => import("#/demos/conversation/long")),
          },
          {
            name: "Streaming",
            slug: "streaming",
            Component: lazy(() => import("#/demos/conversation/streaming")),
          },
          {
            name: "Custom Button",
            slug: "custom-button",
            Component: lazy(() => import("#/demos/conversation/custom-button")),
          },
          {
            name: "Scroll Area",
            slug: "scroll-area",
            Component: lazy(() => import("#/demos/conversation/scroll-area")),
          },
        ],
      },
      {
        name: "Message",
        slug: "message",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/message/basic")),
          },
          {
            name: "Avatar",
            slug: "avatar",
            Component: lazy(() => import("#/demos/message/avatar")),
          },
          {
            name: "Actions",
            slug: "actions",
            Component: lazy(() => import("#/demos/message/actions")),
          },
          {
            name: "Full",
            slug: "full",
            Component: lazy(() => import("#/demos/message/full")),
          },
          {
            name: "Markdown",
            slug: "markdown",
            Component: lazy(() => import("#/demos/message/markdown")),
          },
        ],
      },
      {
        name: "Loader",
        slug: "loader",
        demos: [
          {
            name: "Pulse",
            slug: "pulse",
            Component: lazy(() => import("#/demos/loader/pulse")),
          },
          {
            name: "Shimmer",
            slug: "shimmer",
            Component: lazy(() => import("#/demos/loader/shimmer")),
          },
          {
            name: "Dots",
            slug: "dots",
            Component: lazy(() => import("#/demos/loader/dots")),
          },
          {
            name: "Combined",
            slug: "combined",
            Component: lazy(() => import("#/demos/loader/combined")),
          },
          {
            name: "Sizes",
            slug: "sizes",
            Component: lazy(() => import("#/demos/loader/sizes")),
          },
          {
            name: "Colors",
            slug: "colors",
            Component: lazy(() => import("#/demos/loader/colors")),
          },
          {
            name: "Tuning",
            slug: "tuning",
            Component: lazy(() => import("#/demos/loader/tuning")),
          },
        ],
      },
      {
        name: "Code Block",
        slug: "code-block",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/code-block/basic")),
          },
          {
            name: "Bare",
            slug: "bare",
            Component: lazy(() => import("#/demos/code-block/bare")),
          },
          {
            name: "Actions",
            slug: "actions",
            Component: lazy(() => import("#/demos/code-block/actions")),
          },
          {
            name: "Syntax",
            slug: "syntax",
            Component: lazy(() => import("#/demos/code-block/syntax")),
          },
          {
            name: "Terminal",
            slug: "terminal",
            Component: lazy(() => import("#/demos/code-block/terminal")),
          },
          {
            name: "Clip",
            slug: "clip",
            Component: lazy(() => import("#/demos/code-block/clip")),
          },
        ],
      },
      {
        name: "Reasoning",
        slug: "reasoning",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/reasoning/basic")),
          },
          {
            name: "Streaming",
            slug: "streaming",
            Component: lazy(() => import("#/demos/reasoning/streaming")),
          },
        ],
      },
      {
        name: "Chain Of Thought",
        slug: "chain-of-thought",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/chain-of-thought/basic")),
          },
          {
            name: "Streaming",
            slug: "streaming",
            Component: lazy(() => import("#/demos/chain-of-thought/streaming")),
          },
        ],
      },
      {
        name: "Task",
        slug: "task",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/task/basic")),
          },
          {
            name: "Streaming",
            slug: "streaming",
            Component: lazy(() => import("#/demos/task/streaming")),
          },
        ],
      },
      {
        name: "Todo",
        slug: "todo",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/todo/basic")),
          },
          {
            name: "Streaming",
            slug: "streaming",
            Component: lazy(() => import("#/demos/todo/streaming")),
          },
        ],
      },
      {
        name: "Action",
        slug: "action",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/action/basic")),
          },
          {
            name: "Code",
            slug: "code",
            Component: lazy(() => import("#/demos/action/code")),
          },
        ],
      },
      {
        name: "Callout",
        slug: "callout",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/callout/basic")),
          },
        ],
      },
      {
        name: "Citation",
        slug: "citation",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/citation/basic")),
          },
          {
            name: "Single",
            slug: "single",
            Component: lazy(() => import("#/demos/citation/single")),
          },
          {
            name: "Excerpt",
            slug: "excerpt",
            Component: lazy(() => import("#/demos/citation/excerpt")),
          },
        ],
      },
      {
        name: "Attachment",
        slug: "attachment",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/attachment/basic")),
          },
          {
            name: "Card",
            slug: "card",
            Component: lazy(() => import("#/demos/attachment/card")),
          },
          {
            name: "Uploading",
            slug: "uploading",
            Component: lazy(() => import("#/demos/attachment/uploading")),
          },
          {
            name: "With Actions",
            slug: "with-actions",
            Component: lazy(() => import("#/demos/attachment/with-actions")),
          },
          {
            name: "Mixed",
            slug: "mixed",
            Component: lazy(() => import("#/demos/attachment/mixed")),
          },
          {
            name: "Interactive",
            slug: "interactive",
            Component: lazy(() => import("#/demos/attachment/interactive")),
          },
        ],
      },
      {
        name: "Uploader",
        slug: "uploader",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/uploader/basic")),
          },
          {
            name: "Dropzone",
            slug: "dropzone",
            Component: lazy(() => import("#/demos/uploader/dropzone")),
          },
          {
            name: "Avatar",
            slug: "avatar",
            Component: lazy(() => import("#/demos/uploader/avatar")),
          },
          {
            name: "Composer",
            slug: "composer",
            Component: lazy(() => import("#/demos/uploader/composer")),
          },
          {
            name: "Persisted",
            slug: "persisted",
            Component: lazy(() => import("#/demos/uploader/persisted")),
          },
        ],
      },
      {
        name: "Generated Image",
        slug: "generated-image",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/generated-image/basic")),
          },
          {
            name: "States",
            slug: "states",
            Component: lazy(() => import("#/demos/generated-image/states")),
          },
          {
            name: "Streaming",
            slug: "streaming",
            Component: lazy(() => import("#/demos/generated-image/streaming")),
          },
          {
            name: "Generating",
            slug: "generating",
            Component: lazy(() => import("#/demos/generated-image/generating")),
          },
          {
            name: "Overlay Bottom",
            slug: "overlay-bottom",
            Component: lazy(
              () => import("#/demos/generated-image/overlay-bottom"),
            ),
          },
        ],
      },
      {
        name: "Document",
        slug: "document",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/document/basic")),
          },
          {
            name: "External Trigger",
            slug: "external-trigger",
            Component: lazy(() => import("#/demos/document/external-trigger")),
          },
        ],
      },
      {
        name: "Composer",
        slug: "composer",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/composer/basic")),
          },
          {
            name: "Multiline",
            slug: "multiline",
            Component: lazy(() => import("#/demos/composer/multiline")),
          },
          {
            name: "Controlled",
            slug: "controlled",
            Component: lazy(() => import("#/demos/composer/controlled")),
          },
        ],
      },
      {
        name: "Composer Rich",
        slug: "composer-rich",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/composer-rich/basic")),
          },
          {
            name: "Mentions",
            slug: "mentions",
            Component: lazy(() => import("#/demos/composer-rich/mentions")),
          },
          {
            name: "Submenu",
            slug: "submenu",
            Component: lazy(() => import("#/demos/composer-rich/submenu")),
          },
          {
            name: "Async",
            slug: "async",
            Component: lazy(() => import("#/demos/composer-rich/async")),
          },
          {
            name: "Groups",
            slug: "groups",
            Component: lazy(() => import("#/demos/composer-rich/groups")),
          },
          {
            name: "Custom Data",
            slug: "custom-data",
            Component: lazy(() => import("#/demos/composer-rich/custom-data")),
          },
          {
            name: "Controlled",
            slug: "controlled",
            Component: lazy(() => import("#/demos/composer-rich/controlled")),
          },
        ],
      },
      {
        name: "Prompt",
        slug: "prompt",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/prompt/basic")),
          },
          {
            name: "With Other",
            slug: "with-other",
            Component: lazy(() => import("#/demos/prompt/with-other")),
          },
          {
            name: "Multi Step",
            slug: "multi-step",
            Component: lazy(() => import("#/demos/prompt/multi-step")),
          },
        ],
      },
      {
        name: "Confirmation",
        slug: "confirmation",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/confirmation/basic")),
          },
          {
            name: "With Content",
            slug: "with-content",
            Component: lazy(() => import("#/demos/confirmation/with-content")),
          },
          {
            name: "Danger",
            slug: "danger",
            Component: lazy(() => import("#/demos/confirmation/danger")),
          },
          {
            name: "Controlled",
            slug: "controlled",
            Component: lazy(() => import("#/demos/confirmation/controlled")),
          },
          {
            name: "SQL Query",
            slug: "sql-query",
            Component: lazy(() => import("#/demos/confirmation/sql-query")),
          },
        ],
      },
      {
        name: "Tool",
        slug: "tool",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/tool/basic")),
          },
          {
            name: "States",
            slug: "states",
            Component: lazy(() => import("#/demos/tool/states")),
          },
          {
            name: "Error",
            slug: "error",
            Component: lazy(() => import("#/demos/tool/error")),
          },
          {
            name: "Syntax",
            slug: "syntax",
            Component: lazy(() => import("#/demos/tool/syntax")),
          },
          {
            name: "Approval",
            slug: "approval",
            Component: lazy(() => import("#/demos/tool/approval")),
          },
          {
            name: "Multiple",
            slug: "multiple",
            Component: lazy(() => import("#/demos/tool/multiple")),
          },
        ],
      },
      {
        name: "Suggestion",
        slug: "suggestion",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/suggestion/basic")),
          },
          {
            name: "Column",
            slug: "column",
            Component: lazy(() => import("#/demos/suggestion/column")),
          },
          {
            name: "List",
            slug: "list",
            Component: lazy(() => import("#/demos/suggestion/list")),
          },
          {
            name: "With Icon",
            slug: "with-icon",
            Component: lazy(() => import("#/demos/suggestion/with-icon")),
          },
          {
            name: "With Composer",
            slug: "with-composer",
            Component: lazy(() => import("#/demos/suggestion/with-composer")),
          },
        ],
      },
      {
        name: "Model Selector",
        slug: "model-selector",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/model-selector/basic")),
          },
          {
            name: "Popover",
            slug: "popover",
            Component: lazy(() => import("#/demos/model-selector/popover")),
          },
          {
            name: "Dialog",
            slug: "dialog",
            Component: lazy(() => import("#/demos/model-selector/dialog")),
          },
        ],
      },
      {
        name: "Feedback Bar",
        slug: "feedback-bar",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/feedback-bar/basic")),
          },
        ],
      },
      {
        name: "Selection",
        slug: "selection",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/selection/basic")),
          },
          {
            name: "Message Composer",
            slug: "message-composer",
            Component: lazy(
              () => import("#/demos/selection/message-composer"),
            ),
          },
          {
            name: "Long Text",
            slug: "long-text",
            Component: lazy(() => import("#/demos/selection/long-text")),
          },
        ],
      },
      {
        name: "Transcript",
        slug: "transcript",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/transcript/basic")),
          },
          {
            name: "Video",
            slug: "video",
            Component: lazy(() => import("#/demos/transcript/video")),
          },
          {
            name: "Custom Scroll",
            slug: "custom-scroll",
            Component: lazy(() => import("#/demos/transcript/custom-scroll")),
          },
          {
            name: "Word Highlight",
            slug: "word-highlight",
            Component: lazy(() => import("#/demos/transcript/word-highlight")),
          },
          {
            name: "Waveform",
            slug: "waveform",
            Component: lazy(() => import("#/demos/transcript/waveform")),
          },
        ],
      },
      {
        name: "Web Preview",
        slug: "web-preview",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/web-preview/basic")),
          },
          {
            name: "With Console",
            slug: "with-console",
            Component: lazy(() => import("#/demos/web-preview/with-console")),
          },
        ],
      },
      {
        name: "Console",
        slug: "console",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/console/basic")),
          },
        ],
      },
      {
        name: "Exception",
        slug: "exception",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/exception/basic")),
          },
          {
            name: "With Source",
            slug: "with-source",
            Component: lazy(() => import("#/demos/exception/with-source")),
          },
          {
            name: "Collapsed",
            slug: "collapsed",
            Component: lazy(() => import("#/demos/exception/collapsed")),
          },
          {
            name: "From Error",
            slug: "from-error",
            Component: lazy(() => import("#/demos/exception/from-error")),
          },
          {
            name: "Chained",
            slug: "chained",
            Component: lazy(() => import("#/demos/exception/chained")),
          },
        ],
      },
      {
        name: "Env",
        slug: "env",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/env/basic")),
          },
          {
            name: "Toggle",
            slug: "toggle",
            Component: lazy(() => import("#/demos/env/toggle")),
          },
          {
            name: "Controlled",
            slug: "controlled",
            Component: lazy(() => import("#/demos/env/controlled")),
          },
        ],
      },
      {
        name: "Sandbox",
        slug: "sandbox",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/sandbox/basic")),
          },
          {
            name: "Collapsed",
            slug: "collapsed",
            Component: lazy(() => import("#/demos/sandbox/collapsed")),
          },
          {
            name: "Run",
            slug: "run",
            Component: lazy(() => import("#/demos/sandbox/run")),
          },
          {
            name: "Error",
            slug: "error",
            Component: lazy(() => import("#/demos/sandbox/error")),
          },
          {
            name: "Streaming",
            slug: "streaming",
            Component: lazy(() => import("#/demos/sandbox/streaming")),
          },
          {
            name: "Code Mode",
            slug: "code-mode",
            Component: lazy(() => import("#/demos/sandbox/code-mode")),
          },
        ],
      },
      {
        name: "File Tree",
        slug: "file-tree",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/file-tree/basic")),
          },
          {
            name: "Recursive",
            slug: "recursive",
            Component: lazy(() => import("#/demos/file-tree/recursive")),
          },
          {
            name: "Highlight",
            slug: "highlight",
            Component: lazy(() => import("#/demos/file-tree/highlight")),
          },
          {
            name: "Guides",
            slug: "guides",
            Component: lazy(() => import("#/demos/file-tree/guides")),
          },
          {
            name: "Controlled",
            slug: "controlled",
            Component: lazy(() => import("#/demos/file-tree/controlled")),
          },
          {
            name: "Rename",
            slug: "rename",
            Component: lazy(() => import("#/demos/file-tree/rename")),
          },
          {
            name: "Collapse All",
            slug: "collapse-all",
            Component: lazy(() => import("#/demos/file-tree/collapse-all")),
          },
          {
            name: "Full",
            slug: "full",
            Component: lazy(() => import("#/demos/file-tree/full")),
          },
        ],
      },
      {
        name: "Diff",
        slug: "diff",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/diff/basic")),
          },
          {
            name: "From To",
            slug: "from-to",
            Component: lazy(() => import("#/demos/diff/from-to")),
          },
          {
            name: "Patch",
            slug: "patch",
            Component: lazy(() => import("#/demos/diff/patch")),
          },
          {
            name: "Multi File",
            slug: "multi-file",
            Component: lazy(() => import("#/demos/diff/multi-file")),
          },
          {
            name: "Word Level",
            slug: "word-level",
            Component: lazy(() => import("#/demos/diff/word-level")),
          },
          {
            name: "Streaming",
            slug: "streaming",
            Component: lazy(() => import("#/demos/diff/streaming")),
          },
        ],
      },
      {
        name: "Diff Rich",
        slug: "diff-rich",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/diff-rich/basic")),
          },
          {
            name: "From To",
            slug: "from-to",
            Component: lazy(() => import("#/demos/diff-rich/from-to")),
          },
          {
            name: "Patch",
            slug: "patch",
            Component: lazy(() => import("#/demos/diff-rich/patch")),
          },
          {
            name: "Multi File",
            slug: "multi-file",
            Component: lazy(() => import("#/demos/diff-rich/multi-file")),
          },
          {
            name: "Long File",
            slug: "long-file",
            Component: lazy(() => import("#/demos/diff-rich/long-file")),
          },
        ],
      },
      {
        name: "Source",
        slug: "source",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/source/basic")),
          },
          {
            name: "Card",
            slug: "card",
            Component: lazy(() => import("#/demos/source/card")),
          },
          {
            name: "With Thumbnail",
            slug: "with-thumbnail",
            Component: lazy(() => import("#/demos/source/with-thumbnail")),
          },
          {
            name: "Minimal",
            slug: "minimal",
            Component: lazy(() => import("#/demos/source/minimal")),
          },
        ],
      },
    ],
  },
  {
    title: "Utilities",
    components: [
      {
        name: "Button",
        slug: "button",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/button/basic")),
          },
          {
            name: "With Icon",
            slug: "with-icon",
            Component: lazy(() => import("#/demos/button/with-icon")),
          },
          {
            name: "Icon Only",
            slug: "icon-only",
            Component: lazy(() => import("#/demos/button/icon-only")),
          },
          {
            name: "Loading",
            slug: "loading",
            Component: lazy(() => import("#/demos/button/loading")),
          },
        ],
      },
      {
        name: "Chip",
        slug: "chip",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/chip/basic")),
          },
          {
            name: "Interactive",
            slug: "interactive",
            Component: lazy(() => import("#/demos/chip/interactive")),
          },
        ],
      },
      {
        name: "Spec",
        slug: "spec",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/spec/basic")),
          },
        ],
      },
      {
        name: "Tooltip",
        slug: "tooltip",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/tooltip/basic")),
          },
        ],
      },
      {
        name: "Menu",
        slug: "menu",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/menu/basic")),
          },
          {
            name: "Group",
            slug: "group",
            Component: lazy(() => import("#/demos/menu/group")),
          },
          {
            name: "Radio",
            slug: "radio",
            Component: lazy(() => import("#/demos/menu/radio")),
          },
          {
            name: "Checkbox",
            slug: "checkbox",
            Component: lazy(() => import("#/demos/menu/checkbox")),
          },
          {
            name: "Nested",
            slug: "nested",
            Component: lazy(() => import("#/demos/menu/nested")),
          },
        ],
      },
      {
        name: "Select",
        slug: "select",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/select/basic")),
          },
          {
            name: "Group",
            slug: "group",
            Component: lazy(() => import("#/demos/select/group")),
          },
          {
            name: "Icon",
            slug: "icon",
            Component: lazy(() => import("#/demos/select/icon")),
          },
          {
            name: "Multiple",
            slug: "multiple",
            Component: lazy(() => import("#/demos/select/multiple")),
          },
          {
            name: "Disabled",
            slug: "disabled",
            Component: lazy(() => import("#/demos/select/disabled")),
          },
        ],
      },
      {
        name: "Player",
        slug: "player",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/player/basic")),
          },
          {
            name: "Waveform",
            slug: "waveform",
            Component: lazy(() => import("#/demos/player/waveform")),
          },
          {
            name: "Video",
            slug: "video",
            Component: lazy(() => import("#/demos/player/video")),
          },
          {
            name: "YouTube",
            slug: "youtube",
            Component: lazy(() => import("#/demos/player/youtube")),
          },
        ],
      },
      {
        name: "Popover",
        slug: "popover",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/popover/basic")),
          },
        ],
      },
      {
        name: "Switch",
        slug: "switch",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/switch/basic")),
          },
        ],
      },
      {
        name: "Scroll Area",
        slug: "scroll-area",
        demos: [
          {
            name: "Basic",
            slug: "basic",
            Component: lazy(() => import("#/demos/scroll-area/basic")),
          },
        ],
      },
    ],
  },
];
