/* tslint:disable */
import { Task } from './task.model';

export interface TaskResponse {
  count: number;
  next: string;
  previous: string;
  results: Task[];
}
