import { Injectable } from '@angular/core';
import { GeneralService } from '../general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  constructor(private generalService: GeneralService) {}

  getQBOAccounts(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/qbo/accounts/`, {}
    );
  }

  getFyleCategories(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/fyle/categories/`, {}
    );
  }
  
  postGeneralMappings(workspace_id: number, bank_account_id: string, bank_account_name: string): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/general/`, {
        bank_account_id: bank_account_id,
        bank_account_name: bank_account_name
      }
    );
  }

  getGeneralMappings(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/mappings/general/`, {}
    );
  }

  getCategoryMappings(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/mappings/categories/`, {}
    );
  }

  getEmployeeMappings(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/mappings/employees/`, {}
    );
  }
}
