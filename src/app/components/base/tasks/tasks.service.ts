import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../general.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private generalService: GeneralService) {}

  getTasks(workspace_id: number): Observable<any> {
    return this.generalService.get('/workspaces/' + workspace_id + '/tasks/all/', {});
  }
}
