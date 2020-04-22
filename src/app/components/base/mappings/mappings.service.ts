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

  getQBOAccounts(workspace_id: number): Observable<any> {
    if (!this.qboAccounts) {
      this.qboAccounts = this.generalService.get(
        `/workspaces/${workspace_id}/qbo/accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboAccounts;
  }

  getFyleCategories(workspace_id: number): Observable<any> {
    if (!this.fyleCategories) {
      this.fyleCategories = this.generalService.get(
        `/workspaces/${workspace_id}/fyle/categories/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCategories;
  }

  getQBOVendors(workspace_id: number): Observable<any> {
    if (!this.qboVendors) {
      this.qboVendors = this.generalService.get(
        `/workspaces/${workspace_id}/qbo/vendors/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboVendors;
  }

  getQBOEmployees(workspace_id: number): Observable<any> {
    if (!this.qboEmployees) {
      this.qboEmployees = this.generalService.get(
        `/workspaces/${workspace_id}/qbo/employees/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboEmployees;
  }

  getFyleEmployees(workspace_id: number): Observable<any> {
    if (!this.fyleEmployees) {
      this.fyleEmployees = this.generalService.get(
        `/workspaces/${workspace_id}/fyle/employees/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleEmployees;
  }

  getQBOCustomers(workspace_id: number): Observable<any> {
    if (!this.qboCustomers) {
      this.qboCustomers = this.generalService.get(
        `/workspaces/${workspace_id}/qbo/customers/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboCustomers;
  }

  getFyleProjects(workspace_id: number): Observable<any> {
    if (!this.fyleProjects) {
      this.fyleProjects = this.generalService.get(
        `/workspaces/${workspace_id}/fyle/projects/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleProjects;
  }

  getQBOClasses(workspace_id: number): Observable<any> {
    if (!this.qboClasses) {
      this.qboClasses = this.generalService.get(
        `/workspaces/${workspace_id}/qbo/classes/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.qboClasses;
  }

  getFyleCostCenters(workspace_id: number): Observable<any> {
    if (!this.fyleCostCenters) {
      this.fyleCostCenters = this.generalService.get(
        `/workspaces/${workspace_id}/fyle/cost_centers/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCostCenters;
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
