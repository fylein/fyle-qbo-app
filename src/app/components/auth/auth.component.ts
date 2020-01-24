import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  authPage = 'login'

  constructor(private location: Location) {
    let path = this.location.path().split('?')[0]

    if (path === '/callback') {
      this.authPage = 'callback';
    } else if (path === '/login') {
      this.authPage = 'login'
    }
  }

  ngOnInit() {
  }

}
