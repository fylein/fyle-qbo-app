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
  styleUrls: ['./project.component.css', '../../qbo.component.css']
})
export class ProjectComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleProjects: any[];
  qboObjects: any[];
  projectMappings: any[];
  workspaceId: number;
  projectIsValid: boolean = true;
  objectIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;
  generalSettings: any = true;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleProject: new FormControl(''),
      qboObject: new FormControl('')
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
    this.mappingsService.getMappings(this.workspaceId, 'PROJECT').subscribe(projectMappings => {
      this.projectMappings = projectMappings.results;
      this.isLoading = false;
    });
  }

  objectFormatter = (qboObject) => qboObject.value;

  objectSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.qboObjects.filter(qboObject => new RegExp(term.toLowerCase(), 'g').test(qboObject.value.toLowerCase())))
  )
  
  projectFormatter = (fyleProject) => fyleProject.value;

  projectSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleProjects.filter(fyleProject => new RegExp(term.toLowerCase(), 'g').test(fyleProject.value.toLowerCase())))
  )

  submit() {
    let fyleProject = this.form.value.fyleProject;
    let qboObject = this.form.value.qboObject;
    this.projectIsValid = false;
    this.objectIsValid = false;
    
    if (fyleProject) {
      this.projectIsValid = true;
    }

    if (qboObject) {
      this.objectIsValid = true;
    }

    if (this.projectIsValid && this.objectIsValid) {
      this.isLoading = true;

      this.mappingsService.postMappings(this.workspaceId, {
        source_type: 'PROJECT',
        destination_type: this.generalSettings.project_field_mapping,
        source_value: fyleProject.value,
        destination_value: qboObject.value
      }).subscribe(response => {
        this.clearModalValues();
        this.isLoading = true;
        this.ngOnInit();
      });
    }
  }

  clearModalValues() {
    this.form.reset();
    this.modalRef.close();
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
      this.workspaceId = +params['workspace_id'];
      this.mappingsService.getFyleProjects(this.workspaceId).subscribe(projects => {
        this.fyleProjects = projects;
        this.getProjectMappings();
      });
      
      let projectField = this.generalSettings.project_field_mapping;

      if (projectField === 'CUSTOMER') { 
        this.mappingsService.getQBOCustomers(this.workspaceId).subscribe(objects => {
          this.qboObjects = objects;
        });
      } else if(projectField === 'CLASS') {
        this.mappingsService.getQBOClasses(this.workspaceId).subscribe(objects => {
          this.qboObjects = objects;
        });
      } else if(projectField === 'DEPARTMENT') {
        this.mappingsService.getQBODepartments(this.workspaceId).subscribe(objects => {
          this.qboObjects = objects;
        });
      }

    });
  }

}
