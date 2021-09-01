import { Injectable } from '@angular/core';
import { empty, Observable, Subject } from 'rxjs';
import { concatMap, expand, map, publishReplay, reduce, refCount } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { GeneralMapping } from '../models/general-mapping.model';
import { MappingsResponse } from '../models/mappings-response.model';
import { WorkspaceService } from './workspace.service';
import { ExpenseField } from '../models/expense-field.model';
import { MappingDestination } from '../models/mapping-destination.model';
import { MappingSource } from '../models/mapping-source.model';
import { Mapping } from '../models/mappings.model';
import { Cacheable, CacheBuster } from 'ngx-cacheable';
import { EmployeeMapping } from '../models/employee-mapping.model';
import { EmployeeMappingsResponse } from '../models/employee-mappings-response.model';

const generalMappingsCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  fyleCategories: Observable<MappingSource[]>;
  fyleEmployees: Observable<MappingSource[]>;
  fyleProjects: Observable<MappingSource[]>;
  fyleCostCenters: Observable<MappingSource[]>;
  fyleExpenseCustomFields: Observable<MappingSource[]>;
  expenseFields: Observable<ExpenseField[]>;
  qboAccounts: Observable<MappingDestination[]>;
  qboVendors: Observable<MappingDestination[]>;
  qboEmployees: Observable<MappingDestination[]>;
  qboCustomers: Observable<MappingDestination[]>;
  qboDepartments: Observable<MappingDestination[]>;
  qboClasses: Observable<MappingDestination[]>;
  accountPayables: Observable<MappingDestination[]>;
  bankAccounts: Observable<MappingDestination[]>;
  creditCardAccounts: Observable<MappingDestination[]>;
  billPaymentAccounts: Observable<MappingDestination[]>;
  destinationWorkspace: Observable<{}>;
  sourceWorkspace: Observable<{}>;

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) { }


  syncQuickbooksDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.destinationWorkspace) {
      this.destinationWorkspace = this.apiService.post(`/workspaces/${workspaceId}/qbo/sync_dimensions/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.destinationWorkspace;
  }

  syncFyleDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.sourceWorkspace) {
      this.sourceWorkspace = this.apiService.post(`/workspaces/${workspaceId}/fyle/sync_dimensions/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.sourceWorkspace;
  }

  refreshDimension() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    this.apiService.post(`/workspaces/${workspaceId}/qbo/refresh_dimensions/`, {}).subscribe();
    this.apiService.post(`/workspaces/${workspaceId}/fyle/refresh_dimensions/`, {}).subscribe();
  }

  postFyleEmployees(): Observable<MappingSource[]> {
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

  postFyleCategories(): Observable<MappingSource[]> {
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

  postFyleProjects(): Observable<MappingSource[]> {
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

  postExpenseCustomFields(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleExpenseCustomFields) {
      this.fyleExpenseCustomFields = this.apiService.post(`/workspaces/${workspaceId}/fyle/expense_custom_fields/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleExpenseCustomFields;
  }

  postFyleCostCenters(): Observable<MappingSource[]> {
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

  postQBOVendors(): Observable<MappingDestination[]> {
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

  postQBOEmployees(): Observable<MappingDestination[]> {
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


  postQBOCustomers(): Observable<MappingDestination[]> {
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

  postExpenseAccounts(): Observable<MappingDestination[]> {
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

  postBankAccounts(): Observable<MappingDestination[]> {
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

  postAccountsPayables(): Observable<MappingDestination[]> {
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

  postCreditCardAccounts(): Observable<MappingDestination[]> {
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

  postBillPaymentAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.billPaymentAccounts) {
      this.billPaymentAccounts = this.apiService.post(
        `/workspaces/${workspaceId}/qbo/bill_payment_accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.billPaymentAccounts;
  }


  postQBOClasses(): Observable<MappingDestination[]> {
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

  postQBODepartments(): Observable<MappingDestination[]> {
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

  getFyleExpenseFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_fields/`, {});
  }

  getFyleEmployees(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/employees/`, {});
  }

  getFyleCategories(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/categories/`, {});
  }

  getQBOVendors(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/vendors/`, {});
  }

  getQBOFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/quickbooks_fields/`, {});
  }


  getQBOEmployees(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/employees/`, {});
  }

  getQBOCustomers(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/customers/`, {});
  }

  getFyleExpenseCustomFields(attributeType: string): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_custom_fields/`, {
      attribute_type: attributeType
    });
  }

  getQBOClasses(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/classes/`, {});
  }

  getQBODepartments(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/qbo/departments/`, {});
  }

  getExpenseAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/accounts/`, {}
    );
  }

  getBankAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/bank_accounts/`, {}
    );
  }

  getAccountsPayables(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/accounts_payables/`, {}
    );
  }

  getBillPaymentAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/bill_payment_accounts/`, {}
    );
  }

  getCreditCardAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/qbo/credit_card_accounts/`, {}
    );
  }

  @Cacheable({
    cacheBusterObserver: generalMappingsCache
  })
  getGeneralMappings(): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/general/`, {}
    );
  }

  @CacheBuster({
    cacheBusterNotifier: generalMappingsCache
  })
  postGeneralMappings(generalMappings: GeneralMapping): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/general/`, generalMappings);
  }

  getMappings(sourceType: string, uri: string = null, limit: number = 500, offset: number = 0, tableDimension: number = 2): Observable<MappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const url = uri ? uri.split('/api')[1] : `/workspaces/${workspaceId}/mappings/?limit=${limit}&offset=${offset}&source_type=${sourceType}&table_dimension=${tableDimension}`;
    return this.apiService.get(url, {});
  }

  getEmployeeMappings(uri: string = null, limit: number = 500, offset: number = 0): Observable<EmployeeMappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const url = uri ? uri.split('/api')[1] : `/workspaces/${workspaceId}/mappings/employee/?limit=${limit}&offset=${offset}`;
    return this.apiService.get(url, {});
  }

  getAllMappings(sourceType: string): Observable<Mapping[]> {
    const that = this;
    return this.getMappings(sourceType).pipe(expand((res: MappingsResponse) => {
      // tslint:disable-next-line
      return res.next ? that.getMappings(sourceType, res.next) : empty();
    }), concatMap((res: MappingsResponse) => res.results),
      reduce((arr: Mapping[], val: Mapping) => {
        arr.push(val);
        return arr;
      }, []));
  }

  postMappings(mapping: Mapping): Observable<Mapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/`, mapping);
  }

  postEmployeeMappings(employeeMapping: EmployeeMapping): Observable<EmployeeMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/employee/`, employeeMapping);
  }

  triggerAutoMapEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/auto_map_employees/trigger/`, {});
  }
}
