import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/general.service';
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

  constructor(private apiService: ApiService) {}

  postFyleEmployees(workspaceId: number): Observable<any> {
    if (!this.fyleEmployees) {
      this.fyleEmployees = this.apiService.post(`/workspaces/${workspaceId}/fyle/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleEmployees;
  }

  postFyleCategories(workspaceId: number): Observable<any> {
    if (!this.fyleCategories) {
      this.fyleCategories = this.apiService.post(`/workspaces/${workspaceId}/fyle/categories/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCategories;
  }

  postFyleProjects(workspaceId: number): Observable<any> {
    if (!this.fyleProjects) {
      this.fyleProjects = this.apiService.post(`/workspaces/${workspaceId}/fyle/projects/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleProjects;
  }

  postFyleCostCenters(workspaceId: number): Observable<any> {
    if (!this.fyleCostCenters) {
      this.fyleCostCenters = this.apiService.post(`/workspaces/${workspaceId}/fyle/cost_centers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCostCenters;
  }

  postQBOVendors(workspaceId: number): Observable<any> {
    if (!this.qboVendors) {
      this.qboVendors = this.apiService.post(`/workspaces/${workspaceId}/qbo/vendors/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboVendors;
  }

  postQBOEmployees(workspaceId: number): Observable<any> {
    if (!this.qboEmployees) {
      this.qboEmployees = this.apiService.post(`/workspaces/${workspaceId}/qbo/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboEmployees;
  }


  postQBOCustomers(workspaceId: number): Observable<any> {
    if (!this.qboCustomers) {
      this.qboCustomers = this.apiService.post(`/workspaces/${workspaceId}/qbo/customers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboCustomers;
  }

  postExpenseAccounts(workspaceId: number): Observable<any> {
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

  postBankAccounts(workspaceId: number): Observable<any> {
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

  postAccountsPayables(workspaceId: number): Observable<any> {
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

  postCreditCardAccounts(workspaceId: number): Observable<any> {
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

  postQBOClasses(workspaceId: number): Observable<any> {
    if (!this.qboClasses) {
      this.qboClasses = this.apiService.post(`/workspaces/${workspaceId}/qbo/classes/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboClasses;
  }

  postQBODepartments(workspaceId: number): Observable<any> {
    if (!this.qboDepartments) {
      this.qboDepartments = this.apiService.post(`/workspaces/${workspaceId}/qbo/departments/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboDepartments;
  }

  getFyleEmployees(workspaceId: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/employees/`, {});
  }

  getFyleCategories(workspaceId: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/categories/`, {});
  }

  getQBOVendors(workspaceId: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/vendors/`, {});
  }

  getQBOEmployees(workspaceId: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/employees/`, {});
  }

  getQBOCustomers(workspaceId: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/customers/`, {});
  }

  getFyleProjects(workspaceId: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/projects/`, {});
  }

  getQBOClasses(workspaceId: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/classes/`, {});
  }

  getQBODepartments(workspaceId: number): Observable<any> {
    return this.apiService.get(`/workspaces/${workspaceId}/qbo/departments/`, {});
  }

  getFyleCostCenters(workspaceId: number): Observable<any> {
      return this.apiService.get(`/workspaces/${workspaceId}/fyle/cost_centers/`, {});
  }

  getExpenseAccounts(workspaceId: number): Observable<any> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/accounts/`, {}
    );
  }

  getBankAccounts(workspaceId: number): Observable<any> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/bank_accounts/`, {}
    );
  }

  getAccountsPayables(workspaceId: number): Observable<any> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/accounts_payables/`, {}
    );
  }

  getCreditCardAccounts(workspaceId: number): Observable<any> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/credit_card_accounts/`, {}
    );
  }

  postGeneralMappings(workspaceId: number, accountsPayableId: string, accountsPayableName: string, bankAccountId: string, bankAccountName: string, defaultCCCAccountId: string, defaultCCCAccountName: string): Observable<any> {
    this.qboAccounts = null;
    return this.apiService.post(
      `/workspaces/${workspaceId}/mappings/general/`, {
        accounts_payable_id: accountsPayableId,
        accounts_payable_name: accountsPayableName,
        bank_account_id: bankAccountId,
        bank_account_name: bankAccountName,
        default_ccc_account_id: defaultCCCAccountId,
        default_ccc_account_name: defaultCCCAccountName
      }
    );
  }

  getGeneralMappings(workspaceId: number): Observable<GeneralMapping> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/general/`, {}
    );
  }

  getMappings(workspaceId: number, sourceType): Observable<MappingsResponse> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/?source_type=${sourceType}`, {}
    );
  }

  postMappings(workspaceId: number, mapping: any) {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/`, mapping);
  }

  getCategoryMappings(workspaceId: number): Observable<any> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/categories/`, {}
    );
  }

  postCategoryMappings(workspaceId: number, category: string, subCategory: string, accountName: string, accountId: string): Observable<any> {
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

  getEmployeeMappings(workspaceId: number): Observable<any> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/employees/`, {}
    );
  }

  postEmployeeMappings(workspaceId: number, employeeEmail: string, vendorDisplayName: string, vendorId: string, employeeDisplayName: string, employeeId: string, cccAccountName: string, cccAccountId: string): Observable<any> {
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

  getProjectMappings(workspaceId: number): Observable<any> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/projects/`, {}
    );
  }

  postProjectMappings(workspaceId: number, project: string, customerDisplayName: string, customerId: string): Observable<any> {
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

  getCostCenterMappings(workspaceId: number): Observable<any> {
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/cost_centers/`, {}
    );
  }

  postCostCenterMappings(workspaceId: number, project: string, className: string, classId: string): Observable<any> {
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
