import { ChevronDownIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Todo,
  TodoContent,
  TodoHeader,
  TodoItem,
  TodoItemIcon,
  TodoItemLabel,
  TodoList,
  TodoTitle,
  TodoTrigger,
} from "#/components/ai/todo";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <Todo defaultOpen>
        <TodoHeader>
          <TodoTitle>Update Todos</TodoTitle>
          <TodoTrigger
            aria-label="Toggle todos"
            render={
              <Button
                iconOnly
                variant="ghost"
                className="-mr-1 text-muted-foreground hover:text-foreground"
              />
            }
          >
            <ChevronDownIcon className="group-data-open/todo:rotate-180" />
          </TodoTrigger>
        </TodoHeader>
        <TodoContent>
          <TodoList>
            <TodoItem status="completed">
              <TodoItemIcon />
              <TodoItemLabel>Set up project structure</TodoItemLabel>
            </TodoItem>
            <TodoItem status="completed">
              <TodoItemIcon />
              <TodoItemLabel>Create main HTML page</TodoItemLabel>
            </TodoItem>
            <TodoItem status="in_progress">
              <TodoItemIcon />
              <TodoItemLabel>Adding JavaScript functionality</TodoItemLabel>
            </TodoItem>
            <TodoItem status="pending">
              <TodoItemIcon />
              <TodoItemLabel>Implement CSS styling</TodoItemLabel>
            </TodoItem>
            <TodoItem status="pending">
              <TodoItemIcon />
              <TodoItemLabel>
                Add local storage for saving dive logs
              </TodoItemLabel>
            </TodoItem>
          </TodoList>
        </TodoContent>
      </Todo>
    </div>
  );
}
