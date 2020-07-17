import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { GeneralMapping } from '../models/general-mapping.model';
import { MappingsResponse } from '../models/mappings-response.model';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  // TODO: Map models to each of these and the methods below
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

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) { }

  postFyleEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleEmployees) {
      this.fyleEmployees = this.apiService.post(`/workspaces/${workspaceId}/fyle/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleEmployees;
  }

  postFyleCategories() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleCategories) {
      this.fyleCategories = this.apiService.post(`/workspaces/${workspaceId}/fyle/categories/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCategories;
  }

  postFyleProjects() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleProjects) {
      this.fyleProjects = this.apiService.post(`/workspaces/${workspaceId}/fyle/projects/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleProjects;
  }

  postFyleCostCenters() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleCostCenters) {
      this.fyleCostCenters = this.apiService.post(`/workspaces/${workspaceId}/fyle/cost_centers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCostCenters;
  }

  postQBOVendors() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.qboVendors) {
      this.qboVendors = this.apiService.post(`/workspaces/${workspaceId}/qbo/vendors/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboVendors;
  }

  postQBOEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.qboEmployees) {
      this.qboEmployees = this.apiService.post(`/workspaces/${workspaceId}/qbo/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboEmployees;
  }


  postQBOCustomers() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.qboCustomers) {
      this.qboCustomers = this.apiService.post(`/workspaces/${workspaceId}/qbo/customers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboCustomers;
  }

  postExpenseAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.qboAccounts) {
      this.qboAccounts = this.apiService.post(
        `/workspaces/${workspaceId}/qbo/accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboAccounts;
  }

  postBankAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.bankAccounts) {
      this.bankAccounts = this.apiService.post(
        `/workspaces/${workspaceId}/qbo/bank_accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.bankAccounts;
  }

  postAccountsPayables() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.accountPayables) {
      this.accountPayables = this.apiService.post(
        `/workspaces/${workspaceId}/qbo/accounts_payables/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.accountPayables;
  }

  postCreditCardAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.creditCardAccounts) {
      this.creditCardAccounts = this.apiService.post(
        `/workspaces/${workspaceId}/qbo/credit_card_accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.creditCardAccounts;
  }

  postQBOClasses() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.qboClasses) {
      this.qboClasses = this.apiService.post(`/workspaces/${workspaceId}/qbo/classes/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboClasses;
  }

  postQBODepartments() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.qboDepartments) {
      this.qboDepartments = this.apiService.post(`/workspaces/${workspaceId}/qbo/departments/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboDepartments;
  }

  getFyleEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/employees/`, {});
  }

  getFyleCategories() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/categories/`, {});
  }

  getQBOVendors() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/vendors/`, {});
  }

  getQBOEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/employees/`, {});
  }

  getQBOCustomers() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/customers/`, {});
  }

  getFyleProjects() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/projects/`, {});
  }

  getQBOClasses() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/classes/`, {});
  }

  getQBODepartments() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/departments/`, {});
  }

  getFyleCostCenters() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/cost_centers/`, {});
  }

  getExpenseAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/accounts/`, {}
    );
  }

  getBankAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/bank_accounts/`, {}
    );
  }

  getAccountsPayables() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/accounts_payables/`, {}
    );
  }

  getCreditCardAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/credit_card_accounts/`, {}
    );
  }
  // TODO: Replace any with proper model
  postGeneralMappings(accountsPayableId: string, accountsPayableName: string, bankAccountId: string, bankAccountName: string, defaultCCCAccountId: string, defaultCCCAccountName: string): Observable<any> {
    this.qboAccounts = null;
    const workspaceId = this.workspaceService.getWorkspaceId();
    const generalMappings = {
      accounts_payable_id: accountsPayableId,
      accounts_payable_name: accountsPayableName,
      bank_account_id: bankAccountId,
      bank_account_name: bankAccountName,
      default_ccc_account_id: defaultCCCAccountId,
      default_ccc_account_name: defaultCCCAccountName
    };
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/general/`, generalMappings);
  }

  getGeneralMappings(): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/general/`, {}
    );
  }

  getMappings(sourceType): Observable<MappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/`, {
        source_type: sourceType
      }
    );
  }

  postMappings(mapping: any) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/`, mapping);
  }

  getCategoryMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/categories/`, {}
    );
  }

  postCategoryMappings(category: string, subCategory: string, accountName: string, accountId: string) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    this.fyleCategories = null;
    this.qboAccounts = null;
    return this.apiService.post(
      `/workspaces/${workspaceId}/mappings/categories/`, {
      category,
      sub_category: subCategory,
      account_name: accountName,
      account_id: accountId
    }
    );
  }

  getEmployeeMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/employees/`, {}
    );
  }

  postEmployeeMappings(employeeEmail: string, vendorDisplayName: string, vendorId: string, employeeDisplayName: string, employeeId: string, cccAccountName: string, cccAccountId: string) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    this.fyleEmployees = null;
    this.qboVendors = null;
    this.qboEmployees = null;
    return this.apiService.post(
      `/workspaces/${workspaceId}/mappings/employees/`, {
      employee_email: employeeEmail,
      vendor_display_name: vendorDisplayName,
      vendor_id: vendorId,
      employee_display_name: employeeDisplayName,
      employee_id: employeeId,
      ccc_account_name: cccAccountName,
      ccc_account_id: cccAccountId
    }
    );
  }

  getProjectMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/projects/`, {}
    );
  }

  postProjectMappings(project: string, customerDisplayName: string, customerId: string) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    this.fyleProjects = null;
    this.qboCustomers = null;
    return this.apiService.post(
      `/workspaces/${workspaceId}/mappings/projects/`, {
      project,
      customer_display_name: customerDisplayName,
      customer_id: customerId
    }
    );
  }

  getCostCenterMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/cost_centers/`, {}
    );
  }

  postCostCenterMappings(project: string, className: string, classId: string) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    this.fyleCostCenters = null;
    this.qboClasses = null;
    return this.apiService.post(
      `/workspaces/${workspaceId}/mappings/cost_centers/`, {
      cost_center: project,
      class_name: className,
      class_id: classId
    }
    );
  }
}
