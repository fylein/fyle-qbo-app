import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './components/base/base.component';
import { LoginComponent } from './components/auth/login/login.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { TasksComponent } from './components/base/tasks/tasks.component';
import { ExpenseGroupsComponent } from './components/base/expense-groups/expense-groups.component';
import { BillsComponent } from './components/base/bills/bills.component';
import { MappingsComponent } from './components/base/mappings/mappings.component';
import { SettingsComponent } from './components/base/settings/settings.component';
import { CallbackComponent } from './components/auth/callback/callback.component';
import { AuthComponent } from './components/auth/auth.component';
import { JwtInterceptor } from './components/auth/jwt.interceptor';
import { LoaderComponent } from './components/general/loader/loader.component';
import { QBOCallbackComponent } from './components/base/settings/qbo-callback/qbo-callback.component';
import { FyleCallbackComponent } from './components/base/settings/fyle-callback/fyle-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    LoginComponent,
    LogoutComponent,
    TasksComponent,
    ExpenseGroupsComponent,
    BillsComponent,
    MappingsComponent,
    SettingsComponent,
    CallbackComponent,
    AuthComponent,
    LoaderComponent,
    QBOCallbackComponent,
    FyleCallbackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
