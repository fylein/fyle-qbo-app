import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-subsidiary',
  templateUrl: './subsidiary.component.html',
  styleUrls: ['./subsidiary.component.css', '../../base.component.css']
})
export class SubsidiaryComponent implements OnInit {

  form: FormGroup;
  workspaceId: number;
  netsuiteSubsidiaries: any[]
  subsidiaryMappings: any;
  isLoading: boolean = true;
  subsidiaryIsValid: boolean = true;

  constructor(private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
  }

  submit() {
    this.subsidiaryIsValid = false;
    
    let subsidiaryId = this.form.value.netsuiteSubsidiaries;
    let netsuiteSubsidiary = this.netsuiteSubsidiaries.filter(filteredSubsidiary => filteredSubsidiary.destination_id === subsidiaryId)[0];

    if (subsidiaryId != null) {
      this.subsidiaryIsValid = true;
    }


    if(this.subsidiaryIsValid){
      this.isLoading = true;
      this.mappingsService.postSubsidiaryMappings(this.workspaceId, netsuiteSubsidiary.value, netsuiteSubsidiary.destination_id,).subscribe(response => {
        this.getSubsidiaryMappings();
      });
    }
  }

  getSubsidiaryMappings() {
    this.mappingsService.getSubsidiaryMappings(this.workspaceId).subscribe(subsidiaryMappings => {
      this.subsidiaryMappings = subsidiaryMappings;
      this.isLoading = false;

      this.form = this.formBuilder.group({
        netsuiteSubsidiaries: [this.subsidiaryMappings? this.subsidiaryMappings['results'][0]['internal_id']: 'TestValue'],
      });
    }, error => {
      if(error.status == 400) {
        this.subsidiaryMappings = {};
        this.isLoading = false;
        this.form = this.formBuilder.group({
          netsuiteSubsidiaries: [this.subsidiaryMappings? this.subsidiaryMappings['internal_id']: '']
        });
      }
    });
  }


    ngOnInit() {
      this.route.parent.params.subscribe(params => {
        this.workspaceId = +params['workspace_id'];
        forkJoin(
          [
            this.mappingsService.getNetSuiteSubsidiaries(this.workspaceId),
          ]
        ).subscribe(responses => {
          this.netsuiteSubsidiaries = responses[0]
          this.getSubsidiaryMappings();
        });
      });
    }
  }
