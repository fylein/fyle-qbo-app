import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class ChecksService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  // TODO: Map response to a model
  createChecks(expenseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/qbo/checks/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }
}
