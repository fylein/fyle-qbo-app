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
  isLoading: boolean = true;
  expenseGroup: ExpenseGroup;
  task: any;
  generalSettings: any;
  state: string = 'INFO';
  pageSize: number;
  pageNumber: number;

  constructor(private route: ActivatedRoute, private router: Router, private expenseGroupsService: ExpenseGroupsService, private tasksService: TasksService, private billsService: BillsService, private checksService: ChecksService, private JournalEntriesService: JournalEntriesService, private CreditCardPurchasesService: CreditCardPurchasesService) { }

  // createQBOItems(expense_group_id: number) {
  //   if (this.generalSettings.reimbursable_expenses_object) {
  //     if (this.generalSettings.reimbursable_expenses_object == 'BILL') {
  //       this.billsService.createBills(this.workspaceId, [expense_group_id]).subscribe(result => {
  //         this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
  //       });
  //     }
  //     else if (this.generalSettings.reimbursable_expenses_object == 'CHECK') {
  //       this.checksService.createChecks(this.workspaceId, [expense_group_id]).subscribe(result => {
  //         this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
  //       });
  //     }
  //     else {
  //       this.JournalEntriesService.createJournalEntries(this.workspaceId, [expense_group_id]).subscribe(result => {
  //         this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
  //       });
  //     }
  //   }

  //   if (this.generalSettings.corporate_credit_card_expenses_object) {
  //     if (this.generalSettings.corporate_credit_card_expenses_object == 'JOURNAL ENTRY') {
  //       this.JournalEntriesService.createJournalEntries(this.workspaceId, [expense_group_id]).subscribe(result => {
  //         this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
  //       });
  //     }

  //     else {
  //       this.CreditCardPurchasesService.createCreditCardPurchases(this.workspaceId, [expense_group_id]).subscribe(result => {
  //         this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
  //       });
  //     }
  //   }
  // }



  changeState(state: string) {
    let that = this;
    if (that.state !== state) {
      that.state = state;
      that.router.navigate([`workspaces/${this.workspaceId}/expense_groups/${this.expenseGroupId}/view/${state.toLowerCase()}`]);
    }
  }

  openBillInQBO() {
    window.open(`${environment.qbo_app_url}/app/bill?txnId=${this.task['detail'].Bill.Id}`, '_blank')
  }

  openCheckInQBO() {
    window.open(`${environment.qbo_app_url}/app/check?txnId=${this.task['detail'].Purchase.Id}`, '_blank')
  }

  openJournalEntryInQBO() {
    window.open(`${environment.qbo_app_url}/app/journal?txnId=${this.task['detail'].JournalEntry.Id}`, '_blank')
  }

  openCreditCardPurchaseInQBO() {
    window.open(`${environment.qbo_app_url}/app/expense?txnId=${this.task['detail'].Purchase.Id}`, '_blank')
  }

  openExpenseInFyle(expenseId: string) {
    const clusterDomain = localStorage.getItem('clusterDomain');
    window.open(`${clusterDomain}/app/main/#/enterprise/view_expense/${expenseId}`, '_blank');
  }

  initExpenseGroupDetails() {
    let that = this;
    return that.expenseGroupsService.getExpensesGroupById(that.workspaceId, that.expenseGroupId).toPromise().then(function (expenseGroup) {
      that.expenseGroup = expenseGroup;
      return expenseGroup;
    });
  }

  initTasks() {
    let that = this;
    return that.tasksService.getTasksByExpenseGroupId(that.workspaceId, that.expenseGroupId).toPromise().then(function (tasks) {
      if (tasks.length) {
        that.task = tasks[0];
      }
    });
  }

  ngOnInit() {
    this.workspaceId = +this.route.snapshot.params['workspace_id'];
    this.expenseGroupId = +this.route.snapshot.params['expense_group_id'];
    this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));

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
