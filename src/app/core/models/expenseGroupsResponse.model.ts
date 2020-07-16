/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { ExpenseGroup } from './expenseGroups.model';

export interface ExpenseGroupResponse {
  count: number;
  next: string;
  previous: string;
  results: ExpenseGroup[];
}
