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
  qboDepartments: Observable<any[]>;

  fyleCostCenters: Observable<any[]>;
  qboClasses: Observable<any[]>;

  accountPayables: Observable<any[]>;
  bankAccounts: Observable<any[]>;
  creditCardAccounts: Observable<any[]>;

  constructor(private generalService: GeneralService) {}

  postFyleEmployees(workspace_id: number): Observable<any> {
    if (!this.fyleEmployees) {
      this.fyleEmployees = this.generalService.post(`/workspaces/${workspace_id}/fyle/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleEmployees;
  }
  
  postFyleCategories(workspace_id: number): Observable<any> {
    if (!this.fyleCategories) {
      this.fyleCategories = this.generalService.post(`/workspaces/${workspace_id}/fyle/categories/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCategories;
  }

  postFyleProjects(workspace_id: number): Observable<any> {
    if (!this.fyleProjects) {
      this.fyleProjects = this.generalService.post(`/workspaces/${workspace_id}/fyle/projects/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleProjects;
  }

  postFyleCostCenters(workspace_id: number): Observable<any> {
    if (!this.fyleCostCenters) {
      this.fyleCostCenters = this.generalService.post(`/workspaces/${workspace_id}/fyle/cost_centers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCostCenters;
  }

  postQBOVendors(workspace_id: number): Observable<any> {
    if (!this.qboVendors) {
      this.qboVendors = this.generalService.post(`/workspaces/${workspace_id}/qbo/vendors/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboVendors;
  }

  postQBOEmployees(workspace_id: number): Observable<any> {
    if (!this.qboEmployees) {
      this.qboEmployees = this.generalService.post(`/workspaces/${workspace_id}/qbo/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboEmployees;
  }


  postQBOCustomers(workspace_id: number): Observable<any> {
    if (!this.qboCustomers) {
      this.qboCustomers = this.generalService.post(`/workspaces/${workspace_id}/qbo/customers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboCustomers;
  }

  postExpenseAccounts(workspace_id: number): Observable<any> {
    if (!this.qboAccounts) {
      this.qboAccounts = this.generalService.post(
        `/workspaces/${workspace_id}/qbo/accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboAccounts;
  }

  postBankAccounts(workspace_id: number): Observable<any> {
    if (!this.bankAccounts) {
      this.bankAccounts = this.generalService.post(
        `/workspaces/${workspace_id}/qbo/bank_accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.bankAccounts;
  }

  postAccountsPayables(workspace_id: number): Observable<any> {
    if (!this.accountPayables) {
      this.accountPayables = this.generalService.post(
        `/workspaces/${workspace_id}/qbo/accounts_payables/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.accountPayables;
  }

  postCreditCardAccounts(workspace_id: number): Observable<any> {
    if (!this.creditCardAccounts) {
      this.creditCardAccounts = this.generalService.post(
        `/workspaces/${workspace_id}/qbo/credit_card_accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.creditCardAccounts;
  }

  postQBOClasses(workspace_id: number): Observable<any> {
    if (!this.qboClasses) {
      this.qboClasses = this.generalService.post(`/workspaces/${workspace_id}/qbo/classes/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboClasses;
  }

  postQBODepartments(workspace_id: number): Observable<any> {
    if (!this.qboDepartments) {
      this.qboDepartments = this.generalService.post(`/workspaces/${workspace_id}/qbo/departments/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboDepartments;
  }

  getFyleEmployees(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/fyle/employees/`, {});
  }

  getFyleCategories(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/fyle/categories/`, {});
  }

  getQBOVendors(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/vendors/`, {});
  }

  getQBOEmployees(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/employees/`, {});
  }

  getQBOCustomers(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/customers/`, {});
  }

  getFyleProjects(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/fyle/projects/`, {});
  }

  getQBOClasses(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/classes/`, {});
  }

  getQBODepartments(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/qbo/departments/`, {});
  }

  getFyleCostCenters(workspace_id: number): Observable<any> {
      return this.generalService.get(`/workspaces/${workspace_id}/fyle/cost_centers/`, {});
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
      `/workspaces/${workspace_id}/mappings/?source_type=${source_type}`, {}
    );
  }

  postMappings(workspace_id: number, mapping: any) {
    return this.generalService.post(`/workspaces/${workspace_id}/mappings/`, mapping);
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
