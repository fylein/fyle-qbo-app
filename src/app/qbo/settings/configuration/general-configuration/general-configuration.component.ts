import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { QboComponent } from 'src/app/qbo/qbo.component';

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
  showJeSingleCreditLine: boolean;

  constructor(private formBuilder: FormBuilder, private qbo: QboComponent, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { }

  getExpenseOptions(employeeMappedTo) {
    return {
      EMPLOYEE: [
        {
          label: 'Check',
          value: 'CHECK'
        },
        {
          label: 'Expense',
          value: 'EXPENSE'
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
          label: 'Expense',
          value: 'EXPENSE'
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
        setting => (setting.source_field === 'PROJECT' && setting.destination_field === 'CUSTOMER')
      );

      let importProjects = false;
      if (projectFieldMapping.length) {
        importProjects = projectFieldMapping[0].import_to_fyle;
      }

      that.employeeFieldMapping = employeeFieldMapping;

      that.showPaymentsFields(that.generalSettings.reimbursable_expenses_object);
      that.showJELineSettings(that.generalSettings.reimbursable_expenses_object, that.generalSettings.corporate_credit_card_expenses_object);
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
        importProjects: [importProjects],
        paymentsSync: [paymentsSyncOption],
        autoMapEmployees: [that.generalSettings.auto_map_employees],
        autoCreateDestinationEntity: [that.generalSettings.auto_create_destination_entity],
        jeSingleCreditLine: [that.generalSettings.je_single_credit_line]
      });

      const fyleProjectMapping = that.mappingSettings.filter(
        setting => setting.source_field === 'PROJECT' && setting.destination_field !== 'CUSTOMER'
      );

      const qboProjectMapping = that.mappingSettings.filter(
        setting => setting.destination_field === 'CUSTOMER' && setting.source_field !== 'PROJECT'
      );

      // disable project sync toggle if either of Fyle / QBO Projects are already mapped to different fields
      if (fyleProjectMapping.length || qboProjectMapping.length) {
        that.generalSettingsForm.controls.importProjects.disable();
      }

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
        },
        {
          label: 'Expense',
          value: 'EXPENSE'
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
      } else {
        that.generalSettingsForm.controls.cccExpense.valueChanges.subscribe((cccExpenseMappedTo) => {
          that.showJELineSettings(null, cccExpenseMappedTo);
        });
      }

      that.isLoading = false;
    }, () => {
      that.mappingSettings = [];
      that.isLoading = false;
      that.generalSettingsForm = that.formBuilder.group({
        employees: ['', Validators.required],
        reimburExpense: ['', Validators.required],
        cccExpense: [null],
        importCategories: [false],
        importProjects: [false],
        paymentsSync: [null],
        autoMapEmployees: [null],
        autoCreateDestinationEntity: [false],
        jeSingleCreditLine: [false]
      });

      that.generalSettingsForm.controls.reimburExpense.valueChanges.subscribe((reimbursableExpenseMappedTo) => {
        that.showPaymentsFields(reimbursableExpenseMappedTo);
        that.showJELineSettings(reimbursableExpenseMappedTo);
      });

      that.generalSettingsForm.controls.cccExpense.valueChanges.subscribe((cccExpenseMappedTo) => {
        that.showJELineSettings(null, cccExpenseMappedTo);
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
      const mappingsSettingsPayload: MappingSetting[] = [{
        source_field: 'CATEGORY',
        destination_field: 'ACCOUNT'
      }];

      const reimbursableExpensesObject = that.generalSettingsForm.value.reimburExpense || (that.generalSettings ? that.generalSettings.reimbursable_expenses_object : null);
      const cccExpensesObject = that.generalSettingsForm.value.cccExpense || (that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : null);
      const employeeMappingsObject = that.generalSettingsForm.value.employees || (that.employeeFieldMapping && that.employeeFieldMapping.destination_field);
      const importCategories = that.generalSettingsForm.value.importCategories;
      const importProjects = that.generalSettingsForm.value.importProjects ? that.generalSettingsForm.value.importProjects : false;
      const autoMapEmployees = that.generalSettingsForm.value.autoMapEmployees ? that.generalSettingsForm.value.autoMapEmployees : null;
      const autoCreateDestinationEntity = that.generalSettingsForm.value.autoCreateDestinationEntity;
      const jeSingleCreditLine = that.generalSettingsForm.value.jeSingleCreditLine;

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

      if (importProjects) {
        mappingsSettingsPayload.push({
          source_field: 'PROJECT',
          destination_field: 'CUSTOMER',
          import_to_fyle: true
        });
      } else {
        const projectFieldMapping = that.mappingSettings.filter(
          setting => (setting.source_field === 'PROJECT' && setting.destination_field === 'CUSTOMER')
        );

        if (projectFieldMapping.length) {
          mappingsSettingsPayload.push({
            source_field: 'PROJECT',
            destination_field: 'CUSTOMER',
            import_to_fyle: false
          });
        }
      }

      that.isLoading = true;
      mappingsSettingsPayload.push({
        source_field: 'EMPLOYEE',
        destination_field: employeeMappingsObject
      });

      const generalSettingsPayload: GeneralSetting = {
        reimbursable_expenses_object: reimbursableExpensesObject,
        corporate_credit_card_expenses_object: cccExpensesObject,
        import_categories: importCategories,
        import_projects: importProjects,
        sync_fyle_to_qbo_payments: fyleToQuickbooks,
        sync_qbo_to_fyle_payments: quickbooksToFyle,
        auto_map_employees: autoMapEmployees,
        auto_create_destination_entity: autoCreateDestinationEntity,
        je_single_credit_line: jeSingleCreditLine
      };

      forkJoin(
        [
          that.settingsService.postMappingSettings(that.workspaceId, mappingsSettingsPayload),
          that.settingsService.postGeneralSettings(that.workspaceId, generalSettingsPayload)
        ]
      ).subscribe(() => {
        that.isLoading = true;
        that.snackBar.open('Configuration saved successfully');
        that.qbo.getGeneralSettings();
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

  showJELineSettings(reimburseExpense: string = null, cccExpense: string = null) {
    const that = this;
    if ((reimburseExpense && reimburseExpense === 'JOURNAL ENTRY') || (cccExpense && cccExpense === 'JOURNAL ENTRY')) {
      that.showJeSingleCreditLine = true;
    } else {
      that.showJeSingleCreditLine = false;
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
    that.isLoading = true;

    that.getAllSettings();
  }
}
