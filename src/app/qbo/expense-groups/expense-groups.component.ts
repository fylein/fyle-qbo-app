import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, ActivationEnd } from '@angular/router';
import { ExpenseGroupsService } from '../../core/services/expense-groups.service';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-expense-groups',
  templateUrl: './expense-groups.component.html',
  styleUrls: ['./expense-groups.component.scss', '../qbo.component.scss'],
})
export class ExpenseGroupsComponent implements OnInit, OnDestroy {
  workspaceId: number;
  expenseGroups: MatTableDataSource<ExpenseGroup> = new MatTableDataSource([]);
  isLoading = true;
  count: number;
  state: string;
  pageNumber = 0;
  pageSize: number;
  columnsToDisplay = ['employee', 'expensetype'];
  windowReference: Window;
  routerEventSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private expenseGroupService: ExpenseGroupsService,
    private router: Router,
    private storageService: StorageService,
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
    const that = this;

    return that.expenseGroupService.getExpenseGroups(that.pageSize, that.pageNumber * that.pageSize, that.state).subscribe(expenseGroups => {
      that.count = expenseGroups.count;
      expenseGroups.results.forEach((expenseGroup: ExpenseGroup) => {
        if (expenseGroup.response_logs) {
          const [_, __, exportType] = that.generateExportTypeAndId(expenseGroup);
          expenseGroup.export_type = exportType;
        }
      });
      that.expenseGroups = new MatTableDataSource(expenseGroups.results);
      that.expenseGroups.filterPredicate = that.searchByText;
      that.isLoading = false;
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
    let cachedPageSize = that.storageService.get('expense-groups.pageSize') || 10;
    that.pageSize = +that.route.snapshot.queryParams.page_size || cachedPageSize;
    that.state = that.route.snapshot.queryParams.state || 'FAILED';
    if (that.state === 'COMPLETE') {
      that.columnsToDisplay = ['export-date', 'employee', 'export', 'expensetype', 'openQbo'];
    } else {
      that.columnsToDisplay = ['employee', 'expensetype'];
    }

    that.getPaginatedExpenseGroups();

    that.routerEventSubscription = that.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        const pageNumber = +event.snapshot.queryParams.page_number || 0;
        if (+event.snapshot.queryParams.page_size) {
          that.storageService.set('expense-groups.pageSize', +event.snapshot.queryParams.page_size);
          cachedPageSize = +event.snapshot.queryParams.page_size;
        }

        const pageSize = +event.snapshot.queryParams.page_size || cachedPageSize;
        const state = event.snapshot.queryParams.state || 'FAILED';

        if (that.pageNumber !== pageNumber || that.pageSize !== pageSize || that.state !== state) {
          if (state === 'COMPLETE') {
            that.columnsToDisplay = ['export-date', 'employee', 'export', 'expensetype', 'openQbo'];
          } else {
            that.columnsToDisplay = ['employee', 'expensetype'];
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

  generateExportTypeAndId(expenseGroup: ExpenseGroup) {
    let exportRedirection = null;
    let exportType = null;
    let exportId = null;

    if ('Bill' in expenseGroup.response_logs && expenseGroup.response_logs.Bill) {
      exportRedirection = 'bill';
      exportType = exportRedirection;
      exportId = expenseGroup.response_logs.Bill.Id;
    } else if ('JournalEntry' in expenseGroup.response_logs && expenseGroup.response_logs.JournalEntry) {
      exportRedirection = 'journal';
      exportType = 'Journal Entry';
      exportId = expenseGroup.response_logs.JournalEntry.Id;
    } else if ('Purchase' in expenseGroup.response_logs && expenseGroup.response_logs.Purchase) {
      exportId = expenseGroup.response_logs.Purchase.Id;
      if (expenseGroup.response_logs.Purchase.PaymentType === 'Check') {
        exportRedirection = 'check';
        exportType = exportRedirection;
      } else {
        exportRedirection = 'expense';
        if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'CreditCard' && !expenseGroup.response_logs.Purchase.Credit) {
          exportType = 'Credit Card Purchase';
        } else if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'CreditCard' && expenseGroup.response_logs.Purchase.Credit) {
          exportType = 'Credit Card Credit';
          exportRedirection = 'creditcardcredit';
        } else if (expenseGroup.fund_source === 'CCC' && expenseGroup.response_logs.Purchase.PaymentType === 'Cash') {
          exportType = 'Debit Card Expense';
          exportRedirection = 'expense';
        } else {
          exportType = 'expense';
        }
      }
    }

    return [exportRedirection, exportId, exportType];
  }

  openInQboHandler(clickedExpenseGroup: ExpenseGroup) {
    // tslint:disable-next-line: deprecation
    event.preventDefault();
    // tslint:disable-next-line: deprecation
    event.stopPropagation();

    const that = this;

    const [exportType, exportId, _] = that.generateExportTypeAndId(clickedExpenseGroup);
    that.openInQBO(exportType, exportId);
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

  ngOnDestroy() {
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }

}
