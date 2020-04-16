import { Injectable } from '@angular/core';
import { GeneralService } from '../general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreditCardPurchasesService {
  constructor(private generalService: GeneralService) {}

  createCreditCardPurchases(workspace_id: number, expnese_group_ids: any[]): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/qbo/credit_card_purchases/trigger/`, {
        expense_group_ids: expnese_group_ids
      }
    );
  }

  getCreditCardPurchases(workspace_id: number, limit: number, offset: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/credit_card_purchases/?limit=${limit}&offset=${offset}`, {});
  }
}
