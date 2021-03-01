import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/storage.service';
import { GeneralMapping } from 'src/app/core/models/general-mapping.model';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';

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
  qboVendors: MappingDestination[];
  generalMappings: GeneralMapping;
  generalSettings: GeneralSetting;
  isLoading = true;
  accountsPayableIsValid = true;
  bankAccountIsValid = true;
  cccAccountIsValid = true;
  billPaymentAccountIsValid = true;
  vendorIsValid = true;

  constructor(
    private route: ActivatedRoute,
    private mappingsService: MappingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private storageService: StorageService) {
  }

  submit() {
    const that = this;
    that.accountsPayableIsValid = false;
    that.bankAccountIsValid = false;
    that.cccAccountIsValid = false;
    that.billPaymentAccountIsValid = false;

    const accountPayableAccountId = (that.generalSettings.employee_field_mapping === 'VENDOR' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') ? that.form.value.accountPayableAccounts : '';
    const accountPayableAccount = (that.generalSettings.employee_field_mapping === 'VENDOR' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') ? that.accountPayableAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === accountPayableAccountId)[0] : '';

    const bankAccountId = that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.form.value.bankAccounts : '';
    const bankAccount = that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.bankAccounts.filter(filteredBankAccount => filteredBankAccount.destination_id === bankAccountId)[0] : '';

    const cccAccountId = that.generalSettings.corporate_credit_card_expenses_object !== 'BILL' ? that.form.value.cccAccounts : '';
    const cccAccount = that.generalSettings.corporate_credit_card_expenses_object !== 'BILL' ? that.cccAccounts.filter(filteredCCCAccount => filteredCCCAccount.destination_id === cccAccountId)[0] : '';

    const billPaymentAccountId = that.generalSettings.sync_fyle_to_qbo_payments ? that.form.value.billPaymentAccounts : '';
    const billPaymentAccount = that.generalSettings.sync_fyle_to_qbo_payments ? that.billPaymentAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === billPaymentAccountId)[0] : '';

    const defaultVendorId = that.generalSettings.corporate_credit_card_expenses_object === 'BILL' ? that.form.value.qboVendors : '';
    const defaultVendor = that.generalSettings.corporate_credit_card_expenses_object === 'BILL' ? that.qboVendors.filter(filteredVendor => filteredVendor.destination_id === defaultVendorId)[0] : '';

    if (accountPayableAccountId != null) {
      that.accountsPayableIsValid = true;
    }
    if (bankAccountId != null) {
      that.bankAccountIsValid = true;
    }
    if (cccAccountId != null) {
      that.cccAccountIsValid = true;
    }
    if (billPaymentAccountId != null) {
      that.billPaymentAccountIsValid = true;
    }
    if (defaultVendorId != null) {
      that.vendorIsValid = true;
    }
    if (cccAccountId === null) {
      this.cccAccountIsValid = true;
    }

    if (that.accountsPayableIsValid && that.bankAccountIsValid && that.cccAccountIsValid && that.vendorIsValid && that.billPaymentAccountIsValid) {
      that.isLoading = true;

      const generalMappings: GeneralMapping = {
        accounts_payable_name: accountPayableAccount ? accountPayableAccount.value : null,
        accounts_payable_id: accountPayableAccount ? accountPayableAccount.destination_id : null,
        bank_account_name: bankAccount ? bankAccount.value : null,
        bank_account_id: bankAccount ? bankAccount.destination_id : null,
        default_ccc_account_name: cccAccount ? cccAccount.value : null,
        default_ccc_account_id: cccAccount ? cccAccount.destination_id : null,
        bill_payment_account_name: billPaymentAccount ? billPaymentAccount.value : null,
        bill_payment_account_id: billPaymentAccount ? billPaymentAccount.destination_id : null,
        default_ccc_vendor_name: defaultVendor ? defaultVendor.value : null,
        default_ccc_vendor_id: defaultVendor ? defaultVendor.destination_id : null
      };

      this.mappingsService.postGeneralMappings(generalMappings).subscribe(() => {
        const onboarded = that.storageService.get('onboarded');
        if (onboarded === true) {
          that.getGeneralMappings();
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
      }, error => {
        that.isLoading = false;
        that.snackBar.open('Please fill up the form with valid values');
        that.form.markAllAsTouched();
      });
    } else {
      that.snackBar.open('Please fill up the form with valid values');
      that.form.markAllAsTouched();
    }
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
        cccAccounts: [that.generalMappings ? that.generalMappings.default_ccc_account_id : ''],
        billPaymentAccounts: [that.generalMappings ? that.generalMappings.bill_payment_account_id : ''],
        qboVendors: [that.generalMappings ? that.generalMappings.default_ccc_vendor_id : '']
      });
    }, error => {
      that.isLoading = false;
      that.form = that.formBuilder.group({
        accountPayableAccounts: [null],
        bankAccounts: [null],
        cccAccounts: [null],
        billPaymentAccounts: [null],
        qboVendors: [null]
      });
    });
  }

  reset() {
    const that = this;
    that.isLoading = true;
    forkJoin(
      [
        that.mappingsService.getBankAccounts(),
        that.mappingsService.getCreditCardAccounts(),
        that.mappingsService.getAccountsPayables(),
        that.mappingsService.getQBOVendors(),
        that.mappingsService.getBillPaymentAccounts()
      ]
    ).subscribe(responses => {
      that.isLoading = false;
      that.bankAccounts = responses[0];
      that.cccAccounts = responses[1];
      that.accountPayableAccounts = responses[2];
      that.qboVendors = responses[3];
      that.billPaymentAccounts = responses[4];
      that.getGeneralMappings();
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.isLoading = true;
    that.settingsService.getCombinedSettings(that.workspaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }
}
