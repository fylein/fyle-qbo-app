import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable } from 'ngx-cacheable';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  // TODO: Map response to a model
  createBills(expenseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/qbo/bills/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }

  // TODO: Map response to a model
  @Cacheable()
  getPreferences(workspaceId: number) {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/preferences/`, {});
  }

  UpdateExpenseGroupingIfDepartmentAdded() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/qbo/update_grouping_on_department/`, {});
  }

  // TODO: Map response to a model
  getOrgDetails() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/company_info/`, {});
  }
}
