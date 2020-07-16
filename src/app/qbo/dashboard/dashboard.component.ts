import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, concat } from 'rxjs';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { environment } from 'src/environments/environment';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const QBO_CLIENT_ID = environment.qbo_client_id;
const QBO_SCOPE = environment.qbo_scope;
const QBO_AUTHORIZE_URI = environment.qbo_authorize_uri;
const APP_URL = environment.app_url;

enum onboardingStates {
  initialized,
  fyleConnected,
  qboConnected,
  configurationsDone,
  generalMappingsDone,
  employeeMappingsDone,
  categoryMappingsDone,
  isOnboarded
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../qbo.component.scss']
})
export class DashboardComponent implements OnInit {
  workspaceId: number;
  isLoading = false;

  currentState = onboardingStates.initialized;

  get allOnboardingStates() {
    return onboardingStates;
  }

  rippleDisabled = true;
  linearMode = true;

  successfulExpenseGroupsCount = 0;
  failedExpenseGroupsCount = 0;
  windowReference: Window;

  constructor(
    private expenseGroupService: ExpenseGroupsService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private mappingsService: MappingsService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  connectFyle() {
    this.windowReference.location.href = `${FYLE_URL}/app/developers/#/oauth/authorize?client_id=${FYLE_CLIENT_ID}&redirect_uri=${APP_URL}/workspaces/fyle/callback&response_type=code&state=${this.workspaceId}`;
  }

  connectQBO() {
    this.windowReference.location.href = QBO_AUTHORIZE_URI + '?client_id=' + QBO_CLIENT_ID + '&scope=' + QBO_SCOPE + '&response_type=code&redirect_uri=' + APP_URL + '/workspaces/qbo/callback&state=' + this.workspaceId;
  }

  checkFyleLoginStatus() {
    const that = this;
    return that.settingsService.getFyleCredentials(that.workspaceId).toPromise().then(credentials => {
      that.currentState = onboardingStates.fyleConnected;
      return credentials;
    });
  }


  getQboStatus() {
    const that = this;

    return that.settingsService.getQBOCredentials(that.workspaceId).toPromise().then(credentials => {
      that.currentState = onboardingStates.qboConnected;
      return credentials;
    });
  }

  getConfigurations() {
    const that = this;

    return forkJoin(
      [
        that.settingsService.getGeneralSettings(that.workspaceId),
        that.settingsService.getMappingSettings(that.workspaceId)
      ]
    ).toPromise().then((res) => {
      that.currentState = onboardingStates.configurationsDone;
      return res;
    });
  }

  getGeneralMappings() {
    const that = this;
    return that.mappingsService.getGeneralMappings(that.workspaceId).toPromise().then(generalMappings => {
      that.currentState = onboardingStates.generalMappingsDone;
      return generalMappings;
    });
  }

  getEmployeeMappings() {
    const that = this;
    return that.mappingsService.getMappings(that.workspaceId, 'EMPLOYEE').toPromise().then((res) => {
      if (res.results.length) {
        that.currentState = onboardingStates.employeeMappingsDone;
      } else {
        throw new Error('employee mappings have no entries');
      }
      return res;
    });
  }

  getCategoryMappings() {
    const that = this;
    return that.mappingsService.getMappings(this.workspaceId, 'CATEGORY').toPromise().then((res) => {
      if (res.results.length) {
        that.currentState = onboardingStates.categoryMappingsDone;
      } else {
        throw new Error('cateogry mappings have no entries');
      }
      return res;
    });
  }

  loadSuccessfullExpenseGroupsCount() {
    const that = this;
    return that.expenseGroupService.getAllExpenseGroups(that.workspaceId, 'COMPLETE').toPromise().then((res) => {
      that.successfulExpenseGroupsCount = res.results.length;
      return res;
    });
  }

  loadFailedlExpenseGroupsCount() {
    const that = this;
    return that.expenseGroupService.getAllExpenseGroups(that.workspaceId, 'FAILED').toPromise().then((res) => {
      that.failedExpenseGroupsCount = res.results.length;
      return res;
    });
  }

  loadDashboardData() {
    const that = this;
    that.isLoading = true;
    return forkJoin([
      that.loadSuccessfullExpenseGroupsCount(),
      that.loadFailedlExpenseGroupsCount()
    ]).toPromise().then(() => {
      that.isLoading = false;
      return true;
    });
  }

  // to be callled in background whenever dashboard is opened for sncing fyle data for org
  updateDimensionTables() {
    const that = this;
    concat(
      this.mappingsService.postAccountsPayables(that.workspaceId),
      this.mappingsService.postBankAccounts(that.workspaceId),
      this.mappingsService.postExpenseAccounts(that.workspaceId),
      this.mappingsService.postCreditCardAccounts(that.workspaceId),
      this.mappingsService.postQBOEmployees(that.workspaceId),
      this.mappingsService.postQBOVendors(that.workspaceId),
      this.mappingsService.postQBOCustomers(that.workspaceId),
      this.mappingsService.postQBOClasses(that.workspaceId),
      this.mappingsService.postQBODepartments(that.workspaceId),
      this.mappingsService.postFyleEmployees(that.workspaceId),
      this.mappingsService.postFyleCategories(that.workspaceId),
      this.mappingsService.postFyleCostCenters(that.workspaceId),
      this.mappingsService.postFyleProjects(that.workspaceId)
    ).subscribe(() => {
      // that.snackBar.open('All employee data synced from your fyle account');
    });
  }

  openSchedule(event) {
    const that = this;
    event.preventDefault();
    this.windowReference.open(`workspaces/${that.workspaceId}/settings/schedule`, '_blank');
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.params.workspace_id;
    const onboarded = that.storageService.get('onboarded');

    if (onboarded === true) {
      that.currentState = onboardingStates.isOnboarded;
      that.updateDimensionTables();
      that.loadDashboardData();
    } else {
      that.isLoading = true;
      that.checkFyleLoginStatus()
        .then(() => {
          return that.getQboStatus();
        }).then(() => {
          that.updateDimensionTables();
          return that.getConfigurations();
        }).then(() => {
          return that.getGeneralMappings();
        }).then(() => {
          return that.getEmployeeMappings();
        }).then(() => {
          return that.getCategoryMappings();
        }).then(() => {
          that.currentState = onboardingStates.isOnboarded;
          that.storageService.set('onboarded', true);
          return that.loadDashboardData();
        }).catch(() => {
          // do nothing as this just means some steps are left
        }).finally(() => {
          that.isLoading = false;
        });
    }

  }

}
