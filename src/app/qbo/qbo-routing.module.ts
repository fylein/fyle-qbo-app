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
    { path: ':workspace_id/expense_groups/:expense_group_id/view', component: ViewExpenseGroupComponent, canActivate: [WorkspacesGuard] },
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
    { path: ':workspace_id/settings', component: SettingsComponent },
    { path: 'fyle/callback', component: FyleCallbackComponent },
    { path: 'qbo/callback', component: QBOCallbackComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboRoutingModule { }
