import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutComponent } from './components/auth/logout/logout.component';
import { BaseComponent } from './components/base/base.component';

import { TasksComponent } from './components/base/tasks/tasks.component';
import { ExpenseGroupsComponent } from './components/base/expense-groups/expense-groups.component';
import { SettingsComponent } from './components/base/settings/settings.component';
import { LoginComponent } from './components/auth/login/login.component';
import { CallbackComponent } from './components/auth/callback/callback.component';
import { AuthComponent } from './components/auth/auth.component';

import { AuthGuard } from './components/auth/auth.guard'
import { FyleCallbackComponent } from './components/base/settings/fyle-callback/fyle-callback.component';
import { ViewExpenseGroupComponent } from './components/base/expense-groups/view-expense-group/view-expense-group.component';
import { WorkspacesGuard } from './components/base/workspaces.guard';
import { MappingErrorsComponent } from './components/base/tasks/mapping-errors/mapping-errors.component';

const authRoutes: Routes = [
  {
    path: '',
    redirectTo: '/workspaces',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'callback',
        component: CallbackComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'workspaces',
    pathMatch: 'full'
  },
];

const baseModuleRoutes: Routes = [
  {
    path: 'workspaces',
    component: BaseComponent,
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
      { path: ':workspace_id/settings', component: SettingsComponent },
      { path: 'fyle/callback', component: FyleCallbackComponent },
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(baseModuleRoutes),
    RouterModule.forRoot(authRoutes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
