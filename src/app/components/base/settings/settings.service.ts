import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../general.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private generalService: GeneralService) { }

  getFyleCredentials(workspace_id: number): Observable<any> {
    return this.generalService.get('/workspaces/' + workspace_id + '/credentials/fyle/', {});
  }
  
  deleteFyleCredentials(workspace_id: number): Observable<any> {
    return this.generalService.post('/workspaces/' + workspace_id + '/credentials/fyle/delete/', {});
  }

  getNetSuiteCredentials(workspace_id: number): Observable<any> {
    return this.generalService.get('/workspaces/' + workspace_id + '/credentials/netsuite/', {});
  }

  connectFyle(workspace_id: number, authorization_code: string): Observable<any> {
    return this.generalService.post('/workspaces/' + workspace_id + '/connect_fyle/authorization_code/', {
      code: authorization_code
    });
  }

  connectNetSuite(workspace_id:number, ns_account_id: string, ns_consumer_key: string, ns_consumer_secret: string, ns_token_id:string, ns_token_secret: string): Observable<any> {
    return this.generalService.post('/workspaces/' + workspace_id + '/connect_netsuite/tba/', {
      ns_account_id: ns_account_id,
      ns_consumer_key: ns_consumer_key,
      ns_consumer_secret: ns_consumer_secret,
      ns_token_id: ns_token_id,
      ns_token_secret: ns_token_secret
    });
  }

  postSettings(workspace_id: number, next_run: string, hours: number, schedule_enabled: boolean) {
    return this.generalService.post(`/workspaces/${workspace_id}/settings/`, {
      next_run: next_run,
      hours: hours,
      schedule_enabled: schedule_enabled
    });
  }

  getSettings(workspace_id: number) {
    return this.generalService.get(`/workspaces/${workspace_id}/settings/`, {});
  }

  getMappingSettings(workspace_id: number) {
    return this.generalService.get(`/workspaces/${workspace_id}/mappings/settings/`, {});
  }

  postGeneralSettings(workspace_id: number, reimbursable_expenses_object: string, corporate_credit_card_expenses_object: string) {
    return this.generalService.post(`/workspaces/${workspace_id}/settings/general/`, {
      reimbursable_expenses_object: reimbursable_expenses_object,
      corporate_credit_card_expenses_object: corporate_credit_card_expenses_object,
    });
  }

  postMappingSettings(workspace_id: number, mappingSettings: any) {
    return this.generalService.post(`/workspaces/${workspace_id}/mappings/settings/`, mappingSettings);
  }

  getGeneralSettings(workspace_id: number) {
    return this.generalService.get(`/workspaces/${workspace_id}/settings/general/`, {});
  }
}
