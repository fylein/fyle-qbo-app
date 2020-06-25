import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

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

  constructor(private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder, private router: Router) {
  }

  submit() {
    let that = this;
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
    }
  }

  getGeneralMappings() {
    this.mappingsService.getGeneralMappings(this.workspaceId).subscribe(generalMappings => {
      this.generalMappings = generalMappings;
      this.isLoading = false;

      this.form = this.formBuilder.group({
        accountPayableAccounts: [this.generalMappings ? this.generalMappings.accounts_payable_id : ''],
        bankAccounts: [this.generalMappings ? this.generalMappings.bank_account_id : ''],
        cccAccounts: [this.generalMappings ? this.generalMappings.default_ccc_account_id : '']
      });
    }, error => {
      if (error.status == 400) {
        this.generalMappings = {};
        this.isLoading = false;
        this.form = this.formBuilder.group({
          accountPayableAccounts: [this.generalMappings ? this.generalMappings.accounts_payable_id : ''],
          bankAccounts: [this.generalMappings ? this.generalMappings.bank_account_id : ''],
          cccAccounts: [this.generalMappings ? this.generalMappings.default_ccc_account_id : '']
        });
      }
    });
  }


    ngOnInit() {
      this.route.parent.params.subscribe(params => {
        this.workspaceId = +params.workspace_id;
        this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
        forkJoin(
          [
            this.mappingsService.getBankAccounts(this.workspaceId),
            this.mappingsService.getCreditCardAccounts(this.workspaceId),
            this.mappingsService.getAccountsPayables(this.workspaceId)
          ]
        ).subscribe(responses => {
          this.bankAccounts = responses[0];
          this.cccAccounts = responses[1];
          this.accountPayableAccounts = responses[2];
          this.getGeneralMappings();
        });
      });
    }
}
