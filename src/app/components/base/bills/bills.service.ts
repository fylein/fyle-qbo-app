import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(private generalService: GeneralService) {}

  createBills(workspace_id: number, expnese_group_ids: any[]): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/qbo/bills/trigger/`, {
        expense_group_ids: expnese_group_ids
      }
    );
  }

  getBills(workspace_id: number, limit: number, offset: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/bills/?limit=${limit}&offset=${offset}`, {});
  }

  getPreferences(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/preferences/`, {});
  }
}
