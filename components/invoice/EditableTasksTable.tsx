interface Task {
  id: number;
  name: string;
  rate: number;
  hours: number;
}

interface EditableTasksTableProps {
  tasks: Task[];
  onTaskChange: (id: number, field: keyof Task, value: string | number) => void;
  onTaskDelete: (id: number) => void;
}

export default function EditableTasksTable({
  tasks,
  onTaskChange,
  onTaskDelete,
}: EditableTasksTableProps) {
  const calculateTotal = (rate: number, hours: number) => rate * hours;

  return (
    <div className="mb-6">
      <table className="w-full">
        <thead>
          <tr className="text-base border-t border-b border-gray-300 font-now text-black">
            <th className="py-3 font-bold tracking-wide text-left">TASK</th>
            <th className="py-3 font-bold tracking-wide text-center">RATE</th>
            <th className="py-3 font-bold tracking-wide text-center">HOURS</th>
            <th className="py-3 font-bold tracking-wide text-right">TOTAL</th>
            <th className="py-3 font-bold tracking-wide text-center">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="border-b border-gray-300 font-tt-chocolates text-black"
            >
              <td className="py-3">
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) =>
                    onTaskChange(task.id, "name", e.target.value)
                  }
                  placeholder="Enter task name..."
                  className="w-full text-sm px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-gray-400 text-black"
                />
              </td>
              <td className="py-3 text-center">
                <input
                  type="number"
                  value={task.rate}
                  onChange={(e) =>
                    onTaskChange(task.id, "rate", Number(e.target.value))
                  }
                  min="0"
                  step="0.01"
                  className="w-20 text-sm text-center px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-gray-400 text-black"
                />
              </td>
              <td className="py-3 text-center">
                <input
                  type="number"
                  value={task.hours}
                  onChange={(e) =>
                    onTaskChange(task.id, "hours", Number(e.target.value))
                  }
                  min="0"
                  step="1"
                  className="w-20 text-sm text-center px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-gray-400 text-black"
                />
              </td>
              <td className="py-3 text-sm text-right">
                ${calculateTotal(task.rate, task.hours).toFixed(2)}
              </td>
              <td className="py-3 text-center">
                <button
                  onClick={() => onTaskDelete(task.id)}
                  disabled={tasks.length === 1}
                  className="text-red-500 hover:text-red-700 text-sm disabled:text-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  title={
                    tasks.length === 1
                      ? "At least one task required"
                      : "Delete task"
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
