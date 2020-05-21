import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MappingsService } from './mappings.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.css', '../base.component.css'],
})
export class MappingsComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private mappingService: MappingsService) {}

  generalSettings: any;
  projectsEnabled: boolean = false;
  costCentersEnabled: boolean = false;

  updateDimensionTables(workspaceId: number) {
    forkJoin(
      [
        this.mappingService.postAccountsPayables(workspaceId),
        this.mappingService.postBankAccounts(workspaceId),
        this.mappingService.postExpenseAccounts(workspaceId),
        this.mappingService.postCreditCardAccounts(workspaceId),
        this.mappingService.postQBOEmployees(workspaceId),
        this.mappingService.postQBOVendors(workspaceId),
        this.mappingService.postQBOCustomers(workspaceId),
        this.mappingService.postQBOClasses(workspaceId),
        this.mappingService.postQBODepartments(workspaceId),
        this.mappingService.postFyleEmployees(workspaceId),
        this.mappingService.postFyleCategories(workspaceId),
        this.mappingService.postFyleCostCenters(workspaceId),
        this.mappingService.postFyleProjects(workspaceId)
      ]
    ).subscribe();
  }

  ngOnInit() {
    this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
    if (this.generalSettings.project_field_mapping) {
      this.projectsEnabled = true;
    }

    this.updateDimensionTables(this.generalSettings.workspace);

    if (this.generalSettings.cost_center_field_mapping) {
      this.costCentersEnabled = true;
    }
  }
}
