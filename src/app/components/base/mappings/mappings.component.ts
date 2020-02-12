import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.css', '../base.component.css'],
})
export class MappingsComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let workspaceId = +params['workspace_id'];
      console.log(workspaceId)
      this.router.navigateByUrl(`workspaces/${workspaceId}/mappings/general`)
    });
  }
}
