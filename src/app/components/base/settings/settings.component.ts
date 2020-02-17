import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';


const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const QBO_CLIENT_ID = environment.qbo_client_id;
const QBO_SCOPE = environment.qbo_scope;
const QBO_AUTHORIZE_URI = environment.qbo_authorize_uri;
const APP_URL = environment.app_url;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', '../base.component.css'],
})
export class SettingsComponent implements OnInit {
  showModal = false;
  fyleConnected: boolean;
  qboConnected: boolean;
  isLoading = true;
  state: string = 'source';
  source: string = 'active';
  destination: string;
  schedule: string;
  workspaceId: number;
  error: string;

  constructor(private settingsService: SettingsService, private route: ActivatedRoute, private router: Router) {
  }

  getSource() {
    this.settingsService.getFyleCredentials(this.workspaceId).subscribe(credentials => {
      if (credentials) {
        this.fyleConnected = true;
        this.isLoading = false;
      }
    }, error => {
      if (error.status == 400) {
        this.fyleConnected = false;
        this.isLoading = false;
      }
    });
  }

  getDestination() {
    this.settingsService.getQBOCredentials(this.workspaceId).subscribe(credentials => {
      if (credentials) {
        this.qboConnected = true;
        this.isLoading = false;
      }
    }, error => {
      if (error.status == 400) {
        this.qboConnected = false;
        this.isLoading = false;
      }
    });
  }

  disconnectFyle() {
    this.settingsService.deleteFyleCredentials(this.workspaceId).subscribe(response => {
      this.fyleConnected = false;
    });
  }

  disconnectQBO() {
    this.settingsService.deleteQBOCredentials(this.workspaceId).subscribe(response => {
      this.qboConnected = false;
    });
  }


  toggleState(state: string) {
    this.state = state;
    this.error = '';

    if (this.state === 'source') {
      this.source = 'active';
      this.destination = '';
      this.schedule = '';
    } else if (this.state === 'destination') {
      this.source = '';
      this.destination = 'active';
      this.schedule = '';
    } else if (this.state === 'schedule') {
      this.source = '';
      this.destination = '';
      this.schedule = 'active';
    }
  }

  connectFyle() {
    window.location.href =
      FYLE_URL + '/app/main/#/oauth/authorize?' + 'client_id=' + FYLE_CLIENT_ID +
      '&redirect_uri=' + APP_URL + '/workspaces/fyle/callback&response_type=code&state=' + this.workspaceId;
  }

  connectQBO() {
    window.location.href = QBO_AUTHORIZE_URI + '?client_id=' 
    + QBO_CLIENT_ID + '&scope=' + QBO_SCOPE + '&response_type=code&redirect_uri=' 
    + APP_URL + '/workspaces/qbo/callback&state=' + this.workspaceId; 
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.route.queryParams.subscribe(queryParams => {
        this.getSource();
        this.getDestination();
        if (queryParams.state) {
          this.toggleState(queryParams.state);
          this.error = queryParams.error;
        } else {
          this.toggleState('source');
          this.error = queryParams.error;
        }
      });
    });
  }
}
