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
  employeeMappings: any[];
  workspaceId: number;
  emailIsValid: boolean = true;
  vendorIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleEmployee: new FormControl(''),
      qboVendor: new FormControl('')
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
  
  emailFormatter = (fyleEmployee) => fyleEmployee.employee_email;

  emailSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleEmployees.filter(fyleEmployee => new RegExp(term.toLowerCase(), 'g').test(fyleEmployee.employee_email.toLowerCase())))
  )

  submit() {
    let fyleEmployee = this.form.value.fyleEmployee;
    let qboVendor = this.form.value.qboVendor;
    this.emailIsValid = false;
    this.vendorIsValid = false;
    
    if (fyleEmployee) {
      this.emailIsValid = true;
    }

    if (qboVendor) {
      this.vendorIsValid = true;
    }

    if (this.emailIsValid && this.vendorIsValid) {
      this.isLoading = true;
      this.mappingsService.postEmployeeMappings(this.workspaceId, fyleEmployee.employee_email, qboVendor.DisplayName, qboVendor.Id).subscribe(response => {
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
    });
  }

}
