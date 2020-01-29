import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-qbo-callback',
  templateUrl: './qbo-callback.component.html',
  styleUrls: ['./qbo-callback.component.css']
})
export class QBOCallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router,private settingsService: SettingsService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let workspaceId: number = params.state;
      let code: string = params.code;
      let realmId: string = params.realmId
      this.settingsService.connectQBO(workspaceId, code, realmId).subscribe(response => {
        if (response) {
          this.router.navigateByUrl('/workspaces/' + workspaceId + '/settings?state=destination');
        }
      });
    });
  }

}
