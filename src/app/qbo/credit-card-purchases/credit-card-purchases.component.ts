import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditCardPurchasesService } from './credit-card-purchases.service';

@Component({
  selector: 'app-credit-card-purchases',
  templateUrl: './credit-card-purchases.component.html',
  styleUrls: ['./credit-card-purchases.component.scss', '../qbo.component.scss']
})

export class CreditCardPurchasesComponent implements OnInit {
  workspaceId: number;
  creditCardPurchases: [any];
  isLoading = true;
  nextPageLink: string;
  previousPageLink: string;
  count: number;
  limit: number = 20;
  offset: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private CreditCardPurchasesService: CreditCardPurchasesService) {}

  nextPage() {
    this.offset = this.offset + this.limit;
    this.isLoading = true;
    this.getPaginatedCreditCardPurchases();
  }

  previousPage() {
    this.offset = this.offset - this.limit;
    this.isLoading = true;
    this.getPaginatedCreditCardPurchases();
  }

  getPaginatedCreditCardPurchases() {
    this.CreditCardPurchasesService.getCreditCardPurchases(this.workspaceId, this.limit, this.offset).subscribe(creditCardPurchases => {
      this.nextPageLink = creditCardPurchases.next;
      this.previousPageLink = creditCardPurchases.previous;
      this.count = creditCardPurchases.count;
      this.creditCardPurchases = creditCardPurchases.results;
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
      this.getPaginatedCreditCardPurchases();
    });
  }

}
