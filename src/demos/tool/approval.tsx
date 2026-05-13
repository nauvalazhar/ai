import { ShieldAlertIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ai/button";
import {
  Confirmation,
  ConfirmationAccept,
  ConfirmationAction,
  ConfirmationHeader,
  ConfirmationIcon,
  ConfirmationPending,
  ConfirmationReject,
  ConfirmationTitle,
} from "#/components/ai/confirmation";
import {
  Tool,
  ToolBlock,
  ToolContent,
  ToolError,
  ToolIcon,
  ToolLabel,
  ToolName,
  ToolSubtitle,
  ToolTrigger,
} from "#/components/ai/tool";

const input = `{
  "path": "/var/log/old/*.log",
  "recursive": true
}`;

const output = `{
  "deleted": 12,
  "freed": "284 MB"
}`;

type Phase = "awaiting" | "executing" | "success" | "error";

const TOOL_STATE: Record<Phase, "running" | "success" | "error"> = {
  awaiting: "running",
  executing: "running",
  success: "success",
  error: "error",
};

const LABEL: Record<Phase, string> = {
  awaiting: "waiting for approval",
  executing: "running",
  success: "12 files deleted",
  error: "cancelled",
};

export default function Approval() {
  const [phase, setPhase] = useState<Phase>("awaiting");

  function onConfirmation(state: "pending" | "approved" | "rejected") {
    if (state === "approved") {
      setPhase("executing");
      setTimeout(() => setPhase("success"), 1200);
    }
    if (state === "rejected") {
      setPhase("error");
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <Tool state={TOOL_STATE[phase]} defaultOpen>
        <ToolTrigger>
          <ToolIcon>
            <Trash2Icon />
          </ToolIcon>
          <ToolName>delete_files</ToolName>
          <ToolLabel>{LABEL[phase]}</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{input}</ToolBlock>

          {phase === "awaiting" && (
            <Confirmation
              defaultState="pending"
              tone="danger"
              onStateChange={onConfirmation}
            >
              <ConfirmationHeader>
                <ConfirmationIcon>
                  <ShieldAlertIcon />
                </ConfirmationIcon>
                <ConfirmationTitle>
                  Delete 12 files matching this pattern?
                </ConfirmationTitle>
              </ConfirmationHeader>

              <ConfirmationPending>
                <ConfirmationAction>
                  <ConfirmationReject
                    render={<Button variant="ghost">Cancel</Button>}
                  />
                  <ConfirmationAccept render={<Button>Run</Button>} />
                </ConfirmationAction>
              </ConfirmationPending>
            </Confirmation>
          )}

          {phase === "success" && (
            <>
              <ToolSubtitle>Output</ToolSubtitle>
              <ToolBlock>{output}</ToolBlock>
            </>
          )}

          <ToolError>Cancelled by user.</ToolError>
        </ToolContent>
      </Tool>
    </div>
  );
}
