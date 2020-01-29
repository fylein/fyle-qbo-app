import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceService } from './workspace.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
})
export class BaseComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));;
  workspace: any = {};
  isLoading: boolean = true;

  constructor(private workspaceService: WorkspaceService) {
    this.workspaceService.getWorkspaces().subscribe(workspaces => {
      if (Array.isArray(workspaces) && workspaces.length) {
        this.workspace = workspaces[0];
        this.isLoading = false;
      } else {
        this.workspaceService.createWorkspace().subscribe(workspace => {
          this.workspace = workspace;
          this.isLoading = false;
        });
      }
    });
  }

  ngOnInit() {
  }
}
