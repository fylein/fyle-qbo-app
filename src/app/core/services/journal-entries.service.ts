import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class JournalEntriesService {
  constructor(private apiService: ApiService) {}

  createJournalEntries(workspaceId: number, expneseGroupIds: any[]): Observable<any> {
    return this.apiService.post(
      `/workspaces/${workspaceId}/qbo/journal_entries/trigger/`, {
        expense_group_ids: expneseGroupIds
      }
    );
  }

  getJournalEntries(workspaceId: number, limit: number, offset: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/journal_entries/?limit=${limit}&offset=${offset}`, {});
  }
}
