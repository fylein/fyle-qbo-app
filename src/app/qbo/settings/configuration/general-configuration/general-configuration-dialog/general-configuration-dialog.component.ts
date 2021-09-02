import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdatedConfiguration } from 'src/app/core/models/updated-configuration';

@Component({
  selector: 'app-general-configuration-dialog',
  templateUrl: './general-configuration-dialog.component.html',
  styleUrls: ['./general-configuration-dialog.component.scss']
})
export class GeneralConfigurationDialogComponent implements OnInit {
  updatedConfiguration: UpdatedConfiguration;
  customStyle: object = {};

  constructor(public dialogRef: MatDialogRef<GeneralConfigurationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: UpdatedConfiguration) { }

  redirectToEmployeeMappings(): boolean {
    const that = this;

    if (that.updatedConfiguration.employee && !that.updatedConfiguration.autoCreateVendor && that.updatedConfiguration.employee.oldValue !== that.updatedConfiguration.employee.newValue) {
      return true;
    }

    return false;
  }

  submit() {
    const that = this;

    that.dialogRef.close({
      redirectToEmployeeMappings: that.redirectToEmployeeMappings(),
      accpetedChanges: true
    });
  }

  updateStyle() {
    const that = this;

    if (that.updatedConfiguration.cccExpense && that.updatedConfiguration.cccExpense.oldValue !== 'CREDIT CARD PURCHASE') {
      that.customStyle = {'margin-right': '10%'};
    }
  }

  ngOnInit() {
    const that = this;

    that.updatedConfiguration = that.data;
    that.updateStyle();
  }

}
