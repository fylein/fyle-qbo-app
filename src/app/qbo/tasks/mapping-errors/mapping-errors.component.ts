import { Component, OnInit, Input } from '@angular/core';
import { TasksService } from '../../../core/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mapping-errors',
  templateUrl: './mapping-errors.component.html',
  styleUrls: ['./mapping-errors.component.scss', '../tasks.component.scss', '../../qbo.component.scss']
})
export class MappingErrorsComponent implements OnInit {
  errors: any[];
  task: any;
  isLoading = true;
  workspaceId: number;

  constructor(private tasksService: TasksService, private route: ActivatedRoute, private router: Router) { }

  goToExpenseGroup(id: number) {
    this.router.navigate([]).then(result => {
      window.open(`workspaces/${this.workspaceId}/expense_groups/${id}/view`, '_blank');
    });
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    const taskId = +params.task_id;
    this.workspaceId = +params.workspace_id;
    this.tasksService.getTaskById(this.workspaceId, taskId).subscribe(response => {
      if (response.length && response[0].detail.length) {
        this.task = response[0];
        this.errors = this.task.detail;
      } else {
        this.router.navigateByUrl('/workspaces');
      }
      this.isLoading = false;
    });
  }

}
