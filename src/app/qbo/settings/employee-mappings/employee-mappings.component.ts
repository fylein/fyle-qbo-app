import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeMappingsDialogComponent } from './employee-mappings-dialog/employee-mappings-dialog.component';
import { SettingsService } from 'src/app/core/services/settings.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { Mapping } from 'src/app/core/models/mappings.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { EmployeeMappingsResponse } from 'src/app/core/models/employee-mappings-response.model';
import { EmployeeMapping } from 'src/app/core/models/employee-mapping.model';

@Component({
  selector: 'app-employee-mappings',
  templateUrl: './employee-mappings.component.html',
  styleUrls: ['./employee-mappings.component.scss', '../settings.component.scss', '../../qbo.component.scss']
})
export class EmployeeMappingsComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  employeeMappings: EmployeeMapping[];
  employeeMappingRows: MatTableDataSource<EmployeeMapping> = new MatTableDataSource([]);
  workspaceId: number;
  isLoading = true;
  generalSettings: GeneralSetting;
  pageNumber = 0;
  count: number;
  rowElement: Mapping;
  columnsToDisplay = ['employee_email', 'qbo'];

  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private mappingsService: MappingsService,
              private router: Router,
              private snackBar: MatSnackBar,
              private settingsService: SettingsService,
              private storageService: StorageService) { }

  open(selectedItem: EmployeeMapping = null) {
    const that = this;
    const dialogRef = that.dialog.open(EmployeeMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId,
        employeeMappingRow: selectedItem
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      that.isLoading = true;
      const data = {
        pageSize: that.storageService.get('mappings.pageSize') || 50,
        pageNumber: 0
      };
      that.reset(data);
    });
  }

  triggerAutoMapEmployees() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.triggerAutoMapEmployees().subscribe(() => {
      that.isLoading = false;
      that.snackBar.open('Auto mapping of employees may take few minutes');
    }, error => {
      that.isLoading = false;
      that.snackBar.open(error.error.message);
    });
  }

  applyFilter(event: Event) {
    const that = this;
    const filterValue = (event.target as HTMLInputElement).value;
    that.employeeMappingRows.filter = filterValue.trim().toLowerCase();
  }

  createEmployeeMappingsRows() {
    const that = this;
    that.employeeMappings = that.employeeMappings.filter((employeeMapping: EmployeeMapping) => {
      if (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.corporate_credit_card_expenses_object !== 'BILL') {
        return employeeMapping.destination_employee || employeeMapping.destination_vendor || employeeMapping.destination_card_account;
      } else if (that.generalSettings.employee_field_mapping === 'EMPLOYEE') {
        return employeeMapping.destination_employee;
      } else {
        return employeeMapping.destination_vendor;
      }
    });

    that.count = that.employeeMappings.length;
    that.employeeMappingRows = new MatTableDataSource(that.employeeMappings);
    that.employeeMappingRows.filterPredicate = that.searchByText;
  }

  reset(data) {
    const that = this;
    that.isLoading = true;

    that.mappingsService.getEmployeeMappings(null, data.pageSize, data.pageNumber * data.pageSize).subscribe((employeeMappingResponse: EmployeeMappingsResponse) => {
      that.employeeMappings = employeeMappingResponse.results;
      that.pageNumber = data.pageNumber;
      that.createEmployeeMappingsRows();
      that.isLoading = false;
    });
  }

  searchByText(data: EmployeeMapping, filterText: string) {
    return data.source_employee.value.toLowerCase().includes(filterText) ||
    (data.destination_employee ? data.destination_employee.value.toLowerCase().includes(filterText) : false) ||
    (data.destination_vendor ? data.destination_vendor.value.toLowerCase().includes(filterText) : false) ||
    (data.destination_card_account ? data.destination_card_account.value.toLowerCase().includes(filterText) : false);
  }

  mappingsCheck() {
    const that = this;
    that.mappingsService.getGeneralMappings().subscribe(() => {
      // Do nothing
    }, () => {
      that.snackBar.open('You cannot access this page yet. Please follow the onboarding steps in the dashboard or refresh your page');
      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
    });
  }

  ngOnInit() {
    const that = this;
    that.isLoading = true;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.settingsService.getCombinedSettings(that.workspaceId).subscribe(settings => {
      that.mappingsCheck();
      that.generalSettings = settings;
      that.isLoading = false;
      if (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.corporate_credit_card_expenses_object !== 'BILL') {
        that.columnsToDisplay.push('ccc');
      }
      const data = {
        pageSize: that.storageService.get('mappings.pageSize') || 50,
        pageNumber: 0
      };
      that.reset(data);
    }, () => {
      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
    });
  }
}
