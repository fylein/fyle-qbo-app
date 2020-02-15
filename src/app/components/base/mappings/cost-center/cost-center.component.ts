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
  styleUrls: ['./cost-center.component.css', '../../base.component.css']
})
export class CostCenterComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleCostCenters: any[];
  qboClasses: any[];
  costCenterMappings: any[];
  workspaceId: number;
  costCenterIsValid: boolean = true;
  classIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleCostCenter: new FormControl(''),
      qboClass: new FormControl('')
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
    this.mappingsService.getCostCenterMappings(this.workspaceId).subscribe(costCenterMappings => {
      this.costCenterMappings = costCenterMappings.results;
      this.isLoading = false;
    });
  }

  classFormatter = (qboClass) => qboClass.Name;

  classSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.qboClasses.filter(qboClass => new RegExp(term.toLowerCase(), 'g').test(qboClass.Name.toLowerCase())))
  )
  
  costCenterFormatter = (fyleCostCenter) => fyleCostCenter.name;

  costCenterSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleCostCenters.filter(fyleCostCenter => new RegExp(term.toLowerCase(), 'g').test(fyleCostCenter.name.toLowerCase())))
  )

  submit() {
    let fyleCostCenter = this.form.value.fyleCostCenter;
    let qboClass = this.form.value.qboClass;
    this.costCenterIsValid = false;
    this.classIsValid = false;
    
    if (fyleCostCenter) {
      this.costCenterIsValid = true;
    }

    if (qboClass) {
      this.classIsValid = true;
    }

    if (this.costCenterIsValid && this.classIsValid) {
      this.isLoading = true;
      this.mappingsService.postCostCenterMappings(this.workspaceId, fyleCostCenter.name, qboClass.Name, qboClass.Id).subscribe(response => {
        this.clearModalValues();
        this.getCostCenterMappings();
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
      this.mappingsService.getFyleCostCenters(this.workspaceId).subscribe(costCenters => {
        this.fyleCostCenters = costCenters;
        this.getCostCenterMappings();
      });

      this.mappingsService.getQBOClasses(this.workspaceId).subscribe(classes => {
        this.qboClasses = classes;
      });
    });
  }

}
