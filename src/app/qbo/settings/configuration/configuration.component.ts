import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { forkJoin } from 'rxjs';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss', '../../qbo.component.scss']
})
export class ConfigurationComponent implements OnInit {
  state: string;
  workspaceId: number;
  isParentLoading: boolean;
  fyleFields: any;
  generalSettings: any;

  constructor(private route: ActivatedRoute, private router: Router, private mappingsService: MappingsService, private settingsService: SettingsService) { }

  changeState(state) {
    const that = this;
    if (that.state !== state) {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/settings/configurations/${that.state.toLowerCase()}`]);
    }
  }

  showExpenseFields() {
    const that = this;

    if (that.fyleFields && that.fyleFields.length && that.generalSettings) {
      return true;
    }

    return false;
  } 

  ngOnInit() {
    const that = this;

    that.isParentLoading = true;

    that.state = that.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'GENERAL';
    that.workspaceId = +that.route.snapshot.parent.params.workspace_id;

    forkJoin(
      [
        that.mappingsService.getFyleExpenseFields(),
        that.settingsService.getGeneralSettings(that.workspaceId)
      ]
    ).subscribe(response => {
      that.fyleFields = response[0];
      that.generalSettings = response[1];
      that.isParentLoading = false;
    }, () => {
      that.isParentLoading = false;
    });
  }

}
