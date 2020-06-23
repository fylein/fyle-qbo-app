import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss', '../../qbo.component.scss']
})
export class ScheduleComponent implements OnInit {
  form: FormGroup;
  workspaceId: number;
  isLoading = false;
  minDate: Date = new Date();
  defaultDate: string;
  hours = [...Array(24).keys()];
  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService, private route: ActivatedRoute) { }

  getSettings() {
    const that = this;
    that.isLoading = true;
    that.settingsService.getSettings(that.workspaceId).subscribe(settings => {
      if (settings && settings.schedule) {
        that.form.setValue({
          datetime: new Date(settings.schedule.start_datetime),
          hours: settings.schedule.interval_hours,
          scheduleEnabled: settings.schedule.enabled
        });
      }
      that.isLoading = false;
    }, error => {
      if (error.status == 400) {
        that.isLoading = false;
      }
    });
  }

  submit() {
    const that = this;
    if (that.form.valid) {
      const nextRun = new Date(that.form.value.datetime).toISOString();
      const hours = that.form.value.hours;
      const scheduleEnabled = that.form.value.scheduleEnabled;
      that.isLoading = true;
      that.settingsService.postSettings(that.workspaceId, nextRun, hours, scheduleEnabled).subscribe(response => {
        that.isLoading = false;
        that.getSettings();
      });
    }

  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.form = that.formBuilder.group({
      datetime: [new Date(), Validators.required],
      hours: ['', Validators.required],
      scheduleEnabled: [false]
    });

    that.form.controls.scheduleEnabled.valueChanges.subscribe((newValue) => {
      if (!newValue) {
        that.settingsService.postSettings(that.workspaceId, '', 0, false).subscribe(response => {
          that.isLoading = false;
          that.getSettings();
        });
      }
    });

    that.getSettings();
  }

}
