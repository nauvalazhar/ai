import {
  Exception,
  ExceptionAction,
  ExceptionContent,
  ExceptionFrame,
  ExceptionFrameFunction,
  ExceptionFrameLocation,
  ExceptionFrames,
  ExceptionHeader,
  ExceptionMessage,
  ExceptionTrigger,
  ExceptionType,
} from "#/components/ai/exception";

export default function Collapsed() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <Exception>
        <ExceptionHeader>
          <ExceptionType>ReferenceError</ExceptionType>
          <ExceptionMessage>fetchUser is not defined</ExceptionMessage>
          <ExceptionAction>
            <ExceptionTrigger>
              <span className="group-data-open/exception:hidden text-xs">
                Show stack
              </span>
              <span className="hidden group-data-open/exception:inline text-xs">
                Hide stack
              </span>
            </ExceptionTrigger>
          </ExceptionAction>
        </ExceptionHeader>
        <ExceptionContent>
          <ExceptionFrames>
            <ExceptionFrame active>
              <ExceptionFrameFunction>loadProfile</ExceptionFrameFunction>
              <ExceptionFrameLocation>
                src/api/profile.ts:42:18
              </ExceptionFrameLocation>
            </ExceptionFrame>
            <ExceptionFrame>
              <ExceptionFrameFunction>handleSubmit</ExceptionFrameFunction>
              <ExceptionFrameLocation>
                src/routes/login.tsx:88:5
              </ExceptionFrameLocation>
            </ExceptionFrame>
            <ExceptionFrame>
              <ExceptionFrameFunction>onClick</ExceptionFrameFunction>
              <ExceptionFrameLocation>
                src/routes/login.tsx:114:9
              </ExceptionFrameLocation>
            </ExceptionFrame>
          </ExceptionFrames>
        </ExceptionContent>
      </Exception>
    </div>
  );
}
