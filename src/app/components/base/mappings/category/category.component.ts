import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css', '../../base.component.css']
})
export class CategoryComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleCategories: any[];
  qboAccounts: any[];
  categoryMappings: any[];
  workspaceId: number;
  categoryIsValid: boolean = true;
  subCategoryIsValid: boolean = true;
  accountIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleCategory: new FormControl(''),
      fyleSubCategory: new FormControl(''),
      qboAccount: new FormControl('')
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'categoryMappingModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
  }

  getCategoryMappings() {
    this.mappingsService.getCategoryMappings(this.workspaceId).subscribe(categoryMappings => {
      this.categoryMappings = categoryMappings.results;
      this.isLoading = false;
    });
  }

  accountFormatter = (qboAccount) => qboAccount.Name;

  accountSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.qboAccounts.filter(qboAccount => new RegExp(term.toLowerCase(), 'g').test(qboAccount.Name.toLowerCase())))
  )
  
  categoryFormatter = (fyleCategory) => fyleCategory.name;

  categorySearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleCategories.filter(fyleCategory => new RegExp(term.toLowerCase(), 'g').test(fyleCategory.name.toLowerCase())))
  )

  subCategoryFormatter = (fyleCategory) => fyleCategory.sub_category;

  subCategorySearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleCategories.filter(fyleCategory => new RegExp(term.toLowerCase(), 'g').test(fyleCategory.sub_category.toLowerCase())))
  )

  submit() {
    let fyleCategory = this.form.value.fyleCategory;
    let fyleSubCategory = this.form.value.fyleSubCategory;
    let qboAccount = this.form.value.qboAccount;
    this.categoryIsValid = false;
    this.subCategoryIsValid = false;
    this.accountIsValid = false;
    
    if (fyleCategory) {
      this.categoryIsValid = true;
    }

    if (fyleSubCategory) {
      this.subCategoryIsValid = true;
    }

    if (qboAccount) {
      this.accountIsValid = true;
    }

    if (this.categoryIsValid && this.subCategoryIsValid && this.accountIsValid) {
      this.isLoading = true;
      this.mappingsService.postCategoryMappings(this.workspaceId, fyleCategory.name, fyleSubCategory.sub_category, qboAccount.Name, qboAccount.Id).subscribe(response => {
        this.clearModalValues();
        this.getCategoryMappings();
      });
    }
  }

  clearModalValues() {
    this.form.reset();
    this.modalRef.close();
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.mappingsService.getFyleCategories(this.workspaceId).subscribe(categories => {
        this.fyleCategories = categories;
        this.getCategoryMappings();
      });

      this.mappingsService.getQBOAccounts(this.workspaceId).subscribe(accounts => {
        this.qboAccounts = accounts.filter(account => account.AccountType === 'Expense');
      });
    });
  }

}
