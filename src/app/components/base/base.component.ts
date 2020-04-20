import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkspaceService } from './workspace.service';
import { SettingsService } from './settings/settings.service'

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
})
export class BaseComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));;
  workspace: any = {};
  isLoading: boolean = true;
  fyleConnected: boolean = false;
  qboConencted: boolean = false;
  generalSettings: any;

  constructor(private workspaceService: WorkspaceService, private settingsService: SettingsService, private router: Router) {
  }

  ngOnInit() {
    this.workspaceService.getWorkspaces().subscribe(workspaces => {
      let pathName = window.location.pathname;
      if (Array.isArray(workspaces) && workspaces.length) {
        this.workspace = workspaces[0];
        this.isLoading = false;
        if (pathName === '/workspaces') {
          this.router.navigateByUrl(`/workspaces/${this.workspace.id}/expense_groups`);
        }
      } else {
        this.workspaceService.createWorkspace().subscribe(workspace => {
          this.workspace = workspace;
          this.isLoading = false;
          if (pathName === '/workspaces') {
            this.router.navigateByUrl(`/workspaces/${this.workspace.id}/settings`);
          }
        });
      }
      this.settingsService.getGeneralSettings(this.workspace.id).subscribe(response =>{
        this.generalSettings = response;
      });
    });
  }
}
