import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { MinimalPatchWorkspace, Workspace } from '../models/workspace.model';
import { Cacheable } from 'ngx-cacheable';
import { TrackingService } from './tracking.service';
import { AuthService } from './auth.service';
import { WindowReferenceService } from './window.service';
import { environment } from 'src/environments/environment';

const workspaceCache$ = new Subject<void>();
export { workspaceCache$ };

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  windowReference: Window;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private storageService: StorageService,
    private trackingService: TrackingService,
    private windowReferenceService: WindowReferenceService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  switchToNewApp(workspace: MinimalPatchWorkspace | void): void {
    if (!workspace) {
      workspace = {
        app_version: 'v2',
        onboarding_state: 'COMPLETE'
      };
    }

    this.patchWorkspace(workspace).subscribe(() => {
      this.trackingService.onSwitchToNewApp();
      this.redirectToNewApp();
    });
  }

  redirectToNewApp(): void {
    const user = this.authService.getUser();

    const localStorageDump = {
      user: {
        email: user.employee_email,
        access_token: this.storageService.get('access_token'),
        refresh_token: this.storageService.get('refresh_token'),
        full_name: user.full_name,
        user_id: user.user_id,
        org_id: user.org_id,
        org_name: user.org_name
      },
      orgsCount: this.authService.getOrgCount()
    };

    this.windowReference.location.href = `${environment.new_qbo_app_url}?local_storage_dump=${JSON.stringify(localStorageDump)}`;
  }

  createWorkspace(): Observable<Workspace> {
    return this.apiService.post('/workspaces/', {});
  }

  patchWorkspace(workspace: MinimalPatchWorkspace): Observable<Workspace> {
    return this.apiService.patch(`/workspaces/${this.getWorkspaceId()}/`, workspace);
  }

  @Cacheable()
  getWorkspaces(orgId): Observable<Workspace[]> {
    return this.apiService.get(`/workspaces/`, {
      org_id: orgId
    });
  }

  @Cacheable({
    cacheBusterObserver: workspaceCache$
  })
  getWorkspaceById(): Observable<Workspace> {
    const workspaceId = this.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/`, {});
  }

  getWorkspaceId(): number {
    const id = this.storageService.get('workspaceId');
    return id ? +id : null;
  }

  // TODO: Add a method with implicit workspace id and replace calls everwhere
}
