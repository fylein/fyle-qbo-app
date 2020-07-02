import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';
import { Task } from '../models/task.model';
import { TaskResponse } from '../models/taskReponse.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private generalService: GeneralService) {}

  getTasks(workspaceId: number, limit: number, offset: number, status: string): Observable<TaskResponse> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/tasks/all/?limit=${limit}&offset=${offset}&status=${status}`, {}
    );
  }

  getAllTasks(workspaceId: number, status: string): Observable<TaskResponse> {
    const limit = 10;
    const offset = 0;
    const allTasks: TaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };

    return from(this.getAllTasksInternal(workspaceId, limit, offset, status, allTasks));
  }

  private getAllTasksInternal(workspaceId: number, limit: number, offset: number, status: string, allTasks: TaskResponse): Promise<TaskResponse> {
    const that = this;
    return that.getTasks(workspaceId, limit, offset, status).toPromise().then((taskResponse) => {
      if (allTasks.count === 0 ) {
        allTasks = taskResponse;
      } else {
        allTasks.results = allTasks.results.concat(taskResponse.results);
      }

      if (allTasks.results.length < allTasks.count) {
        return that.getAllTasksInternal(workspaceId, limit, offset + 10, status, allTasks);
      } else {
        return allTasks;
      }
    });
  }

  getTaskById(workspaceId: number, id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/tasks/?id=${id}`, {}
    );
  }

  getTasksByExpenseGroupId(workspaceId: number, expenseGroupId: number): Observable<Task[]> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/tasks/expense_group/${expenseGroupId}/`, {}
    );
  }
}
