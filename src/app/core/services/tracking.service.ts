import { Injectable } from '@angular/core';
import { EmployeeMapping } from '../models/employee-mapping.model';
import { GeneralMapping } from '../models/general-mapping.model';
import { GeneralSetting } from '../models/general-setting.model';
import { Mapping } from '../models/mappings.model';

@Injectable({
  providedIn: 'root'
})

export class TrackingService {
  identityEmail = null;

  constructor() { }

  get tracking() {
    return (window as any).analytics;
  }

  eventTrack(action: string, properties= {}) {
    properties = {
      ...properties,
      Asset: 'QBO Web'
    };
    if (this.tracking) {
      this.tracking.track(action, properties);
    }
  }

  onSignIn(email: string, workspaceId: number, properties) {
    if (this.tracking) {
      this.tracking.identify(email, {
        workspaceId,
      });
      this.identityEmail = email;
    }
    this.eventTrack('Sign In', properties);
  }

  onSignUp(email: string, workspaceId: number, properties: {orgName: string, orgId: string}) {
    if (this.tracking) {
      this.tracking.identify(email, {
        workspaceId,
      });
      this.identityEmail = email;
    }
    this.eventTrack('Sign Up', properties);
  }

  onQBOConnect() {
    this.eventTrack('QBO Account connected');
  }

  onPageVisit(page: string, onboarding: boolean= false) {
    let event = `Visited ${page} Page`;
    event = onboarding ? `Onboarding: ${event}` : event;
    this.eventTrack(event);
  }

  onSignOut() {
    this.eventTrack('Sign Out');
  }

  onSwitchWorkspace() {
    this.eventTrack('Switching Workspace');
  }

  onImportingChartOfAccounts(typesOfAccounts) {
    this.eventTrack('Importing Chart Of Accounts', typesOfAccounts);
  }

  onSaveConfigurations(configurations: GeneralSetting) {
    this.eventTrack('Configurations update/create', configurations);
  }

  onSaveGeneralMappings(generalMappings: GeneralMapping) {
    this.eventTrack('General Mappings update/create', generalMappings);
  }

  onSaveEmployeeMappings(employeeMapping: EmployeeMapping) {
    this.eventTrack('Employee Mappings create', employeeMapping);
  }

  onSaveCategoryMappings(mapping: Mapping) {
    this.eventTrack('Category Mappings create', mapping);
  }

  onModifyDescription(selectedFields) {
    this.eventTrack('Modifying Description', selectedFields);
  }
}
