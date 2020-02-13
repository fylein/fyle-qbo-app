import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css', '../../base.component.css']
})
export class GeneralComponent implements OnInit{

  form: FormGroup;
  workspaceId: number;
  bankAccounts: any[]
  generalMappings: {};
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
  }

  submit() {
    this.isLoading = true;
    let bankAccountId = this.form.value.bankAccounts;
    let bankAccount = this.bankAccounts.filter(filteredBankAccount => filteredBankAccount.Id === bankAccountId)[0];
    this.mappingsService.postGeneralMappings(this.workspaceId, bankAccount.Id, bankAccount.Name).subscribe(response => {
      this.getGeneralMappings();
    });
  }

  getGeneralMappings() {
    this.mappingsService.getGeneralMappings(this.workspaceId).subscribe(generalMappings => {
      this.generalMappings = generalMappings;
      this.isLoading = false;
      this.form = this.formBuilder.group({
        bankAccounts: [this.generalMappings? this.generalMappings['bank_account_id']: '']
      });
    }, error => {
      if(error.status == 400) {
        this.generalMappings = {};
        this.isLoading = false;
        this.form = this.formBuilder.group({
          bankAccounts: [this.generalMappings? this.generalMappings['bank_account_id']: '']
        });
      }
    });
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.mappingsService.getQBOAccounts(this.workspaceId).subscribe(response => {
        this.bankAccounts = response.filter(account => account.AccountType === 'Bank');
        this.getGeneralMappings();
      });
    });
  }
}
