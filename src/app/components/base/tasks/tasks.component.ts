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
  tasks: any;
  limit: number = 10;
  offset: number = 0;
  state: string = 'ALL';
  nextPageLink: string;
  previousPageLink: string;
  count: number;
  isLoading: boolean = true;
  inProgress: string = 'active';
  complete: string;
  failed: string;

  constructor(private route: ActivatedRoute, private tasksService: TasksService) {}

  nextPage() {
    this.offset = this.offset + this.limit;
    this.isLoading = true;
    this.getPaginatedTasks();
  }

  previousPage() {
    this.offset = this.offset - this.limit;
    this.isLoading = true;
    this.getPaginatedTasks();
  }
  
  changeState(state: string) {
    this.isLoading = true;
    this.offset = 0;
    if(state === 'ALL') {
      this.state = 'ALL';
      this.inProgress = 'active';
      this.complete = '';
      this.failed = '';
    } else if(state === 'COMPLETE') {
      this.state = 'COMPLETE';
      this.inProgress = '';
      this.complete = 'active';
      this.failed = '';
    } else if(state === 'FAILED') {
      this.state = 'FAILED';
      this.inProgress = '';
      this.complete = '';
      this.failed = 'active';
    }
    this.getPaginatedTasks();
  }

  getPaginatedTasks() {
    this.tasksService.getTasks(this.workspaceId, this.limit, this.offset, this.state).subscribe(tasks => {
      this.nextPageLink = tasks.next;
      this.previousPageLink = tasks.previous;
      this.count = tasks.count;
      this.tasks = tasks.results;
      console.log(this.tasks);
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.getPaginatedTasks();
    });
  }
}
