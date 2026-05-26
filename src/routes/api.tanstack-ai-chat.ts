import { createFileRoute } from "@tanstack/react-router";
import { getCookie } from "@tanstack/react-start/server";
import {
  chat,
  chatParamsFromRequest,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { createAnthropicChat } from "@tanstack/ai-anthropic";

export const Route = createFileRoute("/api/tanstack-ai-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = getCookie("anthropic_api_key");
        if (!apiKey) {
          return new Response("Set your Anthropic API key first", {
            status: 401,
          });
        }

        const params = await chatParamsFromRequest(request);
        const abortController = new AbortController();
        request.signal.addEventListener("abort", () => abortController.abort());

        const stream = chat({
          adapter: createAnthropicChat("claude-sonnet-4-6", apiKey),
          maxTokens: 8192,
          modelOptions: {
            thinking: {
              type: "enabled",
              budget_tokens: 4096,
            },
          },
          abortController,
          ...params,
        });

        return toServerSentEventsResponse(stream, { abortController });
      },
    },
  },
});
