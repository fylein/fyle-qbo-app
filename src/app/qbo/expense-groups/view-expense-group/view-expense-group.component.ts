import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseGroupsService } from '../expense-groups.service';
import { forkJoin } from 'rxjs';
import { TasksService } from '../../tasks/tasks.service';
import { ChecksService } from '../../checks/checks.service';
import { JournalEntriesService } from '../../journal-entries/journal-entries.service';
import { CreditCardPurchasesService } from '../../credit-card-purchases/credit-card-purchases.service';
import { environment } from 'src/environments/environment';
import { BillsService } from 'src/app/core/services/bills.service';

@Component({
  selector: 'app-view-expense-group',
  templateUrl: './view-expense-group.component.html',
  styleUrls: ['./view-expense-group.component.scss', '../expense-groups.component.scss', '../../qbo.component.scss']
})
export class ViewExpenseGroupComponent implements OnInit {
  workspaceId: number;
  expenseGroupId: number;
  expenses: any[];
  isLoading: boolean = true;
  expenseGroup: any;
  task: any;
  generalSettings: any;

  constructor(private route: ActivatedRoute, private router: Router, private expenseGroupsService: ExpenseGroupsService, private tasksService: TasksService, private billsService: BillsService, private checksService: ChecksService, private JournalEntriesService: JournalEntriesService, private CreditCardPurchasesService: CreditCardPurchasesService) { }

  createQBOItems(expense_group_id: number) {
    if (this.generalSettings.reimbursable_expenses_object) {
      if (this.generalSettings.reimbursable_expenses_object == 'BILL') {
        this.billsService.createBills(this.workspaceId, [expense_group_id]).subscribe(result => {
          this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
        });
      }
      else if (this.generalSettings.reimbursable_expenses_object == 'CHECK') {
        this.checksService.createChecks(this.workspaceId, [expense_group_id]).subscribe(result => {
          this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
        });
      }
      else {
        this.JournalEntriesService.createJournalEntries(this.workspaceId, [expense_group_id]).subscribe(result => {
          this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
        });
      }
    }

    if (this.generalSettings.corporate_credit_card_expenses_object) {
      if (this.generalSettings.corporate_credit_card_expenses_object == 'JOURNAL ENTRY') {
        this.JournalEntriesService.createJournalEntries(this.workspaceId, [expense_group_id]).subscribe(result => {
          this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
        });
      }

      else {
        this.CreditCardPurchasesService.createCreditCardPurchases(this.workspaceId, [expense_group_id]).subscribe(result => {
          this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
        });
      }
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
    window.open(`${environment.fyle_url}/app/main/#/enterprise/view_expense/${expenseId}`, '_blank');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.expenseGroupId = +params['expense_group_id'];
      this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
      forkJoin(
        [
          this.expenseGroupsService.getExpensesGroupById(this.workspaceId, this.expenseGroupId),
          this.expenseGroupsService.getExpensesByExpenseGroupId(this.workspaceId, this.expenseGroupId),
          this.tasksService.getTasksByExpenseGroupId(this.workspaceId, this.expenseGroupId)
        ]
      ).subscribe(response => {
        this.expenseGroup = response[0];
        this.expenses = response[1];
        if (response[2].length) {
          this.task = response[2][0];
        }
        this.isLoading = false;
      });
    });
  }

}
