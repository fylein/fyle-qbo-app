import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable } from 'ngx-cacheable';
import { Observable } from 'rxjs';
import { WorkspaceService } from './workspace.service';
import { QBOPreference } from '../models/qbo-preference.model';
import { QBOComapnyInfo } from '../models/qbo-company-info.model';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  createBills(expenseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/qbo/bills/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }

  @Cacheable()
  getPreferences(workspaceId: number): Observable<QBOPreference> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/preferences/`, {});
  }

  UpdateExpenseGroupingIfDepartmentAdded() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/qbo/update_grouping_on_department/`, {});
  }

  getOrgDetails(): Observable<QBOComapnyInfo> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/company_info/`, {});
  }
}
