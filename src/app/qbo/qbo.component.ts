import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { SettingsService } from '../core/services/settings.service';
import { BillsService } from '../core/services/bills.service';
import { StorageService } from '../core/services/storage.service';
import { TrackingService } from '../core/services/tracking.service';
import { WindowReferenceService } from '../core/services/window.service';
import { UserProfile } from '../core/models/user-profile.model';
import { Workspace } from '../core/models/workspace.model';
import { GeneralSetting } from '../core/models/general-setting.model';
import { MappingSetting } from '../core/models/mapping-setting.model';
import { MappingSettingResponse } from '../core/models/mapping-setting-response.model';
import { MappingsService } from '../core/services/mappings.service';
import { MatSnackBar } from '@angular/material';
import * as Sentry from '@sentry/angular';

@Component({
  selector: 'app-qbo',
  templateUrl: './qbo.component.html',
  styleUrls: ['./qbo.component.scss']
})
export class QboComponent implements OnInit {
  user: UserProfile;
  orgsCount: number;
  workspace: Workspace;
  isLoading = true;
  fyleConnected: boolean;
  qboConencted: boolean;
  generalSettings: GeneralSetting;
  mappingSettings: MappingSetting[];
  showSwitchOrg: boolean;
  showRefreshIcon: boolean;
  qboCompanyName: string;
  navDisabled = true;
  windowReference: Window;

  constructor(
    private workspaceService: WorkspaceService,
    private settingsService: SettingsService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private mappingsService: MappingsService,
    private billService: BillsService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService,
    private trackingService: TrackingService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  refreshDashboardMappingSettings(mappingSettings: MappingSetting[]) {
    const that = this;

    that.mappingSettings = mappingSettings.filter(
      setting => (setting.source_field !== 'EMPLOYEE' && setting.source_field !== 'CATEGORY')
    );
    that.isLoading = false;
  }

  getGeneralSettings() {
    const that = this;

    that.getMappingSettings().then((mappingSettings: MappingSetting[]) => {
      that.refreshDashboardMappingSettings(mappingSettings);
    });
  }

  getMappingSettings() {
    const that = this;

    return that.settingsService.getMappingSettings(that.workspace.id).toPromise().then((mappingSetting: MappingSettingResponse) => {
      return mappingSetting.results;
    }, () => {
      that.isLoading = false;
    });
  }

  switchWorkspace() {
    this.authService.switchWorkspace();
    this.trackingService.onSwitchWorkspace();
    Sentry.configureScope(scope => scope.setUser(null));
  }

  getSettingsAndNavigate() {
    const that = this;
    const pathName = that.windowReference.location.pathname;
    that.storageService.set('workspaceId', that.workspace.id);
    if (pathName === '/workspaces') {
      that.router.navigateByUrl(`/workspaces/${that.workspace.id}/dashboard`);
    }
    that.getGeneralSettings();
    that.setupAccessiblePathWatchers();
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
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

  setupAccessiblePathWatchers() {
    const that = this;
    that.getConfigurations().then(() => {
      that.navDisabled = false;
    }).catch(() => {
      // do nothing
    });

    that.router.events.subscribe(() => {
      const onboarded = that.storageService.get('onboarded');
      if (onboarded !== true) {
        that.getConfigurations().then(() => {
          that.navDisabled = false;
        }).catch(() => {
          // do nothing
        });
      }
    });
  }

  setupWorkspace() {
    const that = this;
    that.user = that.authService.getUser();
    that.workspaceService.getWorkspaces(that.user.org_id).subscribe(workspaces => {
      if (Array.isArray(workspaces) && workspaces.length > 0) {
        that.workspace = workspaces[0];
        that.setUserIdentity(that.user.employee_email, workspaces[0].id, {fullName: that.user.full_name});
        that.getSettingsAndNavigate();
      } else {
        that.workspaceService.createWorkspace().subscribe(workspace => {
          that.workspace = workspace;
          that.setUserIdentity(that.user.employee_email, workspace.id, {fullName: that.user.full_name});
          that.getSettingsAndNavigate();
        });
      }
      that.getQboPreferences();
    });
  }

  setUserIdentity(email: string, workspaceId: number, properties) {
    Sentry.setUser({
      email,
      workspaceId,
    });
    this.trackingService.onSignIn(email, workspaceId, properties);
  }

  onSignOut() {
    Sentry.configureScope(scope => scope.setUser(null));
    this.trackingService.onSignOut();
  }

  onConfigurationsPageVisit() {
    this.trackingService.onPageVisit('Configurations');
  }

  onGeneralMappingsPageVisit() {
    throw new Error('test for single quotes');
    this.trackingService.onPageVisit('Genral Mappings');
  }

  onEmployeeMappingsPageVisit() {
    this.trackingService.onPageVisit('Employee Mappings');
  }

  onCategoryMappingsPageVisit() {
    this.trackingService.onPageVisit('Category Mappings');
  }

  getQboPreferences() {
    const that = this;
    that.billService.getOrgDetails().subscribe((res) => {
      that.qboCompanyName = res.CompanyName;
    });
  }

  hideRefreshIconVisibility() {
    this.showRefreshIcon = false;
  }

  syncDimension() {
    const that = this;
    that.mappingsService.refreshDimension();
    that.snackBar.open('Refreshing Fyle and Quickbooks Data');
  }

  ngOnInit() {
    const that = this;
    const onboarded = that.storageService.get('onboarded');
    that.showRefreshIcon = !onboarded;
    that.navDisabled = onboarded !== true;
    that.orgsCount = that.authService.getOrgCount();
    that.setupWorkspace();
  }
}
