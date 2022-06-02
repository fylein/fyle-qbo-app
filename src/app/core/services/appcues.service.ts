import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppcuesService {

  constructor() { }

  get appcues() {
    return (window as any).Appcues;
  }

  initialiseAppcues(): void {
    // TODO: inititialise appcues only when workspace has completed onboarding
    // this.appcues.identify('ashwin1111', {
    //   email: 'ashwin@ashwin.ashwin',
    //   name: 'Ashwin',
    //   account: {
    //     workspace_id: 234234,
    //     workspace_name: 'Ashwin Org'
    //   },
    //   source: 'Fyle Quickbooks Integration'
    // });
  }
}
