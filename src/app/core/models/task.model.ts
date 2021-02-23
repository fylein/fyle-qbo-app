/* tslint:disable */
// TODO: Use something for serialization / deserialization
import { MappingError } from './mapping-error.model';

export type Task = {
  bill: number;
  cheque: number;
  created_at: Date;
  credit_card_purchase: number;
  detail: MappingError[];
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
