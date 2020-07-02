import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-employee-mappings-dialog',
  templateUrl: './employee-mappings-dialog.component.html',
  styleUrls: ['./employee-mappings-dialog.component.scss']
})
export class EmployeeMappingsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  workSpaceId: number;
  fyleEmployees: any[];
  qboEmployees: any[];
  cccObjects: any[];
  qboVendors: any[];
  generalSettings: any;
  employeeOptions: any[];
  qboEmployeeOptions: any[];
  cccOptions: any[];
  qboVendorOptions: any[];
  generalMappings: any;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EmployeeMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mappingsService: MappingsService,
              private snackBar: MatSnackBar,
              private settingsService: SettingsService) { }


  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  submit() {
    const that = this;
    const fyleEmployee = that.form.value.fyleEmployee;
    const qboVendor = that.generalSettings.employee_field_mapping === 'VENDOR' ? that.form.value.qboVendor : '';
    const qboEmployee = that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.form.value.qboEmployee : '';
    const creditCardAccount = that.form.value.creditCardAccount ? that.form.value.creditCardAccount.value : that.generalMappings.default_ccc_account_name;

    if (that.form.valid && (qboVendor || qboEmployee)) {
      const employeeMapping = [
        that.mappingsService.postMappings(that.workSpaceId, {
          source_type: 'EMPLOYEE',
          destination_type: that.generalSettings.employee_field_mapping,
          source_value: fyleEmployee.value,
          destination_value: that.generalSettings.employee_field_mapping === 'VENDOR' ? qboVendor.value : qboEmployee.value
        })
      ];

      if (creditCardAccount || that.generalSettings.corporate_credit_card_expenses_object) {
        employeeMapping.push(
          that.mappingsService.postMappings(that.workSpaceId, {
            source_type: 'EMPLOYEE',
            destination_type: 'CREDIT_CARD_ACCOUNT',
            source_value: fyleEmployee.value,
            destination_value: creditCardAccount
          })
        );
      }
      that.isLoading = true;
      forkJoin(employeeMapping).subscribe(responses => {
        that.snackBar.open('Mapping saved successfully!');
        that.isLoading = false;
        that.dialogRef.close();
      });

    }
  }

  reset() {
    const that = this;
    const getFyleEmployees = that.mappingsService.getFyleEmployees(that.workSpaceId).toPromise().then((fyleEmployees) => {
      that.fyleEmployees = fyleEmployees;
    });

    const getQBOEmployees = that.mappingsService.getQBOEmployees(that.workSpaceId).toPromise().then((qboEmployees) => {
      that.qboEmployees = qboEmployees;
    });

    const getCCCAccounts = that.mappingsService.getCreditCardAccounts(that.workSpaceId).toPromise().then((cccObjects) => {
      that.cccObjects = cccObjects;
    });

    const getQboVendors = that.mappingsService.getQBOVendors(that.workSpaceId).toPromise().then((qboVendors) => {
      that.qboVendors = qboVendors;
    });

    const getGeneralMappings = that.mappingsService.getGeneralMappings(that.workSpaceId).toPromise().then(generalMappings => {
      that.generalMappings = generalMappings;
    });

    that.isLoading = true;
    forkJoin([
      from(getFyleEmployees),
      from(getQBOEmployees),
      from(getCCCAccounts),
      from(getQboVendors),
      from(getGeneralMappings)
    ]).subscribe((res) => {
      that.isLoading = false;
    });

    that.form = that.formBuilder.group({
      fyleEmployee: ['', Validators.required],
      qboVendor: [''],
      qboEmployee: [''],
      creditCardAccount: ['']
    });

    that.form.controls.fyleEmployee.valueChanges.pipe(debounceTime(200)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.employeeOptions = that.fyleEmployees
          .filter(fyleEmployee => new RegExp(newValue.toLowerCase(), 'g').test(fyleEmployee.value.toLowerCase()));
      }
    });

    that.form.controls.qboVendor.valueChanges.pipe(debounceTime(200)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.qboVendorOptions = that.qboVendors
          .filter(qboVendor => new RegExp(newValue.toLowerCase(), 'g').test(qboVendor.value.toLowerCase()));
      }
    });

    that.form.controls.qboEmployee.valueChanges.pipe(debounceTime(200)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.qboEmployeeOptions = that.qboEmployees
          .filter(qboEmployee => new RegExp(newValue.toLowerCase(), 'g').test(qboEmployee.value.toLowerCase()));
      }
    });

    that.form.controls.creditCardAccount.valueChanges.pipe(debounceTime(200)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.cccOptions = that.cccObjects
          .filter(cccObject => new RegExp(newValue.toLowerCase(), 'g').test(cccObject.value.toLowerCase()));
      }
    });
  }

  ngOnInit() {
    const that = this;
    that.workSpaceId = that.data.workspaceId;
    that.isLoading = true;
    that.settingsService.getCombinedSettings(that.workSpaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }

}
