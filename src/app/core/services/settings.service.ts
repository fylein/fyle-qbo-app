import { Injectable } from '@angular/core';
import { Observable, Subject, merge, forkJoin, from } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ngx-cacheable';

const fyleCredentialsCache = new Subject<void>();
const qboCredentialsCache = new Subject<void>();
const generalSettingsCache = new Subject<void>();
const mappingsSettingsCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private generalService: GeneralService) { }

  @Cacheable({
    cacheBusterObserver: fyleCredentialsCache
  })
  getFyleCredentials(workspaceId: number): Observable<any> {
    return this.generalService.get('/workspaces/' + workspaceId + '/credentials/fyle/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  deleteFyleCredentials(workspaceId: number): Observable<any> {
    return this.generalService.post('/workspaces/' + workspaceId + '/credentials/fyle/delete/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: qboCredentialsCache
  })
  deleteQBOCredentials(workspaceId: number): Observable<any> {
    globalCacheBusterNotifier.next();
    return this.generalService.post('/workspaces/' + workspaceId + '/credentials/qbo/delete/', {});
  }

  @Cacheable({
    cacheBusterObserver: qboCredentialsCache
  })
  getQBOCredentials(workspaceId: number): Observable<any> {
    return this.generalService.get('/workspaces/' + workspaceId + '/credentials/qbo/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  connectFyle(workspaceId: number, authorization_code: string): Observable<any> {
    return this.generalService.post('/workspaces/' + workspaceId + '/connect_fyle/authorization_code/', {
      code: authorization_code
    });
  }

  @CacheBuster({
    cacheBusterNotifier: qboCredentialsCache
  })
  connectQBO(workspaceId: number, authorization_code: string, realm_id: string): Observable<any> {
    globalCacheBusterNotifier.next();
    return this.generalService.post('/workspaces/' + workspaceId + '/connect_qbo/authorization_code/', {
      code: authorization_code,
      realm_id
    });
  }

  postSettings(workspaceId: number, next_run: string, hours: number, schedule_enabled: boolean) {
    return this.generalService.post(`/workspaces/${workspaceId}/settings/`, {
      next_run,
      hours,
      schedule_enabled
    });
  }

  getSettings(workspaceId: number) {
    return this.generalService.get(`/workspaces/${workspaceId}/settings/`, {});
  }

  @Cacheable({
    cacheBusterObserver: mappingsSettingsCache
  })
  getMappingSettings(workspaceId: number) {
    return this.generalService.get(`/workspaces/${workspaceId}/mappings/settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: generalSettingsCache
  })
  postGeneralSettings(workspaceId: number, reimbursable_expenses_object: string, corporate_credit_card_expenses_object: string) {
    return this.generalService.post(`/workspaces/${workspaceId}/settings/general/`, {
      reimbursable_expenses_object,
      corporate_credit_card_expenses_object,
    });
  }

  @CacheBuster({
    cacheBusterNotifier: mappingsSettingsCache
  })
  postMappingSettings(workspaceId: number, mappingSettings: any) {
    return this.generalService.post(`/workspaces/${workspaceId}/mappings/settings/`, mappingSettings);
  }

  @Cacheable({
    cacheBusterObserver: generalSettingsCache
  })
  getGeneralSettings(workspaceId: number) {
    return this.generalService.get(`/workspaces/${workspaceId}/settings/general/`, {});
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
