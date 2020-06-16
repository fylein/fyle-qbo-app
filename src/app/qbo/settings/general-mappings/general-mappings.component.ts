import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  accountPayableAccounts: any[]
  bankAccounts: any[]
  cccAccounts: any[]
  generalMappings: any;
  generalSettings: any;
  isLoading: boolean = true;
  accountsPayableIsValid: boolean = true;
  bankAccountIsValid: boolean = true;
  cccAccountIsValid: boolean = true;

  constructor(private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
  }

  submit() {
    this.accountsPayableIsValid = false;
    this.bankAccountIsValid = false;
    this.cccAccountIsValid = false;
    
    let accountPayableAccountId = this.generalSettings.employee_field_mapping === 'VENDOR' ? this.form.value.accountPayableAccounts : '';
    let accountPayableAccount = this.generalSettings.employee_field_mapping === 'VENDOR' ? this.accountPayableAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === accountPayableAccountId)[0] : '';

    let bankAccountId = this.generalSettings.employee_field_mapping === 'EMPLOYEE' ? this.form.value.bankAccounts : '';
    let bankAccount = this.generalSettings.employee_field_mapping === 'EMPLOYEE' ? this.bankAccounts.filter(filteredBankAccount => filteredBankAccount.destination_id === bankAccountId)[0] : '';

    let cccAccountId = this.generalSettings.corporate_credit_card_expenses_object ? this.form.value.cccAccounts: '';
    let cccAccount = this.generalSettings.corporate_credit_card_expenses_object ? this.cccAccounts.filter(filteredCCCAccount => filteredCCCAccount.destination_id === cccAccountId)[0] : '';

    if (accountPayableAccountId != null) {
      this.accountsPayableIsValid = true;
    }
    if (bankAccountId != null) {
      this.bankAccountIsValid = true;
    }
    if (cccAccountId != null) {
      this.cccAccountIsValid = true;
    }

    if(this.accountsPayableIsValid && this.bankAccountIsValid && this.cccAccountIsValid){
      this.isLoading = true;
      this.mappingsService.postGeneralMappings(this.workspaceId, accountPayableAccount.destination_id, accountPayableAccount.value, bankAccount.destination_id, bankAccount.value, cccAccount.destination_id, cccAccount.value).subscribe(response => {
        this.getGeneralMappings();
      });
    }
  }

  getGeneralMappings() {
    this.mappingsService.getGeneralMappings(this.workspaceId).subscribe(generalMappings => {
      this.generalMappings = generalMappings;
      this.isLoading = false;

      this.form = this.formBuilder.group({
        accountPayableAccounts: [this.generalMappings? this.generalMappings['accounts_payable_id']: ''],
        bankAccounts: [this.generalMappings? this.generalMappings['bank_account_id']: ''],
        cccAccounts: [this.generalMappings? this.generalMappings['default_ccc_account_id']: '']
      });
    }, error => {
      if(error.status == 400) {
        this.generalMappings = {};
        this.isLoading = false;
        this.form = this.formBuilder.group({
          accountPayableAccounts: [this.generalMappings? this.generalMappings['accounts_payable_id']: ''],
          bankAccounts: [this.generalMappings? this.generalMappings['bank_account_id']: ''],
          cccAccounts: [this.generalMappings? this.generalMappings['default_ccc_account_id']: '']
        });
      }
    });
  }


    ngOnInit() {
      this.route.parent.params.subscribe(params => {
        this.workspaceId = +params['workspace_id'];
        this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
        forkJoin(
          [
            this.mappingsService.getBankAccounts(this.workspaceId),
            this.mappingsService.getCreditCardAccounts(this.workspaceId),
            this.mappingsService.getAccountsPayables(this.workspaceId)
          ]
        ).subscribe(responses => {
          this.bankAccounts = responses[0]
          this.cccAccounts = responses[1]
          this.accountPayableAccounts = responses[2]
          this.getGeneralMappings();
        });
      });
    }
}
