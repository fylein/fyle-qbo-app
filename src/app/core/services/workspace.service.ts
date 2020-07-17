import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService) { }

  createWorkspace(): Observable<any> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaces(orgId): Observable<any> {
    return this.apiService.get(`/workspaces/`, {
      org_id: orgId
    });
  }

  getWorkspaceId(): number {
    const id = this.storageService.get('workspaceId');
    return id ? +id : null;
  }
}
