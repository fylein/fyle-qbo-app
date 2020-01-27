import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceService } from './workspace.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
})
export class BaseComponent implements OnInit {
  user: any = {};
  workspace: any = {};
  isLoading: boolean = false;

  setUser() {
    this.workspaceService.getUserProfile(this.workspace.id).subscribe(user => {
      this.user = user;
      this.isLoading = false;
    });
  }

  constructor(private router: Router, private workspaceService: WorkspaceService) {
    this.isLoading = true;
    this.workspaceService.getWorkspaces().subscribe(workspaces => {
      if(Array.isArray(workspaces) && workspaces.length) {
        this.workspace = workspaces[0];
        this.setUser();
      } else {
        this.workspaceService.createWorkspace().subscribe(workspace => {
          this.workspace = workspace
          this.setUser();
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
