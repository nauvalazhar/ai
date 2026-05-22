import ShikiHighlighter from "react-shiki/web";
import {
  Exception,
  ExceptionContent,
  ExceptionFrame,
  ExceptionFrameFunction,
  ExceptionFrameLocation,
  ExceptionFrames,
  ExceptionHeader,
  ExceptionMessage,
  ExceptionSource,
  ExceptionSourceContent,
  ExceptionSourceHeader,
  ExceptionType,
} from "#/components/ai/exception";

const code = `function UserCard({ user }) {
  return (
    <h2>{user.name}</h2>
  );
}`;

const startLine = 25;
const activeLine = 27;

export default function WithSource() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <Exception defaultOpen>
        <ExceptionHeader>
          <ExceptionType>TypeError</ExceptionType>
          <ExceptionMessage>
            Cannot read properties of undefined (reading 'name')
          </ExceptionMessage>
        </ExceptionHeader>

        <ExceptionSource>
          <ExceptionSourceHeader>
            <span>src/components/user-card.tsx</span>
            <span>{activeLine}:18</span>
          </ExceptionSourceHeader>
          <ExceptionSourceContent>
            <ShikiHighlighter
              language="tsx"
              theme={{ light: "github-light", dark: "github-dark" }}
              defaultColor="light"
              addDefaultStyles={false}
              showLanguage={false}
              showLineNumbers
              startingLineNumber={startLine}
              transformers={[
                {
                  line(node, line) {
                    if (startLine + line - 1 === activeLine) {
                      node.properties["data-active"] = "true";
                    }
                  },
                },
              ]}
            >
              {code}
            </ShikiHighlighter>
          </ExceptionSourceContent>
        </ExceptionSource>

        <ExceptionContent>
          <ExceptionFrames>
            <ExceptionFrame active>
              <ExceptionFrameFunction>UserCard</ExceptionFrameFunction>
              <ExceptionFrameLocation>
                src/components/user-card.tsx:27:18
              </ExceptionFrameLocation>
            </ExceptionFrame>
            <ExceptionFrame>
              <ExceptionFrameFunction>Profile</ExceptionFrameFunction>
              <ExceptionFrameLocation>
                src/routes/profile.tsx:12:5
              </ExceptionFrameLocation>
            </ExceptionFrame>
            <ExceptionFrame>
              <ExceptionFrameFunction>App</ExceptionFrameFunction>
              <ExceptionFrameLocation>src/app.tsx:18:3</ExceptionFrameLocation>
            </ExceptionFrame>
            <ExceptionFrame internal>
              <ExceptionFrameFunction>renderWithHooks</ExceptionFrameFunction>
              <ExceptionFrameLocation>
                node_modules/react-dom/cjs/react-dom.development.js:14985:18
              </ExceptionFrameLocation>
            </ExceptionFrame>
          </ExceptionFrames>
        </ExceptionContent>
      </Exception>
    </div>
  );
}
