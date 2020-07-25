import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-qbo-callback',
  templateUrl: './qbo-callback.component.html',
  styleUrls: ['./qbo-callback.component.scss']
})
export class QBOCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService) { }

  ngOnInit() {
    const that = this;
    const workspaceId: number = that.route.snapshot.queryParams.state;
    const code: string = that.route.snapshot.queryParams.code;
    const realmId: string = that.route.snapshot.queryParams.realmId;
    // TODO: replace with rxjs implementation
    that.settingsService.connectQBO(workspaceId, code, realmId).toPromise().then(() => {
      // nothing to do here but need then block for promise to execute
    }).finally(() => {
      that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`);
    });
  }

}
