import { Component, OnInit } from '@angular/core';
import { ExpenseGroupsService } from '../../../../core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseGroup } from 'src/app/core/models/expenseGroups.model';
import { forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Expense } from 'src/app/core/models/expense.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss', '../../../qbo.component.scss']
})
export class InfoComponent implements OnInit {

  constructor(private expenseGroupsService: ExpenseGroupsService, private route: ActivatedRoute, private authService: AuthService) { }

  expenseGroupId: number;
  workspaceId: number;

  expenseGroup: ExpenseGroup;

  isLoading = false;
  expenses: MatTableDataSource<Expense> = new MatTableDataSource([]);
  count: number;
  pageNumber = 0;
  pageSize = 5;
  columnsToDisplay = ['expense_id', 'claimno', 'view'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.expenses.filter = filterValue.trim().toLowerCase();
  }

  initExpenseGroupExpenses() {
    const that = this;
    return that.expenseGroupsService.getExpensesByExpenseGroupId(that.workspaceId, that.expenseGroupId).toPromise().then((expenses) => {
      console.log(expenses);
      that.count = expenses.length;
      that.expenses = new MatTableDataSource(expenses);
    });
  }

  initExpenseGroupDetails() {
    const that = this;
    return that.expenseGroupsService.getExpensesGroupById(that.workspaceId, that.expenseGroupId).toPromise().then((expenseGroup) => {
      that.expenseGroup = expenseGroup;
    });
  }

  openExpenseInFyle(expense) {
    const that = this;
    const clusterDomain = localStorage.getItem('clusterDomain');
    const user = that.authService.getUser();
    window.open(`${clusterDomain}/app/main/#/enterprise/view_expense/${expense.expense_id}?org_id=${user.org_id}`, '_blank');
  }


  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.parent.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.parent.params.expense_group_id;

    that.isLoading = true;
    forkJoin([
      that.initExpenseGroupExpenses(),
      that.initExpenseGroupDetails()
    ]).subscribe(() => {
      that.isLoading = false;
    });

  }

}
