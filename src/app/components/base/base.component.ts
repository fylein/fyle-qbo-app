import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  constructor(private router: Router) { }

  fullName: string = 'Example Name';
  workspaceName: string = 'Example Workspace Name';
  workspace_id: number = 1;
  
  ngOnInit() {
    this.router.navigate(['/workspaces/' + this.workspace_id + '/tasks']);
  }

}
