import { Component, OnInit } from '@angular/core';
import { MappingsService } from '../../../core/services/mappings.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CostCenterMappingsDialogComponent } from './cost-center-mappings-dialog/cost-center-mappings-dialog.component';

@Component({
  selector: 'app-cost-center-mappings',
  templateUrl: './cost-center-mappings.component.html',
  styleUrls: ['./cost-center-mappings.component.scss', '../../qbo.component.scss']
})
export class CostCenterMappingsComponent implements OnInit {
  isLoading = false;
  workspaceId: number;
  costCenterMappings: any[];
  generalSettings: any;
  columnsToDisplay = ['costCenter', 'qbo'];

  constructor(private mappingsService: MappingsService, private route: ActivatedRoute, public dialog: MatDialog) { }

  open(content) {
    let that= this;
    const dialogRef = that.dialog.open(CostCenterMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      that.getCostCenterMappings();
    });
  }


  getCostCenterMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getMappings(this.workspaceId, 'COST_CENTER').subscribe(costCenterMappings => {
      that.costCenterMappings = costCenterMappings.results;
      that.isLoading = false;
    });
  } 

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.parent.snapshot.params.workspace_id;
    that.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
    that.getCostCenterMappings();
  }

}
