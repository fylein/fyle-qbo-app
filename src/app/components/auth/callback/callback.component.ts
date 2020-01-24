import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit, AfterViewInit {
  authorizationCode: string;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      this.authorizationCode = params.code;
      this.authService.login(this.authorizationCode).subscribe(response => {
        this.authService.setUser(response);
        this.router.navigate(['']);
      })
    });
  }
}
