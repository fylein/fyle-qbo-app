import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css', '../../base.component.css']
})
export class EmployeeComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleEmployees: any[];
  qboVendors: any[];
  qboEmployees: any[];
  qboAccounts: any[];
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
      qboAccount: new FormControl('')
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

  getEmployeeMappings() {
    this.mappingsService.getEmployeeMappings(this.workspaceId).subscribe(employeeMappings => {
      this.employeeMappings = employeeMappings.results;
      this.isLoading = false;
    });
  }

  vendorFormatter = (qboVendor) => qboVendor.DisplayName;

  vendorSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.qboVendors.filter(qboVendor => new RegExp(term.toLowerCase(), 'g').test(qboVendor.DisplayName.toLowerCase())))
  )

  employeeFormatter = (qboEmployee) => qboEmployee.DisplayName;

  employeeSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.qboEmployees.filter(qboEmployee => new RegExp(term.toLowerCase(), 'g').test(qboEmployee.DisplayName.toLowerCase())))
  )

  accountFormatter = (qboAccount) => qboAccount.Name;

  accountSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.qboAccounts.filter(qboAccount => new RegExp(term.toLowerCase(), 'g').test(qboAccount.Name.toLowerCase())))
  )
  
  emailFormatter = (fyleEmployee) => fyleEmployee.employee_email;

  emailSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleEmployees.filter(fyleEmployee => new RegExp(term.toLowerCase(), 'g').test(fyleEmployee.employee_email.toLowerCase())))
  )

  submit() {
    let fyleEmployee = this.form.value.fyleEmployee;
    let qboVendor = this.generalSettings.employee_field_mapping === 'VENDOR' ? this.form.value.qboVendor : '';
    let qboEmployee = this.generalSettings.employee_field_mapping === 'EMPLOYEE' ? this.form.value.qboEmployee : '';
    let qboAccount = this.form.value.qboAccount ? this.form.value.qboAccount : this.generalMappings.default_ccc_account_name;

    if(qboAccount == this.generalMappings.default_ccc_account_name){
      this.filteredAccounts = this.qboAccounts.filter(account => account.Name === qboAccount)[0];
    }
    else {
      this.filteredAccounts = qboAccount
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

    if(qboAccount) {
      this.accountIsValid = true;
    }

    if (this.emailIsValid && this.vendorIsValid && this.employeeIsValid && this.accountIsValid) {
      this.isLoading = true;
      this.mappingsService.postEmployeeMappings(this.workspaceId, fyleEmployee.employee_email, qboVendor.DisplayName, qboVendor.Id, qboEmployee.DisplayName, qboEmployee.Id, this.filteredAccounts['Name'], this.filteredAccounts['Id']).subscribe(response => {
        this.clearModalValues();
        this.getEmployeeMappings();
      });
    }
  }

  clearModalValues() {
    this.form.reset();
    this.modalRef.close();
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.mappingsService.getFyleEmployees(this.workspaceId).subscribe(employees => {
        this.fyleEmployees = employees;
        this.getEmployeeMappings();
      });

      this.mappingsService.getQBOVendors(this.workspaceId).subscribe(vendors => {
        this.qboVendors = vendors;
      });

      this.mappingsService.getQBOEmployees(this.workspaceId).subscribe(employees => {
        this.qboEmployees = employees;
      });

      this.mappingsService.getQBOAccounts(this.workspaceId).subscribe(accounts => {
        this.qboAccounts = accounts;
      });

      this.mappingsService.getGeneralMappings(this.workspaceId).subscribe(generalMappings => {
        this.generalMappings = generalMappings;
      });

      this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
    });
  }

}
