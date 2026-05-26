import { createFileRoute } from "@tanstack/react-router";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";

const COOKIE = "anthropic_api_key";

function options(request: Request) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: new URL(request.url).protocol === "https:",
  };
}

export const Route = createFileRoute("/api/tanstack-ai-key")({
  server: {
    handlers: {
      GET: () => Response.json({ hasKey: Boolean(getCookie(COOKIE)) }),
      POST: async ({ request }) => {
        const { apiKey } = (await request.json()) as { apiKey?: string };
        if (!apiKey || !apiKey.startsWith("sk-ant-")) {
          return new Response("Key should start with sk-ant-", { status: 400 });
        }

        const verify = await fetch("https://api.anthropic.com/v1/models", {
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
        });
        if (!verify.ok) {
          const msg =
            verify.status === 401
              ? "Anthropic rejected this key"
              : `Could not verify key (status ${verify.status})`;
          return new Response(msg, { status: 400 });
        }

        setCookie(COOKIE, apiKey, { ...options(request), maxAge: 2592000 });
        return new Response(null, { status: 204 });
      },
      DELETE: ({ request }) => {
        deleteCookie(COOKIE, options(request));
        return new Response(null, { status: 204 });
      },
    },
  },
});
