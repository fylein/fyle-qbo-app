import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkspaceService } from './workspace.service';
import { SettingsService } from './settings/settings.service'
import { forkJoin } from 'rxjs';
import { MappingsService } from './mappings/mappings.service';
import { environment } from 'src/environments/environment';

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const CALLBACK_URI = environment.callback_uri;
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
  mappingSettings: any;

  constructor(private workspaceService: WorkspaceService, private settingsService: SettingsService, private router: Router) {
  }

  getGeneralSettings() { 

    forkJoin(
      [
        this.settingsService.getGeneralSettings(this.workspace.id),
        this.settingsService.getMappingSettings(this.workspace.id)
      ]
    ).subscribe(responses => {
      this.generalSettings = responses[0];
      this.mappingSettings = responses[1]['results'];
      
      let employeeFieldMapping = this.mappingSettings.filter(
        setting => (setting.source_field === 'EMPLOYEE') && 
        (setting.destination_field === 'EMPLOYEE' || setting.destination_field === 'VENDOR')
      )[0];

      let projectFieldMapping = this.mappingSettings.filter(
        settings => settings.source_field === 'PROJECT'
      )[0];

      let costCenterFieldMapping = this.mappingSettings.filter(
        settings => settings.source_field === 'COST_CENTER'
      )[0];

      this.generalSettings['employee_field_mapping'] = employeeFieldMapping.destination_field;

      if (projectFieldMapping) {
        this.generalSettings['project_field_mapping'] = projectFieldMapping.destination_field;
      }

      if (costCenterFieldMapping) {
        this.generalSettings['cost_center_field_mapping'] = costCenterFieldMapping.destination_field;
      }

      localStorage.setItem('generalSettings', JSON.stringify(this.generalSettings));
    });
  }

  switchWorkspace() {
    localStorage.clear();
    window.location.href =
    FYLE_URL +
    '/app/developers/#/oauth/authorize?' +
    'client_id=' +
    FYLE_CLIENT_ID +
    '&redirect_uri=' +
    CALLBACK_URI +
    '&response_type=code';
  }

  createWorkspace(pathName) {
    this.workspaceService.createWorkspace().subscribe(workspace => {
      this.workspace = workspace;
      this.isLoading = false;
      if (pathName === '/workspaces') {
        this.router.navigateByUrl(`/workspaces/${this.workspace.id}/settings`);
      }
    });
  }

  ngOnInit() {
    this.workspaceService.getWorkspaces().subscribe(workspaces => {
      let pathName = window.location.pathname;
      if (Array.isArray(workspaces) && workspaces.length) {
        const oldWorkspace =  workspaces.some(element => {
          if (element.fyle_org_id === this.user.org_id) {
            this.workspace = element;
          }
          return element.fyle_org_id === this.user.org_id;
        });
        if (oldWorkspace) {
          this.isLoading = false;
          if (pathName === '/workspaces') {
            this.router.navigateByUrl(`/workspaces/${this.workspace.id}/expense_groups`);
          }
          this.getGeneralSettings();
        } else {
          this.createWorkspace(pathName);
        }
      } else {
        this.createWorkspace(pathName);
      }
    });
  }
}
