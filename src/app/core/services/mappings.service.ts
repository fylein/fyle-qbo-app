import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { GeneralService } from 'src/app/core/services/general.service';
import { GeneralMapping } from '../models/generalMapping.model';
import { MappingsResponse } from '../models/mappingsResponse.model';

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

  postFyleEmployees(workspaceId: number): Observable<any> {
    if (!this.fyleEmployees) {
      this.fyleEmployees = this.generalService.post(`/workspaces/${workspaceId}/fyle/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleEmployees;
  }

  postFyleCategories(workspaceId: number): Observable<any> {
    if (!this.fyleCategories) {
      this.fyleCategories = this.generalService.post(`/workspaces/${workspaceId}/fyle/categories/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCategories;
  }

  postFyleProjects(workspaceId: number): Observable<any> {
    if (!this.fyleProjects) {
      this.fyleProjects = this.generalService.post(`/workspaces/${workspaceId}/fyle/projects/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleProjects;
  }

  postFyleCostCenters(workspaceId: number): Observable<any> {
    if (!this.fyleCostCenters) {
      this.fyleCostCenters = this.generalService.post(`/workspaces/${workspaceId}/fyle/cost_centers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCostCenters;
  }

  postQBOVendors(workspaceId: number): Observable<any> {
    if (!this.qboVendors) {
      this.qboVendors = this.generalService.post(`/workspaces/${workspaceId}/qbo/vendors/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboVendors;
  }

  postQBOEmployees(workspaceId: number): Observable<any> {
    if (!this.qboEmployees) {
      this.qboEmployees = this.generalService.post(`/workspaces/${workspaceId}/qbo/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboEmployees;
  }


  postQBOCustomers(workspaceId: number): Observable<any> {
    if (!this.qboCustomers) {
      this.qboCustomers = this.generalService.post(`/workspaces/${workspaceId}/qbo/customers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboCustomers;
  }

  postExpenseAccounts(workspaceId: number): Observable<any> {
    if (!this.qboAccounts) {
      this.qboAccounts = this.generalService.post(
        `/workspaces/${workspaceId}/qbo/accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboAccounts;
  }

  postBankAccounts(workspaceId: number): Observable<any> {
    if (!this.bankAccounts) {
      this.bankAccounts = this.generalService.post(
        `/workspaces/${workspaceId}/qbo/bank_accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.bankAccounts;
  }

  postAccountsPayables(workspaceId: number): Observable<any> {
    if (!this.accountPayables) {
      this.accountPayables = this.generalService.post(
        `/workspaces/${workspaceId}/qbo/accounts_payables/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.accountPayables;
  }

  postCreditCardAccounts(workspaceId: number): Observable<any> {
    if (!this.creditCardAccounts) {
      this.creditCardAccounts = this.generalService.post(
        `/workspaces/${workspaceId}/qbo/credit_card_accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.creditCardAccounts;
  }

  postQBOClasses(workspaceId: number): Observable<any> {
    if (!this.qboClasses) {
      this.qboClasses = this.generalService.post(`/workspaces/${workspaceId}/qbo/classes/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboClasses;
  }

  postQBODepartments(workspaceId: number): Observable<any> {
    if (!this.qboDepartments) {
      this.qboDepartments = this.generalService.post(`/workspaces/${workspaceId}/qbo/departments/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboDepartments;
  }

  getFyleEmployees(workspaceId: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/fyle/employees/`, {});
  }

  getFyleCategories(workspaceId: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/fyle/categories/`, {});
  }

  getQBOVendors(workspaceId: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/qbo/vendors/`, {});
  }

  getQBOEmployees(workspaceId: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/qbo/employees/`, {});
  }

  getQBOCustomers(workspaceId: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/qbo/customers/`, {});
  }

  getFyleProjects(workspaceId: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/fyle/projects/`, {});
  }

  getQBOClasses(workspaceId: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/qbo/classes/`, {});
  }

  getQBODepartments(workspaceId: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspaceId}/qbo/departments/`, {});
  }

  getFyleCostCenters(workspaceId: number): Observable<any> {
      return this.generalService.get(`/workspaces/${workspaceId}/fyle/cost_centers/`, {});
  }

  getExpenseAccounts(workspaceId: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/qbo/accounts/`, {}
    );
  }

  getBankAccounts(workspaceId: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/qbo/bank_accounts/`, {}
    );
  }

  getAccountsPayables(workspaceId: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/qbo/accounts_payables/`, {}
    );
  }

  getCreditCardAccounts(workspaceId: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/qbo/credit_card_accounts/`, {}
    );
  }

  postGeneralMappings(workspace_id: number, accounts_payable_id: string, accounts_payable_name: string, bank_account_id: string, bank_account_name: string, default_ccc_account_id: string, default_ccc_account_name: string): Observable<any> {
    this.qboAccounts = null;
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/general/`, {
        accounts_payable_id,
        accounts_payable_name,
        bank_account_id,
        bank_account_name,
        default_ccc_account_id,
        default_ccc_account_name
      }
    );
  }

  getGeneralMappings(workspaceId: number): Observable<GeneralMapping> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/mappings/general/`, {}
    );
  }

  getMappings(workspaceId: number, sourceType): Observable<MappingsResponse> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/mappings/?source_type=${sourceType}`, {}
    );
  }

  postMappings(workspaceId: number, mapping: any) {
    return this.generalService.post(`/workspaces/${workspaceId}/mappings/`, mapping);
  }

  getCategoryMappings(workspaceId: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/mappings/categories/`, {}
    );
  }

  postCategoryMappings(workspace_id: number, category: string, sub_category: string, account_name: string, account_id: string): Observable<any> {
    this.fyleCategories = null;
    this.qboAccounts = null;
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/categories/`, {
        category,
        sub_category,
        account_name,
        account_id
      }
    );
  }

  getEmployeeMappings(workspaceId: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/mappings/employees/`, {}
    );
  }

  postEmployeeMappings(workspace_id: number, employee_email: string, vendor_display_name: string, vendor_id: string, employee_display_name: string, employee_id: string, ccc_account_name: string, ccc_account_id: string): Observable<any> {
    this.fyleEmployees = null;
    this.qboVendors = null;
    this.qboEmployees = null;
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/employees/`, {
        employee_email,
        vendor_display_name,
        vendor_id,
        employee_display_name,
        employee_id,
        ccc_account_name,
        ccc_account_id
      }
    );
  }

  getProjectMappings(workspaceId: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/mappings/projects/`, {}
    );
  }

  postProjectMappings(workspace_id: number, project: string, customer_display_name: string, customer_id: string): Observable<any> {
    this.fyleProjects = null;
    this.qboCustomers = null;
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/projects/`, {
        project,
        customer_display_name,
        customer_id
      }
    );
  }

  getCostCenterMappings(workspaceId: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspaceId}/mappings/cost_centers/`, {}
    );
  }

  postCostCenterMappings(workspace_id: number, project: string, class_name: string, class_id: string): Observable<any> {
    this.fyleCostCenters = null;
    this.qboClasses = null;
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/cost_centers/`, {
        cost_center: project,
        class_name,
        class_id
      }
    );
  }
}
