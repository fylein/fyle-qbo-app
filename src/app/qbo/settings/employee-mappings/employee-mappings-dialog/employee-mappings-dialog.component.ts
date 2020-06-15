import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from 'src/app/qbo/mappings/mappings.service';

@Component({
  selector: 'app-employee-mappings-dialog',
  templateUrl: './employee-mappings-dialog.component.html',
  styleUrls: ['./employee-mappings-dialog.component.scss']
})
export class EmployeeMappingsDialogComponent implements OnInit {
  
  form: FormGroup;
  workSpaceId: number;
  fyleEmployees: any[];

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private mappingsService: MappingsService) { }

  emailSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleEmployees.filter(fyleEmployee => new RegExp(term.toLowerCase(), 'g').test(fyleEmployee.value.toLowerCase())))
  )

  ngOnInit() {
    this.workSpaceId = this.route.parent.snapshot.params.workspace_id;

    this.mappingsService.getFyleEmployees(this.workSpaceId).subscribe(function(fyleEmployees) {
      this.fyleEmployees = fyleEmployees;
    });

    this.form = this.formBuilder.group({
      fyleEmployee: [''],
      qboVendor: [''],
      qboEmployee: [''],
      creditCardAccount: ['']
    });

    
  }

}
