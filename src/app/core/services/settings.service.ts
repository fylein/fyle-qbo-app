import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private generalService: GeneralService) { }

  getFyleCredentials(workspaceId: number): Observable<any> {
    return this.generalService.get('/workspaces/' + workspaceId + '/credentials/fyle/', {});
  }

  deleteFyleCredentials(workspaceId: number): Observable<any> {
    return this.generalService.post('/workspaces/' + workspaceId + '/credentials/fyle/delete/', {});
  }

  deleteQBOCredentials(workspaceId: number): Observable<any> {
    return this.generalService.post('/workspaces/' + workspaceId + '/credentials/qbo/delete/', {});
  }

  getQBOCredentials(workspaceId: number): Observable<any> {
    return this.generalService.get('/workspaces/' + workspaceId + '/credentials/qbo/', {});
  }

  connectFyle(workspaceId: number, authorization_code: string): Observable<any> {
    return this.generalService.post('/workspaces/' + workspaceId + '/connect_fyle/authorization_code/', {
      code: authorization_code
    });
  }

  connectQBO(workspaceId: number, authorization_code: string, realm_id: string): Observable<any> {
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

  getMappingSettings(workspaceId: number) {
    return this.generalService.get(`/workspaces/${workspaceId}/mappings/settings/`, {});
  }

  postGeneralSettings(workspaceId: number, reimbursable_expenses_object: string, corporate_credit_card_expenses_object: string) {
    return this.generalService.post(`/workspaces/${workspaceId}/settings/general/`, {
      reimbursable_expenses_object,
      corporate_credit_card_expenses_object,
    });
  }

  postMappingSettings(workspaceId: number, mappingSettings: any) {
    return this.generalService.post(`/workspaces/${workspaceId}/mappings/settings/`, mappingSettings);
  }

  getGeneralSettings(workspaceId: number) {
    return this.generalService.get(`/workspaces/${workspaceId}/settings/general/`, {});
  }
}
