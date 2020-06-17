import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BillsService } from '../services/bills.service';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesGuard implements CanActivate {

  constructor(private settingsService: SettingsService, private router: Router, private billsService: BillsService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const params = next.params;
    const workspaceId = +params.workspace_id;

    return forkJoin(
      [
        this.settingsService.getFyleCredentials(workspaceId),
        this.settingsService.getQBOCredentials(workspaceId),
        this.settingsService.getGeneralSettings(workspaceId),
        this.billsService.getPreferences(workspaceId)
      ]
    ).pipe(
      map(response => response ? true : false),
      catchError(error => {
        let state: string;
        if (error.status == 400) {
          if (error.error.message === 'QBO Credentials not found in this workspace') {
            state = 'destination';
          } else if (error.error.message === 'General Settings does not exist in workspace') {
            state = 'settings';
          } else if (error.error.message === 'Quickbooks Online connection expired') {
            this.settingsService.deleteQBOCredentials(workspaceId).subscribe();
            state = 'destination';
          } else {
            state = 'source';
          }
        }
        return this.router.navigateByUrl(`workspaces/${workspaceId}/settings?state=${state}&error=${error.error.message}`);
      })
    );
  }
}
