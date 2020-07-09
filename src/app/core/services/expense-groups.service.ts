import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ExpenseGroupResponse } from 'src/app/core/models/expenseGroupsResponse.model';
import { ExpenseGroup } from 'src/app/core/models/expenseGroups.model';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupsService {
  constructor(private apiService: ApiService) {}

  getExpenseGroups(workspaceId: number, limit: number, offset: number, state: string): Observable<ExpenseGroupResponse> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/fyle/expense_groups/?limit=${limit}&offset=${offset}&state=${state}`,
      {}
    );
  }

  getAllExpenseGroups(workspaceId: number, state: string): Observable<ExpenseGroupResponse> {
    const limit = 10;
    const offset = 0;
    // this would require to create a default object - not much benefit in doing so imho @Dhar
    // tslint:disable-next-line: prefer-const
    let allExpenseGroupsResponse;

    return from(this.getAllExpenseGroupsInternal(workspaceId, limit, offset, state, allExpenseGroupsResponse));
  }

  private getAllExpenseGroupsInternal(workspaceId: number, limit: number, offset: number, state: string, allExpenseGroupsResponse: ExpenseGroupResponse): Promise<ExpenseGroupResponse> {
    const that = this;
    return that.getExpenseGroups(workspaceId, limit, offset, state).toPromise().then((expenseGroupRes) => {
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

  getExpensesByExpenseGroupId(workspaceId: number, expenseGroupOd: number): Observable<Expense[]> {
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_groups/${expenseGroupOd}/expenses/`, {});
  }

  getExpensesGroupById(workspaceId: number, expenseGroupOd: number): Observable<ExpenseGroup> {
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_groups/${expenseGroupOd}/`, {});
  }

  syncExpenseGroups(workspaceId: number): Observable<any> {
    return this.apiService.post(`/workspaces/${workspaceId}/fyle/expense_groups/trigger/`, {});
  }
}
