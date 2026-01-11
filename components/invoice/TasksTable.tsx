interface Task {
  name: string;
  rate: number;
  hours: number;
}

interface TasksTableProps {
  tasks: Task[];
}

export default function TasksTable({ tasks }: TasksTableProps) {
  return (
    <div className="mb-6">
      <table className="w-full">
        <thead>
          <tr className="text-base border-t border-b border-gray-300 font-now">
            <th className="py-3 font-bold tracking-wide text-left">TASK</th>
            <th className="py-3 font-bold tracking-wide text-center">RATE</th>
            <th className="py-3 font-bold tracking-wide text-center">HOURS</th>
            <th className="py-3 font-bold tracking-wide text-right">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task: Task, index: number) => (
            <tr
              key={index}
              className="border-b border-gray-300 font-tt-chocolates"
            >
              <td className="py-3 text-sm whitespace-normal wrap-break-words w-70 max-w-70">
                {task.name}
              </td>
              <td className="py-3 text-sm text-center">${task.rate}/hr</td>
              <td className="py-3 text-sm text-center">{task.hours}</td>
              <td className="py-3 text-sm text-right">
                ${(task.rate * task.hours).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
