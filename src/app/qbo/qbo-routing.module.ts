import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QboComponent } from './qbo.component';
import { AuthGuard } from '../core/guard/auth.guard';
import { WorkspacesGuard } from '../core/guard/workspaces.guard';
import { ExpenseGroupsComponent } from './expense-groups/expense-groups.component';
import { ViewExpenseGroupComponent } from './expense-groups/view-expense-group/view-expense-group.component';
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
import { ScheduleComponent } from './settings/schedule/schedule.component';
import { GeneralConfigurationComponent } from './settings/configuration/general-configuration/general-configuration.component';
import { ExpenseFieldConfigurationComponent } from './settings/configuration/expense-field-configuration/expense-field-configuration.component';
import { GenericMappingsComponent } from './settings/generic-mappings/generic-mappings.component';
import { GroupQuickbooksErrorComponent } from './expense-groups/view-expense-group/group-quickbooks-error/group-quickbooks-error.component';
import { MemoStructureComponent } from './settings/configuration/memo-structure/memo-structure.component';

const routes: Routes = [{
  path: '',
  component: QboComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: ':workspace_id/expense_groups',
      component: ExpenseGroupsComponent,
      canActivate: [WorkspacesGuard]
    },
    {
      path: ':workspace_id/dashboard',
      component: DashboardComponent
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
          path: 'quickbooks_errors',
          component: GroupQuickbooksErrorComponent
        },
        {
          path: '**',
          redirectTo: 'info'
        }
      ]
    },
    {
      path: ':workspace_id/settings',
      component: SettingsComponent,
      children: [
        {
          path: 'configurations',
          component: ConfigurationComponent,
          children: [
            {
              path: 'general',
              component: GeneralConfigurationComponent
            },
            {
              path: 'expense_fields',
              component: ExpenseFieldConfigurationComponent
            },
            {
              path: 'memo_structure',
              component: MemoStructureComponent
            }
          ]
        },
        {
          path: 'general_mappings',
          component: GeneralMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'employee_mappings',
          component: EmployeeMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: ':source_field/mappings',
          component: GenericMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'schedule',
          component: ScheduleComponent,
          canActivate: [WorkspacesGuard]
        }
      ]
    },
    {
      path: 'fyle/callback',
      component: FyleCallbackComponent
    },
    {
      path: 'qbo/callback',
      component: QBOCallbackComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboRoutingModule { }
