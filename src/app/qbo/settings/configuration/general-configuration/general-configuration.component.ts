import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { QboComponent } from 'src/app/qbo/qbo.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralConfigurationDialogComponent } from './general-configuration-dialog/general-configuration-dialog.component';
import { UpdatedConfiguration } from 'src/app/core/models/updated-configuration';

@Component({
  selector: 'app-general-configuration',
  templateUrl: './general-configuration.component.html',
  styleUrls: ['./general-configuration.component.scss', '../../../qbo.component.scss']
})
export class GeneralConfigurationComponent implements OnInit {

  isLoading: boolean;
  generalSettingsForm: FormGroup;
  expenseOptions: { label: string, value: string }[];
  workspaceId: number;
  generalSettings: GeneralSetting;
  mappingSettings: MappingSetting[];
  showPaymentsField: boolean;
  showAutoCreate: boolean;
  showJeSingleCreditLine: boolean;

  constructor(private formBuilder: FormBuilder, private qbo: QboComponent, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog) { }

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

  setupFieldWatchers() {
    const that = this;

    that.generalSettingsForm.controls.cccExpense.valueChanges.subscribe((cccExpenseMappedTo) => {
      that.showJELineSettings(that.generalSettingsForm.value.reimburExpense, cccExpenseMappedTo);
      if (that.generalSettings && that.generalSettings.je_single_credit_line && !that.showJeSingleCreditLine) {
        that.generalSettingsForm.controls.jeSingleCreditLine.setValue(false);
      }
    });

    that.generalSettingsForm.controls.reimburExpense.valueChanges.subscribe((reimbursableExpenseMappedTo) => {
      that.showPaymentsFields(reimbursableExpenseMappedTo);

      if (that.generalSettings && that.generalSettings.sync_fyle_to_qbo_payments && !that.showPaymentsField) {
        that.generalSettingsForm.controls.paymentsSync.setValue(false);
      }

      that.showJELineSettings(reimbursableExpenseMappedTo, that.generalSettingsForm.value.cccExpense);
      if (that.generalSettings && that.generalSettings.je_single_credit_line && !that.showJeSingleCreditLine) {
        that.generalSettingsForm.controls.jeSingleCreditLine.setValue(false);
      }
    });

    that.generalSettingsForm.controls.autoMapEmployees.valueChanges.subscribe((employeeMappingPreference) => {
      that.showAutoCreateOption(employeeMappingPreference, that.generalSettingsForm.value.employees);
    });

    that.generalSettingsForm.controls.employees.valueChanges.subscribe((employeeMappedTo) => {
      that.showAutoCreateOption(that.generalSettingsForm.value.autoMapEmployees, employeeMappedTo);
      that.expenseOptions = that.getExpenseOptions(employeeMappedTo);
      that.generalSettingsForm.controls.reimburExpense.reset();
      if (that.generalSettings) {
        that.generalSettingsForm.controls.reimburExpense.markAsTouched();
      }
      if (that.generalSettings && that.generalSettings.auto_create_destination_entity && !that.showAutoCreate) {
        that.generalSettingsForm.controls.autoCreateDestinationEntity.setValue(false);
      }
    });
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

      const projectFieldMapping = that.mappingSettings.filter(
        setting => (setting.source_field === 'PROJECT' && setting.destination_field === 'CUSTOMER')
      );

      let importProjects = false;
      if (projectFieldMapping.length) {
        importProjects = projectFieldMapping[0].import_to_fyle;
      }

      const employeeFieldMapping = that.generalSettings.employee_field_mapping;

      that.showPaymentsFields(that.generalSettings.reimbursable_expenses_object);
      that.showJELineSettings(that.generalSettings.reimbursable_expenses_object, that.generalSettings.corporate_credit_card_expenses_object);
      that.expenseOptions = that.getExpenseOptions(employeeFieldMapping);

      let paymentsSyncOption = '';
      if (that.generalSettings.sync_fyle_to_qbo_payments) {
        paymentsSyncOption = 'sync_fyle_to_qbo_payments';
      } else if (that.generalSettings.sync_qbo_to_fyle_payments) {
        paymentsSyncOption = 'sync_qbo_to_fyle_payments';
      }

      that.generalSettingsForm = that.formBuilder.group({
        reimburExpense: [that.generalSettings ? that.generalSettings.reimbursable_expenses_object : '', Validators.required],
        cccExpense: [that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : ''],
        employees: [employeeFieldMapping ? employeeFieldMapping : '', Validators.required],
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

      that.showAutoCreateOption(that.generalSettings.auto_map_employees, employeeFieldMapping);

      that.setupFieldWatchers();

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

      that.setupFieldWatchers();
    });
  }

  openDialog(updatedConfigurations: UpdatedConfiguration, generalSettingsPayload: GeneralSetting, mappingSettingsPayload: MappingSetting[]) {
    const that = this;
    const dialogRef = that.dialog.open(GeneralConfigurationDialogComponent, {
      width: '750px',
      data: updatedConfigurations
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data.accpetedChanges) {
        that.isLoading = true;
        that.postConfigurationsAndMappingSettings(generalSettingsPayload, mappingSettingsPayload, true, data.redirectToEmployeeMappings);
      }
    });
  }

  constructUpdatedConfigurationsPayload(generalSettingsPayload: GeneralSetting): UpdatedConfiguration {
    const that = this;
    const updatedConfiguration: UpdatedConfiguration = {};

    if (that.generalSettings.employee_field_mapping !== generalSettingsPayload.employee_field_mapping) {
      updatedConfiguration.employee = {
        oldValue: that.generalSettings.employee_field_mapping,
        newValue: generalSettingsPayload.employee_field_mapping
      };
    }

    if (that.generalSettings.reimbursable_expenses_object !== generalSettingsPayload.reimbursable_expenses_object) {
      updatedConfiguration.reimburseExpense = {
        oldValue: that.generalSettings.reimbursable_expenses_object,
        newValue: generalSettingsPayload.reimbursable_expenses_object
      };
    }

    if (that.generalSettings.corporate_credit_card_expenses_object !== generalSettingsPayload.corporate_credit_card_expenses_object) {
      updatedConfiguration.cccExpense = {
        oldValue: that.generalSettings.corporate_credit_card_expenses_object,
        newValue: generalSettingsPayload.corporate_credit_card_expenses_object
      };
    }

    return updatedConfiguration;
  }

  postConfigurationsAndMappingSettings(generalSettingsPayload: GeneralSetting, mappingSettingsPayload: MappingSetting[], redirectToGeneralMappings: boolean = false, redirectToEmployeeMappings: boolean = false) {
    const that = this;

    that.isLoading = true;
    forkJoin(
      [
        that.settingsService.postMappingSettings(that.workspaceId, mappingSettingsPayload),
        that.settingsService.postGeneralSettings(that.workspaceId, generalSettingsPayload)
      ]
    ).subscribe(() => {
      that.snackBar.open('Configuration saved successfully');
      that.qbo.getGeneralSettings();
      if (redirectToGeneralMappings) {
        if (redirectToEmployeeMappings) {
          // add redirect_to_employee_mappings query param
          that.router.navigate([`workspaces/${that.workspaceId}/settings/general_mappings`], { queryParams: { redirect_to_employee_mappings: redirectToEmployeeMappings } });
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/settings/general_mappings`);
        }
      } else {
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      }
    });
  }

  save() {
    const that = this;

    const mappingsSettingsPayload: MappingSetting[] = [{
      source_field: 'CATEGORY',
      destination_field: 'ACCOUNT'
    }];

    const reimbursableExpensesObject = that.generalSettingsForm.value.reimburExpense;
    const cccExpensesObject = that.generalSettingsForm.value.cccExpense ? that.generalSettingsForm.value.cccExpense : null;
    const employeeMappingsObject = that.generalSettingsForm.value.employees;
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

    const generalSettingsPayload: GeneralSetting = {
      employee_field_mapping: employeeMappingsObject,
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

    // Open dialog conditionally
    if (that.generalSettings && (that.generalSettings.employee_field_mapping !== employeeMappingsObject || that.generalSettings.reimbursable_expenses_object !== reimbursableExpensesObject || that.generalSettings.corporate_credit_card_expenses_object !== cccExpensesObject)) {
      const updatedConfigurations = that.constructUpdatedConfigurationsPayload(generalSettingsPayload);
      that.openDialog(updatedConfigurations, generalSettingsPayload, mappingsSettingsPayload);
    } else {
      that.postConfigurationsAndMappingSettings(generalSettingsPayload, mappingsSettingsPayload);
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

  showJELineSettings(reimburseExpense: string, cccExpense: string) {
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
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.isLoading = true;

    that.getAllSettings();
  }
}
