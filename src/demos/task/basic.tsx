import { LightbulbIcon, FilePenLineIcon } from "lucide-react";
import { Chip } from "#/components/ai/chip";
import {
  Task,
  TaskIcon,
  TaskItem,
  TaskLabel,
} from "#/components/ai/task";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl">
      <Task>
        <TaskItem>
          <TaskIcon>
            <LightbulbIcon />
          </TaskIcon>
          <TaskLabel>Thought for 9s</TaskLabel>
        </TaskItem>
        <TaskItem>
          <TaskIcon>
            <FilePenLineIcon />
          </TaskIcon>
          <TaskLabel>Edited</TaskLabel>
          <Chip>src/styles.css</Chip>
        </TaskItem>
        <TaskItem>
          <TaskIcon>
            <FilePenLineIcon />
          </TaskIcon>
          <TaskLabel>Edited</TaskLabel>
          <Chip>src/styles.css</Chip>
        </TaskItem>
        <TaskItem>
          <TaskIcon>
            <FilePenLineIcon />
          </TaskIcon>
          <TaskLabel>Edited</TaskLabel>
          <Chip>src/styles.css</Chip>
        </TaskItem>
        <TaskItem>
          <TaskIcon>
            <FilePenLineIcon />
          </TaskIcon>
          <TaskLabel>Edited</TaskLabel>
          <Chip>src/routes/index.tsx</Chip>
        </TaskItem>
      </Task>
    </div>
  );
}
