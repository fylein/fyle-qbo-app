import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { SettingsService } from 'src/app/core/services/settings.service';

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const QBO_CLIENT_ID = environment.qbo_client_id;
const QBO_SCOPE = environment.qbo_scope;
const QBO_AUTHORIZE_URI = environment.qbo_authorize_uri;
const APP_URL = environment.app_url;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss', '../qbo.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {

  }
}
