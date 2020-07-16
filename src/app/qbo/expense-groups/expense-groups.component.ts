import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, ActivationEnd } from '@angular/router';
import { ExpenseGroupsService } from '../../core/services/expense-groups.service';
import { ExpenseGroup } from 'src/app/core/models/expenseGroups.model';
import { MatTableDataSource } from '@angular/material/table';
import { SettingsService } from 'src/app/core/services/settings.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { environment } from 'src/environments/environment';
import { WindowReferenceService } from 'src/app/core/services/window.service';

@Component({
  selector: 'app-expense-groups',
  templateUrl: './expense-groups.component.html',
  styleUrls: ['./expense-groups.component.scss', '../qbo.component.scss'],
})
export class ExpenseGroupsComponent implements OnInit {
  workspaceId: number;
  expenseGroups: MatTableDataSource<ExpenseGroup> = new MatTableDataSource([]);
  isLoading = true;
  count: number;
  state: string;
  settings;
  pageNumber = 0;
  pageSize = 5;
  columnsToDisplay = ['description', 'employee', 'expensetype'];
  windowReference: Window;

  constructor(
    private route: ActivatedRoute,
    private taskService: TasksService,
    private expenseGroupService: ExpenseGroupsService,
    private router: Router,
    private settingsService: SettingsService,
    private windowReferenceService: WindowReferenceService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.expenseGroups.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event) {
    const that = this;

    that.isLoading = true;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        page_number: event.pageIndex,
        page_size: event.pageSize,
        state: that.state
      }
    };

    that.router.navigate([`workspaces/${that.workspaceId}/expense_groups`], navigationExtras);
  }


  changeState(state: string) {
    const that = this;
    if (that.state !== state) {
      that.isLoading = true;
      const navigationExtras: NavigationExtras = {
        queryParams: {
          page_number: 0,
          page_size: that.pageSize,
          state
        }
      };

      that.router.navigate([`workspaces/${that.workspaceId}/expense_groups`], navigationExtras);
    }
  }

  getPaginatedExpenseGroups() {
    return this.expenseGroupService.getExpenseGroups(this.workspaceId, this.pageSize, this.pageNumber * this.pageSize, this.state).subscribe(expenseGroups => {
      this.count = expenseGroups.count;
      this.expenseGroups = new MatTableDataSource(expenseGroups.results);
      this.expenseGroups.filterPredicate = this.searchByText;
      this.isLoading = false;
      return expenseGroups;
    });
  }

  goToExpenseGroup(id: number) {
    this.router.navigate([`workspaces/${this.workspaceId}/expense_groups/${id}/view`]);
  }

  reset() {
    const that = this;
    that.workspaceId = +that.route.snapshot.params.workspace_id;
    that.pageNumber = +that.route.snapshot.queryParams.page_number || 0;
    that.pageSize = +that.route.snapshot.queryParams.page_size || 5;
    that.state = that.route.snapshot.queryParams.state || 'FAILED';
    that.settingsService.getCombinedSettings(that.workspaceId).subscribe((settings) => {
      if (that.state === 'COMPLETE') {
        that.columnsToDisplay = ['description', 'employee', 'export', 'expensetype', 'openQbo'];
      } else {
        that.columnsToDisplay = ['description', 'employee', 'expensetype'];
      }

      that.settings = settings;
      that.getPaginatedExpenseGroups();
    });

    that.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        const pageNumber = +event.snapshot.queryParams.page_number || 0;
        const pageSize = +event.snapshot.queryParams.page_size || 5;
        const state = event.snapshot.queryParams.state || 'FAILED';

        if (that.pageNumber !== pageNumber || that.pageSize !== pageSize || that.state !== state) {
          if (state === 'COMPLETE') {
            that.columnsToDisplay = ['description', 'employee', 'export', 'expensetype', 'openQbo'];
          } else {
            that.columnsToDisplay = ['description', 'employee', 'expensetype'];
          }

          that.pageNumber = pageNumber;
          that.pageSize = pageSize;
          that.state = state;
          that.getPaginatedExpenseGroups();
        }
      }
    });
  }

  openInQBO(type, id) {
    this.windowReference.open(`${environment.qbo_app_url}/app/${type}?txnId=${id}`, '_blank');
  }

  openInQboHandler(clickedExpenseGroup: ExpenseGroup) {
    // tslint:disable-next-line: deprecation
    event.preventDefault();
    // tslint:disable-next-line: deprecation
    event.stopPropagation();
    const that = this;
    that.isLoading = true;
    that.taskService.getTasksByExpenseGroupId(that.workspaceId, clickedExpenseGroup.id).subscribe(tasks => {
      that.isLoading = false;
      const completeTask = tasks.filter(task => task.status === 'COMPLETE')[0];

      if (completeTask) {
        const typeMap = {
          CREATING_BILL: {
            type: 'bill',
            getId: (task) => task.detail.Bill.Id
          },
          CREATING_CHECK: {
            type: 'check',
            getId: (task) => task.detail.Purchase.Id
          },
          CREATING_JOURNAL_ENTRY: {
            type: 'journal',
            getId: (task) => task.detail.JournalEntry.Id
          },
          CREATING_CREDIT_CARD_PURCHASE: {
            type: 'expense',
            getId: (task) => task.detail.Purchase.Id
          }
        };

        that.openInQBO(typeMap[completeTask.type].type, typeMap[completeTask.type].getId(completeTask));
      }
    });
  }

  searchByText(data: ExpenseGroup, filterText: string) {
    return data.description.employee_email.includes(filterText) ||
      ('Reimbursable'.toLowerCase().includes(filterText) && data.fund_source === 'PERSONAL') ||
      ('Corporate Credit Card'.toLowerCase().includes(filterText) && data.fund_source !== 'PERSONAL') ||
      data.description.claim_number.includes(filterText);
  }

  ngOnInit() {
    this.reset();
    this.expenseGroups.filterPredicate = this.searchByText;
  }
}
