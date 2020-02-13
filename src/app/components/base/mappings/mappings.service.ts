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

  getQBOVendors(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/qbo/vendors/`, {}
    );
  }

  getFyleEmployees(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/fyle/employees/`, {}
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

  postCategoryMappings(workspace_id: number, category: string, sub_category: string, account_name: string, account_id: string): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/categories/`, {
        category: category,
        sub_category: sub_category,
        account_name: account_name,
        account_id: account_id
      }
    );
  }

  getEmployeeMappings(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/mappings/employees/`, {}
    );
  }

  postEmployeeMappings(workspace_id: number, employee_email: string, vendor_name: string, vendor_id: string): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/employees/`, {
        employee_email: employee_email,
        vendor_name: vendor_name,
        vendor_id: vendor_id
      }
    );
  }
}
