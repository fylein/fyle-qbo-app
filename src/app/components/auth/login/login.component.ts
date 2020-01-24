import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor() {}

  login() {
    window.location.href =
      'https://staging.fyle.in/app/main/#/oauth/authorize?' +
      'client_id=tpaYfU7VLyrEN&redirect_uri=http://localhost:4200/callback&response_type=code';
  }

  ngOnInit() {}
}
