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
