import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class ChecksService {
  constructor(private generalService: GeneralService) {}

  createChecks(workspace_id: number, expnese_group_ids: any[]): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/qbo/checks/trigger/`, {
        expense_group_ids: expnese_group_ids
      }
    );
  }

  getChecks(workspace_id: number, limit: number, offset: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/checks/?limit=${limit}&offset=${offset}`, {});
  }
}
