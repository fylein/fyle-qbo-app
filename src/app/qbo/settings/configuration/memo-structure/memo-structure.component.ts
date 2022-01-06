import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrackingService } from 'src/app/core/services/tracking.service';

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

  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService, private trackingService: TrackingService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog) { }


  drop(event: CdkDragDrop<string[]>) {
    const that = this;
    moveItemInArray(that.defaultMemoFields, event.previousIndex, event.currentIndex);
    const selectedMemoFields = that.defaultMemoFields.filter(memoOption => that.form.value.memoStructure.indexOf(memoOption) !== -1);
    const memoStructure = selectedMemoFields ? selectedMemoFields : that.defaultMemoFields;
    that.generalSettings.memo_structure = memoStructure;
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  showPreview(selectedMemoFields: string[]) {
    const time = Date.now();
    const today = new Date(time);

    const dummyValues = {
        employee_email: 'john.doe@acme.com',
        category: 'Meals and Entertainment',
        purpose: 'Client Meeting',
        merchant: 'Pizza Hut',
        report_number: 'C/2021/12/R/1',
        spent_on: today.toLocaleDateString(),
        expense_link: 'https://app.fylehq.com/app/main/#/enterprise/view_expense/'
    };

    let text = '';
    selectedMemoFields.forEach((field, index) => {
        if (field in dummyValues) {
            text = text + dummyValues[field];
            if (index + 1 !== selectedMemoFields.length) {
                text = text + ' - ';
            }
        }
    });

    return text;
  }

  getMemoStructureSettings() {
    const that = this;
    that.isLoading = true;
    that.settingsService.getGeneralSettings(that.workspaceId).subscribe(generalSettings => {
      that.generalSettings = generalSettings;

      that.form = that.formBuilder.group({
        memoStructure: [ that.generalSettings.memo_structure ]
      });
      that.form.controls.memoStructure.setValidators(Validators.required);

      that.form.controls.memoStructure.valueChanges.subscribe((memoChanges) => {
        that.generalSettings.memo_structure = memoChanges;
        that.showPreview(memoChanges);
      });

      that.isLoading = false;

    });
  }


  save() {
    const that = this;
    that.isLoading = true;

    const selectedMemoFields = that.defaultMemoFields.filter(memoOption => that.form.value.memoStructure.indexOf(memoOption) !== -1);
    const memoStructure = selectedMemoFields ? selectedMemoFields : that.defaultMemoFields;

    that.settingsService.patchGeneralSettings(that.workspaceId, memoStructure).subscribe((response) => {
      that.snackBar.open('Custom Memo saved successfully');
      const trackingProperties = {
        workspace_id: that.workspaceId,
        oldDescriptionFields: that.generalSettings.memo_structure,
        newDescriptionFields: memoStructure
      };

      that.trackingService.onModifyDescription(trackingProperties);

      that.generalSettings = response;
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
