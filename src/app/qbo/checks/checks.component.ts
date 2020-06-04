import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChecksService } from '../checks/checks.service';

@Component({
  selector: 'app-checks',
  templateUrl: './checks.component.html',
  styleUrls: ['./checks.component.scss', '../qbo.component.scss']
})
export class ChecksComponent implements OnInit {
  workspaceId: number;
  checks: [any];
  isLoading = true;
  nextPageLink: string;
  previousPageLink: string;
  count: number;
  limit: number = 20;
  offset: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private checksService: ChecksService) {}

  nextPage() {
    this.offset = this.offset + this.limit;
    this.isLoading = true;
    this.getPaginatedChecks();
  }

  previousPage() {
    this.offset = this.offset - this.limit;
    this.isLoading = true;
    this.getPaginatedChecks();
  }

  getPaginatedChecks() {
    this.checksService.getChecks(this.workspaceId, this.limit, this.offset).subscribe(checks => {
      this.nextPageLink = checks.next;
      this.previousPageLink = checks.previous;
      this.count = checks.count;
      this.checks = checks.results;
      this.isLoading = false;
    });
  }

  goToExpenseGroup(id: number) {
    this.router.navigate([]).then(result => {
      window.open(`workspaces/${this.workspaceId}/expense_groups/${id}/view`, '_blank')
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.getPaginatedChecks();
    });
  }

}
