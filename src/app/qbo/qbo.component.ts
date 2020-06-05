import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WorkspaceService } from '../core/services/workspace.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from '../core/services/settings.service';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-qbo',
  templateUrl: './qbo.component.html',
  styleUrls: ['./qbo.component.scss']
})
export class QboComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  user = JSON.parse(localStorage.getItem('user'));;
  workspace: any = {};
  isLoading: boolean = true;
  fyleConnected: boolean = false;
  qboConencted: boolean = false;
  generalSettings: any;
  mappingSettings: any;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private workspaceService: WorkspaceService,
    private settingsService: SettingsService,
    private router: Router
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
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

  onadsadsclick(): void {
    console.log('Hola!');
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
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
        this.getGeneralSettings();
      } else {
        this.workspaceService.createWorkspace().subscribe(workspace => {
          this.workspace = workspace;
          this.isLoading = false;
          if (pathName === '/workspaces') {
            this.router.navigateByUrl(`/workspaces/${this.workspace.id}/settings`);
          }
        });
      }
    });
  }
}
