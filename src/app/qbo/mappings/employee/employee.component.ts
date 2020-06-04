import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss', '../../qbo.component.scss']
})
export class EmployeeComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleEmployees: any[];
  qboVendors: any[];
  qboEmployees: any[];
  creditCardAccounts: any[];
  employeeMappings: any[];
  workspaceId: number;
  emailIsValid: boolean = true;
  vendorIsValid:boolean = true;
  employeeIsValid:boolean = true;
  accountIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;
  generalSettings: any;
  generalMappings: any;
  filteredAccounts: any[];

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleEmployee: new FormControl(''),
      qboVendor: new FormControl(''),
      qboEmployee: new FormControl(''),
      creditCardAccount: new FormControl('')
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'employeeMappingModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
  }

  vendorFormatter = (qboVendor) => qboVendor.value;

  vendorSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.qboVendors.filter(qboVendor => new RegExp(term.toLowerCase(), 'g').test(qboVendor.value.toLowerCase())))
  )

  employeeFormatter = (qboEmployee) => qboEmployee.value;

  employeeSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.qboEmployees.filter(qboEmployee => new RegExp(term.toLowerCase(), 'g').test(qboEmployee.value.toLowerCase())))
  )

  accountFormatter = (creditCardAccount) => creditCardAccount.value;

  accountSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.creditCardAccounts.filter(creditCardAccount => new RegExp(term.toLowerCase(), 'g').test(creditCardAccount.value.toLowerCase())))
  )
  
  emailFormatter = (fyleEmployee) => fyleEmployee.value;

  emailSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleEmployees.filter(fyleEmployee => new RegExp(term.toLowerCase(), 'g').test(fyleEmployee.value.toLowerCase())))
  )

  submit() {
    let fyleEmployee = this.form.value.fyleEmployee;
    let qboVendor = this.generalSettings.employee_field_mapping === 'VENDOR' ? this.form.value.qboVendor : '';
    let qboEmployee = this.generalSettings.employee_field_mapping === 'EMPLOYEE' ? this.form.value.qboEmployee : '';
    let creditCardAccount = this.form.value.creditCardAccount ? this.form.value.creditCardAccount.value : this.generalMappings.default_ccc_account_name;

    if(creditCardAccount == this.generalMappings.default_ccc_account_name){
      this.filteredAccounts = this.creditCardAccounts.filter(account => account.Name === creditCardAccount)[0];
    }
    else {
      this.filteredAccounts = creditCardAccount
    }

    this.emailIsValid = false;
    this.vendorIsValid = false;
    this.employeeIsValid = false;
    this.accountIsValid = false;
    
    if (fyleEmployee) {
      this.emailIsValid = true;
    }

    if (qboVendor || qboEmployee) {
      this.vendorIsValid = true;
      this.employeeIsValid = true;
    }

    let employeeMapping: any = [
      this.mappingsService.postMappings(this.workspaceId, {
        source_type: 'EMPLOYEE',
        destination_type: this.generalSettings.employee_field_mapping,
        source_value: fyleEmployee.value,
        destination_value: this.generalSettings.employee_field_mapping == 'VENDOR'? qboVendor.value: qboEmployee.value
      })
    ];

    if(creditCardAccount || !(this.generalSettings.corporate_credit_card_expenses_object)) {
      this.accountIsValid = true;

      employeeMapping.push(
        this.mappingsService.postMappings(this.workspaceId, {
          source_type: 'EMPLOYEE',
          destination_type: 'CREDIT_CARD_ACCOUNT',
          source_value: fyleEmployee.value,
          destination_value: creditCardAccount
        })
      )
    }

    if (this.emailIsValid && this.vendorIsValid && this.employeeIsValid && this.accountIsValid) {
      forkJoin(employeeMapping).subscribe(responses => {
        this.isLoading = true;
        this.clearModalValues();
        this.ngOnInit();
      });
    }
  }

  createEmployeeMappingsRows() {
    let employeeEVMappings = this.employeeMappings.filter(mapping => mapping.destination_type !== 'CREDIT_CARD_ACCOUNT');
    let mappings = [];

    employeeEVMappings.forEach(employeeEVMapping => {
      mappings.push({
        fyle_value: employeeEVMapping['source']['value'],
        qbo_value: employeeEVMapping['destination']['value'],
        ccc_account: this.employeeMappings.filter(evMapping => evMapping.destination_type === 'CREDIT_CARD_ACCOUNT' && evMapping.source.value === employeeEVMapping.source.value)[0].destination.value
      });
    });
    this.employeeMappings = mappings;
  }

  clearModalValues() {
    this.form.reset();
    this.modalRef.close();
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];

      forkJoin(
        [
          this.mappingsService.getFyleEmployees(this.workspaceId),
          this.mappingsService.getQBOVendors(this.workspaceId),
          this.mappingsService.getQBOEmployees(this.workspaceId),
          this.mappingsService.getCreditCardAccounts(this.workspaceId),
          this.mappingsService.getMappings(this.workspaceId, 'EMPLOYEE')
        ]
      ).subscribe(responses => {
        this.fyleEmployees = responses [0];
        this.qboVendors = responses [1];
        this.qboEmployees = responses[2];
        this.creditCardAccounts = responses[3];
        this.employeeMappings = responses[4]['results'];

        this.createEmployeeMappingsRows();
        
        this.isLoading = false;
      });

      this.mappingsService.getGeneralMappings(this.workspaceId).subscribe(generalMappings => {
        this.generalMappings = generalMappings;
      });

      this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
    });
  }

}
