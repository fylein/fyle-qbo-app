import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/storage.service';
import { GeneralMapping } from 'src/app/core/models/general-mapping.model';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { TrackingService } from 'src/app/core/services/tracking.service';

@Component({
  selector: 'app-general-mappings',
  templateUrl: './general-mappings.component.html',
  styleUrls: ['./general-mappings.component.scss', '../../qbo.component.scss']
})
export class GeneralMappingsComponent implements OnInit {
  form: FormGroup;
  workspaceId: number;
  accountPayableAccounts: MappingDestination[];
  bankAccounts: MappingDestination[];
  cccAccounts: MappingDestination[];
  billPaymentAccounts: MappingDestination[];
  qboExpenseAccounts: MappingDestination[];
  qboVendors: MappingDestination[];
  taxCodes: MappingDestination[];
  debitCardExpenseAccounts: MappingDestination[];
  generalMappings: GeneralMapping;
  generalSettings: GeneralSetting;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private mappingsService: MappingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private storageService: StorageService,
    private trackingService: TrackingService) {
  }

  redirectHandler() {
    const that = this;

    that.route.queryParams.subscribe(params => {
      if (params.redirect_to_employee_mappings) {
        setTimeout(() => {
          const destination = that.generalSettings.employee_field_mapping.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
          that.snackBar.open(`To ensure successful export, map Fyle Employees to ${destination}s in QBO`, '', {
            duration: 7000
          });
          return that.router.navigateByUrl(`workspaces/${that.workspaceId}/settings/employee_mappings`);
        }, 1000);
      } else {
        const onboarded = that.storageService.get('onboarded');
        if (!onboarded) {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        } else {
          that.isLoading = false;
        }
      }
    });
  }

  submit() {
    const that = this;

    const accountPayableAccountId = that.generalSettings.employee_field_mapping === 'VENDOR' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL' ? that.form.value.accountPayableAccounts : '';
    const accountPayableAccount = that.generalSettings.employee_field_mapping === 'VENDOR' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL' ? that.accountPayableAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === accountPayableAccountId)[0] : '';

    const bankAccountId = that.generalSettings.employee_field_mapping === 'EMPLOYEE' && that.generalSettings.reimbursable_expenses_object !== 'EXPENSE' ? that.form.value.bankAccounts : '';
    const bankAccount = that.generalSettings.employee_field_mapping === 'EMPLOYEE' && that.generalSettings.reimbursable_expenses_object !== 'EXPENSE' ? that.bankAccounts.filter(filteredBankAccount => filteredBankAccount.destination_id === bankAccountId)[0] : '';

    const qboExpenseAccountId = that.generalSettings.reimbursable_expenses_object === 'EXPENSE' ? that.form.value.qboExpenseAccounts : '';
    const qboExpenseAccount = that.generalSettings.reimbursable_expenses_object === 'EXPENSE' ? that.qboExpenseAccounts.filter(filteredAccount => filteredAccount.destination_id === qboExpenseAccountId)[0] : '';

    const cccAccountId = that.generalSettings.corporate_credit_card_expenses_object !== 'BILL' ? that.form.value.cccAccounts : '';
    const cccAccount = that.generalSettings.corporate_credit_card_expenses_object !== 'BILL' ? that.cccAccounts.filter(filteredCCCAccount => filteredCCCAccount.destination_id === cccAccountId)[0] : '';

    const billPaymentAccountId = that.generalSettings.sync_fyle_to_qbo_payments ? that.form.value.billPaymentAccounts : '';
    const billPaymentAccount = that.generalSettings.sync_fyle_to_qbo_payments ? that.billPaymentAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === billPaymentAccountId)[0] : '';

    const defaultVendorId = that.generalSettings.corporate_credit_card_expenses_object === 'BILL' ? that.form.value.qboVendors : '';
    const defaultVendor = that.generalSettings.corporate_credit_card_expenses_object === 'BILL' ? that.qboVendors.filter(filteredVendor => filteredVendor.destination_id === defaultVendorId)[0] : '';

    const debitCardExpenseAccountId = that.generalSettings.corporate_credit_card_expenses_object === 'DEBIT CARD EXPENSE' ? that.form.value.debitCardExpenseAccounts : '';

    const debitCardExpenseAccount = that.generalSettings.corporate_credit_card_expenses_object === 'DEBIT CARD EXPENSE' ? that.debitCardExpenseAccounts.filter(filteredDebitCardExpenseAccount => filteredDebitCardExpenseAccount.destination_id === debitCardExpenseAccountId)[0] : '';

    const defaultTaxCodeId = that.form.value.qboTaxCodes;
    const defaultTaxCode = that.taxCodes.filter(filteredTaxCode => filteredTaxCode.destination_id === defaultTaxCodeId)[0];

    const generalMappings: GeneralMapping = {
      accounts_payable_name: accountPayableAccount ? accountPayableAccount.value : null,
      accounts_payable_id: accountPayableAccount ? accountPayableAccount.destination_id : null,
      bank_account_name: bankAccount ? bankAccount.value : null,
      bank_account_id: bankAccount ? bankAccount.destination_id : null,
      qbo_expense_account_name: qboExpenseAccount ? qboExpenseAccount.value : null,
      qbo_expense_account_id: qboExpenseAccount ? qboExpenseAccount.destination_id : null,
      default_ccc_account_name: cccAccount ? cccAccount.value : null,
      default_ccc_account_id: cccAccount ? cccAccount.destination_id : null,
      bill_payment_account_name: billPaymentAccount ? billPaymentAccount.value : null,
      bill_payment_account_id: billPaymentAccount ? billPaymentAccount.destination_id : null,
      default_ccc_vendor_name: defaultVendor ? defaultVendor.value : null,
      default_ccc_vendor_id: defaultVendor ? defaultVendor.destination_id : null,
      default_tax_code_name: defaultTaxCode ? defaultTaxCode.value : null,
      default_tax_code_id: defaultTaxCode ? defaultTaxCode.destination_id : null,
      default_debit_card_account_name: debitCardExpenseAccount ? debitCardExpenseAccount.value : null,
      default_debit_card_account_id: debitCardExpenseAccount ? debitCardExpenseAccount.destination_id : null,
    };

    this.mappingsService.postGeneralMappings(generalMappings).subscribe(() => {
      that.trackingService.onSaveGeneralMappings(generalMappings);
      that.snackBar.open('General Mappings saved successfully');
      that.redirectHandler();
    }, () => {
      that.isLoading = false;
      that.snackBar.open('Please fill up the form with valid values');
      that.form.markAllAsTouched();
    });
  }

  setMandatoryField() {
    const that = this;

    if ((that.generalSettings.reimbursable_expenses_object === 'BILL' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') || (that.generalSettings.reimbursable_expenses_object === 'JOURNAL ENTRY' && that.generalSettings.employee_field_mapping === 'VENDOR')) {
      that.form.controls.accountPayableAccounts.setValidators(Validators.required);
    }

    if (that.generalSettings.employee_field_mapping === 'EMPLOYEE' && this.generalSettings.reimbursable_expenses_object !== 'EXPENSE') {
      that.form.controls.bankAccounts.setValidators(Validators.required);
    }

    if (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.corporate_credit_card_expenses_object !== 'BILL' && that.generalSettings.corporate_credit_card_expenses_object !== 'DEBIT CARD EXPENSE') {
      that.form.controls.cccAccounts.setValidators(Validators.required);
    }

    if (that.generalSettings.corporate_credit_card_expenses_object === 'BILL') {
      that.form.controls.qboVendors.setValidators(Validators.required);
    }

    if (that.generalSettings.reimbursable_expenses_object === 'EXPENSE') {
      that.form.controls.qboExpenseAccounts.setValidators(Validators.required);
    }

    if (that.generalSettings.sync_fyle_to_qbo_payments) {
      that.form.controls.billPaymentAccounts.setValidators(Validators.required);
    }

    if (that.generalSettings.import_tax_codes) {
      that.form.controls.qboTaxCodes.setValidators(Validators.required);
    }

    if (that.generalSettings.corporate_credit_card_expenses_object === 'DEBIT CARD EXPENSE') {
      that.form.controls.debitCardExpenseAccounts.setValidators(Validators.required);
    }

    if (that.generalMappings) {
      that.form.markAllAsTouched();
    }
  }

  isFieldMandatory(controlName: string) {
    const abstractControl = this.form.controls[controlName];
    if (abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }

    return false;
  }

  getGeneralMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getGeneralMappings().subscribe(generalMappings => {
      that.generalMappings = generalMappings;
      that.isLoading = false;

      that.form = that.formBuilder.group({
        accountPayableAccounts: [that.generalMappings ? that.generalMappings.accounts_payable_id : ''],
        bankAccounts: [that.generalMappings ? that.generalMappings.bank_account_id : ''],
        qboExpenseAccounts: [that.generalMappings ? that.generalMappings.qbo_expense_account_id : ''],
        cccAccounts: [that.generalMappings ? that.generalMappings.default_ccc_account_id : ''],
        billPaymentAccounts: [that.generalMappings ? that.generalMappings.bill_payment_account_id : ''],
        qboVendors: [that.generalMappings ? that.generalMappings.default_ccc_vendor_id : ''],
        qboTaxCodes: [that.generalMappings ? that.generalMappings.default_tax_code_id : ''],
        debitCardExpenseAccounts: [that.generalMappings ? that.generalMappings.default_debit_card_account_id : ''],
      });

      that.setMandatoryField();

    }, () => {
      that.isLoading = false;
      that.form = that.formBuilder.group({
        accountPayableAccounts: [null],
        bankAccounts: [null],
        qboExpenseAccounts: [null],
        cccAccounts: [null],
        billPaymentAccounts: [null],
        qboVendors: [null],
        qboTaxCodes: [null],
        debitCardExpenseAccounts: [null],
      });

      that.setMandatoryField();

    });
  }


 getAttributesFilteredByConfig() {
  const that = this;
  const attributes = [];

  if ((that.generalSettings.reimbursable_expenses_object === 'BILL' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') || (that.generalSettings.reimbursable_expenses_object === 'JOURNAL ENTRY' && that.generalSettings.employee_field_mapping === 'VENDOR')) {
    attributes.push('ACCOUNTS_PAYABLE');
  }

  if ((that.generalSettings.employee_field_mapping === 'EMPLOYEE' && this.generalSettings.reimbursable_expenses_object !== 'EXPENSE') || (that.generalSettings.corporate_credit_card_expenses_object === 'DEBIT CARD EXPENSE')) {
    attributes.push('BANK_ACCOUNT');
  }

  if (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.corporate_credit_card_expenses_object !== 'BILL') {
    attributes.push('CREDIT_CARD_ACCOUNT');
  }

  if (that.generalSettings.reimbursable_expenses_object === 'EXPENSE') {
    attributes.push('BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT');
  }

  if (that.generalSettings.corporate_credit_card_expenses_object === 'BILL') {
    attributes.push('VENDOR');
  }

  if (this.generalSettings.sync_fyle_to_qbo_payments) {
    attributes.push('BANK_ACCOUNT');
  }

  if (this.generalSettings.import_tax_codes) {
    attributes.push('TAX_CODE');
  }

  return [...new Set(attributes)];
}


  reset() {
    const that = this;
    that.isLoading = true;

    const attributes = this.getAttributesFilteredByConfig();
    that.mappingsService.getGroupedQBODestinationAttributes(attributes).subscribe(responses => {
      that.isLoading = false;
      that.bankAccounts = responses.BANK_ACCOUNT;
      that.cccAccounts = responses.CREDIT_CARD_ACCOUNT;
      that.accountPayableAccounts = responses.ACCOUNTS_PAYABLE;
      that.qboVendors = responses.VENDOR;
      that.billPaymentAccounts = responses.BANK_ACCOUNT;
      that.taxCodes = responses.TAX_CODE;
      that.qboExpenseAccounts = [ ...responses.BANK_ACCOUNT, ...responses.CREDIT_CARD_ACCOUNT];
      that.debitCardExpenseAccounts = [ ...responses.BANK_ACCOUNT];
      that.getGeneralMappings();
    });
  }


  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.isLoading = true;
    that.settingsService.getGeneralSettings(that.workspaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }
}
