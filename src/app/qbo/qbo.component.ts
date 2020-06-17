import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { SettingsService } from '../core/services/settings.service';

@Component({
  selector: 'app-qbo',
  templateUrl: './qbo.component.html',
  styleUrls: ['./qbo.component.scss']
})
export class QboComponent implements OnInit {
  user: any;
  orgsCount: number;
  workspace: any = {};
  isLoading = true;
  fyleConnected = false;
  qboConencted = false;
  generalSettings: any;
  mappingSettings: any;
  showSwitchOrg = false;

  constructor(
    private workspaceService: WorkspaceService,
    private settingsService: SettingsService,
    private router: Router,
    private authService: AuthService
    ) {
  }

  getGeneralSettings() {
    forkJoin(
      [
        this.settingsService.getGeneralSettings(this.workspace.id),
        this.settingsService.getMappingSettings(this.workspace.id)
      ]
    ).subscribe(responses => {
      this.generalSettings = responses[0];
      this.mappingSettings = responses[1].results;

      const employeeFieldMapping = this.mappingSettings.filter(
        setting => (setting.source_field === 'EMPLOYEE') &&
        (setting.destination_field === 'EMPLOYEE' || setting.destination_field === 'VENDOR')
      )[0];

      const projectFieldMapping = this.mappingSettings.filter(
        settings => settings.source_field === 'PROJECT'
      )[0];

      const costCenterFieldMapping = this.mappingSettings.filter(
        settings => settings.source_field === 'COST_CENTER'
      )[0];

      this.generalSettings.employee_field_mapping = employeeFieldMapping.destination_field;

      if (projectFieldMapping) {
        this.generalSettings.project_field_mapping = projectFieldMapping.destination_field;
      }

      if (costCenterFieldMapping) {
        this.generalSettings.cost_center_field_mapping = costCenterFieldMapping.destination_field;
      }

      localStorage.setItem('generalSettings', JSON.stringify(this.generalSettings));
    });
  }

  switchWorkspace() {
    this.authService.switchWorkspace();
  }

  getSettingsAndNavigate(location) {
    const pathName = window.location.pathname;
    this.isLoading = false;
    if (pathName === '/workspaces') {
      this.router.navigateByUrl(`/workspaces/${this.workspace.id}/${location}`);
    }
    this.getGeneralSettings();
  }

  setupWorkspace() {
    this.user = this.authService.getUser();
    this.workspaceService.getWorkspaces(this.user.org_id).subscribe(workspaces => {
      if (Array.isArray(workspaces) && workspaces.length) {
        this.workspace = workspaces[0];
        this.getSettingsAndNavigate('expense_groups');
      } else {
        this.workspaceService.createWorkspace().subscribe(workspace => {
          this.workspace = workspace;
          this.getSettingsAndNavigate('settings');
        });
      }
    });
  }

  ngOnInit() {
    this.orgsCount = this.authService.getOrgCount();
    this.setupWorkspace();
  }
}
