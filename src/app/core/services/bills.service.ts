import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(private generalService: GeneralService) {}

  createBills(workspaceId: number, expnese_group_ids: any[]): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspaceId}/qbo/bills/trigger/`, {
        expense_group_ids: expnese_group_ids
      }
    );
  }

  getBills(workspaceId: number, limit: number, offset: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/qbo/bills/?limit=${limit}&offset=${offset}`, {});
  }

  getPreferences(workspaceId: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/qbo/preferences/`, {});
  }
}
