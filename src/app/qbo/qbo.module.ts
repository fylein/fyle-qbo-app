import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QboRoutingModule } from './qbo-routing.module';
import { QboComponent } from './qbo.component';

import { TasksComponent } from './tasks/tasks.component';
import { MappingErrorsComponent } from './tasks/mapping-errors/mapping-errors.component';
import { ExpenseGroupsComponent } from './expense-groups/expense-groups.component';
import { ViewExpenseGroupComponent } from './expense-groups/view-expense-group/view-expense-group.component';
import { BillsComponent } from './bills/bills.component';
import { ChecksComponent } from './checks/checks.component';
import { JournalEntriesComponent } from './journal-entries/journal-entries.component';
import { CreditCardPurchasesComponent } from './credit-card-purchases/credit-card-purchases.component';
import { MappingsComponent } from './mappings/mappings.component';
import { GeneralComponent } from './mappings/general/general.component';
import { CategoryComponent } from './mappings/category/category.component';
import { EmployeeComponent } from './mappings/employee/employee.component';
import { ProjectComponent } from './mappings/project/project.component';
import { CostCenterComponent } from './mappings/cost-center/cost-center.component';
import { SettingsComponent } from './settings/settings.component';
import { FyleCallbackComponent } from './settings/fyle-callback/fyle-callback.component';
import { QBOCallbackComponent } from './settings/qbo-callback/qbo-callback.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    QboComponent,
    TasksComponent,
    MappingErrorsComponent,
    ExpenseGroupsComponent,
    ViewExpenseGroupComponent,
    BillsComponent,
    ChecksComponent,
    JournalEntriesComponent,
    CreditCardPurchasesComponent,
    MappingsComponent,
    GeneralComponent,
    CategoryComponent,
    EmployeeComponent,
    ProjectComponent,
    CostCenterComponent,
    SettingsComponent,
    FyleCallbackComponent,
    QBOCallbackComponent
  ],
  entryComponents: [
    EmployeeComponent
  ],
  imports: [
    CommonModule,
    QboRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class QboModule { }
