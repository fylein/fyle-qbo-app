import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    const that = this;
    const workspaceId: number = that.route.snapshot.queryParams.state;
    const code: string = that.route.snapshot.queryParams.code;
    const realmId: string = that.route.snapshot.queryParams.realmId;
    that.settingsService.connectQBO(workspaceId, code, realmId).subscribe(() => {
      that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`);
    }, () => {
      that.snackBar.open(`Please select the QBO account that you had previously established integration with.`, null, {
        duration: 8000
      });
      that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`);
    });
  }

}
