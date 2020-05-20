import { Injectable } from '@angular/core';
import { GeneralService } from '../general.service';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  fyleCategories: Observable<any[]>;
  qboAccounts: Observable<any[]>;
  
  fyleEmployees: Observable<any[]>;
  qboVendors: Observable<any[]>;
  qboEmployees: Observable<any[]>;

  fyleProjects: Observable<any[]>;
  qboCustomers: Observable<any[]>;

  fyleCostCenters: Observable<any[]>;
  qboClasses: Observable<any[]>;

  constructor(private generalService: GeneralService) {}

  getFyleCategories(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/fyle/categories/`, {});
  }

  postFyleCategories(workspace_id: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspace_id}/fyle/categories/`, {});
  }

  getQBOVendors(workspace_id: number): Observable<any> {
      return this.generalService.get(`/workspaces/${workspace_id}/qbo/vendors/`, {});
  }

  postQBOVendors(workspace_id: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspace_id}/qbo/vendors/`, {});
  }

  getQBOEmployees(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/employees/`, {});
  }

  postQBOEmployees(workspace_id: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspace_id}/qbo/employees/`, {});
  }

  getFyleEmployees(workspace_id: number): Observable<any> {
      return this.generalService.get(`/workspaces/${workspace_id}/fyle/employees/`, {});
  }

  postFyleEmployees(workspace_id: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspace_id}/fyle/employees/`, {});
}

  getQBOCustomers(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/customers/`, {});
  }

  postQBOCustomers(workspace_id: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspace_id}/qbo/customers/`, {});
  }

  getFyleProjects(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/fyle/projects/`, {});
  }

  postFyleProjects(workspace_id: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspace_id}/fyle/projects/`, {});
  }

  getQBOClasses(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/classes/`, {});
  }

  postQBOClasses(workspace_id: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspace_id}/qbo/classes/`, {});
  }

  getQBODepartments(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/departments/`, {});
  }

  postQBODepartments(workspace_id: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspace_id}/qbo/departments/`, {});
  }

  getFyleCostCenters(workspace_id: number): Observable<any> {
      return this.generalService.get(`/workspaces/${workspace_id}/fyle/cost_centers/`, {});
  }

  postFyleCostCenters(workspace_id: number): Observable<any> {
    return this.generalService.post(`/workspaces/${workspace_id}/fyle/cost_centers/`, {});
  }

  getExpenseAccounts(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/qbo/accounts/`, {}
    );
  }

  getBankAccounts(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/qbo/bank_accounts/`, {}
    );
  }

  getAccountsPayables(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/qbo/accounts_payables/`, {}
    );
  }

  getCreditCardAccounts(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/qbo/credit_card_accounts/`, {}
    );
  }

  postExpenseAccounts(workspace_id: number): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/qbo/accounts/`, {}
    );
  }

  postBankAccounts(workspace_id: number): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/qbo/bank_accounts/`, {}
    );
  }

  postAccountsPayables(workspace_id: number): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/qbo/accounts_payables/`, {}
    );
  }

  postCreditCardAccounts(workspace_id: number): Observable<any> {
    return this.generalService.post(
      `/workspaces/${workspace_id}/qbo/credit_card_accounts/`, {}
    );
  }

  postGeneralMappings(workspace_id: number, accounts_payable_id: string, accounts_payable_name: string, bank_account_id: string, bank_account_name: string, default_ccc_account_id: string, default_ccc_account_name: string): Observable<any> {
    this.qboAccounts = null;
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/general/`, {
        accounts_payable_id: accounts_payable_id,
        accounts_payable_name: accounts_payable_name,
        bank_account_id: bank_account_id,
        bank_account_name: bank_account_name,
        default_ccc_account_id: default_ccc_account_id,
        default_ccc_account_name: default_ccc_account_name
      }
    );
  }

  getGeneralMappings(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/mappings/general/`, {}
    );
  }

  getMappings(workspace_id: number, source_type): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/mappings/infra/?source_type=${source_type}`, {}
    );
  }

  postMappings(workspace_id: number, mapping: any) {
    return this.generalService.post(`/workspaces/${workspace_id}/mappings/infra/`, mapping);
  }

  getCategoryMappings(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/mappings/categories/`, {}
    );
  }

  postCategoryMappings(workspace_id: number, category: string, sub_category: string, account_name: string, account_id: string): Observable<any> {
    this.fyleCategories = null;
    this.qboAccounts = null;
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

  postEmployeeMappings(workspace_id: number, employee_email: string, vendor_display_name: string, vendor_id: string, employee_display_name: string, employee_id: string, ccc_account_name: string, ccc_account_id: string): Observable<any> {
    this.fyleEmployees = null;
    this.qboVendors = null;
    this.qboEmployees = null;
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/employees/`, {
        employee_email: employee_email,
        vendor_display_name: vendor_display_name,
        vendor_id: vendor_id,
        employee_display_name: employee_display_name,
        employee_id: employee_id,
        ccc_account_name: ccc_account_name,
        ccc_account_id: ccc_account_id
      }
    );
  }

  getProjectMappings(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/mappings/projects/`, {}
    );
  }

  postProjectMappings(workspace_id: number, project: string, customer_display_name: string, customer_id: string): Observable<any> {
    this.fyleProjects = null;
    this.qboCustomers = null;
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/projects/`, {
        project: project,
        customer_display_name: customer_display_name,
        customer_id: customer_id
      }
    );
  }

  getCostCenterMappings(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/mappings/cost_centers/`, {}
    );
  }

  postCostCenterMappings(workspace_id: number, project: string, class_name: string, class_id: string): Observable<any> {
    this.fyleCostCenters = null;
    this.qboClasses = null;
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/cost_centers/`, {
        cost_center: project,
        class_name: class_name,
        class_id: class_id
      }
    );
  }
}
