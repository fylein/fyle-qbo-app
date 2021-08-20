import { Injectable } from '@angular/core';
import { json } from '@rxweb/reactive-form-validators';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  identityEmail = null;

  constructor(
    private authService: AuthService
  ) { }

  get tracking() {
    return (window as any).analytics;
  }

  eventTrack(action, properties) {
    properties = {
      ...properties,
      Asset: 'QBO Web'
    };
    if (this.tracking) {
      this.tracking.track(action, properties);
    }
  }

  // SignIn Event
  onSignin(email, properties) {
    if (this.tracking) {
      this.tracking.identify(email, {
      });
      this.identityEmail = email;
    }
    this.eventTrack('Sign In', properties);
  }

  connectQBO(properties) {
    this.eventTrack('Connect Quickbooks Online', properties);
  }

  mapFyleFieldsToQBOFields(properties) {
    this.eventTrack('Map Fyle Fields To QBO Fields', properties);
  }

  mapBankAccounts(properties) {
    this.eventTrack('Map Bank Accounts', properties);
  }

  mapEmployees(properties) {
    this.eventTrack('Map Employees', properties);
  }

  mapCategories(properties) {
    this.eventTrack('Map Categories', properties);
  }

  onSignOut(properties) {
    this.eventTrack('Sign Out', properties);
  }

  onSwitchWorkspace(properties) {
    this.eventTrack('Switching Workspace', properties);
  }
}
