import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, ActivationEnd } from '@angular/router';
import { ExpenseGroupsService } from '../../core/services/expense-groups.service';
import { ChecksService } from '../checks/checks.service';
import { JournalEntriesService } from '../journal-entries/journal-entries.service';
import { CreditCardPurchasesService } from '../credit-card-purchases/credit-card-purchases.service';
import { BillsService } from 'src/app/core/services/bills.service';
import { ExpenseGroup } from 'src/app/core/models/expenseGroups.model';
import { MatTableDataSource } from '@angular/material/table';

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
  generalSettings: any;
  pageNumber = 0;
  pageSize = 5;
  columnsToDisplay = ['description', 'employee', 'claimno', 'expensetype'];

  constructor(private route: ActivatedRoute, private expenseGroupService: ExpenseGroupsService, private router: Router, private billsService: BillsService, private checksService: ChecksService, private JournalEntriesService: JournalEntriesService, private CreditCardPurchasesService: CreditCardPurchasesService) { }

  syncExpenseGroups() {
    this.expenseGroupService.syncExpenseGroups(this.workspaceId).subscribe(task => {
      this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
    });
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

    that.getPaginatedExpenseGroups();
    that.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));

    that.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        const pageNumber = +event.snapshot.queryParams.page_number || 0;
        const pageSize = +event.snapshot.queryParams.page_size || 5;
        const state = event.snapshot.queryParams.state || 'FAILED';

        if (that.pageNumber !== pageNumber || that.pageSize !== pageSize || that.state !== state) {
          that.pageNumber = pageNumber;
          that.pageSize = pageSize;
          that.state = state;
          that.getPaginatedExpenseGroups();
        }
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
