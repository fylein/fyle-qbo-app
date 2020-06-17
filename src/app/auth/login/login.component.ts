import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const CALLBACK_URI = environment.callback_uri;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      router.navigate(['/workspaces']);
    }
  }

  login() {
    this.authService.redirectToLogin();
  }

  ngOnInit() {
    console.log(FYLE_URL);
    console.log(FYLE_CLIENT_ID);
    console.log(CALLBACK_URI);
  }
}
