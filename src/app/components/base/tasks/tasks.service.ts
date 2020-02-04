import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../general.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private generalService: GeneralService) {}

  getTasks(workspace_id: number, limit: number, offset: number, status: string): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/tasks/all/?limit=${limit}&offset=${offset}&status=${status}`, {}
    );
  }
}
