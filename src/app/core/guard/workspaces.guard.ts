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

  constructor(private settingsService: SettingsService, private router: Router, private billsService: BillsService) { }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
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
      map(response => !!response),
      catchError(error => {
        const that = this;
        if (error.status === 400) {
          if (error.error.message === 'Quickbooks Online connection expired') {
            that.settingsService.deleteQBOCredentials(workspaceId).subscribe();
          }
        }
        return that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`).then(a => {
          console.log(a);
          return a || true;
        }).catch(a => {
          console.log(a);
          return a || true;
        })
        ;
      })
    );
  }
}
