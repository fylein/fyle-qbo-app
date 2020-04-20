import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import { SettingsService } from '../../settings/settings.service';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css', '../../base.component.css']
})
export class GeneralComponent implements OnInit{

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

  constructor(private route: ActivatedRoute, private mappingsService: MappingsService, private settingsService: SettingsService, private formBuilder: FormBuilder) {
  }

  submit() {
    this.accountsPayableIsValid = false;
    this.bankAccountIsValid = false;
    this.cccAccountIsValid = false;
    
    let accountPayableAccountId = this.generalSettings.employee_field_mapping === 'VENDOR' ? this.form.value.accountPayableAccounts : '';
    let accountPayableAccount = this.generalSettings.employee_field_mapping === 'VENDOR' ? this.accountPayableAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.Id === accountPayableAccountId)[0] : '';

    let bankAccountId = this.generalSettings.employee_field_mapping === 'EMPLOYEE' ? this.form.value.bankAccounts : '';
    let bankAccount = this.generalSettings.employee_field_mapping === 'EMPLOYEE' ? this.bankAccounts.filter(filteredBankAccount => filteredBankAccount.Id === bankAccountId)[0] : '';

    let cccAccountId = this.generalSettings.corporate_credit_card_expenses_object ? this.form.value.cccAccounts: '';
    let cccAccount = this.generalSettings.corporate_credit_card_expenses_object ? this.cccAccounts.filter(filteredCCCAccount => filteredCCCAccount.Id === cccAccountId)[0] : '';

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
      this.mappingsService.postGeneralMappings(this.workspaceId, accountPayableAccount.Id, accountPayableAccount.Name, bankAccount.Id, bankAccount.Name, cccAccount.Id, cccAccount.Name).subscribe(response => {
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
        this.mappingsService.getQBOAccounts(this.workspaceId).subscribe(response => {
          this.settingsService.getGeneralSettings(this.workspaceId).subscribe(generalSettings =>{
            this.generalSettings = generalSettings;
        this.accountPayableAccounts = response.filter(account => account.AccountType === 'Accounts Payable');
        this.bankAccounts = response.filter(account => account.AccountType === 'Bank');
        this.cccAccounts = response.filter(account => account.AccountType === 'Credit Card');
        this.getGeneralMappings();
        });
      });
      });
    }
  }
