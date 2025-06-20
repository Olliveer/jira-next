import { ProjectAnalytics } from '@/features/projects/api/use-get-project-analytics';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { AnalyticsCard } from './analytics-card';
import { Separator } from './ui/separator';

export function Analytics({ data }: { data: ProjectAnalytics }) {
  if (!data) {
    return null;
  }

  return (
    <ScrollArea className="border rounded-lg whitespace-nowrap shrink-0">
      <div className="flex w-full flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDiff > 0 ? 'up' : 'down'}
            increaseValue={data.taskDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.assigneeCount}
            variant={data.assigneeDiff > 0 ? 'up' : 'down'}
            increaseValue={data.assigneeDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDiff > 0 ? 'up' : 'down'}
            increaseValue={data.completedTaskDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDiff > 0 ? 'up' : 'down'}
            increaseValue={data.overdueTaskDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incomplete Tasks"
            value={data.inconpleteTaskCount}
            variant={data.inconpleteTaskDiff > 0 ? 'up' : 'down'}
            increaseValue={data.inconpleteTaskDiff}
          />
          <Separator orientation="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
