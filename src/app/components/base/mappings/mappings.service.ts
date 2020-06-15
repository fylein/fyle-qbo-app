import { Injectable } from '@angular/core';
import { GeneralService } from '../general.service';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  fyleCategories: Observable<any[]>;
  netsuiteAccounts: Observable<any[]>;
  
  fyleEmployees: Observable<any[]>;
  netsuiteVendors: Observable<any[]>;
  netsuiteEmployees: Observable<any[]>;

  fyleProjects: Observable<any[]>;
  netsuiteDepartments: Observable<any[]>;

  fyleCostCenters: Observable<any[]>;
  netsuiteLocations: Observable<any[]>;

  netsuiteSubsidiaries: Observable<any[]>;

  nsSubs: Observable<any[]>;


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

  postNetSuiteVendors(workspace_id: number): Observable<any> {
    if (!this.netsuiteVendors) {
      this.netsuiteVendors = this.generalService.post(`/workspaces/${workspace_id}/netsuite/vendors/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteVendors;
  }


  postExpenseAccounts(workspace_id: number): Observable<any> {
    if (!this.netsuiteAccounts) {
      this.netsuiteAccounts = this.generalService.post(
        `/workspaces/${workspace_id}/netsuite/accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteAccounts;
  }

  postNetSuiteLocations(workspace_id: number): Observable<any> {
    if (!this.netsuiteLocations) {
      this.netsuiteLocations = this.generalService.post(`/workspaces/${workspace_id}/netsuite/locations/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteLocations;
  }

  postNetSuiteDepartments(workspace_id: number): Observable<any> {
    if (!this.netsuiteDepartments) {
      this.netsuiteDepartments = this.generalService.post(`/workspaces/${workspace_id}/netsuite/departments/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteDepartments;
  }

  postNetSuiteSubsidiaries(workspace_id: number): Observable<any> {
    if (!this.nsSubs) {
      this.nsSubs = this.generalService.post(`/workspaces/${workspace_id}/netsuite/subsidiaries/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.nsSubs;
  }

  postSubsidiaryMappings(workspace_id: number, internal_id: string, subsidiary_name: string): Observable<any> {
    this.netsuiteSubsidiaries = null;
    return this.generalService.post(
      `/workspaces/${workspace_id}/mappings/subsidiaries/`, {
        subsidiary_name: subsidiary_name,
        internal_id: internal_id
      }
    );
  }

  getFyleEmployees(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/fyle/employees/`, {});
  }

  getFyleCategories(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/fyle/categories/`, {});
  }

  getNetSuiteVendors(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/netsuite/vendors/`, {});
  }

  getNetSuiteLocations(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/netsuite/locations/`, {});
  }

  getFyleProjects(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/fyle/projects/`, {});
  }

  getNetSuiteDepartments(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/netsuite/departments/`, {});
  }

  getNetSuiteSubsidiaries(workspace_id: number): Observable<any> {
    return this.generalService.get(`/workspaces/${workspace_id}/netsuite/subsidiaries/`, {});
  }

  getFyleCostCenters(workspace_id: number): Observable<any> {
      return this.generalService.get(`/workspaces/${workspace_id}/fyle/cost_centers/`, {});
  }

  getExpenseAccounts(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/netsuite/accounts/`, {}
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

  getSubsidiaryMappings(workspace_id: number): Observable<any> {
    return this.generalService.get(
      `/workspaces/${workspace_id}/mappings/subsidiaries/`, {}
    );
  }
}
