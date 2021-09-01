import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ngx-cacheable';
import { FyleCredentials } from '../models/fyle-credentials.model';
import { QBOCredentials } from '../models/qbo-credentials.model';
import { ScheduleSettings } from '../models/schedule-settings.model';
import { MappingSettingResponse } from '../models/mapping-setting-response.model';
import { GeneralSetting } from '../models/general-setting.model';
import { MappingSetting } from '../models/mapping-setting.model';

const fyleCredentialsCache = new Subject<void>();
const qboCredentialsCache = new Subject<void>();
const generalSettingsCache$ = new Subject<void>();
const mappingsSettingsCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private apiService: ApiService) { }

  @Cacheable({
    cacheBusterObserver: fyleCredentialsCache
  })
  getFyleCredentials(workspaceId: number): Observable<FyleCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/fyle/', {});
  }

  @Cacheable({
    cacheBusterObserver: qboCredentialsCache
  })
  getQBOCredentials(workspaceId: number): Observable<QBOCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/qbo/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: qboCredentialsCache
  })
  deleteQBOCredentials(workspaceId: number) {
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + workspaceId + '/credentials/qbo/delete/', {});
  }

  @CacheBuster({
    cacheBusterNotifier: qboCredentialsCache
  })
  connectQBO(workspaceId: number, authorizationCode: string, realmId: string): Observable<QBOCredentials> {
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_qbo/authorization_code/', {
      code: authorizationCode,
      realm_id: realmId
    });
  }

  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  connectFyle(workspaceId: number, authorizationCode: string): Observable<FyleCredentials> {
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_fyle/authorization_code/', {
      code: authorizationCode
    });
  }

  postSettings(workspaceId: number, hours: number, scheduleEnabled: boolean): Observable<ScheduleSettings> {
    return this.apiService.post(`/workspaces/${workspaceId}/schedule/`, {
      hours,
      schedule_enabled: scheduleEnabled
    });
  }

  getSettings(workspaceId: number): Observable<ScheduleSettings> {
    return this.apiService.get(`/workspaces/${workspaceId}/schedule/`, {});
  }

  @Cacheable({
    cacheBusterObserver: generalSettingsCache$
  })
  getGeneralSettings(workspaceId: number): Observable<GeneralSetting> {
    return this.apiService.get(`/workspaces/${workspaceId}/settings/general/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: generalSettingsCache$
  })
  postGeneralSettings(workspaceId: number, generalSettingsPayload: GeneralSetting): Observable<GeneralSetting> {
    return this.apiService.post(`/workspaces/${workspaceId}/settings/general/`, generalSettingsPayload);
  }

  @Cacheable({
    cacheBusterObserver: mappingsSettingsCache$
  })
  getMappingSettings(workspaceId: number): Observable<MappingSettingResponse> {
    return this.apiService.get(`/workspaces/${workspaceId}/mappings/settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: mappingsSettingsCache$
  })
  postMappingSettings(workspaceId: number, mappingSettings: MappingSetting[]): Observable<MappingSetting[]> {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/settings/`, mappingSettings);
  }
}
