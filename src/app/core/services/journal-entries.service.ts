import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class JournalEntriesService {
  constructor(private generalService: GeneralService) {}

  createJournalEntries(workspaceId: number, expneseGroupIds: any[]): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspaceId}/qbo/journal_entries/trigger/`, {
        expense_group_ids: expneseGroupIds
      }
    );
  }

  getJournalEntries(workspaceId: number, limit: number, offset: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/qbo/journal_entries/?limit=${limit}&offset=${offset}`, {});
  }
}
