import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppcuesService {

  constructor() { }

  initialiseAppcues(): void {
    (window as any).Appcues('identify', 'ashwin1111', {
      email: 'ashwin@ashwin.ashwin',
      name: 'Ashwin',
      account: {
        workspace_id: 234234,
        workspace_name: 'Ashwin Org'
      },
      source: 'Fyle Quickbooks Integration'
    });
  }
}
