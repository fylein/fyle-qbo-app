import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss', '../../qbo.component.scss']
})
export class ConfigurationComponent implements OnInit {

  isLoading: boolean;
  isSaveDisabled: boolean;
  generalSettingsForm: FormGroup;
  expenseOptions: { label: string, value: string }[];
  workspaceId: number;
  generalSettings: any;
  mappingSettings: any;
  employeeFieldMapping: any;
  projectFieldMapping: any;
  costCenterFieldMapping: any;

  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService, private route: ActivatedRoute) { }

  getExpenseOptions(employeeMappedTo) {
    return {
      EMPLOYEE: [
        {
          label: 'Check',
          value: 'CHECK'
        },
        {
          label: 'Journal Entry',
          value: 'JOURNAL_ENTRY'
        }
      ],
      VENDOR: [
        {
          label: 'Bill',
          value: 'BILL'
        },
        {
          label: 'Journal Entry',
          value: 'JOURNAL_ENTRY'
        }
      ]
    }[employeeMappedTo];
  }

  getAllSettings() {
    const that = this;
    that.isLoading = true;
    forkJoin(
      [
        that.settingsService.getGeneralSettings(that.workspaceId),
        that.settingsService.getMappingSettings(that.workspaceId)
      ]
    ).subscribe(responses => {
      that.generalSettings = responses[0];
      that.mappingSettings = responses[1].results;

      const employeeFieldMapping = that.mappingSettings.filter(
        setting => (setting.source_field === 'EMPLOYEE') &&
          (setting.destination_field === 'EMPLOYEE' || setting.destination_field === 'VENDOR')
      )[0];

      const projectFieldMapping = that.mappingSettings.filter(
        settings => settings.source_field === 'PROJECT'
      )[0];

      const costCenterFieldMapping = that.mappingSettings.filter(
        settings => settings.source_field === 'COST_CENTER'
      )[0];

      that.employeeFieldMapping = employeeFieldMapping;
      that.projectFieldMapping = projectFieldMapping ? projectFieldMapping : {};
      that.costCenterFieldMapping = costCenterFieldMapping ? costCenterFieldMapping : {};

      that.generalSettingsForm = that.formBuilder.group({
        reimburExpense: [that.generalSettings ? that.generalSettings.reimbursable_expenses_object : ''],
        cccExpense: [that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : ''],
        employees: [that.employeeFieldMapping ? that.employeeFieldMapping.destination_field : ''],
        projects: [that.projectFieldMapping ? that.projectFieldMapping.destination_field : ''],
        costCenters: [that.costCenterFieldMapping ? that.costCenterFieldMapping.destination_field : '']
      });

      if (that.generalSettings.reimbursable_expenses_object) {
        that.expenseOptions = [{
          label: 'Bill',
          value: 'BILL'
        },
        {
          label: 'Journal Entry',
          value: 'JOURNAL_ENTRY'
        },
        {
          label: 'Check',
          value: 'CHECK'
        }
        ];
      }

      that.generalSettingsForm.controls.employees.disable();
      that.generalSettingsForm.controls.reimburExpense.disable();

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        that.generalSettingsForm.controls.cccExpense.disable();
      }

      if (projectFieldMapping) {
        that.generalSettingsForm.controls.projects.disable();
      }

      if (costCenterFieldMapping) {
        that.generalSettingsForm.controls.costCenters.disable();
      }

      if (that.generalSettings.corporate_credit_card_expenses_object && projectFieldMapping && costCenterFieldMapping) {
        that.isSaveDisabled = true;
      }

      that.isLoading = false;
    }, error => {
      if (error.status == 400) {
        that.generalSettings = {};
        that.mappingSettings = {}
        that.isLoading = false;
        that.generalSettingsForm = that.formBuilder.group({
          employees: ['', Validators.required],
          reimburExpense: ['', Validators.required],
          cccExpense: [''],
          projects: [''],
          costCenters: [''],
        });

        that.generalSettingsForm.controls.employees.valueChanges.subscribe((employeeMappedTo) => {
          that.expenseOptions = that.getExpenseOptions(employeeMappedTo);
          that.generalSettingsForm.controls.reimburExpense.reset();
        });
      }
    });
  }

  save() {
    if (this.generalSettingsForm.valid) {
      const mappingsSettingsPayload = [{
        source_field: 'CATEGORY',
        destination_field: 'ACCOUNT'
      }];

      const reimbursableExpensesObject = this.generalSettingsForm.value.reimburExpense || this.generalSettings.reimbursable_expenses_object;
      const cccExpensesObject = this.generalSettingsForm.value.cccExpense || this.generalSettings.corporate_credit_card_expenses_object;
      const employeeMappingsObject = this.generalSettingsForm.value.employees || this.employeeFieldMapping.destination_field;
      const costCenterMappingObject = this.generalSettingsForm.value.costCenters || this.costCenterFieldMapping.destination_field;
      const projectMappingObject = this.generalSettingsForm.value.projects || this.projectFieldMapping.destination_field;

      if (cccExpensesObject) {
        mappingsSettingsPayload.push({
          source_field: 'EMPLOYEE',
          destination_field: 'CREDIT_CARD_ACCOUNT'
        });
      }

      if (projectMappingObject) {
        mappingsSettingsPayload.push({
          source_field: 'PROJECT',
          destination_field: projectMappingObject
        });
      }

      if (costCenterMappingObject) {
        mappingsSettingsPayload.push({
          source_field: 'COST_CENTER',
          destination_field: costCenterMappingObject
        });
      }

      this.isLoading = true;
      mappingsSettingsPayload.push({
        source_field: 'EMPLOYEE',
        destination_field: employeeMappingsObject
      });

      forkJoin(
        [
          this.settingsService.postMappingSettings(this.workspaceId, mappingsSettingsPayload),
          this.settingsService.postGeneralSettings(this.workspaceId, reimbursableExpensesObject, cccExpensesObject)
        ]
      ).subscribe(responses => {
        this.isLoading = true;
        window.location.href = `/workspaces/${this.workspaceId}/expense_groups`;
      });
    } else {
      this.generalSettingsForm.markAllAsTouched();
    }
  }

  ngOnInit() {
    const that = this;
    that.isSaveDisabled = false;
    that.workspaceId = that.route.snapshot.parent.params.workspace_id;
    that.getAllSettings();
  }

}
