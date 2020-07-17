import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardPurchasesService {
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) {}

  // TODO: Map response to a model
  createCreditCardPurchases(expenseGroupIds: number[]) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(
      `/workspaces/${workspaceId}/qbo/credit_card_purchases/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }
}
