import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-qbo-callback',
  templateUrl: './qbo-callback.component.html',
  styleUrls: ['./qbo-callback.component.scss']
})
export class QBOCallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService) { }

  ngOnInit() {
    const workspaceId: number = this.route.snapshot.params.state;
    const code: string = this.route.snapshot.params.code;
    const realmId: string = this.route.snapshot.params.realmId;
    this.settingsService.connectQBO(workspaceId, code, realmId).subscribe(response => {
      if (response) {
        this.router.navigateByUrl(`/workspaces/${workspaceId}/settings?state=destination`);
      }
    },
      error => {
        if (error.status == 400) {
          this.router.navigateByUrl(`/workspaces/${workspaceId}/settings?state=destination&error=${error.error.message}`);
        }
      });
  }

}
