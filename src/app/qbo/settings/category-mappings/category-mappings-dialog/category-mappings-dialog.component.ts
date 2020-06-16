import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-category-mappings-dialog',
  templateUrl: './category-mappings-dialog.component.html',
  styleUrls: ['./category-mappings-dialog.component.scss']
})
export class CategoryMappingsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  fyleCategories: any[];
  qboAccounts: any[];
  fyleCategoryOptions: any[];
  qboAccountOptions: any[];

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CategoryMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mappingsService: MappingsService) { }

  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  submit() {
    let that = this;
    if (that.form.valid) {
      that.isLoading = true;
      that.mappingsService.postMappings(that.data.workspaceId, {
        source_type: 'CATEGORY',
        destination_type: 'ACCOUNT',
        source_value: that.form.controls.fyleCategory.value.value,
        destination_value: that.form.controls.qboAccount.value.value
      }).subscribe(response => {
        that.isLoading = false;
        that.dialogRef.close();
      });
    }
  }

  ngOnInit() {
    const that = this;

    const getFyleCateogories = that.mappingsService.getFyleCategories(that.data.workspaceId).toPromise().then(fyleCategories => {
      that.fyleCategories = fyleCategories;
    });

    const getExpenseAccounts = that.mappingsService.getExpenseAccounts(that.data.workspaceId).toPromise().then(qboAccounts => {
      that.qboAccounts = qboAccounts;
    });

    that.isLoading = true;
    forkJoin([
      getFyleCateogories,
      getExpenseAccounts
    ]).subscribe(() => {
      that.isLoading = false;
    });

    that.form = that.formBuilder.group({
      fyleCategory: ['', Validators.required],
      qboAccount: ['', Validators.required]
    });

    that.form.controls.fyleCategory.valueChanges.pipe(debounceTime(200)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        that.fyleCategoryOptions = that.fyleCategories
        .filter(fyleCategory => new RegExp(newValue.toLowerCase(), 'g').test(fyleCategory.value.toLowerCase()));
      }
    });


    that.form.controls.qboAccount.valueChanges.pipe(debounceTime(200)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        that.qboAccountOptions = that.qboAccounts
        .filter(qboAccount => new RegExp(newValue.toLowerCase(), 'g').test(qboAccount.value.toLowerCase()));
      }
    });
  }

}
