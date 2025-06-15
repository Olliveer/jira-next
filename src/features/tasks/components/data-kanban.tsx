import { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { KanbanColumnHeader } from './kanban-column-header';

interface DataKanbanProps {
  data: Task[];
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TaskState = {
  [key in TaskStatus]: Task[];
};

export function DataKanban({ data }: DataKanbanProps) {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach(task => {
      initialTasks[task.status].push(task);
    });

    Object.values(initialTasks).forEach(task => {
      task.sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto">
        {boards.map(board => (
          <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px] ">
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
