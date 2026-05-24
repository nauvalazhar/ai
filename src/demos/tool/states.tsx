import { DatabaseIcon, ShieldAlertIcon, Trash2Icon } from "lucide-react";
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

const partialInput = `{
  "query": "SELECT * FROM users WHERE`;

const input = `{
  "query": "SELECT * FROM users WHERE id = 42"
}`;

const output = `{
  "rows": [{ "id": 42, "name": "Ada" }]
}`;

const destructiveInput = `{
  "path": "/var/log/old/*.log",
  "recursive": true
}`;

export default function States() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3 p-6">
      <Tool state="pending" defaultOpen>
        <ToolTrigger>
          <ToolIcon>
            <DatabaseIcon />
          </ToolIcon>
          <ToolName>run_query</ToolName>
          <ToolLabel>streaming arguments</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{partialInput}</ToolBlock>
        </ToolContent>
      </Tool>

      <Tool state="approval" defaultOpen>
        <ToolTrigger>
          <ToolIcon>
            <Trash2Icon />
          </ToolIcon>
          <ToolName>delete_files</ToolName>
          <ToolLabel>needs approval</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{destructiveInput}</ToolBlock>
          <Confirmation tone="danger">
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
        </ToolContent>
      </Tool>

      <Tool state="running" defaultOpen={false}>
        <ToolTrigger>
          <ToolIcon>
            <DatabaseIcon />
          </ToolIcon>
          <ToolName>run_query</ToolName>
          <ToolLabel>running</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{input}</ToolBlock>
        </ToolContent>
      </Tool>

      <Tool state="success" defaultOpen={false}>
        <ToolTrigger>
          <ToolIcon>
            <DatabaseIcon />
          </ToolIcon>
          <ToolName>run_query</ToolName>
          <ToolLabel>1 row returned</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{input}</ToolBlock>
          <ToolSubtitle>Output</ToolSubtitle>
          <ToolBlock>{output}</ToolBlock>
        </ToolContent>
      </Tool>

      <Tool state="error" defaultOpen>
        <ToolTrigger>
          <ToolIcon>
            <DatabaseIcon />
          </ToolIcon>
          <ToolName>run_query</ToolName>
          <ToolLabel>connection refused</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{input}</ToolBlock>
          <ToolError>
            Connection refused: could not reach database at db.internal:5432
          </ToolError>
        </ToolContent>
      </Tool>
    </div>
  );
}
