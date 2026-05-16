import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
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

type TodoStatus = "pending" | "in_progress" | "completed";

type TodoItemData = {
  content: string;
  activeForm: string;
  status: TodoStatus;
};

const SCRIPT: TodoItemData[] = [
  {
    content: "Set up project structure",
    activeForm: "Setting up project structure",
    status: "pending",
  },
  {
    content: "Create main HTML page",
    activeForm: "Creating main HTML page",
    status: "pending",
  },
  {
    content: "Add JavaScript functionality",
    activeForm: "Adding JavaScript functionality",
    status: "pending",
  },
  {
    content: "Implement CSS styling",
    activeForm: "Implementing CSS styling",
    status: "pending",
  },
  {
    content: "Add local storage for saving dive logs",
    activeForm: "Adding local storage for saving dive logs",
    status: "pending",
  },
];

function reset(): TodoItemData[] {
  return SCRIPT.map((t) => ({ ...t }));
}

export default function Streaming() {
  const [todos, setTodos] = useState<TodoItemData[]>(reset);

  useEffect(() => {
    const interval = setInterval(() => {
      setTodos((prev) => {
        const ip = prev.findIndex((t) => t.status === "in_progress");
        if (ip >= 0) {
          const next = prev.slice();
          next[ip] = { ...next[ip], status: "completed" };
          return next;
        }
        const pending = prev.findIndex((t) => t.status === "pending");
        if (pending >= 0) {
          const next = prev.slice();
          next[pending] = { ...next[pending], status: "in_progress" };
          return next;
        }
        return prev;
      });
    }, 900);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (todos.every((t) => t.status === "completed")) {
      const timeout = setTimeout(() => setTodos(reset()), 1800);
      return () => clearTimeout(timeout);
    }
  }, [todos]);

  const completed = todos.filter((t) => t.status === "completed").length;
  const allDone = completed === todos.length;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Todo defaultOpen>
        <TodoHeader>
          <TodoTitle>
            {allDone
              ? "All tasks completed"
              : `${completed} of ${todos.length} completed`}
          </TodoTitle>
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
            {todos.map((todo, i) => (
              <TodoItem key={i} status={todo.status}>
                <TodoItemIcon />
                <TodoItemLabel>
                  {todo.status === "in_progress"
                    ? todo.activeForm
                    : todo.content}
                </TodoItemLabel>
              </TodoItem>
            ))}
          </TodoList>
        </TodoContent>
      </Todo>
    </div>
  );
}
