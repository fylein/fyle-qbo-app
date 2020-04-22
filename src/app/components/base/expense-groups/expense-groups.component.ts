import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseGroupsService } from './expense-groups.service';
import { BillsService } from '../bills/bills.service';
import { ChecksService } from '../checks/checks.service';
import { JournalEntriesService } from '../journal-entries/journal-entries.service';
import { CreditCardPurchasesService } from '../credit-card-purchases/credit-card-purchases.service';


@Component({
  selector: 'app-expense-groups',
  templateUrl: './expense-groups.component.html',
  styleUrls: ['./expense-groups.component.css', '../base.component.css'],
})
export class ExpenseGroupsComponent implements OnInit {
  workspaceId: number;
  expenseGroups: [any];
  isLoading = true;
  nextPageLink: string;
  previousPageLink: string;
  count: number;
  limit: number = 20;
  offset: number = 0;
  state = 'READY';
  ready: string = 'active';;
  complete: string;
  all: string
  allSelected: boolean;
  selectedGroups: any[] = [];
  generalSettings: any;

  constructor(private route: ActivatedRoute, private expenseGroupService: ExpenseGroupsService, private router: Router, private billsService: BillsService, private checksService: ChecksService, private JournalEntriesService: JournalEntriesService, private CreditCardPurchasesService: CreditCardPurchasesService) {}

  syncExpenseGroups() {
    this.expenseGroupService.syncExpenseGroups(this.workspaceId).subscribe(task => {
      this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
    });
  }
  
  nextPage() {
    this.offset = this.offset + this.limit;
    this.isLoading = true;
    this.getPaginatedExpenseGroups();
  }

  onSelect() {
    this.selectedGroups = this.expenseGroups.filter(expenseGroup => expenseGroup.selected);
  }

  previousPage() {
    this.offset = this.offset - this.limit;
    this.isLoading = true;
    this.getPaginatedExpenseGroups();
  }
  
  changeState(state: string) {
    this.isLoading = true;
    this.offset = 0;
    if(state === 'ALL') {
      this.state = 'ALL';
      this.ready = '';
      this.complete = '';
      this.all = 'active';
    } else if(state === 'READY') {
      this.state = 'READY';
      this.ready = 'active';
      this.complete = '';
      this.all = '';
    } else if(state === 'COMPLETE') {
      this.state = 'COMPLETE';
      this.ready = '';
      this.complete = 'active';
      this.all = '';
    }
    this.getPaginatedExpenseGroups();
  }

  createQBOItems() { 
    if (this.generalSettings.reimbursable_expenses_object){
      let expenseGroupIds = this.expenseGroups.filter(expenseGroup => expenseGroup.selected).map(expenseGroup => expenseGroup.fund_source == 'PERSONAL' ? expenseGroup.id : '');
      let filteredIds = expenseGroupIds.filter(Boolean);

      if (filteredIds) {
        if(this.generalSettings.reimbursable_expenses_object == 'BILL') {
          this.billsService.createBills(this.workspaceId, filteredIds).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
          });
        }
        if (this.generalSettings.reimbursable_expenses_object == 'CHECK') {
          this.checksService.createChecks(this.workspaceId, filteredIds).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
          });
        }
        if (this.generalSettings.reimbursable_expenses_object == 'JOURNAL ENTRY') {
          this.JournalEntriesService.createJournalEntries(this.workspaceId, filteredIds).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
          });
        }
      }
    }

    if (this.generalSettings.corporate_credit_card_expenses_object != 'NONE') {
      let expenseGroupIds = this.expenseGroups.filter(expenseGroup => expenseGroup.selected).map(expenseGroup => expenseGroup.fund_source == 'CCC' ? expenseGroup.id : '');
      let filteredIds = expenseGroupIds.filter(Boolean);

      if (filteredIds) {
        if (this.generalSettings.corporate_credit_card_expenses_object == 'JOURNAL ENTRY') {
          this.JournalEntriesService.createJournalEntries(this.workspaceId, filteredIds).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
          });
        }
        if (this.generalSettings.corporate_credit_card_expenses_object == 'CREDIT CARD PURCHASE') {
          this.CreditCardPurchasesService.createCreditCardPurchases(this.workspaceId, filteredIds).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
          });
        }
      }
    }
  }

  toggleSelectAll() {
    this.expenseGroups.map(expenseGroup => expenseGroup.selected = this.allSelected);
    this.selectedGroups = this.expenseGroups.filter(expenseGroup => expenseGroup.selected == true);
  }

  getPaginatedExpenseGroups() {
    this.expenseGroupService.getExpenseGroups(this.workspaceId, this.limit, this.offset, this.state).subscribe(expenseGroups => {
      this.nextPageLink = expenseGroups.next;
      this.previousPageLink = expenseGroups.previous;
      this.count = expenseGroups.count;
      this.expenseGroups = expenseGroups.results;
      this.allSelected = false;      
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
      this.getPaginatedExpenseGroups();
      this.generalSettings = JSON.parse(window.localStorage.getItem('generalSettings'));
    });
  }
}
