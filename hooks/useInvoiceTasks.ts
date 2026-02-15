import { useCallback, useMemo, useState } from "react";

import type { InvoiceTask, Task } from "@/shared/types/Invoice";

export type { InvoiceTask } from "@/shared/types/Invoice";

type UseInvoiceTasksOptions = {
  initialTasks: InvoiceTask[];
  defaultRate?: number;
  ensureAtLeastOneTask?: boolean;
};

function getNextTaskId(tasks: InvoiceTask[]) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((t) => t.id)) + 1;
}

export function useInvoiceTasks({
  initialTasks,
  defaultRate = 27,
  ensureAtLeastOneTask = true,
}: UseInvoiceTasksOptions) {
  const [tasks, setTasks] = useState<InvoiceTask[]>(initialTasks);

  const grandTotal = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.rate * task.hours, 0);
  }, [tasks]);

  const areTasksValid = useMemo(() => {
    return tasks.every((task) => task.name.trim() && task.hours > 0);
  }, [tasks]);

  const updateTask = useCallback(
    (id: number, field: keyof Task, value: string | number) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, [field]: value } : task,
        ),
      );
    },
    [],
  );

  const addTask = useCallback(() => {
    setTasks((prevTasks) => {
      const newId = getNextTaskId(prevTasks);
      return [
        ...prevTasks,
        { id: newId, name: "", rate: defaultRate, hours: 0 },
      ];
    });
  }, [defaultRate]);

  const deleteTask = useCallback(
    (id: number) => {
      setTasks((prevTasks) => {
        if (ensureAtLeastOneTask && prevTasks.length <= 1) return prevTasks;
        return prevTasks.filter((task) => task.id !== id);
      });
    },
    [ensureAtLeastOneTask],
  );

  return {
    tasks,
    setTasks,
    grandTotal,
    areTasksValid,
    updateTask,
    addTask,
    deleteTask,
  };
}
