import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ChecksService {
  constructor(private apiService: ApiService) {}

  createChecks(workspaceId: number, expenseGroupIds: any[]): Observable<any> {
    return this.apiService.post(
      `/workspaces/${workspaceId}/qbo/checks/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }

  getChecks(workspaceId: number, limit: number, offset: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/checks/?limit=${limit}&offset=${offset}`, {});
  }
}
