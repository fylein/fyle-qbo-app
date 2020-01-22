import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasksComponent } from './components/base/tasks/tasks.component';
import {  ExpenseGroupsComponent } from './components/base/expense-groups/expense-groups.component'
import {  BillsComponent } from './components/base/bills/bills.component'
import {  MappingsComponent } from './components/base/mappings/mappings.component'
import {  SettingsComponent } from './components/base/settings/settings.component'


const routes: Routes = [
  { path: 'workspaces/:workspace_id/tasks', component: TasksComponent },
  { path: 'workspaces/:workspace_id/expense_groups', component: ExpenseGroupsComponent },
  { path: 'workspaces/:workspace_id/bills', component: BillsComponent },
  { path: 'workspaces/:workspace_id/mappings', component: MappingsComponent },
  { path: 'workspaces/:workspace_id/settings', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
