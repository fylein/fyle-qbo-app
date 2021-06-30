
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TasksService } from 'src/app/core/services/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/core/models/task.model';
import { QuickbooksError } from 'src/app/core/models/quickbooks-error.model';

@Component({
  selector: 'app-group-quickbooks-error',
  templateUrl: './group-quickbooks-error.component.html',
  styleUrls: ['./group-quickbooks-error.component.scss']
})
export class GroupQuickbooksErrorComponent implements OnInit {

  isLoading = false;
  expenseGroupId: number;
  workspaceId: number;
  count: number;

  quickbooksError: MatTableDataSource <any> = new MatTableDataSource([]);
  columnsToDisplay = ['shortDescription', 'longDescription', 'type'];

  constructor(private taskService: TasksService, private route: ActivatedRoute) { }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.parent.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.parent.params.expense_group_id;
    that.isLoading = true;
    that.taskService.getTasksByExpenseGroupId(that.expenseGroupId).subscribe((res: Task[]) => {
      that.quickbooksError = new MatTableDataSource(res[0].quickbooks_errors);
      that.count = res[0].quickbooks_errors && res[0].quickbooks_errors.length;
      that.isLoading = false;
    });
  }
}
