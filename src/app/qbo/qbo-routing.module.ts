import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QboComponent } from './qbo.component';
import { AuthGuard } from '../core/guard/auth.guard';
import { TasksComponent } from './tasks/tasks.component';
import { WorkspacesGuard } from '../core/guard/workspaces.guard';
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
import { InfoComponent } from './expense-groups/view-expense-group/info/info.component';
import { GroupMappingErrorComponent } from './expense-groups/view-expense-group/group-mapping-error/group-mapping-error.component';
import { SyncExportComponent } from './sync-export/sync-export.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SyncComponent } from './sync-export/sync/sync.component';
import { ExportComponent } from './sync-export/export/export.component';
import { ConfigurationComponent } from './settings/configuration/configuration.component';
import { GeneralMappingsComponent } from './settings/general-mappings/general-mappings.component';
import { EmployeeMappingsComponent } from './settings/employee-mappings/employee-mappings.component';
import { CategoryMappingsComponent } from './settings/category-mappings/category-mappings.component';
import { ProjectMappingsComponent } from './settings/project-mappings/project-mappings.component';
import { ScheduleComponent } from './settings/schedule/schedule.component';
import { CostCenterMappingsComponent } from './settings/cost-center-mappings/cost-center-mappings.component';

const routes: Routes = [{
  path: '',
  component: QboComponent,
  canActivate: [AuthGuard],
  children: [
    { path: ':workspace_id/tasks', component: TasksComponent, canActivate: [WorkspacesGuard] },
    { path: ':workspace_id/tasks/:task_id/errors', component: MappingErrorsComponent },
    {
      path: ':workspace_id/expense_groups',
      component: ExpenseGroupsComponent,
      canActivate: [WorkspacesGuard]
    },
    {
      path: ':workspace_id/dashboard', 
      component: DashboardComponent,
      canActivate: [WorkspacesGuard]
    },
    {
      path: ':workspace_id/sync_export', 
      component: SyncExportComponent,
      canActivate: [WorkspacesGuard],
      children: [
        {
          path: 'sync',
          component: SyncComponent
        },
        {
          path: 'export',
          component: ExportComponent
        }
      ]
    },
    { 
      path: ':workspace_id/expense_groups/:expense_group_id/view', 
      component: ViewExpenseGroupComponent, 
      canActivate: [WorkspacesGuard],
      children: [
        {
          path: 'info',
          component: InfoComponent
        },
        {
          path: 'mapping_errors',
          component: GroupMappingErrorComponent
        },
        {
          path: '**',
          redirectTo: 'info'
        }
      ]
    },
    { path: ':workspace_id/bills', component: BillsComponent, canActivate: [WorkspacesGuard] },
    { path: ':workspace_id/checks', component: ChecksComponent, canActivate: [WorkspacesGuard] },
    { path: ':workspace_id/journal_entries', component: JournalEntriesComponent, canActivate: [WorkspacesGuard] },
    { path: ':workspace_id/credit_card_purchases', component: CreditCardPurchasesComponent, canActivate: [WorkspacesGuard] },
    {
      path: ':workspace_id/mappings',
      component: MappingsComponent,
      canActivate: [WorkspacesGuard],
      children: [
        { path: 'general', component: GeneralComponent },
        { path: 'categories', component: CategoryComponent },
        { path: 'employees', component: EmployeeComponent },
        { path: 'projects', component: ProjectComponent },
        { path: 'cost_centers', component: CostCenterComponent },
      ]
    },
    {
      path: ':workspace_id/settings',
      component: SettingsComponent,
      children: [
        {
          path: 'configurations',
          component: ConfigurationComponent
        },
        {
          path: 'general_mappings',
          component: GeneralMappingsComponent
        },
        {
          path: 'employee_mappings',
          component: EmployeeMappingsComponent
        },
        {
          path: 'category_mappings',
          component: CategoryMappingsComponent
        },
        {
          path: 'project_mappings',
          component: ProjectMappingsComponent
        },
        {
          path: 'cost_center_mappings',
          component: CostCenterMappingsComponent
        },
        {
          path: 'schedule',
          component: ScheduleComponent
        }
      ]
    },
    { path: 'fyle/callback', component: FyleCallbackComponent },
    { path: 'qbo/callback', component: QBOCallbackComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboRoutingModule { }
