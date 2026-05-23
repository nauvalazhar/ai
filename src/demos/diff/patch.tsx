import {
  Diff,
  DiffContent,
  DiffFile,
  DiffFileHeader,
  DiffFileName,
  DiffFilePanel,
  DiffHeader,
  DiffRow,
  DiffStat,
  DiffTitle,
  useDiff,
} from "#/components/ai/diff";

const patch = `--- a/server.ts
+++ b/server.ts
@@ -3,7 +3,7 @@ import { handler } from "./handler";

 const app = express();

-app.use(express.json({ limit: "1mb" }));
+app.use(express.json({ limit: "10mb" }));

 app.get("/health", (_req, res) => {
   res.json({ status: "ok" });
@@ -18,5 +18,6 @@ app.post("/api/chat", handler);

 const port = process.env.PORT ?? 3000;
 app.listen(port, () => {
-  console.log("listening on " + port);
+  console.log(\`server ready on http://localhost:\${port}\`);
+  console.log("press ctrl+c to stop");
 });
`;

export default function Patch() {
  const { name, lines, additions, removals } = useDiff({ patch });

  return (
    <div className="mx-auto max-w-2xl">
      <Diff>
        <DiffHeader>
          <DiffTitle>1 file changed</DiffTitle>
        </DiffHeader>
        <DiffContent>
          <DiffFile>
            <DiffFileHeader>
              <DiffFileName>{name}</DiffFileName>
              <DiffStat kind="added">+{additions}</DiffStat>
              <DiffStat kind="removed">-{removals}</DiffStat>
            </DiffFileHeader>
            <DiffFilePanel>
              {lines.map((entry) => (
                <DiffRow key={entry.key} entry={entry} />
              ))}
            </DiffFilePanel>
          </DiffFile>
        </DiffContent>
      </Diff>
    </div>
  );
}
