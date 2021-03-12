import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';

@Component({
  selector: 'app-general-configuration',
  templateUrl: './general-configuration.component.html',
  styleUrls: ['./general-configuration.component.scss', '../../../qbo.component.scss']
})
export class GeneralConfigurationComponent implements OnInit {

  isLoading: boolean;
  isSaveDisabled: boolean;
  generalSettingsForm: FormGroup;
  expenseOptions: { label: string, value: string }[];
  workspaceId: number;
  generalSettings: GeneralSetting;
  mappingSettings: MappingSetting[];
  employeeFieldMapping: MappingSetting;
  showPaymentsField: boolean;
  showAutoCreate: boolean;

  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { }

  getExpenseOptions(employeeMappedTo) {
    return {
      EMPLOYEE: [
        {
          label: 'Check',
          value: 'CHECK'
        },
        {
          label: 'Journal Entry',
          value: 'JOURNAL ENTRY'
        }
      ],
      VENDOR: [
        {
          label: 'Bill',
          value: 'BILL'
        },
        {
          label: 'Journal Entry',
          value: 'JOURNAL ENTRY'
        }
      ]
    }[employeeMappedTo];
  }

  showImportProjects() {
    const that = this;
    let projectSetting;

    if (that.mappingSettings) {
      projectSetting = that.mappingSettings.filter(setting => setting.source_field === 'PROJECT')[0];
    }

    if (!projectSetting || projectSetting.destination_field === 'CUSTOMER') {
      return true;
    }
    return false;
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

      that.employeeFieldMapping = employeeFieldMapping;

      that.showPaymentsFields(that.generalSettings.reimbursable_expenses_object);
      that.expenseOptions = that.getExpenseOptions(that.employeeFieldMapping.destination_field);

      let paymentsSyncOption = '';
      if (that.generalSettings.sync_fyle_to_qbo_payments) {
        paymentsSyncOption = 'sync_fyle_to_qbo_payments';
      } else if (that.generalSettings.sync_qbo_to_fyle_payments) {
        paymentsSyncOption = 'sync_qbo_to_fyle_payments';
      }

      that.generalSettingsForm = that.formBuilder.group({
        reimburExpense: [that.generalSettings ? that.generalSettings.reimbursable_expenses_object : ''],
        cccExpense: [that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : ''],
        employees: [that.employeeFieldMapping ? that.employeeFieldMapping.destination_field : ''],
        importCategories: [that.generalSettings.import_categories],
        importProjects: [that.generalSettings.import_projects],
        paymentsSync: [paymentsSyncOption],
        autoMapEmployees: [that.generalSettings.auto_map_employees],
        autoCreateDestinationEntity: [that.generalSettings.auto_create_destination_entity]
      });

      if (that.generalSettings.reimbursable_expenses_object) {
        that.expenseOptions = [{
          label: 'Bill',
          value: 'BILL'
        },
        {
          label: 'Journal Entry',
          value: 'JOURNAL ENTRY'
        },
        {
          label: 'Check',
          value: 'CHECK'
        }
        ];
      }

      that.generalSettingsForm.controls.employees.disable();
      that.generalSettingsForm.controls.reimburExpense.disable();

      that.showAutoCreateOption(that.generalSettings.auto_map_employees, that.employeeFieldMapping.destination_field);

      that.generalSettingsForm.controls.autoMapEmployees.valueChanges.subscribe((employeeMappingPreference) => {
        that.showAutoCreateOption(employeeMappingPreference, that.employeeFieldMapping.destination_field);
      });

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        that.generalSettingsForm.controls.cccExpense.disable();
      }

      that.isLoading = false;
    }, error => {
      that.isLoading = false;
      that.generalSettingsForm = that.formBuilder.group({
        employees: ['', Validators.required],
        reimburExpense: ['', Validators.required],
        cccExpense: [null],
        importCategories: [false],
        importProjects: [false],
        paymentsSync: [null],
        autoMapEmployees: [null],
        autoCreateDestinationEntity: [false]
      });


      that.generalSettingsForm.controls.reimburExpense.valueChanges.subscribe((reimbursableExpenseMappedTo) => {
        that.showPaymentsFields(reimbursableExpenseMappedTo);
      });

      that.generalSettingsForm.controls.autoMapEmployees.valueChanges.subscribe((employeeMappingPreference) => {
        that.showAutoCreateOption(employeeMappingPreference, that.generalSettingsForm.value.employees);
      });

      that.generalSettingsForm.controls.employees.valueChanges.subscribe((employeeMappedTo) => {
        that.showAutoCreateOption(that.generalSettingsForm.value.autoMapEmployees, employeeMappedTo);
        that.expenseOptions = that.getExpenseOptions(employeeMappedTo);
        that.generalSettingsForm.controls.reimburExpense.reset();
      });
    });
  }

  save() {
    const that = this;
    if (that.generalSettingsForm.valid) {
      const mappingsSettingsPayload = [{
        source_field: 'CATEGORY',
        destination_field: 'ACCOUNT'
      }];

      const reimbursableExpensesObject = that.generalSettingsForm.value.reimburExpense || (that.generalSettings ? that.generalSettings.reimbursable_expenses_object : null);
      const cccExpensesObject = that.generalSettingsForm.value.cccExpense || (that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : null);
      const employeeMappingsObject = that.generalSettingsForm.value.employees || (that.employeeFieldMapping && that.employeeFieldMapping.destination_field);
      const importCategories = that.generalSettingsForm.value.importCategories;
      const importProjects = that.generalSettingsForm.value.importProjects;
      const autoMapEmployees = that.generalSettingsForm.value.autoMapEmployees ? that.generalSettingsForm.value.autoMapEmployees : null;
      const autoCreateDestinationEntity = that.generalSettingsForm.value.autoCreateDestinationEntity;

      let fyleToQuickbooks = false;
      let quickbooksToFyle = false;

      if (that.generalSettingsForm.controls.paymentsSync.value) {
        fyleToQuickbooks = that.generalSettingsForm.value.paymentsSync === 'sync_fyle_to_qbo_payments' ? true : false;
        quickbooksToFyle = that.generalSettingsForm.value.paymentsSync === 'sync_qbo_to_fyle_payments' ? true : false;
      }

      if (cccExpensesObject) {
        mappingsSettingsPayload.push({
          source_field: 'EMPLOYEE',
          destination_field: 'CREDIT_CARD_ACCOUNT'
        });
      }

      that.isLoading = true;
      mappingsSettingsPayload.push({
        source_field: 'EMPLOYEE',
        destination_field: employeeMappingsObject
      });

      forkJoin(
        [
          that.settingsService.postMappingSettings(that.workspaceId, mappingsSettingsPayload),
          that.settingsService.postGeneralSettings(that.workspaceId, reimbursableExpensesObject, cccExpensesObject, importCategories, importProjects, fyleToQuickbooks, quickbooksToFyle, autoCreateDestinationEntity, autoMapEmployees)
        ]
      ).subscribe(responses => {
        that.isLoading = true;
        that.snackBar.open('Configuration saved successfully');

        if (autoMapEmployees) {
          setTimeout(() => {
            that.snackBar.open('Auto mapping of employees may take up to 10 minutes');
          }, 1500);
        }

        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      });
    } else {
      that.snackBar.open('Form has invalid fields');
      that.generalSettingsForm.markAllAsTouched();
    }
  }

  showPaymentsFields(reimbursableExpensesObject) {
      const that = this;
      if (reimbursableExpensesObject && reimbursableExpensesObject === 'BILL') {
        that.showPaymentsField = true;
      } else {
        that.showPaymentsField = false;
      }
    }

    showAutoCreateOption(autoMapEmployees, employeeMappingPreference) {
      const that = this;
      if (autoMapEmployees && autoMapEmployees !== 'EMPLOYEE_CODE' && employeeMappingPreference === 'VENDOR') {
        that.showAutoCreate = true;
      } else {
        that.showAutoCreate = false;
        that.generalSettingsForm.controls.autoCreateDestinationEntity.setValue(false);
      }
    }

  ngOnInit() {
    const that = this;
    that.isSaveDisabled = false;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.getAllSettings();
  }
}
