import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MappingSource } from 'src/app/core/models/mapping-source.model';
import { GeneralMapping } from 'src/app/core/models/general-mapping.model';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MappingModal } from 'src/app/core/models/mapping-modal.model';
import { EmployeeMapping } from 'src/app/core/models/employee-mapping.model';

export class MappingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-employee-mappings-dialog',
  templateUrl: './employee-mappings-dialog.component.html',
  styleUrls: ['./employee-mappings-dialog.component.scss', '../../settings.component.scss']
})
export class EmployeeMappingsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  workSpaceId: number;
  fyleEmployees: MappingSource[];
  qboEmployees: MappingDestination[];
  cccObjects: MappingDestination[];
  qboVendors: MappingDestination[];
  generalSettings: GeneralSetting;
  employeeOptions: MappingSource[];
  qboEmployeeOptions: MappingDestination[];
  cccOptions: MappingDestination[];
  qboVendorOptions: MappingDestination[];
  generalMappings: GeneralMapping;
  editMapping: boolean;

  matcher = new MappingErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EmployeeMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MappingModal,
              private mappingsService: MappingsService,
              private snackBar: MatSnackBar,
              private settingsService: SettingsService) { }


  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  submit() {
    const that = this;
    const fyleEmployee = that.form.controls.fyleEmployee.value;
    const qboVendor = that.form.getRawValue().qboVendor;
    const qboEmployee = that.form.getRawValue().qboEmployee;

    if (that.form.valid) {
      const employeeMapping: EmployeeMapping = {
        source_employee: {
          id: fyleEmployee.id
        },
        destination_vendor: {
          id: qboVendor ? qboVendor.id : null
        },
        destination_employee: {
          id: qboEmployee ? qboEmployee.id : null
        },
        destination_card_account: {
          id: that.form.getRawValue().creditCardAccount ? that.form.getRawValue().creditCardAccount.id : null
        },
        workspace: that.workSpaceId
      };

      that.isLoading = true;
      that.mappingsService.postEmployeeMappings(employeeMapping).subscribe(() => {
        that.snackBar.open('Employee Mapping saved successfully');
        that.isLoading = false;
        that.dialogRef.close();
      }, () => {
        that.snackBar.open('Something went wrong');
        that.isLoading = false;
      });
    } else {
      that.snackBar.open('Form has invalid fields');
      that.form.markAllAsTouched();
    }
  }

  forbiddenSelectionValidator(options: (MappingSource|MappingDestination)[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: object } | null => {
      if (control.value) {
        const forbidden = !options.some((option) => {
          return control.value && control.value.id && option && option.id === control.value.id;
        });
        return forbidden ? {
          forbiddenOption: {
            value: control.value
          }
        } : null;
      }

      return null;
    };
  }

  setupFyleEmployeeAutocompleteWatcher() {
    const that = this;
    that.form.controls.fyleEmployee.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.employeeOptions = that.fyleEmployees
          .filter(fyleEmployee => new RegExp(newValue.toLowerCase(), 'g').test(fyleEmployee.value.toLowerCase()));
      }
    });
  }

  setupQboVendorAutocompleteWatcher() {
    const that = this;

    that.form.controls.qboVendor.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.qboVendorOptions = that.qboVendors
          .filter(qboVendor => new RegExp(newValue.toLowerCase(), 'g').test(qboVendor.value.toLowerCase()));
      }
    });
  }

  setupQboEmployeesWatcher() {
    const that = this;

    that.form.controls.qboEmployee.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.qboEmployeeOptions = that.qboEmployees
          .filter(qboEmployee => new RegExp(newValue.toLowerCase(), 'g').test(qboEmployee.value.toLowerCase()));
      }
    });
  }

  setupCCCAutocompleteWatcher() {
    const that = this;

    that.form.controls.creditCardAccount.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.cccOptions = that.cccObjects
          .filter(cccObject => new RegExp(newValue.toLowerCase(), 'g').test(cccObject.value.toLowerCase()));
      }
    });
  }

  setupAutocompleteWatchers() {
    const that = this;
    that.setupFyleEmployeeAutocompleteWatcher();
    that.setupQboVendorAutocompleteWatcher();
    that.setupQboEmployeesWatcher();
    that.setupCCCAutocompleteWatcher();
  }

  reset() {
    const that = this;
    that.isLoading = true;

    forkJoin([
      that.mappingsService.getFyleEmployees(),
      that.mappingsService.getQBOEmployees(),
      that.mappingsService.getCreditCardAccounts(),
      that.mappingsService.getQBOVendors(),
      that.mappingsService.getGeneralMappings()
    ]).subscribe(response => {
      that.fyleEmployees = response[0];
      that.qboEmployees = response[1];
      that.cccObjects = response[2];
      that.qboVendors = response[3];
      that.generalMappings = response[4];

      const fyleEmployee = that.editMapping ? that.fyleEmployees.filter(employee => employee.value === that.data.employeeMappingRow.source_employee.value)[0] : '';
      const qboVendor = that.editMapping ? that.qboVendors.filter(vendor => that.data.employeeMappingRow.destination_vendor && vendor.value === that.data.employeeMappingRow.destination_vendor.value)[0] : '';
      const qboEmployee = that.editMapping ? that.qboEmployees.filter(employee => that.data.employeeMappingRow.destination_employee && employee.value === that.data.employeeMappingRow.destination_employee.value)[0] : '';
      const defaultCCCObj = that.editMapping ? that.cccObjects.filter(cccObj => that.data.employeeMappingRow.destination_card_account && cccObj.value === that.data.employeeMappingRow.destination_card_account.value)[0] : that.cccObjects.filter(cccObj => cccObj.value === that.generalMappings.default_ccc_account_name)[0];
      that.isLoading = false;
      that.form = that.formBuilder.group({
        fyleEmployee: [fyleEmployee, Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleEmployees)])],
        qboVendor: [qboVendor, that.generalSettings.employee_field_mapping === 'VENDOR' ? that.forbiddenSelectionValidator(that.qboVendors) : ''],
        qboEmployee: [qboEmployee, that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.forbiddenSelectionValidator(that.qboEmployees) : ''],
        creditCardAccount: [defaultCCCObj || '', (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.corporate_credit_card_expenses_object !== 'BILL') ? that.forbiddenSelectionValidator(that.cccObjects) : null]
      });

      if (that.editMapping) {
        that.form.controls.fyleEmployee.disable();
      }

      that.setupAutocompleteWatchers();
    });
  }

  ngOnInit() {
    const that = this;
    that.workSpaceId = that.data.workspaceId;

    if (that.data.employeeMappingRow) {
      that.editMapping = true;
    }

    that.isLoading = true;
    that.settingsService.getCombinedSettings(that.workSpaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }

}
