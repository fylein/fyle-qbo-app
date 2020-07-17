import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
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
  selector: 'app-project-mappings-dialog',
  templateUrl: './project-mappings-dialog.component.html',
  styleUrls: ['./project-mappings-dialog.component.scss', '../../settings.component.scss']
})
export class ProjectMappingsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  fyleProjects: any[];
  qboElements: any[];
  fyleProjectOptions: any[];
  qboOptions: any[];
  generalSettings: any;
  matcher = new MappingErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<ProjectMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mappingsService: MappingsService,
              private settingsService: SettingsService,
              private snackBar: MatSnackBar) { }

  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  forbiddenSelectionValidator(options: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
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

  submit() {
    const that = this;
    if (that.form.valid) {
      that.isLoading = true;
      that.mappingsService.postMappings({
        source_type: 'PROJECT',
        destination_type: that.generalSettings.project_field_mapping,
        source_value: that.form.controls.fyleProject.value.value,
        destination_value: that.form.controls.qboObject.value.value
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

  setupProjectAutocompleteWatcher() {
    const that = this;
    that.form.controls.fyleProject.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.fyleProjectOptions = that.fyleProjects.filter(fyleProject => new RegExp(newValue.toLowerCase(), 'g').test(fyleProject.value.toLowerCase()));
      }
    });
  }

  setupQboAutocompleteWatcher() {
    const that = this;
    that.form.controls.qboObject.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.qboOptions = that.qboElements
          .filter(qboElement => new RegExp(newValue.toLowerCase(), 'g').test(qboElement.value.toLowerCase()));
      }
    });
  }

  setupAutcompleteWatchers() {
    const that = this;
    that.setupProjectAutocompleteWatcher();
    that.setupQboAutocompleteWatcher();
  }

  reset() {
    const that = this;
    const getFyleCateogories = that.mappingsService.getFyleProjects().toPromise().then(projects => {
      that.fyleProjects = projects;
    });

    let qboPromise;
    if (that.generalSettings.project_field_mapping === 'CUSTOMER') {
      qboPromise = that.mappingsService.getQBOCustomers().toPromise().then(objects => {
        that.qboElements = objects;
      });
    } else if (that.generalSettings.project_field_mapping === 'CLASS') {
      qboPromise = that.mappingsService.getQBOClasses().toPromise().then(objects => {
        that.qboElements = objects;
      });
    } else if (that.generalSettings.project_field_mapping === 'DEPARTMENT') {
      qboPromise = that.mappingsService.getQBODepartments().toPromise().then(objects => {
        that.qboElements = objects;
      });
    }

    that.isLoading = true;
    forkJoin([
      getFyleCateogories,
      qboPromise
    ]).subscribe(() => {
      that.isLoading = false;
      that.form = that.formBuilder.group({
        fyleProject: ['', Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleProjects)])],
        qboObject: ['', Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.qboElements)])]
      });

      that.setupAutcompleteWatchers();
    });
  }

  ngOnInit() {
    const that = this;

    that.isLoading = true;
    that.settingsService.getCombinedSettings(that.data.workspaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }
}
