import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-shared-login',
  templateUrl: './shared-login.component.html',
  styleUrls: ['./shared-login.component.scss']
})
export class SharedLoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    const that = this;
    if (that.authService.isLoggedIn()) {
      that.authService.logout();
    }

    this.route.queryParams.subscribe(params => {
      const localStorageDump = JSON.parse(params.local_storage_dump);
      Object.keys(localStorageDump).forEach(key => {
        this.storageService.set(key, localStorageDump[key]);
      });
    });

    this.router.navigate(['/workspaces']);
    // that.storageService.set('email', response.user.email);
    // that.storageService.set('access_token', response.access_token);
    // that.storageService.set('refresh_token', response.refresh_token);
    // const user = {
    //   employee_email: response.user.email,
    //   full_name: response.user.full_name,
    //   org_id: response.user.org_id,
    //   org_name: response.user.org_name,
    //   user_id: response.user.user_id
    // };
    // that.storageService.set('user', user);
    // that.authService.getFyleOrgs().subscribe(responses => {
    //   that.storageService.set('orgsCount', responses);
    //   that.router.navigate(['/workspaces']);
    // });
  }

}
