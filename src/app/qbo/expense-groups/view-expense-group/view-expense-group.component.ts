import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ExpenseGroupsService } from '../../../core/services/expense-groups.service';
import { forkJoin, Observable } from 'rxjs';
import { TasksService } from '../../../core/services/tasks.service';
import { ChecksService } from '../../checks/checks.service';
import { JournalEntriesService } from '../../journal-entries/journal-entries.service';
import { CreditCardPurchasesService } from '../../credit-card-purchases/credit-card-purchases.service';
import { environment } from 'src/environments/environment';
import { BillsService } from 'src/app/core/services/bills.service';
import { ExpenseGroup } from 'src/app/core/models/expenseGroups.model';

@Component({
  selector: 'app-view-expense-group',
  templateUrl: './view-expense-group.component.html',
  styleUrls: ['./view-expense-group.component.scss', '../expense-groups.component.scss', '../../qbo.component.scss']
})
export class ViewExpenseGroupComponent implements OnInit {
  workspaceId: number;
  expenseGroupId: number;
  expenses: ExpenseGroup[];
  isLoading = true;
  expenseGroup: ExpenseGroup;
  task: any;
  generalSettings: any;
  state: string;
  pageSize: number;
  pageNumber: number;

  constructor(private route: ActivatedRoute, private router: Router, private expenseGroupsService: ExpenseGroupsService, private tasksService: TasksService, private billsService: BillsService, private checksService: ChecksService, private JournalEntriesService: JournalEntriesService, private CreditCardPurchasesService: CreditCardPurchasesService) { }

  changeState(state: string) {
    const that = this;
    if (that.state !== state) {
      that.state = state;
      that.router.navigate([`workspaces/${this.workspaceId}/expense_groups/${this.expenseGroupId}/view/${state.toLowerCase()}`]);
    }
  }

  openBillInQBO() {
    window.open(`${environment.qbo_app_url}/app/bill?txnId=${this.task.detail.Bill.Id}`, '_blank');
  }

  openCheckInQBO() {
    window.open(`${environment.qbo_app_url}/app/check?txnId=${this.task.detail.Purchase.Id}`, '_blank');
  }

  openJournalEntryInQBO() {
    window.open(`${environment.qbo_app_url}/app/journal?txnId=${this.task.detail.JournalEntry.Id}`, '_blank');
  }

  openCreditCardPurchaseInQBO() {
    window.open(`${environment.qbo_app_url}/app/expense?txnId=${this.task.detail.Purchase.Id}`, '_blank');
  }

  openExpenseInFyle(expenseId: string) {
    const clusterDomain = localStorage.getItem('clusterDomain');
    window.open(`${clusterDomain}/app/main/#/enterprise/view_expense/${expenseId}`, '_blank');
  }

  initExpenseGroupDetails() {
    const that = this;
    return that.expenseGroupsService.getExpensesGroupById(that.workspaceId, that.expenseGroupId).toPromise().then(function(expenseGroup) {
      that.expenseGroup = expenseGroup;
      return expenseGroup;
    });
  }

  initTasks() {
    const that = this;
    return that.tasksService.getTasksByExpenseGroupId(that.workspaceId, that.expenseGroupId).toPromise().then(function(tasks) {
      if (tasks.length) {
        that.task = tasks[0];
      }
    });
  }

  ngOnInit() {
    this.workspaceId = +this.route.snapshot.params.workspace_id;
    this.expenseGroupId = +this.route.snapshot.params.expense_group_id;
    this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
    this.state = this.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'INFO';

    forkJoin(
      [
        this.initExpenseGroupDetails(),
        this.initTasks()
      ]
    ).subscribe(response => {
      this.isLoading = false;
    });
  }

}
