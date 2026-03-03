"use client";

import { useState, useTransition } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Button,
  Input,
  Badge
} from "@maatwork/ui";
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Calendar,
  AlertCircle,
  Loader2
} from "lucide-react";
import { addTodo, toggleTodo, deleteTodo } from "../todo-actions";
import { cn } from "@maatwork/ui/lib/utils";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  createdAt: Date | null;
}

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    startTransition(async () => {
      await addTodo(text);
      setText("");
    });
  };

  const priorityColors = {
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <Card className="col-span-4 border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden group">
      <CardHeader className="border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Próximos Pasos
            </CardTitle>
            <CardDescription className="text-white/40">Gestiona tus tareas y objetivos de expansión.</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 animate-pulse">
            Productividad Alta
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleAdd} className="p-4 flex gap-2 bg-white/[0.02] border-b border-white/5">
          <Input 
            placeholder="¿Qué sigue para Maatwork?" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isPending}
            className="flex-1 bg-black/40 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-primary/50"
          />
          <Button type="submit" size="icon" disabled={isPending || !text.trim()}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>

        <div className="divide-y divide-white/5 max-h-[400px] overflow-auto custom-scrollbar">
          {initialTodos.length === 0 ? (
            <div className="p-12 text-center text-white/20">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-10" />
              <p className="text-sm">No hay tareas pendientes. ¡Buen trabajo!</p>
            </div>
          ) : (
            initialTodos.map((todo) => (
              <div 
                key={todo.id} 
                className={cn(
                  "flex items-center justify-between p-4 transition-colors hover:bg-white/[0.02]",
                  todo.completed && "opacity-50"
                )}
              >
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => startTransition(() => toggleTodo(todo.id, !todo.completed))}
                    className="p-1 hover:text-primary transition-colors"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "text-sm font-medium transition-all",
                      todo.completed && "line-through decoration-primary/50 text-white/40"
                    )}>
                      {todo.text}
                    </span>
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-widest px-1.5 py-0", priorityColors[todo.priority])}>
                        {todo.priority}
                      </Badge>
                      {todo.dueDate && (
                        <span className="flex items-center gap-1 text-[10px] text-white/30 uppercase font-black">
                          <Calendar className="h-2.5 w-2.5" />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => startTransition(() => deleteTodo(todo.id))}
                  className="text-white/20 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
