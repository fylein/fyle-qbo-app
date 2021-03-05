import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardPurchasesService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  createCreditCardPurchases(expenseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/qbo/credit_card_purchases/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }
}
