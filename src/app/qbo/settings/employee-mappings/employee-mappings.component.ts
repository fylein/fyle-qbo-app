import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeMappingsDialogComponent } from './employee-mappings-dialog/employee-mappings-dialog.component';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-employee-mappings',
  templateUrl: './employee-mappings.component.html',
  styleUrls: ['./employee-mappings.component.scss', '../../qbo.component.scss']
})
export class EmployeeMappingsComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  employeeMappings: any[];
  workspaceId: number;
  isLoading = true;
  generalSettings: any;
  filteredAccounts: any[];
  columnsToDisplay = ['employee_email', 'qbo'];

  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private mappingsService: MappingsService,
              private router: Router,
              private settingsService: SettingsService) {
  }

  open() {
    const that = this;
    const dialogRef = that.dialog.open(EmployeeMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      that.isLoading = true;
      that.mappingsService.getMappings(that.workspaceId, 'EMPLOYEE').subscribe((employees) => {
        that.employeeMappings = employees.results;
        that.isLoading = false;
        const onboarded = localStorage.getItem('onboarded');

        if (onboarded === 'true') {
          that.createEmployeeMappingsRows();
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
      });
    });
  }

  createEmployeeMappingsRows() {
    const that = this;
    const employeeEVMappings = that.employeeMappings.filter(mapping => mapping.destination_type !== 'CREDIT_CARD_ACCOUNT');
    const mappings = [];

    employeeEVMappings.forEach(employeeEVMapping => {
      mappings.push({
        fyle_value: employeeEVMapping.source.value,
        qbo_value: employeeEVMapping.destination.value,
        ccc_account: that.getCCCAccount(that.employeeMappings, employeeEVMapping)
      });
    });
    that.employeeMappings = mappings;
  }

  getCCCAccount(employeeMappings, employeeEVMapping) {
    var empMapping = employeeMappings.filter(evMapping => evMapping.destination_type === 'CREDIT_CARD_ACCOUNT' && evMapping.source.value === employeeEVMapping.source.value);

    return empMapping.length ? empMapping[0].destination.value : null;
  }

  reset() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getMappings(that.workspaceId, 'EMPLOYEE').subscribe((employees) => {
      that.employeeMappings = employees.results;
      that.createEmployeeMappingsRows();
      that.isLoading = false;
    });

    if (that.generalSettings.corporate_credit_card_expenses_object) {
      that.columnsToDisplay.push('ccc');
    }
  }

  ngOnInit() {
    const that = this;
    that.isLoading = true;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.settingsService.getCombinedSettings(that.workspaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }
}