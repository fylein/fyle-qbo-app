import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss', '../../qbo.component.scss']
})
export class ConfigurationComponent implements OnInit {

  generalSettingsForm: FormGroup;
  expenseOptions: { label:string, value:string }[];

  constructor(private formBuilder: FormBuilder) { }

  getExpenseOptions(employeeMappedTo) {
    return {
      EMPLOYEE: [
      {
        label: 'Check',
        value: 'CHECK'
      },
      {
        label: 'Journal Entry',
        value: 'JOURNAL_ENTRY'
      }
      ],
      VENDOR: [
        {
          label: 'Bill',
          value: 'BILL'
        },
        {
          label: 'Journal Entry',
          value: 'JOURNAL_ENTRY'
        }
      ]
    }[employeeMappedTo];
  }

  save() {
    if (this.generalSettingsForm.valid) {
      console.log('VALIIIIIID')
    } else {
      this.generalSettingsForm.markAllAsTouched();
    }
  }

  ngOnInit() {
    let that = this;
    that.generalSettingsForm = that.formBuilder.group({
      employees: ['', Validators.required],
      reimburExpense: ['', Validators.required],
      cccExpense: [''],
      projects: [''],
      costCenters: [''],
    });

    that.generalSettingsForm.controls.employees.valueChanges.subscribe(function (employeeMappedTo) {
      that.expenseOptions = that.getExpenseOptions(employeeMappedTo);
      that.generalSettingsForm.controls.reimburExpense.reset();
    });
  }

}
