import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseGroupsService } from './expense-groups.service';

@Component({
  selector: 'app-expense-groups',
  templateUrl: './expense-groups.component.html',
  styleUrls: ['./expense-groups.component.css', '../base.component.css'],
})
export class ExpenseGroupsComponent implements OnInit {
  workspaceId: number;
  expenseGroups: {any};

  constructor(private route: ActivatedRoute, private expenseGroupService: ExpenseGroupsService) {}

  syncExpenseGroups() {
    this.expenseGroupService.syncExpenseGroups(this.workspaceId).subscribe(task => {
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.expenseGroupService.getExpenseGroups(this.workspaceId).subscribe(expenseGroups => {
        this.expenseGroups = expenseGroups;
      });
    });
  }
}
