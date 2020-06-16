import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-cost-center-mappings-dialog',
  templateUrl: './cost-center-mappings-dialog.component.html',
  styleUrls: ['./cost-center-mappings-dialog.component.scss']
})
export class CostCenterMappingsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  fyleCostCenters: any[];
  qboElements: any[];
  fyleCostCenterOptions: any[];
  qboOptions: any[];
  generalSettings: any;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CostCenterMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mappingsService: MappingsService) { }

  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  submit() {
    let that = this;
    if (that.form.valid) {
      that.isLoading = true;
      that.mappingsService.postMappings(that.data.workspaceId, {
        source_type: 'COST_CENTER',
        destination_type: that.generalSettings.cost_center_field_mapping,
        source_value: that.form.controls.fyleCostCenter.value.value,
        destination_value: that.form.controls.qboObject.value.value
      }).subscribe(response => {
        that.isLoading = false;
        that.dialogRef.close();
      });
    }
  }

  ngOnInit() {
    const that = this;
    that.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));

    const getFyleCostCenters = that.mappingsService.getFyleCostCenters(that.data.workspaceId).toPromise().then(costCenters => {
      that.fyleCostCenters = costCenters;
    });

    let qboPromise;
    if (this.generalSettings.cost_center_field_mapping === 'CUSTOMER') {
      qboPromise = that.mappingsService.getQBOCustomers(that.data.workspaceId).toPromise().then(objects => {
        that.qboElements = objects;
      });
    } else if (this.generalSettings.cost_center_field_mapping === 'CLASS') {
      qboPromise = that.mappingsService.getQBOClasses(that.data.workspaceId).toPromise().then(objects => {
        that.qboElements = objects;
      });
    } else if (this.generalSettings.cost_center_field_mapping === 'DEPARTMENT') {
      qboPromise = that.mappingsService.getQBODepartments(that.data.workspaceId).toPromise().then(objects => {
        that.qboElements = objects;
      });
    }

    that.isLoading = true;
    forkJoin([
      getFyleCostCenters,
      qboPromise
    ]).subscribe(() => {
      that.isLoading = false;
    });

    that.form = that.formBuilder.group({
      fyleCostCenter: ['', Validators.required],
      qboObject: ['', Validators.required]
    });

    that.form.controls.fyleCostCenter.valueChanges.pipe(debounceTime(200)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        that.fyleCostCenterOptions = that.fyleCostCenters
        .filter(fyleCostCenter => new RegExp(newValue.toLowerCase(), 'g').test(fyleCostCenter.value.toLowerCase()));
      }
    });


    that.form.controls.qboObject.valueChanges.pipe(debounceTime(200)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        that.qboOptions = that.qboElements
        .filter(qboElement => new RegExp(newValue.toLowerCase(), 'g').test(qboElement.value.toLowerCase()));
      }
    });
  }
}
