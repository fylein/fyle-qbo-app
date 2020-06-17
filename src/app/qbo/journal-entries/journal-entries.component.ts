import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalEntriesService } from '../journal-entries/journal-entries.service';

@Component({
  selector: 'app-journal-entries',
  templateUrl: './journal-entries.component.html',
  styleUrls: ['./journal-entries.component.scss', '../qbo.component.scss']
})
export class JournalEntriesComponent implements OnInit {
  workspaceId: number;
  journalEntries: [any];
  isLoading = true;
  nextPageLink: string;
  previousPageLink: string;
  count: number;
  limit = 20;
  offset = 0;

  constructor(private route: ActivatedRoute, private router: Router, private JournalEntriesService: JournalEntriesService) {}

  nextPage() {
    this.offset = this.offset + this.limit;
    this.isLoading = true;
    this.getPaginatedJournalEntries();
  }

  previousPage() {
    this.offset = this.offset - this.limit;
    this.isLoading = true;
    this.getPaginatedJournalEntries();
  }

  getPaginatedJournalEntries() {
    this.JournalEntriesService.getJournalEntries(this.workspaceId, this.limit, this.offset).subscribe(journalEntries => {
      this.nextPageLink = journalEntries.next;
      this.previousPageLink = journalEntries.previous;
      this.count = journalEntries.count;
      this.journalEntries = journalEntries.results;
      this.isLoading = false;
    });
  }

  goToExpenseGroup(id: number) {
    this.router.navigate([]).then(result => {
      window.open(`workspaces/${this.workspaceId}/expense_groups/${id}/view`, '_blank');
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params.workspace_id;
      this.getPaginatedJournalEntries();
    });
  }

}

