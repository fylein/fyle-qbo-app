import { Component, OnInit } from '@angular/core';
import { ExpenseGroup } from 'src/app/core/models/expenseGroups.model';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { BillsService } from 'src/app/core/services/bills.service';
import { JournalEntriesService } from '../../journal-entries/journal-entries.service';
import { ChecksService } from '../../checks/checks.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { concat, interval, from } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  isLoading: boolean;
  isExporting: boolean;
  workspaceId: number;
  exportableExpenseGroups: ExpenseGroup[];
  generalSettings: any;
  failedExpenseGroupCount = 0;
  successfulExpenseGroupCount = 0;

  constructor(private route: ActivatedRoute, private taskService: TasksService, private expenseGroupService: ExpenseGroupsService, private journalEntriesService: JournalEntriesService, private billsService: BillsService, private checksService: ChecksService) { }

  exportReimbursibleExpenses(reimbursableExpensesObject): Function {
    const that = this;
    const handlerMap =  {
      BILL: (workspaceId, filteredIds) => {
        return that.billsService.createBills(workspaceId, filteredIds);
      },
      CHECK: (workspaceId, filteredIds) => {
        return that.checksService.createChecks(workspaceId, filteredIds);
      },
      JOURNAL: (workspaceId, filteredIds) => {
        return that.journalEntriesService.createJournalEntries(workspaceId, filteredIds);
      }
    };

    return handlerMap[reimbursableExpensesObject] || handlerMap.JOURNAL;
  }

  exportCCCExpenses(corporateCreditCardExpensesObject): Function {
    const that = this;
    const handlerMap =  {
      'JOURNAL ENTRY': (workspaceId, filteredIds) => {
        return that.billsService.createBills(workspaceId, filteredIds);
      },
      'CREDIT CARD PURCHASE': (workspaceId, filteredIds) => {
        return that.checksService.createChecks(workspaceId, filteredIds);
      }
    };

    return handlerMap[corporateCreditCardExpensesObject] || handlerMap['CREDIT CARD PURCHASE'];
  }

  openFailedExports() {
    const that = this;
    window.open(`workspaces/${that.workspaceId}/expense_groups?state=FAILED`, '_blank');
  }

  openSuccessfulExports() {
    const that = this;
    window.open(`workspaces/${that.workspaceId}/expense_groups?state=COMPLETE`, '_blank');
  }

  createQBOItems() {
    const that = this;
    that.isExporting = true;
    that.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
    if (that.generalSettings.reimbursable_expenses_object) {
      const filteredIds = that.exportableExpenseGroups.filter(expenseGroup => expenseGroup.fund_source === 'PERSONAL').map(expenseGroup => expenseGroup.id);
      if (filteredIds.length > 0) {
        that.exportReimbursibleExpenses(that.generalSettings.reimbursable_expenses_object)(that.workspaceId, filteredIds).subscribe(() => {
          interval(3000).pipe(
            switchMap(() => from(that.taskService.getTasks(that.workspaceId, 10, 0, 'ALL'))),
            takeWhile((response) => response.results.filter(task => task.status === 'IN_PROGRESS').length > 0, true)
          ).subscribe( () => {
            that.taskService.getAllTasks(that.workspaceId, 'FAILED').subscribe((taskResponse) => {
              that.failedExpenseGroupCount = taskResponse.count;
              that.successfulExpenseGroupCount = filteredIds.length - that.failedExpenseGroupCount;
              that.isExporting = false;
            });
          });
        });
      }
    } else if (that.generalSettings.corporate_credit_card_expenses_object) {
      const filteredIds = that.exportableExpenseGroups.filter(expenseGroup => expenseGroup.fund_source == 'CCC').map(expenseGroup => expenseGroup.id);
      if (filteredIds.length > 0) {
        that.exportCCCExpenses(that.workspaceId)(that.workspaceId, filteredIds).subscribe((res) => {
          that.loadExportableExpenseGroups();
          that.isExporting = false;
        });
      }
    }
  }

  loadExportableExpenseGroups() {
    const that = this;
    that.isLoading = true;
    that.expenseGroupService.getAllExpenseGroups(that.workspaceId, 'READY').subscribe(function(res) {
      that.exportableExpenseGroups = res.results;
      that.isLoading = false;
    });
  }

  ngOnInit() {
    const that = this;
    that.isLoading = false;
    that.isExporting = false;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.loadExportableExpenseGroups();
  }

}
