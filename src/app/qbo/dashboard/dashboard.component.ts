import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { environment } from 'src/environments/environment';

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
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  workspaceId: number;
  isLoading = false;

  currentState = onboardingStates.initialized;

  get allOnboardingStates () {
    return onboardingStates;
  }

  // fyleConnected = false;
  // qboConnected = false;
  // configurationsDone = false;
  // generalMappingsDone = false;
  // employeeMappingsDone = false;
  // categoryMappingsDone = false;
  // isOnboarded = false;

  // enum onboardingStates = {
  //   connectToFyle,
  //   connectToQbo
  // }

  rippleDisabled = true;
  linearMode = true;

  constructor(private settingsService: SettingsService, private route: ActivatedRoute, private mappingsService: MappingsService) { }

  connectFyle() {
    window.location.href = `${FYLE_URL}/app/developers/#/oauth/authorize?client_id=${FYLE_CLIENT_ID}&redirect_uri=${APP_URL}/workspaces/fyle/callback&response_type=code&state=${this.workspaceId}`;
  }

  connectQBO() {
    window.location.href = QBO_AUTHORIZE_URI + '?client_id=' + QBO_CLIENT_ID + '&scope=' + QBO_SCOPE + '&response_type=code&redirect_uri=' + APP_URL + '/workspaces/qbo/callback&state=' + this.workspaceId;
  }

  checkFyleLoginStatus() {
    const that = this;
    return that.settingsService.getFyleCredentials(that.workspaceId).toPromise().then(credentials => {
      that.currentState = onboardingStates.fyleConnected;
      that.isLoading = false;
      return credentials;
    });
  }


  getQboStatus() {
    const that = this;

    return that.settingsService.getQBOCredentials(that.workspaceId).toPromise().then(credentials => {
      that.currentState = onboardingStates.qboConnected;
      that.isLoading = false;
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
      if (res.results.length > 0) {
        that.currentState = onboardingStates.employeeMappingsDone;
      } else {
        throw new Error('employee mappings have no entries!');
      }
      return res;
    });
  }

  getCategoryMappings() {
    const that = this;
    return that.mappingsService.getMappings(this.workspaceId, 'CATEGORY').toPromise().then((res) => {
      if (res.results.length > 0) {
        that.currentState = onboardingStates.categoryMappingsDone;
      } else {
        throw new Error('cateogry mappings have no entries!');
      }
      return res;
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.params.workspace_id;
    // that.isLoading = true;
    that.checkFyleLoginStatus()
      .then(() => {
        return that.getQboStatus();
      }).then(() => {
        return that.getConfigurations();
      }).then(() => {
        return that.getGeneralMappings();
      }).then(() => {
        return that.getEmployeeMappings();
      }).then(() => {
        return that.getCategoryMappings();
      }).then(() => {
        that.currentState = onboardingStates.isOnboarded;
      }).catch(() => {
        // do nothing as this just means some steps are left
      }).finally(() => {
        that.isLoading = false;
      });

  }

}
