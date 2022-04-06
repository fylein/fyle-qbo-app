import { Component, OnInit } from '@angular/core';
import { MappingsService } from '../../../core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/core/services/storage.service';
import { GenericMappingsDialogComponent } from './generic-mappings-dialog/generic-mappings-dialog.component';
import { SettingsService } from 'src/app/core/services/settings.service';
import { Mapping } from 'src/app/core/models/mappings.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { MappingRow } from 'src/app/core/models/mapping-row.model';
import { MatTableDataSource } from '@angular/material';
import { TrackingService } from 'src/app/core/services/tracking.service';

@Component({
  selector: 'app-generic-mappings',
  templateUrl: './generic-mappings.component.html',
  styleUrls: ['./generic-mappings.component.scss', '../settings.component.scss', '../../qbo.component.scss']
})
export class GenericMappingsComponent implements OnInit {
  workspaceId: number;
  sourceField: string;
  isLoading: boolean;
  mappings: MatTableDataSource<Mapping> = new MatTableDataSource([]);
  generalSettings: GeneralSetting;
  setting: MappingSetting;
  count: number;
  pageNumber = 0;
  rowElement: Mapping;
  docLink: string;
  columnsToDisplay = ['sourceField', 'destinationField'];

  constructor(
    private mappingsService: MappingsService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private storageService: StorageService,
    private settingsService: SettingsService,
    private trackingService: TrackingService
  ) { }

  open(selectedItem: MappingRow = null) {
    const that = this;
    const dialogRef = that.dialog.open(GenericMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId,
        setting: that.setting,
        rowElement: selectedItem
      }
    });

    dialogRef.afterClosed().subscribe((mapping: Mapping | null) => {
      const data = {
        pageSize: that.storageService.get('mappings.pageSize') || 50,
        pageNumber: 0
      };
      that.getMappings(data);
      const onboarded = that.storageService.get('onboarded');

      if (onboarded === false) {
        if (mapping && that.sourceField === 'category') {
          // tracking for 1st category mapping
          this.trackingService.onSaveCategoryMappings(mapping);
        }
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      }
    });
  }

  applyFilter(event: Event) {
    const that = this;
    const filterValue = (event.target as HTMLInputElement).value;
    that.mappings.filter = filterValue.trim().toLowerCase();
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  getMappings(data) {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getMappings(that.setting.source_field, that.setting.destination_field, null, data.pageSize, data.pageSize * data.pageNumber).subscribe(mappings => {
      that.mappings = new MatTableDataSource(mappings.results);
      that.count = mappings.count;
      that.pageNumber = data.pageNumber;
      that.mappings.filterPredicate = that.searchByText;
      that.isLoading = false;
    });
  }

  goToConfigurations() {
    this.router.navigate([`/workspaces/${this.workspaceId}/settings/configurations/`]);
  }

  searchByText(data: Mapping, filterText: string) {
    return data.source.value.toLowerCase().includes(filterText) ||
    data.destination.value.toLowerCase().includes(filterText);
  }

  ngOnInit() {
    const that = this;
    that.route.params.subscribe(val => {
      that.isLoading = true;
      that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
      that.sourceField = that.route.snapshot.params.source_field;
      that.docLink = 'https://www.fylehq.com/help/en/articles/4284108-configuring-mappings-for-the-fyle-quickbooks-online-integration';

      if (that.sourceField === 'corporate_card') {
        that.docLink = 'https://help.fylehq.com/en/articles/5944870-mapping-corporate-credit-cards-in-fyle-to-credit-card-accounts-in-quickbooks-online';
      }
      if (that.sourceField === 'tax_group') {
        that.docLink = 'https://www.fylehq.com/help/en/articles/5671079-importing-tax-codes-and-groups-from-quickbooks-online-to-fyle';
      }
      that.settingsService.getMappingSettings(that.workspaceId).subscribe(response => {
        that.setting = response.results.filter(setting => setting.source_field === that.sourceField.toUpperCase())[0];
        const data = {
          pageSize: that.storageService.get('mappings.pageSize') || 50,
          pageNumber: 0
        };
        that.getMappings(data);
      });
    });

  }

}
