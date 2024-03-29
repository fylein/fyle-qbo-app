/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { ExpenseGroupDescription } from './expense-group-description.model';

export type ExpenseGroup = {
  id: number;
  fyle_group_id: string;
  fund_source: string;
  description: ExpenseGroupDescription;
  // having any here is okay, different qbo exports has different structures
  response_logs: any;
  export_type: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  expenses: number[];
};
