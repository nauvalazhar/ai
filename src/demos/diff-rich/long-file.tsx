import {
  Diff,
  DiffContent,
  DiffHeader,
  DiffTitle,
} from "#/components/ai/diff";
import { DiffRichFile } from "#/components/ai/diff-rich";

const before = `import express from "express";
import cors from "cors";
import { logger } from "./logger";
import { auth } from "./middleware/auth";
import { rateLimit } from "./middleware/rate-limit";
import { db } from "./db";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(logger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/users", auth, async (_req, res) => {
  const users = await db.users.findMany();
  res.json(users);
});

app.get("/api/users/:id", auth, async (req, res) => {
  const user = await db.users.findUnique({
    where: { id: req.params.id },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user);
});

app.post("/api/users", auth, async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email" });
  }
  const user = await db.users.create({
    data: { name, email },
  });
  res.status(201).json(user);
});

app.patch("/api/users/:id", auth, async (req, res) => {
  const user = await db.users.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(user);
});

app.delete("/api/users/:id", auth, async (req, res) => {
  await db.users.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

app.get("/api/posts", async (_req, res) => {
  const posts = await db.posts.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json(posts);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log("listening on " + port);
});
`;

const after = `import express from "express";
import cors from "cors";
import { logger } from "./logger";
import { auth } from "./middleware/auth";
import { rateLimit } from "./middleware/rate-limit";
import { db } from "./db";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(rateLimit({ window: 60, max: 100 }));
app.use(logger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/users", auth, async (_req, res) => {
  const users = await db.users.findMany();
  res.json(users);
});

app.get("/api/users/:id", auth, async (req, res) => {
  const user = await db.users.findUnique({
    where: { id: req.params.id },
    include: { posts: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user);
});

app.post("/api/users", auth, async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email" });
  }
  const user = await db.users.create({
    data: { name, email },
  });
  res.status(201).json(user);
});

app.patch("/api/users/:id", auth, async (req, res) => {
  const user = await db.users.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(user);
});

app.delete("/api/users/:id", auth, async (req, res) => {
  await db.users.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

app.get("/api/posts", async (_req, res) => {
  const posts = await db.posts.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json(posts);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(\`server ready on http://localhost:\${port}\`);
  console.log("press ctrl+c to stop");
});
`;

export default function LongFile() {
  return (
    <div className="mx-auto max-w-2xl">
      <Diff>
        <DiffHeader>
          <DiffTitle>1 file changed</DiffTitle>
        </DiffHeader>
        <DiffContent>
          <DiffRichFile from={before} to={after} filename="server.ts" />
        </DiffContent>
      </Diff>
    </div>
  );
}
