import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable } from 'ngx-cacheable';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(private apiService: ApiService) {}

  createBills(workspaceId: number, expenseGroupIds: any[]): Observable<any> {
    return this.apiService.post(
      `/workspaces/${workspaceId}/qbo/bills/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }

  getBills(workspaceId: number, limit: number, offset: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/bills/?limit=${limit}&offset=${offset}`, {});
  }

  @Cacheable()
  getPreferences(workspaceId: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/preferences/`, {});
  }

  getOrgDetails(workspaceId: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/company_info/`, {});
  }
}
