import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class ChecksService {
  constructor(private generalService: GeneralService) {}

  createChecks(workspaceId: number, expenseGroupIds: any[]): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspaceId}/qbo/checks/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }

  getChecks(workspaceId: number, limit: number, offset: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/qbo/checks/?limit=${limit}&offset=${offset}`, {});
  }
}
