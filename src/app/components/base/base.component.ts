import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceService } from './workspace.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
})
export class BaseComponent implements OnInit {
  fullName: string = 'Example Name';
  workspace: any = {};

  constructor(private router: Router, private workspaceService: WorkspaceService) {
    this.workspaceService.getWorkspaces().subscribe(workspaces => {
      if(Array.isArray(workspaces) && workspaces.length) {
        this.workspace = workspaces[0];
        // this.router.navigate([this.workspace.id + '/tasks']);
      } else {
        this.workspaceService.createWorkspace().subscribe(workspace => {
          this.workspace = workspace
          this.router.navigate([this.workspace.id + '/tasks']);
        });
      }
    },
    error => {
      console.log(error.message);
    });
  }

  ngOnInit() {
  }
}
