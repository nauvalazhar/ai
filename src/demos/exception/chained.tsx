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

export default function Chained() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-2 p-6">
      <Exception defaultOpen>
        <ExceptionHeader>
          <ExceptionType>QueryFailedError</ExceptionType>
          <ExceptionMessage>
            Failed to load user profile for id "u_4f21"
          </ExceptionMessage>
        </ExceptionHeader>
        <ExceptionContent>
          <ExceptionFrames>
            <ExceptionFrame active>
              <ExceptionFrameFunction>loadProfile</ExceptionFrameFunction>
              <ExceptionFrameLocation>
                src/server/profile.ts:18:11
              </ExceptionFrameLocation>
            </ExceptionFrame>
            <ExceptionFrame>
              <ExceptionFrameFunction>profileLoader</ExceptionFrameFunction>
              <ExceptionFrameLocation>
                src/routes/profile.tsx:8:22
              </ExceptionFrameLocation>
            </ExceptionFrame>
          </ExceptionFrames>
        </ExceptionContent>
      </Exception>

      <div className="px-4 text-xs text-muted-foreground">Caused by</div>

      <Exception defaultOpen>
        <ExceptionHeader>
          <ExceptionType>ConnectionError</ExceptionType>
          <ExceptionMessage>
            ECONNREFUSED 127.0.0.1:5432 after 3 retries
          </ExceptionMessage>
        </ExceptionHeader>
        <ExceptionContent>
          <ExceptionFrames>
            <ExceptionFrame active>
              <ExceptionFrameFunction>connect</ExceptionFrameFunction>
              <ExceptionFrameLocation>
                src/db/pool.ts:104:7
              </ExceptionFrameLocation>
            </ExceptionFrame>
            <ExceptionFrame>
              <ExceptionFrameFunction>query</ExceptionFrameFunction>
              <ExceptionFrameLocation>
                src/db/pool.ts:62:14
              </ExceptionFrameLocation>
            </ExceptionFrame>
            <ExceptionFrame internal>
              <ExceptionFrameFunction>
                processTicksAndRejections
              </ExceptionFrameFunction>
              <ExceptionFrameLocation>
                node:internal/process/task_queues:96:5
              </ExceptionFrameLocation>
            </ExceptionFrame>
          </ExceptionFrames>
        </ExceptionContent>
      </Exception>
    </div>
  );
}
