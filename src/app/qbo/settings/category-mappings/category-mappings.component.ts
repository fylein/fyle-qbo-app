import { Component, OnInit } from '@angular/core';
import { MappingsService } from '../../../core/services/mappings.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CategoryMappingsDialogComponent } from './category-mappings-dialog/category-mappings-dialog.component';

@Component({
  selector: 'app-category-mappings',
  templateUrl: './category-mappings.component.html',
  styleUrls: ['./category-mappings.component.scss', '../../qbo.component.scss']
})
export class CategoryMappingsComponent implements OnInit {
  isLoading = false;
  workspaceId: number;
  categoryMappings: any[];
  columnsToDisplay = ['category', 'qbo'];

  constructor(private mappingsService: MappingsService, private route: ActivatedRoute, public dialog: MatDialog) { }

  open() {
    const that = this;
    const dialogRef = that.dialog.open(CategoryMappingsDialogComponent, {
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
    that.mappingsService.getMappings(this.workspaceId, 'CATEGORY').subscribe(categoryMappings => {
      that.categoryMappings = categoryMappings.results;
      that.isLoading = false;
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.parent.snapshot.params.workspace_id;
    that.getCategoryMappings();
  }

}
