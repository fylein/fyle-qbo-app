import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.scss', '../../qbo.component.scss']
})
export class CostCenterComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleCostCenters: any[];
  qboObjects: any[];
  costCenterMappings: any[];
  workspaceId: number;
  costCenterIsValid: boolean = true;
  objectIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;
  generalSettings: any;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleCostCenter: new FormControl(''),
      qboObject: new FormControl('')
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'costCenterMappingModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
  }

  getCostCenterMappings() {
    this.mappingsService.getMappings(this.workspaceId, 'COST_CENTER').subscribe(costCenterMappings => {
      this.costCenterMappings = costCenterMappings.results;
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
  
  costCenterFormatter = (fyleCostCenter) => fyleCostCenter.value;

  costCenterSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleCostCenters.filter(fyleCostCenter => new RegExp(term.toLowerCase(), 'g').test(fyleCostCenter.value.toLowerCase())))
  )

  submit() {
    let fyleCostCenter = this.form.value.fyleCostCenter;
    let qboObject = this.form.value.qboObject;
    this.costCenterIsValid = false;
    this.objectIsValid = false;
    
    if (fyleCostCenter) {
      this.costCenterIsValid = true;
    }

    if (qboObject) {
      this.objectIsValid = true;
    }

    if (this.costCenterIsValid && this.objectIsValid) {
      this.mappingsService.postMappings(this.workspaceId, {
        source_type: 'COST_CENTER',
        destination_type: this.generalSettings.cost_center_field_mapping,
        source_value: fyleCostCenter.value,
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
      this.mappingsService.getFyleCostCenters(this.workspaceId).subscribe(costCenters => {
        this.fyleCostCenters = costCenters;
        this.getCostCenterMappings();
      });

      let costCenterField = this.generalSettings.cost_center_field_mapping;

      if (costCenterField === 'CUSTOMER') { 
        this.mappingsService.getQBOCustomers(this.workspaceId).subscribe(objects => {
          this.qboObjects = objects;
        });
      } else if(costCenterField === 'CLASS') {
        this.mappingsService.getQBOClasses(this.workspaceId).subscribe(objects => {
          this.qboObjects = objects;
        });
      } else if(costCenterField === 'DEPARTMENT') {
        this.mappingsService.getQBODepartments(this.workspaceId).subscribe(objects => {
          this.qboObjects = objects;
        });
      }
    });
  }

}
