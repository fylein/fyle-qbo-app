import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';
import { ExpenseGroupResponse } from 'src/app/core/models/expenseGroupsResponse.model';
import { ExpenseGroup } from 'src/app/core/models/expenseGroups.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupsService {
  constructor(private generalService: GeneralService) {}

  getExpenseGroups(workspaceId: number, limit: number, offset: number, state: string): Observable<ExpenseGroupResponse> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/fyle/expense_groups/?limit=${limit}&offset=${offset}&state=${state}`,
      {}
    );
  }

  getAllExpenseGroups(workspaceId: number, state: string): Observable<ExpenseGroupResponse> {
    const limit = 10;
    const offset = 0;
    let allExpenseGroupsResponse;

    return from(this.getAllExpenseGroupsInternal(workspaceId, limit, offset, state, allExpenseGroupsResponse));
  }

  private getAllExpenseGroupsInternal(workspaceId: number, limit: number, offset: number, state: string, allExpenseGroupsResponse: ExpenseGroupResponse): Promise<ExpenseGroupResponse> {
    const that = this;
    return that.getExpenseGroups(workspaceId, limit, offset, state).toPromise().then(function(expenseGroupRes) {
      if (!allExpenseGroupsResponse) {
        allExpenseGroupsResponse = expenseGroupRes;
      } else {
        allExpenseGroupsResponse.results = allExpenseGroupsResponse.results.concat(expenseGroupRes.results);
      }

      if (allExpenseGroupsResponse.results.length < allExpenseGroupsResponse.count) {
        return that.getAllExpenseGroupsInternal(workspaceId, limit, offset + 10, state, allExpenseGroupsResponse);
      } else {
        return allExpenseGroupsResponse;
      }
    });
  }

  getExpensesByExpenseGroupId(workspaceId: number, expenseGroupOd: number): Observable<ExpenseGroup[]> {
    return this.generalService.get(`/workspaces/${workspaceId}/fyle/expense_groups/${expenseGroupOd}/expenses/`, {});
  }

  getExpensesGroupById(workspaceId: number, expenseGroupOd: number): Observable<ExpenseGroup> {
    return this.generalService.get(`/workspaces/${workspaceId}/fyle/expense_groups/${expenseGroupOd}/`, {});
  }

  syncExpenseGroups(workspaceId: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspaceId}/fyle/expense_groups/trigger/`, {});
  }
}
