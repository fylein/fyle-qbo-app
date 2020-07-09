import { Injectable } from '@angular/core';
import { Observable, Subject, merge, forkJoin, from } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ngx-cacheable';

const fyleCredentialsCache = new Subject<void>();
const qboCredentialsCache = new Subject<void>();
const generalSettingsCache = new Subject<void>();
const mappingsSettingsCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private apiService: ApiService) { }

  @Cacheable({
    cacheBusterObserver: fyleCredentialsCache
  })
  getFyleCredentials(workspaceId: number): Observable<any> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/fyle/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  deleteFyleCredentials(workspaceId: number): Observable<any> {
    return this.apiService.post('/workspaces/' + workspaceId + '/credentials/fyle/delete/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: qboCredentialsCache
  })
  deleteQBOCredentials(workspaceId: number): Observable<any> {
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + workspaceId + '/credentials/qbo/delete/', {});
  }

  @Cacheable({
    cacheBusterObserver: qboCredentialsCache
  })
  getQBOCredentials(workspaceId: number): Observable<any> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/qbo/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  connectFyle(workspaceId: number, authorizationCode: string): Observable<any> {
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_fyle/authorization_code/', {
      code: authorizationCode
    });
  }

  @CacheBuster({
    cacheBusterNotifier: qboCredentialsCache
  })
  connectQBO(workspaceId: number, authorizationCode: string, realmId: string): Observable<any> {
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_qbo/authorization_code/', {
      code: authorizationCode,
      realm_id: realmId
    });
  }

  postSettings(workspaceId: number, nextRun: string, hours: number, scheduleEnabled: boolean) {
    return this.apiService.post(`/workspaces/${workspaceId}/settings/`, {
      next_run: nextRun,
      hours,
      schedule_enabled: scheduleEnabled
    });
  }

  getSettings(workspaceId: number) {
    return this.apiService.get(`/workspaces/${workspaceId}/settings/`, {});
  }

  @Cacheable({
    cacheBusterObserver: mappingsSettingsCache
  })
  getMappingSettings(workspaceId: number) {
    return this.apiService.get(`/workspaces/${workspaceId}/mappings/settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: generalSettingsCache
  })
  postGeneralSettings(workspaceId: number, reimbursableExpensesObject: string, corporateCreditCardExpensesObject: string) {
    return this.apiService.post(`/workspaces/${workspaceId}/settings/general/`, {
      reimbursable_expenses_object: reimbursableExpensesObject,
      corporate_credit_card_expenses_object: corporateCreditCardExpensesObject,
    });
  }

  @CacheBuster({
    cacheBusterNotifier: mappingsSettingsCache
  })
  postMappingSettings(workspaceId: number, mappingSettings: any) {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/settings/`, mappingSettings);
  }

  @Cacheable({
    cacheBusterObserver: generalSettingsCache
  })
  getGeneralSettings(workspaceId: number) {
    return this.apiService.get(`/workspaces/${workspaceId}/settings/general/`, {});
  }

  @Cacheable({
    cacheBusterObserver: merge(generalSettingsCache, generalSettingsCache)
  })
  getCombinedSettings(workspaceId: number) {
    return from(forkJoin(
      [
        this.getGeneralSettings(workspaceId),
        this.getMappingSettings(workspaceId)
      ]
    ).toPromise().then(responses => {
      const generalSettings = responses[0];
      const mappingSettings = responses[1].results;

      const employeeFieldMapping = mappingSettings.filter(
        setting => (setting.source_field === 'EMPLOYEE') &&
        (setting.destination_field === 'EMPLOYEE' || setting.destination_field === 'VENDOR')
      )[0];

      const projectFieldMapping = mappingSettings.filter(
        settings => settings.source_field === 'PROJECT'
      )[0];

      const costCenterFieldMapping = mappingSettings.filter(
        settings => settings.source_field === 'COST_CENTER'
      )[0];

      generalSettings.employee_field_mapping = employeeFieldMapping.destination_field;

      if (projectFieldMapping) {
        generalSettings.project_field_mapping = projectFieldMapping.destination_field;
      }

      if (costCenterFieldMapping) {
        generalSettings.cost_center_field_mapping = costCenterFieldMapping.destination_field;
      }

      return generalSettings;
    }));
  }
}
