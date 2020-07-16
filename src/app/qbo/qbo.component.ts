import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { SettingsService } from '../core/services/settings.service';
import { BillsService } from '../core/services/bills.service';
import { StorageService } from '../core/services/storage.service';
import { WindowReferenceService } from '../core/services/window.service';

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
  qboCompanyName: string;
  navDisabled = true;
  windowReference: Window;

  constructor(
    private workspaceService: WorkspaceService,
    private settingsService: SettingsService,
    private router: Router,
    private authService: AuthService,
    private billService: BillsService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  getGeneralSettings() {
    const that = this;
    forkJoin(
      [
        that.settingsService.getGeneralSettings(that.workspace.id),
        that.settingsService.getMappingSettings(that.workspace.id)
      ]
    ).subscribe((responses) => {
      that.generalSettings = responses[0];
      that.mappingSettings = responses[1].results;

      const employeeFieldMapping = that.mappingSettings.filter(
        setting => (setting.source_field === 'EMPLOYEE') &&
          (setting.destination_field === 'EMPLOYEE' || setting.destination_field === 'VENDOR')
      )[0];

      const projectFieldMapping = that.mappingSettings.filter(
        settings => settings.source_field === 'PROJECT'
      )[0];

      const costCenterFieldMapping = that.mappingSettings.filter(
        settings => settings.source_field === 'COST_CENTER'
      )[0];

      that.generalSettings.employee_field_mapping = employeeFieldMapping.destination_field;

      if (projectFieldMapping) {
        that.generalSettings.project_field_mapping = projectFieldMapping.destination_field;
      }

      if (costCenterFieldMapping) {
        that.generalSettings.cost_center_field_mapping = costCenterFieldMapping.destination_field;
      }
      that.storageService.set('generalSettings', that.generalSettings);
    });
  }

  switchWorkspace() {
    this.authService.switchWorkspace();
  }

  getSettingsAndNavigate() {
    const pathName = this.windowReference.location.pathname;
    this.isLoading = false;
    if (pathName === '/workspaces') {
      this.router.navigateByUrl(`/workspaces/${this.workspace.id}/dashboard`);
    }
    this.getGeneralSettings();
  }

  getConfigurations() {
    const that = this;

    return forkJoin(
      [
        that.settingsService.getGeneralSettings(that.workspace.id),
        that.settingsService.getMappingSettings(that.workspace.id)
      ]
    ).toPromise();
  }

  setupWorkspace() {
    const that = this;
    that.user = that.authService.getUser();
    that.workspaceService.getWorkspaces(that.user.org_id).subscribe(workspaces => {
      if (Array.isArray(workspaces) && workspaces.length) {
        that.workspace = workspaces[0];
        that.getSettingsAndNavigate();
      } else {
        that.workspaceService.createWorkspace().subscribe(workspace => {
          that.workspace = workspace;
          that.getSettingsAndNavigate();
        });
      }
      that.getQboPreferences();

      that.getConfigurations().then(() => {
        that.navDisabled = false;
      }).catch(() => {
        // do nothing
      });

      that.router.events.subscribe(() => {
        const onboarded = that.storageService.get('onboarded');
        if (onboarded !== 'true') {
          that.getConfigurations().then(() => {
            that.navDisabled = false;
          }).catch(() => {
            // do nothing
          });
        }
      });
    });
  }

  getQboPreferences() {
    const that = this;
    that.billService.getOrgDetails(that.workspace.id).subscribe((res) => {
      that.qboCompanyName = res.CompanyName;
    });
  }

  ngOnInit() {
    const that = this;
    const onboarded = that.storageService.get('onboarded');
    that.navDisabled = onboarded !== 'true';
    that.orgsCount = that.authService.getOrgCount();
    that.setupWorkspace();
  }
}
