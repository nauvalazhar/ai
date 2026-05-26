import { createFileRoute } from "@tanstack/react-router";

const COOKIE = "anthropic_api_key";

function attrs(request: Request) {
  const secure = new URL(request.url).protocol === "https:" ? "Secure; " : "";
  return `HttpOnly; ${secure}SameSite=Lax; Path=/`;
}

export const Route = createFileRoute("/api/tanstack-ai-key")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const has = (request.headers.get("cookie") ?? "")
          .split(";")
          .some((p) => p.trim().startsWith(`${COOKIE}=`));
        return Response.json({ hasKey: has });
      },
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

        return new Response(null, {
          status: 204,
          headers: {
            "Set-Cookie": `${COOKIE}=${encodeURIComponent(apiKey)}; ${attrs(request)}; Max-Age=2592000`,
          },
        });
      },
      DELETE: ({ request }) =>
        new Response(null, {
          status: 204,
          headers: {
            "Set-Cookie": `${COOKIE}=; ${attrs(request)}; Max-Age=0`,
          },
        }),
    },
  },
});
