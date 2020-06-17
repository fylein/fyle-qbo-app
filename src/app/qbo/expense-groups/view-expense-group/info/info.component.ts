import { Component, OnInit } from '@angular/core';
import { ExpenseGroupsService } from '../../../../core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseGroup } from 'src/app/core/models/expenseGroups.model';
import { forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss', '../../../qbo.component.scss']
})
export class InfoComponent implements OnInit {

  constructor(private expenseGroupsService: ExpenseGroupsService, private route: ActivatedRoute) { }

  expenseGroupId: number;
  workspaceId: number;

  expenseGroup: ExpenseGroup;

  isLoading = false;
  expenses: MatTableDataSource<ExpenseGroup> = new MatTableDataSource([]);
  count: number;
  pageNumber = 0;
  pageSize = 5;
  columnsToDisplay = ['expense_id', 'claimno'];

  initExpenseGroupExpenses() {
    const that = this;
    return that.expenseGroupsService.getExpensesByExpenseGroupId(that.workspaceId, that.expenseGroupId).toPromise().then(function(expenses) {
      that.count = expenses.length;
      that.expenses = new MatTableDataSource(expenses);
      that.expenses.filterPredicate = that.searchByText;
    });
  }

  initExpenseGroupDetails() {
    const that = this;
    return that.expenseGroupsService.getExpensesGroupById(that.workspaceId, that.expenseGroupId).toPromise().then(function(expenseGroup) {
      that.expenseGroup = expenseGroup;
    });
  }

  searchByText(data: ExpenseGroup, filterText: string) {
    return data.description.employee_email.includes(filterText) ||
      ('Reimbursable'.toLowerCase().includes(filterText) && data.fund_source === 'PERSONAL') ||
      ('Corporate Credit Card'.toLowerCase().includes(filterText) && data.fund_source !== 'PERSONAL') ||
      data.description.claim_number.includes(filterText);
  }


  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.parent.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.parent.params.expense_group_id;

    that.isLoading = true;
    forkJoin([
      that.initExpenseGroupExpenses(),
      that.initExpenseGroupDetails()
    ]).subscribe(function() {
      that.isLoading = false;
    });

  }

}
