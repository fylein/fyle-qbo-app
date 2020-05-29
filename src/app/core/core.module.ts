import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralService } from './services/general.service';
import { WorkspaceService } from './services/workspace.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    GeneralService,
    WorkspaceService
  ]
})
export class CoreModule { }
