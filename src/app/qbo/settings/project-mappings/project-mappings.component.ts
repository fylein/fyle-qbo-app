import { Component, OnInit } from '@angular/core';
import { MappingsService } from '../../../core/services/mappings.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProjectMappingsDialogComponent } from './project-mappings-dialog/project-mappings-dialog.component';

@Component({
  selector: 'app-project-mappings',
  templateUrl: './project-mappings.component.html',
  styleUrls: ['./project-mappings.component.scss', '../../qbo.component.scss']
})
export class ProjectMappingsComponent implements OnInit {
  isLoading = false;
  workspaceId: number;
  projectMappings: any[];
  generalSettings: any;
  columnsToDisplay = ['projects', 'qbo'];

  constructor(private mappingsService: MappingsService, private route: ActivatedRoute, public dialog: MatDialog) { }

  open() {
    const that = this;
    const dialogRef = that.dialog.open(ProjectMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      that.getCategoryMappings();
    });
  }


  getCategoryMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getMappings(that.workspaceId, 'PROJECT').subscribe(projectMappings => {
      that.projectMappings = projectMappings.results;
      that.isLoading = false;
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
    that.getCategoryMappings();
  }

}
