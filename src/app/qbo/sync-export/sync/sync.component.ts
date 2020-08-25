import { Component, OnInit } from '@angular/core';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';
import { Task } from 'src/app/core/models/task.model';
import { MappingsService } from '../../../core/services/mappings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ExpenseGroupSettingsDialogComponent } from './expense-group-settings-dialog/expense-group-settings-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss', '../../qbo.component.scss']
})
export class SyncComponent implements OnInit {

  workspaceId: number;
  lastTask: Task;
  isLoading: boolean;
  isExpensesSyncing: boolean;
  isEmployeesSyncing: boolean;
  importExpensesForm: FormGroup;
  errorOccurred = false;

  constructor(private expenseGroupService: ExpenseGroupsService, private route: ActivatedRoute, private taskService: TasksService, private snackBar: MatSnackBar, private formBuilder: FormBuilder, public dialog: MatDialog) { }

  syncExpenses() {
    const that = this;
    that.isExpensesSyncing = true;

    const expenseGroupConfiguration = that.importExpensesForm.value.expenseGroupConfiguration;
    const expenseStates = that.importExpensesForm.value.expenseStates;
    const exportDate = that.importExpensesForm.value.exportDate;

    that.expenseGroupService.syncExpenseGroups(expenseGroupConfiguration, expenseStates, exportDate).subscribe((res) => {
      that.updateLastSyncStatus();
      that.snackBar.open('Importing Complete');
      that.isExpensesSyncing = false;
    }, (error) => {
      that.isExpensesSyncing = false;
      that.snackBar.open('Importing Failed');
      that.errorOccurred = true;
    });
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
    that.taskService.getTasks(1, 0, 'ALL').subscribe((res) => {
      if (res.count > 0) {
        that.lastTask = res.results[0];
      }
      that.isLoading = false;
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;

    that.importExpensesForm = that.formBuilder.group({
      expenseGroupConfiguration: [''],
      expenseStates: [''],
      exportDate: ['']
    });

    that.isExpensesSyncing = false;
    this.updateLastSyncStatus();
  }

}
