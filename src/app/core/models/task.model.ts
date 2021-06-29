/* tslint:disable */
// TODO: Use something for serialization / deserialization
import {QuickbookError} from './quickbooks-error.model';

export type Task = {
  bill: number;
  cheque: number;
  created_at: Date;
  credit_card_purchase: number;
  // having any here is okay, didn't differentiate qbo errors and fyle errors
  detail: any;
  quickbooks_errors: QuickbookError[];
  expense_group: number;
  id: number;
  journal_entry: number;
  bill_payment: number;
  status: string;
  task_id: string;
  type: string;
  updated_at: Date;
  workspace: number;
};
