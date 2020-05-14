import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

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
  settings: string;
  workspaceId: number;
  form: FormGroup;
  error: string;
  datetimeIsValid: boolean = true;
  frequencyIsValid: boolean = true;
  scheduleEnabled: boolean = true;
  datetimePickerOptions: FlatpickrOptions;
  modalRef: NgbModalRef;
  closeResult: string;
  generalSettingsForm: FormGroup;
  generalSettings: any;
  mappingSettings: any;
  reimbursableExpensesObjects: any[]
  cccExpensesObjects: any[]
  employeeMappingsObjects: any[]
  reimbursableExpensesObjectIsValid: boolean = true;
  employeeMappingsObjectIsValid: boolean = true;
  employeeFieldMapping: any = {};

  constructor(private modalService: NgbModal, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      datetime: new FormControl(''),
      hours: new FormControl(''),
      scheduleEnabled: new FormControl()
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

  getSettings() {
    this.settingsService.getSettings(this.workspaceId).subscribe(settings => {
      if (settings) {
        if (settings.schedule) {
          this.form.setValue({
            datetime: new Date(settings.schedule.start_datetime),
            hours: settings.schedule.interval_hours,
            scheduleEnabled: settings.schedule.enabled
          });
          this.datetimePickerOptions.minDate = new Date(settings.schedule.start_datetime.split('T')[0]);
          this.datetimePickerOptions.defaultDate = new Date(settings.schedule.start_datetime).toISOString();
        }
        this.isLoading = false;
      }
    }, error => {
      if (error.status == 400) {
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
      this.settings = '';
    } else if (this.state === 'destination') {
      this.source = '';
      this.destination = 'active';
      this.schedule = '';
      this.settings = '';
    } else if (this.state === 'schedule') {
      this.source = '';
      this.destination = '';
      this.schedule = 'active';
      this.settings = '';
    } else if (this.state === 'settings') {
      this.source = '';
      this.destination = '';
      this.schedule = '';
      this.settings = 'active';
    }
  }

  submit() {
    this.datetimeIsValid = false
    this.frequencyIsValid = false

    if (this.form.value.datetime) {
      this.datetimeIsValid = true;
    }

    if (this.form.value.hours) {
      this.frequencyIsValid = true;
    }

    if (this.datetimeIsValid && this.frequencyIsValid) {
      let nextRun = new Date(this.form.value.datetime).toISOString();
      let hours = this.form.value.hours;
      let scheduleEnabled = this.form.value.scheduleEnabled;
      this.isLoading = true;
      this.settingsService.postSettings(this.workspaceId, nextRun, hours, scheduleEnabled).subscribe(response => {
        this.getSettings();
      });
    }
  }

  getAllSettings() {
    forkJoin(
      [
        this.settingsService.getGeneralSettings(this.workspaceId),
        this.settingsService.getMappingSettings(this.workspaceId)
      ]
    ).subscribe(responses => {
      this.generalSettings = responses[0];
      this.mappingSettings = responses[1]['results'];

      let employeeFieldMapping = this.mappingSettings.filter(
        setting => (setting.source_field === 'EMPLOYEE') &&
          (setting.destination_field === 'EMPLOYEE' || setting.destination_field === 'VENDOR')
      )[0]

      this.employeeFieldMapping = employeeFieldMapping;

      this.isLoading = false;
      this.generalSettingsForm = this.formBuilder.group({
        reimbursableExpensesObjects: [this.generalSettings ? this.generalSettings['reimbursable_expenses_object'] : ''],
        cccExpensesObjects: [this.generalSettings ? this.generalSettings['corporate_credit_card_expenses_object'] : ''],
        employeeMappingsObjects: [this.mappingSettings ? this.employeeFieldMapping.destination_field : ''],
      });
      this.generalSettingsForm.controls.employeeMappingsObjects.disable()
      this.generalSettingsForm.controls.reimbursableExpensesObjects.disable()
      if (this.generalSettings.corporate_credit_card_expenses_object) {
        this.generalSettingsForm.controls.cccExpensesObjects.disable()
      }
    }, error => {
      if (error.status == 400) {
        this.generalSettings = {};
        this.mappingSettings = {}
        this.isLoading = false;
        this.generalSettingsForm = this.formBuilder.group({
          reimbursableExpensesObjects: [''],
          cccExpensesObjects: [''],
          employeeMappingsObjects: ['']
        });
        this.generalSettingsForm.controls['employeeMappingsObjects'].valueChanges.subscribe((value) => {
          setTimeout(() => {
            switch (value) {
              case 'VENDOR': this.reimbursableExpensesObjects = [{ name: 'BILL' }, { name: 'JOURNAL ENTRY' }];
                break;
              case 'EMPLOYEE': this.reimbursableExpensesObjects = [{ name: 'CHECK' }, { name: 'JOURNAL ENTRY' }];
                break;
            }
          }, 500);
        });
      }
    });
  }

  submitSettings() {
    this.reimbursableExpensesObjectIsValid = false;
    this.employeeMappingsObjectIsValid = false;

    let mappingsSettingsPayload = [{
      source_field: 'CATEGORY',
      destination_field: 'ACCOUNT'
    }]

    let reimbursableExpensesObject = this.generalSettingsForm.value.reimbursableExpensesObjects == undefined ? this.generalSettings.reimbursable_expenses_object : this.generalSettingsForm.value.reimbursableExpensesObjects;
    let cccExpensesObject = this.generalSettingsForm.value.cccExpensesObjects == 'NONE' ? null : this.generalSettingsForm.value.cccExpensesObjects;
    let employeeMappingsObject = this.generalSettingsForm.value.employeeMappingsObjects == undefined ? this.generalSettings.employee_field_mapping : this.generalSettingsForm.value.employeeMappingsObjects;

    if (reimbursableExpensesObject != null) {
      this.reimbursableExpensesObjectIsValid = true;
    }
    if (employeeMappingsObject != null) {
      this.employeeMappingsObjectIsValid = true;
    }

    if (cccExpensesObject != null) {
      mappingsSettingsPayload.push({
        source_field: 'EMPLOYEE',
        destination_field: 'CREDIT_CARD_ACCOUNT'
      });
    }

    if (this.reimbursableExpensesObjectIsValid && this.employeeMappingsObjectIsValid) {
      this.isLoading = true;
      mappingsSettingsPayload.push({
        source_field: 'EMPLOYEE',
        destination_field: employeeMappingsObject
      });

      forkJoin(
        [
          this.settingsService.postMappingSettings(this.workspaceId, mappingsSettingsPayload),
          this.settingsService.postGeneralSettings(this.workspaceId, reimbursableExpensesObject, cccExpensesObject, '')
        ]
      ).subscribe(responses => {
        this.closeModal();
        this.isLoading = true;
        window.location.href= `/workspaces/${this.workspaceId}/expense_groups`;
      });
    }
  }

  closeModal() {
    this.modalRef.close();
  }

  connectFyle() {
    window.location.href =
      `${FYLE_URL}/app/developers/#/oauth/authorize?client_id=${FYLE_CLIENT_ID}&redirect_uri=${APP_URL}/workspaces/fyle/callback&response_type=code&state=${this.workspaceId}`;
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
    this.reimbursableExpensesObjects = [
      { name: 'BILL' },
      { name: 'CHECK' },
      { name: 'JOURNAL ENTRY' }
    ];

    this.cccExpensesObjects = [
      { name: 'NONE' },
      { name: 'CREDIT CARD PURCHASE' },
      { name: 'JOURNAL ENTRY' }
    ];

    this.employeeMappingsObjects = [
      { name: 'EMPLOYEE' },
      { name: 'VENDOR' }
    ];

    this.datetimePickerOptions = {
      enableTime: true,
      minDate: new Date()
    }
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.route.queryParams.subscribe(queryParams => {
        this.getSource();
        this.getDestination();
        this.getSettings();
        if (queryParams.state) {
          this.toggleState(queryParams.state);
          this.error = queryParams.error;
        } else {
          this.toggleState('source');
          this.error = queryParams.error;
        }
      });
      this.getAllSettings();
    });

  }
}
