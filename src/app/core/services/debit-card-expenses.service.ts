import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root'
})
export class DebitCardExpensesService {

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) { }

  createDebitCardExpenses(expenseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/qbo/debit_card_expenses/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }
}
