import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { environment } from 'src/environments/environment';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { QboComponent } from '../qbo.component';
import { Count } from 'src/app/core/models/count.model';

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
  cardsMappingDone,
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
  generalSettings: GeneralSetting;
  showCardsMapping = true;
  skipCardsMappings = false;

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
    private qbo: QboComponent,
    private snackBar: MatSnackBar,
    private mappingsService: MappingsService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService,
    private trackingService: TrackingService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  connectFyle() {
    this.windowReference.location.href = `${FYLE_URL}/app/developers/#/oauth/authorize?client_id=${FYLE_CLIENT_ID}&redirect_uri=${APP_URL}/workspaces/fyle/callback&response_type=code&state=${this.workspaceId}`;
  }

  connectQBO(onboarding: boolean = false) {
    this.windowReference.location.href = QBO_AUTHORIZE_URI + '?client_id=' + QBO_CLIENT_ID + '&scope=' + QBO_SCOPE + '&response_type=code&redirect_uri=' + APP_URL + '/workspaces/qbo/callback&state=' + this.workspaceId;
    this.onConnectQBOPageVisit(onboarding);
  }

  onConnectQBOPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Connect Quickbooks Online', onboarding);
  }

  onConfigurationsPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Configurations', onboarding);
  }

  onGeneralMappingsPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('General Mappings', onboarding);
  }

  onCardsMappingsPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Cards Mappings', onboarding);
  }

  onEmployeeMappingsPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Employee Mappings', onboarding);
  }

  onCategoryMappingsPageVisit(onboarding: boolean = false) {
    this.trackingService.onPageVisit('Category Mappings', onboarding);
  }

  // TODO: remove promises and do with rxjs observables
  checkFyleLoginStatus() {
    const that = this;
    return that.settingsService.getFyleCredentials(that.workspaceId).toPromise().then(credentials => {
      that.currentState = onboardingStates.fyleConnected;
      return credentials;
    });
  }

  // TODO: remove promises and do with rxjs observables
  getQboStatus() {
    const that = this;

    return that.settingsService.getQBOCredentials(that.workspaceId).toPromise().then(credentials => {
      that.currentState = onboardingStates.qboConnected;
      return credentials;
    });
  }

  getConfigurations() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return forkJoin(
      [
        that.settingsService.getGeneralSettings(that.workspaceId),
        that.settingsService.getMappingSettings(that.workspaceId)
      ]
    ).toPromise().then((res) => {
      that.generalSettings = res[0];
      that.currentState = onboardingStates.configurationsDone;
      if (!res[0].corporate_credit_card_expenses_object || res[0].corporate_credit_card_expenses_object === 'BILL' || res[0].corporate_credit_card_expenses_object === 'DEBIT CARD EXPENSE') {
        that.showCardsMapping = false;
        that.skipCardsMappings = true;
      }
      return res;
    });
  }

  getGeneralMappings() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.mappingsService.getGeneralMappings().toPromise().then(generalMappings => {
      that.currentState = onboardingStates.generalMappingsDone;
      return generalMappings;
    });
  }

  getCardsMappings() {
    const that = this;
    if (that.generalSettings && that.showCardsMapping) {
      if (that.generalSettings.skip_cards_mapping) {
        that.currentState = onboardingStates.cardsMappingDone;
      } else {
        return that.mappingsService.getMappings('CORPORATE_CARD', 'CREDIT_CARD_ACCOUNT', null, 1).toPromise().then((res) => {
          if (res.results.length > 0) {
            that.currentState = onboardingStates.cardsMappingDone;
          } else if (!that.generalSettings.corporate_credit_card_expenses_object || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') {
            that.currentState = onboardingStates.cardsMappingDone;
          } else if (!that.generalSettings.skip_cards_mapping) {
            throw new Error('card mappings have no entries');
          }
          return res;
        });
      }
    }
  }

  getEmployeeMappings() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    if (that.generalSettings && that.generalSettings.auto_create_destination_entity) {
      that.currentState = onboardingStates.employeeMappingsDone;
      return;
    } else {
      return that.mappingsService.getEmployeeMappings(null, 1, 0).toPromise().then((res) => {
        if (res.results.length > 0) {
          that.currentState = onboardingStates.employeeMappingsDone;
        } else {
          throw new Error('employee mappings have no entries');
        }
        return res;
      });
    }
  }

  getCategoryMappings() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.mappingsService.getMappings('CATEGORY', 'ACCOUNT', null, 1).toPromise().then((res) => {
      if (res.results.length > 0) {
        that.currentState = onboardingStates.categoryMappingsDone;
      } else {
        throw new Error('cateogry mappings have no entries');
      }
      return res;
    });
  }

  loadSuccessfullExpenseGroupsCount() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.expenseGroupService.getExpenseGroupCountByState('COMPLETE').toPromise().then((res: Count) => {
      that.successfulExpenseGroupsCount = res.count;
      return res;
    });
  }

  loadFailedlExpenseGroupsCount() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.expenseGroupService.getExpenseGroupCountByState('FAILED').toPromise().then((res: Count) => {
      that.failedExpenseGroupsCount = res.count;
      return res;
    });
  }

  loadDashboardData() {
    const that = this;
    that.isLoading = true;
    // TODO: remove promises and do with rxjs observables
    return forkJoin([
      that.loadSuccessfullExpenseGroupsCount(),
      that.loadFailedlExpenseGroupsCount()
    ]).toPromise().then(() => {
      that.isLoading = false;
      return true;
    });
  }

  syncDimension() {
    const that = this;

    that.mappingsService.refreshDimension();
    that.snackBar.open('Refreshing Fyle and Quickbooks Data');
  }

  // to be callled in background whenever dashboard is opened for sncing fyle data for org
  updateDimensionTables() {
    const that = this;

    that.mappingsService.syncFyleDimensions().subscribe(() => {});
    that.mappingsService.syncQuickbooksDimensions().subscribe(() => {});

  }

  openSchedule(event) {
    const that = this;
    event.preventDefault();
    this.windowReference.open(`workspaces/${that.workspaceId}/settings/schedule`, '_blank');
  }

  skipCardsMapping() {
    const that = this;
    if (that.showCardsMapping) {
      that.isLoading = true;
      that.settingsService.skipCardsMapping(that.workspaceId).subscribe((generalSetting: GeneralSetting) => {
        that.generalSettings = generalSetting;
        that.currentState = onboardingStates.cardsMappingDone;
        that.isLoading = false;
      });
    }
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.params.workspace_id;
    const onboarded = that.storageService.get('onboarded');

    if (onboarded === true) {
      that.qbo.showAppSwitcher();
      that.updateDimensionTables();
      that.loadDashboardData();
      that.getQboStatus().then(() => {
        that.currentState = onboardingStates.isOnboarded;
      }).catch(() => {
        that.storageService.set('onboarded', false);
        that.snackBar.open('Quickbooks Online token expired, please connect Quickbooks Online account');
        setTimeout(() => {
          that.windowReference.location.reload();
        }, 3000);
      });
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
          return that.getCardsMappings();
        }).then(() => {
          return that.getEmployeeMappings();
        }).then(() => {
          return that.getCategoryMappings();
        }).then(() => {
          that.currentState = onboardingStates.isOnboarded;
          that.storageService.set('onboarded', true);
          that.qbo.showAppSwitcher();
          that.qbo.hideRefreshIconVisibility();
          return that.loadDashboardData();
        }).catch(() => {
          // do nothing as this just means some steps are left
          that.storageService.set('onboarded', false);
        }).finally(() => {
          that.isLoading = false;
        });
    }

  }

}
