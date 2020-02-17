import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { SettingsService } from 'src/app/components/base/settings/settings.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesGuard implements CanActivate {

  constructor(private settingsService: SettingsService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let params = next.params;
    let workspaceId = +params['workspace_id']
    console.log(workspaceId);

    return forkJoin(
      [
        this.settingsService.getFyleCredentials(workspaceId),
        this.settingsService.getQBOCredentials(workspaceId)
      ]
    ).pipe(
      map(response => response? true: false),
      catchError(error => {
        let state: string
        if (error.status == 400) {
          if(error.error.message === 'QBO Credentials not found in this workspace') {
            state = 'destination';
          } else {
            state = 'source';
          }
        }
        console.log(state);
        return this.router.navigateByUrl(`workspaces/${workspaceId}/settings?state=${state}&error=${error.error.message}`);
      })
    );
  }
}
