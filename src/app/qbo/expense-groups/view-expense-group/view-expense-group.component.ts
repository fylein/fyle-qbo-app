import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ExpenseGroupsService } from '../../../core/services/expense-groups.service';
import { forkJoin, Observable } from 'rxjs';
import { TasksService } from '../../../core/services/tasks.service';
import { ChecksService } from '../../../core/services/checks.service';
import { JournalEntriesService } from '../../../core/services/journal-entries.service';
import { environment } from 'src/environments/environment';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { Task } from 'src/app/core/models/task.model';

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
  task: Task;
  state: string;
  pageSize: number;
  pageNumber: number;
  status: string;
  showMappingErrors = false;
  showQuickbooksErrors = false;
  windowReference: Window;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseGroupsService: ExpenseGroupsService,
    private tasksService: TasksService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  changeState(state: string) {
    const that = this;
    if (that.state !== state) {
      that.state = state;
      that.router.navigate([`workspaces/${this.workspaceId}/expense_groups/${this.expenseGroupId}/view/${state.toLowerCase()}`]);
    }
  }

  openBillInQBO() {
    this.windowReference.open(`${environment.qbo_app_url}/app/bill?txnId=${this.task.detail.Bill.Id}`, '_blank');
  }

  openExpenseInQBO() {
    this.windowReference.open(`${environment.qbo_app_url}/app/expense?txnId=${this.task.detail.Purchase.Id}`, '_blank');
  }

  openCheckInQBO() {
    this.windowReference.open(`${environment.qbo_app_url}/app/check?txnId=${this.task.detail.Purchase.Id}`, '_blank');
  }

  openJournalEntryInQBO() {
    this.windowReference.open(`${environment.qbo_app_url}/app/journal?txnId=${this.task.detail.JournalEntry.Id}`, '_blank');
  }

  openCreditCardPurchaseInQBO() {
    this.windowReference.open(`${environment.qbo_app_url}/app/expense?txnId=${this.task.detail.Purchase.Id}`, '_blank');
  }

  openExpenseInFyle(expenseId: string) {
    const clusterDomain = this.storageService.get('clusterDomain');
    this.windowReference.open(`${clusterDomain}/app/main/#/enterprise/view_expense/${expenseId}`, '_blank');
  }

  ngOnInit() {
    const that = this;

    that.workspaceId = +that.route.snapshot.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.params.expense_group_id;
    that.state = that.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'INFO';

    forkJoin(
      [
        that.expenseGroupsService.getExpensesGroupById(that.expenseGroupId),
        that.tasksService.getTaskByExpenseGroupId(that.expenseGroupId)
      ]
    ).subscribe(response => {
      that.isLoading = false;

      that.expenseGroup = response[0];
      if (response[1]) {
        that.task = response[1];
        that.showMappingErrors = that.task.detail ? true : false;
        that.showQuickbooksErrors = that.task.quickbooks_errors ? true : false;
        that.status = that.task.status;
      }
    });
  }

}
