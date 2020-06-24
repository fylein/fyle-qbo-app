import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeMappingsDialogComponent } from './employee-mappings-dialog/employee-mappings-dialog.component';

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
              private mappingsService: MappingsService) {
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
        that.createEmployeeMappingsRows();
        that.isLoading = false;
      });
    });
  }

  createEmployeeMappingsRows() {
    const employeeEVMappings = this.employeeMappings.filter(mapping => mapping.destination_type !== 'CREDIT_CARD_ACCOUNT');
    const mappings = [];

    employeeEVMappings.forEach(employeeEVMapping => {
      mappings.push({
        fyle_value: employeeEVMapping.source.value,
        qbo_value: employeeEVMapping.destination.value,
        ccc_account: this.employeeMappings
          .filter(evMapping => evMapping.destination_type === 'CREDIT_CARD_ACCOUNT'
            && evMapping.source.value === employeeEVMapping.source.value)[0].destination.value
      });
    });
    this.employeeMappings = mappings;
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;

    that.isLoading = true;
    that.mappingsService.getMappings(that.workspaceId, 'EMPLOYEE').subscribe((employees) => {
      that.employeeMappings = employees.results;
      that.createEmployeeMappingsRows();
      that.isLoading = false;
    });

    that.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
    if (that.generalSettings.corporate_credit_card_expenses_object) {
      that.columnsToDisplay.push('ccc');
    }
  }
}
