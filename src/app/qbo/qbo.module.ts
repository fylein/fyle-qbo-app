import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboRoutingModule } from './qbo-routing.module';
import { QboComponent } from './qbo.component';

import { ExpenseGroupsComponent } from './expense-groups/expense-groups.component';
import { ViewExpenseGroupComponent } from './expense-groups/view-expense-group/view-expense-group.component';
import { SettingsComponent } from './settings/settings.component';
import { FyleCallbackComponent } from './settings/fyle-callback/fyle-callback.component';
import { QBOCallbackComponent } from './settings/qbo-callback/qbo-callback.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InfoComponent } from './expense-groups/view-expense-group/info/info.component';
import { GroupMappingErrorComponent } from './expense-groups/view-expense-group/group-mapping-error/group-mapping-error.component';
import { SyncExportComponent } from './sync-export/sync-export.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SyncComponent } from './sync-export/sync/sync.component';
import { ExportComponent } from './sync-export/export/export.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfigurationComponent } from './settings/configuration/configuration.component';
import { MatSelectModule } from '@angular/material/select';
import { GeneralMappingsComponent } from './settings/general-mappings/general-mappings.component';
import { EmployeeMappingsComponent } from './settings/employee-mappings/employee-mappings.component';
import { ScheduleComponent } from './settings/schedule/schedule.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EmployeeMappingsDialogComponent } from './settings/employee-mappings/employee-mappings-dialog/employee-mappings-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { GeneralConfigurationComponent } from './settings/configuration/general-configuration/general-configuration.component';
import { ExpenseFieldConfigurationComponent } from './settings/configuration/expense-field-configuration/expense-field-configuration.component';
import { GenericMappingsComponent } from './settings/generic-mappings/generic-mappings.component';
import { GenericMappingsDialogComponent } from './settings/generic-mappings/generic-mappings-dialog/generic-mappings-dialog.component';
import { PaginatorComponent } from './settings/paginator/paginator.component';
import { ExpenseGroupSettingsDialogComponent } from './sync-export/sync/expense-group-settings-dialog/expense-group-settings-dialog.component';
import { MatTooltipModule } from '@angular/material';
import { GroupQuickbooksErrorComponent } from './expense-groups/view-expense-group/group-quickbooks-error/group-quickbooks-error.component';
import { GeneralConfigurationDialogComponent } from './settings/configuration/general-configuration/general-configuration-dialog/general-configuration-dialog.component';
import { MemoStructureComponent } from './settings/configuration/memo-structure/memo-structure.component';
import { CdkDrag, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    QboComponent,
    ExpenseGroupsComponent,
    ViewExpenseGroupComponent,
    SettingsComponent,
    FyleCallbackComponent,
    QBOCallbackComponent,
    InfoComponent,
    GroupMappingErrorComponent,
    SyncExportComponent,
    DashboardComponent,
    SyncComponent,
    ExportComponent,
    ConfigurationComponent,
    GeneralMappingsComponent,
    EmployeeMappingsComponent,
    ScheduleComponent,
    EmployeeMappingsDialogComponent,
    GeneralConfigurationDialogComponent,
    GeneralConfigurationComponent,
    ExpenseFieldConfigurationComponent,
    GenericMappingsComponent,
    GenericMappingsDialogComponent,
    ExpenseGroupSettingsDialogComponent,
    PaginatorComponent,
    GroupQuickbooksErrorComponent,
    MemoStructureComponent
  ],
  entryComponents: [
    EmployeeMappingsDialogComponent,
    GeneralConfigurationDialogComponent,
    GenericMappingsDialogComponent,
    ExpenseGroupSettingsDialogComponent
  ],
  imports: [
    CommonModule,
    QboRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    Ng2FlatpickrModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatProgressBarModule,
    MatTooltipModule,
    DragDropModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: true }
    }
  ]
})
export class QboModule { }
