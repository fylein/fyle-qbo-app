import { Injectable } from '@angular/core';
import { GeneralService } from '../general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupsService {
  constructor(private generalService: GeneralService) {}

  getExpenseGroups(workspace_id: number): Observable<any> {
    return this.generalService.get('/workspaces/' + workspace_id + '/fyle/expense_groups/', {});
  }

  syncExpenseGroups(workspace_id: number): Observable<any> {
    return this.generalService.post('/workspaces/' + workspace_id + '/fyle/expense_groups/', {});
  }
}
