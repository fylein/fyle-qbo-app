import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const baseModuleRoutes: Routes = [
  {
    path: '',
    redirectTo: '/workspaces',
    pathMatch: 'full'
  },
  {
    path: 'workspaces',
    loadChildren: () => import('./qbo/qbo.module').then(m => m.QboModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: 'workspaces',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      baseModuleRoutes,
      { enableTracing: true }
    )
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
