import { createFileRoute } from "@tanstack/react-router";
import {
  chat,
  chatParamsFromRequest,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { createAnthropicChat } from "@tanstack/ai-anthropic";

function readCookie(header: string | null, name: string) {
  if (!header) return undefined;
  for (const pair of header.split(";")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    if (pair.slice(0, eq).trim() === name) {
      return decodeURIComponent(pair.slice(eq + 1).trim());
    }
  }
}

export const Route = createFileRoute("/api/tanstack-ai-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = readCookie(
          request.headers.get("cookie"),
          "anthropic_api_key",
        );
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
            // thinking: {
            //   type: "enabled",
            //   budget_tokens: 4096,
            // },
          },
          abortController,
          ...params,
        });

        return toServerSentEventsResponse(stream, { abortController });
      },
    },
  },
});
