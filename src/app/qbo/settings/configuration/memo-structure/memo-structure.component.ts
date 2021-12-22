import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-memo-structure',
  templateUrl: './memo-structure.component.html',
  styleUrls: ['./memo-structure.component.scss', '../../../qbo.component.scss']
})
export class MemoStructureComponent implements OnInit {

  isLoading: boolean;
  workspaceId: number;
  generalSettings: GeneralSetting;
  defaultMemoFields: string[];
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog) { }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.defaultMemoFields, event.previousIndex, event.currentIndex);
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  showPreview(memoStructure) {
    const time = Date.now();
    const today = new Date(time);
    memoStructure = memoStructure + '';
    memoStructure = memoStructure.replace('employee_email', ' john.doe@acme.com ');
    memoStructure = memoStructure.replace('category', ' Meals and Entertainment ');
    memoStructure = memoStructure.replace('purpose', ' Client Meeting ');
    memoStructure = memoStructure.replace('merchant', ' Pizza Hut ');
    memoStructure = memoStructure.replace('report_number', ' C/2021/12/R/1 ');
    memoStructure = memoStructure.replace('spent_on', today.toLocaleDateString());
    memoStructure = memoStructure.replace(/,/g, ' - ');
    memoStructure = memoStructure.replace(/_/g, ' ');
    return memoStructure;
  }

  getMemoStructureSettings() {
    const that = this;
    that.isLoading = true;
    that.settingsService.getGeneralSettings(this.workspaceId).subscribe(generalSettings => {
      that.generalSettings = generalSettings;
      that.showPreview(generalSettings.memo_structure);
      that.isLoading = false;

      that.form = that.formBuilder.group({
        memoStructure: [that.generalSettings.memo_structure ? that.generalSettings.memo_structure : this.defaultMemoFields]
      });

    }, () => {
      that.isLoading = false;
      that.form = that.formBuilder.group({
        memoStructure: this.defaultMemoFields,
      });
    });
  }


  save() {
    const that = this;
    that.isLoading = true;

    const selectedMemoFields = that.defaultMemoFields.filter(i => that.form.value.memoStructure.indexOf(i) !== -1);
    const memoStructure = selectedMemoFields ? selectedMemoFields : that.defaultMemoFields;

    const generalSettingsPayload: GeneralSetting = {
      memo_structure: memoStructure
    };

    that.settingsService.patchGeneralSettings(this.workspaceId, generalSettingsPayload).subscribe((response) => {
      that.snackBar.open('Custom Memo saved successfully');
      that.getMemoStructureSettings();
      that.isLoading = false;
    }, () => {
      that.snackBar.open('Something went wrong');
      that.isLoading = false;
    });
  }


  ngOnInit() {
    const that = this;
    that.isLoading = true;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.defaultMemoFields = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];
    that.getMemoStructureSettings();
  }
}
