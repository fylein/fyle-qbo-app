import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qbo-callback',
  templateUrl: './qbo-callback.component.html',
  styleUrls: ['./qbo-callback.component.scss']
})
export class QBOCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService) { }

  ngOnInit() {
    const that = this;
    const workspaceId: number = that.route.snapshot.queryParams.state;
    const code: string = that.route.snapshot.queryParams.code;
    const realmId: string = that.route.snapshot.queryParams.realmId;
    const redirectUri: string = environment.app_url + '/workspaces/qbo/callback';
    that.settingsService.connectQBO(workspaceId, code, realmId, redirectUri).subscribe(() => {
      that.trackingService.onQBOConnect();
      that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`);
    }, () => {
      that.snackBar.open(`Please select the QuickBooks Online account that you had previously established integration with.`, null, {
        duration: 8000
      });
      that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`);
    });
  }

}
