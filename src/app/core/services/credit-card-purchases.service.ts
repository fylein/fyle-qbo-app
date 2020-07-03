import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardPurchasesService {
  constructor(private apiService: ApiService) {}

  createCreditCardPurchases(workspaceId: number, expenseGroupIds: any[]): Observable<any> {
    return this.apiService.post(
      `/workspaces/${workspaceId}/qbo/credit_card_purchases/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }

  getCreditCardPurchases(workspaceId: number, limit: number, offset: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/credit_card_purchases/?limit=${limit}&offset=${offset}`, {});
  }
}
