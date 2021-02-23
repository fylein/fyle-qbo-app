/* tslint:disable */
// TODO: Use something for serialization / deserialization
export type GeneralMapping = {
  id?: number;
  accounts_payable_id: number;
  accounts_payable_name: string;
  bank_account_id: string;
  bank_account_name: string;
  default_ccc_account_id: string;
  default_ccc_account_name: string;
  default_ccc_vendor_id: string;
  default_ccc_vendor_name: string;
  bill_payment_account_id: string;
  bill_payment_account_name: string;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
};
