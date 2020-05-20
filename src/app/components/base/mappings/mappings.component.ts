import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.css', '../base.component.css'],
})
export class MappingsComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  generalSettings: any;
  projectsEnabled: boolean = false;
  costCentersEnabled: boolean = false;

  ngOnInit() {
    this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
    if (this.generalSettings.project_field_mapping) {
      this.projectsEnabled = true;
    }

    if (this.generalSettings.cost_center_field_mapping) {
      this.costCentersEnabled = true;
    }
  }
}
