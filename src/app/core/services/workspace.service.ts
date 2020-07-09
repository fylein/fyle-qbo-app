import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(private apiService: ApiService) { }

  createWorkspace(): Observable<any> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaces(orgId): Observable<any> {
    return this.apiService.get(`/workspaces/?org_id=${orgId}`, {});
  }
}
