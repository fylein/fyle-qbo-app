import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css', '../../base.component.css']
})
export class LocationComponent implements OnInit {

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
      this.mappingsService.postLocationMappings(this.workspaceId, netsuiteSubsidiary.destination_id, netsuiteSubsidiary.value,).subscribe(response => {
        this.getSubsidiaryMappings();
      });
    }
  }

  getSubsidiaryMappings() {
    this.mappingsService.getLocationMappings(this.workspaceId).subscribe(subsidiaryMappings => {
      this.subsidiaryMappings = subsidiaryMappings;
      this.isLoading = false;
      this.form = this.formBuilder.group({
        netsuiteSubsidiaries: [this.subsidiaryMappings? this.subsidiaryMappings.internal_id: ''],
      });
    }, error => {
      if(error.status == 400) {
        this.subsidiaryMappings = {};
        this.isLoading = false;
        this.form = this.formBuilder.group({
          netsuiteSubsidiaries: [this.subsidiaryMappings? this.subsidiaryMappings.internal_id: '']
        });
      }
    });
  }


    ngOnInit() {
      this.route.parent.params.subscribe(params => {
        this.workspaceId = +params['workspace_id'];
        forkJoin(
          [
            this.mappingsService.getNetSuiteLocations(this.workspaceId),
          ]
        ).subscribe(responses => {
          this.netsuiteSubsidiaries = responses[0]
          this.getSubsidiaryMappings();
        });
      });
    }
  }
