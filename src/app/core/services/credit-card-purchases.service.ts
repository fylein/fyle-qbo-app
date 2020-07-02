import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardPurchasesService {
  constructor(private generalService: GeneralService) {}

  createCreditCardPurchases(workspaceId: number, expenseGroupIds: any[]): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspaceId}/qbo/credit_card_purchases/trigger/`, {
        expense_group_ids: expenseGroupIds
      }
    );
  }

  getCreditCardPurchases(workspaceId: number, limit: number, offset: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/qbo/credit_card_purchases/?limit=${limit}&offset=${offset}`, {});
  }
}
