import { Component, OnInit } from '@angular/core';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseGroup } from 'src/app/core/models/expenseGroups.model';
import { TasksService } from 'src/app/core/services/tasks.service';
import { Task } from 'src/app/core/models/task.model';
import { MappingsService } from '../../../core/services/mappings.service';
import { concat } from 'rxjs/internal/observable/concat';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss']
})
export class SyncComponent implements OnInit {

  workspaceId: number;
  // lastSyncedExpenseGroup: ExpenseGroup;
  lastTask: Task;
  isLoading: boolean;
  isExpensesSyncing: boolean;
  isEmployeesSyncing: boolean;

  constructor(private expenseGroupService: ExpenseGroupsService, private route: ActivatedRoute, private taskService: TasksService, private mappingService: MappingsService) { }

  syncExpenses() {
    const that = this;
    that.isExpensesSyncing = true;
    that.expenseGroupService.syncExpenseGroups(that.workspaceId).subscribe((res) => {
      that.updateLastSyncStatus();
      that.isExpensesSyncing = false;
    });
  }

  updateLastSyncStatus() {
    const that = this;
    that.isLoading = true;
    that.taskService.getTasks(that.workspaceId, 1, 0, 'ALL').subscribe((res) => {
      if (res.count > 0) {
        that.lastTask = res.results[0];
      }
      that.isLoading = false;
    });
  }

  updateDimensionTables() {
    const that = this;
    that.isEmployeesSyncing = true;
    concat(
        this.mappingService.postAccountsPayables(that.workspaceId),
        this.mappingService.postBankAccounts(that.workspaceId),
        this.mappingService.postExpenseAccounts(that.workspaceId),
        this.mappingService.postCreditCardAccounts(that.workspaceId),
        this.mappingService.postQBOEmployees(that.workspaceId),
        this.mappingService.postQBOVendors(that.workspaceId),
        this.mappingService.postQBOCustomers(that.workspaceId),
        this.mappingService.postQBOClasses(that.workspaceId),
        this.mappingService.postQBODepartments(that.workspaceId),
        this.mappingService.postFyleEmployees(that.workspaceId),
        this.mappingService.postFyleCategories(that.workspaceId),
        this.mappingService.postFyleCostCenters(that.workspaceId),
        this.mappingService.postFyleProjects(that.workspaceId)
    ).subscribe((response) => {
      that.isEmployeesSyncing = false;
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;

    that.isExpensesSyncing = false;
    this.updateLastSyncStatus();
  }

}
