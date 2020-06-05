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

  getMappingSettings(workspace_id: number) {
    return this.generalService.get(`/workspaces/${workspace_id}/mappings/settings/`, {});
  }

  postMappingSettings(workspace_id: number, mappingSettings: any) {
    return this.generalService.post(`/workspaces/${workspace_id}/mappings/settings/`, mappingSettings);
  }
}
