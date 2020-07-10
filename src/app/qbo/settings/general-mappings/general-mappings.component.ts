import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-general-mappings',
  templateUrl: './general-mappings.component.html',
  styleUrls: ['./general-mappings.component.scss', '../../qbo.component.scss']
})
export class GeneralMappingsComponent implements OnInit {
  form: FormGroup;
  workspaceId: number;
  accountPayableAccounts: any[];
  bankAccounts: any[];
  cccAccounts: any[];
  generalMappings: any;
  generalSettings: any;
  isLoading = true;
  accountsPayableIsValid = true;
  bankAccountIsValid = true;
  cccAccountIsValid = true;

  constructor(private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder, private router: Router, private settingsService: SettingsService, private snackBar: MatSnackBar) {
  }

  submit() {
    const that = this;
    that.accountsPayableIsValid = false;
    that.bankAccountIsValid = false;
    that.cccAccountIsValid = false;

    const accountPayableAccountId = that.generalSettings.employee_field_mapping === 'VENDOR' ? that.form.value.accountPayableAccounts : '';
    const accountPayableAccount = that.generalSettings.employee_field_mapping === 'VENDOR' ? that.accountPayableAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === accountPayableAccountId)[0] : '';

    const bankAccountId = that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.form.value.bankAccounts : '';
    const bankAccount = that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.bankAccounts.filter(filteredBankAccount => filteredBankAccount.destination_id === bankAccountId)[0] : '';

    const cccAccountId = that.generalSettings.corporate_credit_card_expenses_object ? that.form.value.cccAccounts : '';
    const cccAccount = that.generalSettings.corporate_credit_card_expenses_object ? that.cccAccounts.filter(filteredCCCAccount => filteredCCCAccount.destination_id === cccAccountId)[0] : '';

    if (accountPayableAccountId != null) {
      that.accountsPayableIsValid = true;
    }
    if (bankAccountId != null) {
      that.bankAccountIsValid = true;
    }
    if (cccAccountId != null) {
      that.cccAccountIsValid = true;
    }

    if (that.accountsPayableIsValid && that.bankAccountIsValid && that.cccAccountIsValid) {
      that.isLoading = true;
      that.mappingsService.postGeneralMappings(that.workspaceId, accountPayableAccount.destination_id, accountPayableAccount.value, bankAccount.destination_id, bankAccount.value, cccAccount.destination_id, cccAccount.value).subscribe(response => {
        const onboarded = localStorage.getItem('onboarded');
        if (onboarded === 'true') {
          that.getGeneralMappings();
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
      });
    } else {
      that.snackBar.open('Please fill up the form with valid values');
    }
  }

  getGeneralMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getGeneralMappings(that.workspaceId).subscribe(generalMappings => {
      that.generalMappings = generalMappings;
      that.isLoading = false;

      that.form = that.formBuilder.group({
        accountPayableAccounts: [that.generalMappings ? that.generalMappings.accounts_payable_id : ''],
        bankAccounts: [that.generalMappings ? that.generalMappings.bank_account_id : ''],
        cccAccounts: [that.generalMappings ? that.generalMappings.default_ccc_account_id : '']
      });
    }, error => {
      if (error.status === 400) {
        that.generalMappings = {};
        that.isLoading = false;
        that.form = that.formBuilder.group({
          accountPayableAccounts: [that.generalMappings ? that.generalMappings.accounts_payable_id : ''],
          bankAccounts: [that.generalMappings ? that.generalMappings.bank_account_id : ''],
          cccAccounts: [that.generalMappings ? that.generalMappings.default_ccc_account_id : '']
        });
      }
    });
  }

  reset() {
    const that = this;
    that.isLoading = true;
    forkJoin(
      [
        that.mappingsService.getBankAccounts(that.workspaceId),
        that.mappingsService.getCreditCardAccounts(that.workspaceId),
        that.mappingsService.getAccountsPayables(that.workspaceId)
      ]
    ).subscribe(responses => {
      that.isLoading = false;
      that.bankAccounts = responses[0];
      that.cccAccounts = responses[1];
      that.accountPayableAccounts = responses[2];
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
