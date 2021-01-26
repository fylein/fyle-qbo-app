import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Task } from '../models/task.model';
import { TaskResponse } from '../models/task-reponse.model';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  getTasks(limit: number, offset: number, status: string, expenseGroupIds: number[]): Observable<TaskResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/tasks/all/`, {
      limit,
      offset,
      status,
      expenseGroupIds,
    }
  );
}

  getAllTasks(status: string, expenseGroupIds: number[] = null): Observable<TaskResponse> {
    const limit = 500;
    const offset = 0;
    const allTasks: TaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };

    return from(this.getAllTasksInternal(limit, offset, status, expenseGroupIds, allTasks));
  }
  // TODO: remove promises and do with rxjs observables
  private getAllTasksInternal(limit: number, offset: number, status: string, expenseGroupIds: number[], allTasks: TaskResponse): Promise<TaskResponse> {
    const that = this;
    return that.getTasks(limit, offset, status, expenseGroupIds).toPromise().then((taskResponse) => {
      if (allTasks.count === 0 ) {
        allTasks = taskResponse;
      } else {
        allTasks.results = allTasks.results.concat(taskResponse.results);
      }

      if (allTasks.results.length < allTasks.count) {
        return that.getAllTasksInternal(limit, offset + 500, status, expenseGroupIds, allTasks);
      } else {
        return allTasks;
      }
    });
  }

  getTasksByExpenseGroupId(expenseGroupId: number): Observable<Task[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/tasks/expense_group/${expenseGroupId}/`, {}
    );
  }
}
