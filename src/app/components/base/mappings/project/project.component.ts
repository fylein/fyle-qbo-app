import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css', '../../base.component.css']
})
export class ProjectComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleProjects: any[];
  qboCustomers: any[];
  projectMappings: any[];
  workspaceId: number;
  projectIsValid: boolean = true;
  customerIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleProject: new FormControl(''),
      qboCustomer: new FormControl('')
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'projectMappingModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
  }

  getProjectMappings() {
    this.mappingsService.getProjectMappings(this.workspaceId).subscribe(projectMappings => {
      this.projectMappings = projectMappings.results;
      this.isLoading = false;
    });
  }

  customerFormatter = (qboCustomer) => qboCustomer.DisplayName;

  customerSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.qboCustomers.filter(qboCustomer => new RegExp(term.toLowerCase(), 'g').test(qboCustomer.DisplayName.toLowerCase())))
  )
  
  projectFormatter = (fyleProject) => fyleProject.name;

  projectSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleProjects.filter(fyleProject => new RegExp(term.toLowerCase(), 'g').test(fyleProject.name.toLowerCase())))
  )

  submit() {
    let fyleProject = this.form.value.fyleProject;
    let qboCustomer = this.form.value.qboCustomer;
    this.projectIsValid = false;
    this.customerIsValid = false;
    
    if (fyleProject) {
      this.projectIsValid = true;
    }

    if (qboCustomer) {
      this.customerIsValid = true;
    }

    if (this.projectIsValid && this.customerIsValid) {
      this.isLoading = true;
      this.mappingsService.postProjectMappings(this.workspaceId, fyleProject.name, qboCustomer.DisplayName, qboCustomer.Id).subscribe(response => {
        this.clearModalValues();
        this.getProjectMappings();
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
      this.mappingsService.getFyleProjects(this.workspaceId).subscribe(projects => {
        this.fyleProjects = projects;
        this.getProjectMappings();
      });

      this.mappingsService.getQBOCustomers(this.workspaceId).subscribe(customers => {
        this.qboCustomers = customers;
      });
    });
  }

}
