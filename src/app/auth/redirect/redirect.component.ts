import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/core/services/workspace.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit() {
    this.workspaceService.switchToNewApp({app_version: 'v2'});
  }

}
