import { Component, OnInit } from '@angular/core';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { ExpenseGroupSettingsDialogComponent } from './expense-group-settings-dialog/expense-group-settings-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, from, interval } from 'rxjs';
import { WorkspaceService } from 'src/app/core/services/workspace.service';
import { switchMap, takeWhile } from 'rxjs/operators';
import { Workspace } from 'src/app/core/models/workspace.model';
import { ExpenseGroupSetting } from 'src/app/core/models/expense-group-setting.model';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss', '../../qbo.component.scss']
})
export class SyncComponent implements OnInit {

  workspaceId: number;
  workspace: Workspace;
  isLoading: boolean;
  isExpensesSyncing: boolean;
  isEmployeesSyncing: boolean;
  errorOccurred = false;
  expenseGroupSettings: ExpenseGroupSetting;

  constructor(private expenseGroupService: ExpenseGroupsService, private route: ActivatedRoute, private taskService: TasksService, private workspaceService: WorkspaceService, private snackBar: MatSnackBar, private formBuilder: FormBuilder, public dialog: MatDialog) { }

  syncExpenses() {
    const that = this;
    that.isExpensesSyncing = true;
    that.expenseGroupService.syncExpenseGroups().subscribe((res) => {
      that.checkSyncStatus();
    }, (error) => {
      that.isExpensesSyncing = false;
      that.snackBar.open('Import Failed');
      that.errorOccurred = true;
    });
  }

  checkSyncStatus() {
    const that = this;
    const taskType = ['FETCHING_EXPENSES'];
    const taskStatus = ['IN_PROGRESS', 'ENQUEUED'];
    interval(3000).pipe(
      switchMap(() => from(that.taskService.getAllTasks(taskStatus, [], taskType))),
      takeWhile((response) => response.results.length > 0, true)
    ).subscribe((res) => {
      if (!res.results.length) {
        that.taskService.getAllTasks(['COMPLETE'], [], taskType).subscribe((response) => {
          that.updateLastSyncStatus();
          that.isExpensesSyncing = false;
          that.snackBar.open(response.results.length ? 'Import Complete' : 'Import Failed');
          that.errorOccurred = !response.results.length;
        });
      }
    });
  }

  getDescription() {
    const that = this;

    const allowedFields = ['vendor', 'claim_number', 'settlement_id', 'category'];

    const expensesGroupedByList = [];
    that.expenseGroupSettings.reimbursable_expense_group_fields.forEach(element => {
      if (allowedFields.indexOf(element) >= 0) {
        if (element === 'vendor') {
          element = 'Merchant';
        } else if (element === 'claim_number') {
          element = 'Expense Report';
        } else if (element === 'settlement_id') {
          element = 'Payment';
        } else if (element === 'category') {
          element = 'Category';
        }
        expensesGroupedByList.push(element);
      }
    });

    const expensesGroup = expensesGroupedByList.join(', ');
    const expenseState: string = that.expenseGroupSettings.expense_state;
    let exportDateConfiguration = null;

    if (that.expenseGroupSettings.export_date_type === 'spent_at') {
      exportDateConfiguration = 'Spend Date';
    } else if (that.expenseGroupSettings.export_date_type === 'approved_at') {
      exportDateConfiguration = 'Approval Date';
    } else if (that.expenseGroupSettings.export_date_type === 'verified_at') {
      exportDateConfiguration = 'Verification Date';
    } else if (that.expenseGroupSettings.export_date_type === 'last_spent_at') {
      exportDateConfiguration = 'Last Spend Date';
    }

    return {
      expensesGroupedBy: expensesGroup,
      expenseState: expenseState.replace(/_/g, ' '),
      exportDateType: exportDateConfiguration
    };
  }

  open() {
    const that = this;
    const dialogRef = that.dialog.open(ExpenseGroupSettingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      that.updateLastSyncStatus();
    });
  }

  updateLastSyncStatus() {
    const that = this;
    that.isLoading = true;

    forkJoin(
      [
        that.workspaceService.getWorkspaceById(),
        that.expenseGroupService.getExpenseGroupSettings()
      ]
    )

    .subscribe((res) => {
      that.workspace = res[0];
      that.expenseGroupSettings = res[1];
      that.isLoading = false;
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.isExpensesSyncing = false;
    this.updateLastSyncStatus();
  }

}
