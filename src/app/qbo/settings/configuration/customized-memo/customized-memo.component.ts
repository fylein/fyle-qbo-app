import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customized-memo',
  templateUrl: './customized-memo.component.html',
  styleUrls: ['./customized-memo.component.scss', '../../../qbo.component.scss']
})
export class CustomizedMemoComponent implements OnInit {

  isLoading: boolean;
  customizedMemoForm: FormGroup;
  workspaceId: number;
  generalSettings: GeneralSetting;
  defaultMemoFields: string[];

  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog) { }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.defaultMemoFields, event.previousIndex, event.currentIndex);
    console.log(event)
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  getcustomizedMemoSettings() {
    const that = this;

    that.settingsService.getGeneralSettings(that.workspaceId).subscribe(response => {
    that.generalSettings = response;
    });

    that.customizedMemoForm = that.formBuilder.group({
      customizedMemo: [that.generalSettings.customized_memo ? that.generalSettings.customized_memo : [null]]
    }, () => {
      that.customizedMemoForm = that.formBuilder.group({
        customizedMemo: that.defaultMemoFields,
      });
      that.isLoading = false;
    });
  }

  save() {
    const that = this;
    const customizedMemo = that.customizedMemoForm.value.customizedMemo ? that.customizedMemoForm.value.customizedMemo : [null];

    const generalSettingsPayload: GeneralSetting = {
      customized_memo: customizedMemo
    };

    that.settingsService.patchGeneralSettings(this.workspaceId, generalSettingsPayload).subscribe(() => {
      that.snackBar.open('Custom Memo saved successfully');
    }, () => {
      that.snackBar.open('Something went wrong');
      that.isLoading = false;
    });
  }

  onChange(deviceValue) {
    console.log(deviceValue);
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.defaultMemoFields = ['employee_email', 'vendor', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];
    that.getcustomizedMemoSettings();
  }

}
