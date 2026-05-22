import {
  Exception,
  ExceptionContent,
  ExceptionFrame,
  ExceptionFrameFunction,
  ExceptionFrameLocation,
  ExceptionFrames,
  ExceptionHeader,
  ExceptionMessage,
  ExceptionType,
} from "#/components/ai/exception";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <Exception defaultOpen>
        <ExceptionHeader>
          <ExceptionType>TypeError</ExceptionType>
          <ExceptionMessage>
            Cannot read properties of undefined (reading 'name')
          </ExceptionMessage>
        </ExceptionHeader>
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
            <ExceptionFrame internal>
              <ExceptionFrameFunction>
                updateFunctionComponent
              </ExceptionFrameFunction>
              <ExceptionFrameLocation>
                node_modules/react-dom/cjs/react-dom.development.js:17356:20
              </ExceptionFrameLocation>
            </ExceptionFrame>
          </ExceptionFrames>
        </ExceptionContent>
      </Exception>
    </div>
  );
}
