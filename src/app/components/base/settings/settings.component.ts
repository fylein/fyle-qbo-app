import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const APP_URL = environment.app_url;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', '../base.component.css'],
})
export class SettingsComponent implements OnInit {
  showModal = false;
  fyleConnected: boolean;
  isLoading = true;
  state: string = 'source';
  source: string = 'active';
  destination: string;
  settings: string;
  workspaceId: number;
  form: FormGroup;
  error: string;
  nsAccountIdIsValid: boolean = true;
  nsConsumerKeyIsValid: boolean = true;
  nsConsumerSecretIsValid: boolean = true;
  nsTokenIdIsValid: boolean = true;
  nsTokenSecretIsValid: boolean = true;
  modalRef: NgbModalRef;
  closeResult: string;

  constructor(private modalService: NgbModal, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      nsAccountId: new FormControl(''),
      nsConsumerKey: new FormControl(''),
      nsConsumerSecret: new FormControl(),
      nsTokenId: new FormControl(),
      nsTokenSecret: new FormBuilder(),
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'generalSettingsModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
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


  getNetSuiteSettings() {
    this.settingsService.getNetSuiteCredentials(this.workspaceId).subscribe(settings => {
      if (settings) {
        if (settings.destination) {
          this.form.setValue({
            nsAccountId: settings.destination.ns_account_id,
            nsConsumerKey: settings.destination.ns_consumer_key,
            nsConsumerSecret: settings.destination.ns_consumer_secret,
            nsTokenId: settings.destination.ns_token_id,
            nsTokenSecret: settings.destination.ns_token_secret
          });
        }
        this.isLoading = false;
      }
    }, error => {
      if (error.status == 401) {
        this.isLoading = false;
      }
    });
  }

  disconnectFyle() {
    this.settingsService.deleteFyleCredentials(this.workspaceId).subscribe(response => {
      this.fyleConnected = false;
    });
  }


  toggleState(state: string) {
    this.state = state;
    this.error = '';

    if (this.state === 'source') {
      this.source = 'active';
      this.destination = '';
      this.settings = '';
    } else if (this.state === 'destination') {
      this.source = '';
      this.destination = 'active';
      this.settings = '';
    } else if (this.state === 'schedule') {
      this.source = '';
      this.destination = '';
      this.settings = '';
    } else if (this.state === 'settings') {
      this.source = '';
      this.destination = '';
      this.settings = 'active';
    }
  }

  submit() {
    this.nsAccountIdIsValid = true;
    this.nsConsumerKeyIsValid = true;
    this.nsConsumerSecretIsValid = true;
    this.nsTokenIdIsValid = true;
    this.nsTokenSecretIsValid = true;

    if (this.form.value.ns_account_id) {
      this.nsAccountIdIsValid = true;
    }

    if (this.form.value.ns_consumer_key) {
      this.nsConsumerKeyIsValid = true;
    }

    if (this.form.value.ns_consumer_secret) {
      this.nsConsumerSecretIsValid = true;
    }

    if (this.form.value.ns_token_id) {
      this.nsTokenIdIsValid = true;
    }

    if (this.form.value.ns_token_secret) {
      this.nsTokenSecretIsValid = true;
    }

    if (this.nsAccountIdIsValid && this.nsConsumerKeyIsValid && this.nsConsumerSecretIsValid && this.nsTokenIdIsValid && this.nsTokenSecretIsValid) {
      let accountId = this.form.value.nsAccountId;
      let consumerKey = this.form.value.nsConsumerKey;
      let consumerSecret = this.form.value.nsConsumerSecret;
      let tokenId = this.form.value.nsTokenId;
      let tokenSecret = this.form.value.nsTokenSecret;

      this.isLoading = true;
      this.settingsService.connectNetSuite(this.workspaceId, accountId, consumerKey, consumerSecret, tokenId, tokenSecret).subscribe(response => {
        console.log(accountId, consumerKey, consumerSecret, tokenId, tokenSecret)
        this.getNetSuiteSettings();
      }, error => {
        if (error.status == 400) {
          this.isLoading = false;
      }
    });
    }
  }

  getNetrSuiteSettings() {
    this.settingsService.getNetSuiteCredentials(this.workspaceId).subscribe(settings => {
      if (settings) {
        if (settings.destination) {
          this.form.setValue({
            nsAccountId: settings.destination.ns_account_id,
            nsConsumerKey: settings.destination.ns_consumer_key,
            nsConsumerSecret: settings.destination.ns_consumer_secret,
            nsTokenId: settings.destination.ns_token_id,
            nsTokenSecret: settings.destination.ns_token_secret
          });
        }
        this.isLoading = false;
      }
    }, error => {
      if (error.status == 400) {
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.modalRef.close();
  }

  connectFyle() {
    window.location.href =
      `${FYLE_URL}/app/developers/#/oauth/authorize?client_id=${FYLE_CLIENT_ID}&redirect_uri=${APP_URL}/workspaces/fyle/callback&response_type=code&state=${this.workspaceId}`;
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.route.queryParams.subscribe(queryParams => {
        this.getSource();
        this.getNetSuiteSettings();
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
