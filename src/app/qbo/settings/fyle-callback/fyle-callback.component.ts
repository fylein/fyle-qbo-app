import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-fyle-callback',
  templateUrl: './fyle-callback.component.html',
  styleUrls: ['./fyle-callback.component.scss']
})
export class FyleCallbackComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private settingsService: SettingsService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const workspaceId: number = params.state;
      const code: string = params.code;
      this.settingsService.connectFyle(workspaceId, code).subscribe(response => {
        if (response) {
          this.router.navigateByUrl('/workspaces/' + workspaceId + '/settings?state=source');
        }
      }, error => {
        if (error.status == 400) {
          this.router.navigateByUrl(`/workspaces/${workspaceId}/settings?state=source&error=${error.error.message}`);
        }
      });
    });
  }

}
