import { Component, OnInit } from '@angular/core';
import { ExpenseGroup } from 'src/app/core/models/expenseGroups.model';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { BillsService } from 'src/app/core/services/bills.service';
import { JournalEntriesService } from '../../journal-entries/journal-entries.service';
import { ChecksService } from '../../checks/checks.service';

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

  constructor(private route: ActivatedRoute, private expenseGroupService: ExpenseGroupsService, private journalEntriesService: JournalEntriesService, private billsService:BillsService, private checksService: ChecksService) { }

  exportReimbursibleExpenses(reimbursableExpensesObject):Function {
    let that = this;
    let handlerMap =  {
      BILL: function (workspaceId, filteredIds) {
        return that.billsService.createBills(workspaceId, filteredIds)
      },
      CHECK: function (workspaceId, filteredIds) {
        return that.checksService.createChecks(workspaceId, filteredIds)
      },
      JOURNAL: function (workspaceId, filteredIds) {
        return that.journalEntriesService.createJournalEntries(workspaceId, filteredIds)
      }
    };

    return handlerMap[reimbursableExpensesObject] || handlerMap.JOURNAL;
  }

  exportCCCExpenses(corporateCreditCardExpensesObject):Function {
    let that = this;
    let handlerMap =  {
      'JOURNAL ENTRY': function (workspaceId, filteredIds) {
        return that.billsService.createBills(workspaceId, filteredIds)
      },
      'CREDIT CARD PURCHASE': function (workspaceId, filteredIds) {
        return that.checksService.createChecks(workspaceId, filteredIds)
      }
    };

    return handlerMap[corporateCreditCardExpensesObject] || handlerMap['CREDIT_CARD_PURCHASE'];
  }

  createQBOItems() {
    let that = this;
    that.isExporting = true;
    that.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
    if (that.generalSettings.reimbursable_expenses_object) {
      let filteredIds = that.exportableExpenseGroups.filter(expenseGroup => expenseGroup.fund_source == 'PERSONAL').map(expenseGroup => expenseGroup.id);
      if (filteredIds.length > 0) {
        that.exportReimbursibleExpenses(that.generalSettings.reimbursable_expenses_object)(that.workspaceId, filteredIds).subscribe(function (res) {
          that.loadExportableExpenseGroups();
          that.isExporting = false;
        });
      }
    } else if (that.generalSettings.corporate_credit_card_expenses_object) {
      let filteredIds = that.exportableExpenseGroups.filter(expenseGroup => expenseGroup.fund_source == 'CCC').map(expenseGroup => expenseGroup.id);
      if (filteredIds.length > 0) {
        that.exportCCCExpenses(that.workspaceId)(that.workspaceId, filteredIds).subscribe(function (res) {
          that.loadExportableExpenseGroups();
          that.isExporting = false;
        });
      }
    }
  }

  loadExportableExpenseGroups() {
    let that = this;
    that.isLoading = true;
    that.expenseGroupService.getAllExpenseGroups(that.workspaceId, 'READY').subscribe(function (res) {
      that.exportableExpenseGroups = res.results;
      that.isLoading = false;
    });
  }

  ngOnInit() {
    let that = this;
    that.isLoading = false;
    that.isExporting = false;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.loadExportableExpenseGroups();
  }

}
