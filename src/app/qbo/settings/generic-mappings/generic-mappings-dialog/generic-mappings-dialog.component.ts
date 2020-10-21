import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { forkJoin, from } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class MappingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-generic-mappings-dialog',
  templateUrl: './generic-mappings-dialog.component.html',
  styleUrls: ['./generic-mappings-dialog.component.scss', '../../settings.component.scss']
})
export class GenericMappingsDialogComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  fyleAttributes: any[];
  qboElements: any[];
  fyleAttributeOptions: any[];
  qboOptions: any[];
  setting: any;
  editMapping: boolean;
  matcher = new MappingErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<GenericMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mappingsService: MappingsService,
              private settingsService: SettingsService,
              private snackBar: MatSnackBar) { }

  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  submit() {
    const that = this;
    if (that.form.valid) {
      that.isLoading = true;
      that.mappingsService.postMappings({
        source_type: that.setting.source_field,
        destination_type: that.setting.destination_field,
        source_value: that.form.controls.sourceField.value.value,
        destination_value: that.form.controls.destinationField.value.value
      }).subscribe(response => {
        that.snackBar.open('Mapping saved successfully');
        that.isLoading = false;
        that.dialogRef.close();
      }, err => {
        that.snackBar.open('Something went wrong');
        that.isLoading = false;
      });
    } else {
      that.snackBar.open('Form has invalid fields');
      that.form.markAllAsTouched();
    }
  }

  forbiddenSelectionValidator(options: any[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = !options.some((option) => {
        return control.value.id && option.id === control.value.id;
      });
      return forbidden ? {
        forbiddenOption: {
          value: control.value
        }
      } : null;
    };
  }

  setupSourceFieldAutocompleteWatcher() {
    const that = this;

    that.form.controls.sourceField.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.fyleAttributeOptions = that.fyleAttributes
          .filter(fyleAttribute => new RegExp(newValue.toLowerCase(), 'g').test(fyleAttribute.value.toLowerCase()));
      }
    });
  }

  setupDestinationFieldAutocompleteWatcher() {
    const that = this;

    that.form.controls.destinationField.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.qboOptions = that.qboElements
          .filter(qboElement => new RegExp(newValue.toLowerCase(), 'g').test(qboElement.value.toLowerCase()));
      }
    });
  }

  setupAutcompleteWathcers() {
    const that = this;
    that.setupSourceFieldAutocompleteWatcher();
    that.setupDestinationFieldAutocompleteWatcher();
  }

  reset() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    const getFyleAttributes = that.mappingsService.getFyleExpenseCustomFields(that.setting.source_field).toPromise().then(attributes => {
      that.fyleAttributes = attributes;
    });

    let qboPromise;
    if (that.setting.destination_field === 'CUSTOMER') {
      // TODO: remove promises and do with rxjs observables
      qboPromise = that.mappingsService.getQBOCustomers().toPromise().then(objects => {
        that.qboElements = objects;
      });
    } else if (that.setting.destination_field === 'CLASS') {
      // TODO: remove promises and do with rxjs observables
      qboPromise = that.mappingsService.getQBOClasses().toPromise().then(objects => {
        that.qboElements = objects;
      });
    } else if (that.setting.destination_field === 'DEPARTMENT') {
      qboPromise = that.mappingsService.getQBODepartments().toPromise().then(objects => {
        that.qboElements = objects;
      });
    } else if (that.setting.destination_field === 'ACCOUNT') {
      qboPromise = that.mappingsService.getExpenseAccounts().toPromise().then(objects => {
        that.qboElements = objects;
      });
    }

    that.isLoading = true;
    // TODO: remove promises and do with rxjs observables
    forkJoin([
      from(getFyleAttributes),
      from(qboPromise)
    ]).subscribe((res) => {
      that.isLoading = false;
      const sourceField = that.editMapping ? that.fyleAttributes.filter(sourceField => sourceField.value === that.data.rowElement.source.value)[0] : '';
      const destinationField = that.editMapping ? that.qboElements.filter(destinationField => destinationField.value === that.data.rowElement.destination.value)[0] : '';
      that.form = that.formBuilder.group({
        sourceField: [that.editMapping ? sourceField : Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleAttributes)])],
        destinationField: [that.editMapping ? destinationField : that.forbiddenSelectionValidator(that.qboElements)]
      });

      if(that.editMapping) {
        that.form.controls.sourceField.disable()
      }

      that.setupAutcompleteWathcers();
    });
  }

  ngOnInit() {
    const that = this;
    that.isLoading = true;

    that.setting = that.data.setting;
    
    if (that.data.rowElement) {
      that.editMapping = true;
    }
    
    that.isLoading = false;
    that.reset();
  }

}