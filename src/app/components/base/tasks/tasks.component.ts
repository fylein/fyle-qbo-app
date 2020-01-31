import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css', '../base.component.css'],
})
export class TasksComponent implements OnInit {
  workspaceId: number;
  tasks: {any};

  constructor(private route: ActivatedRoute, private tasksService: TasksService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.tasksService.getTasks(this.workspaceId).subscribe(tasks => {
        this.tasks = tasks;
      });
    });
  }
}
