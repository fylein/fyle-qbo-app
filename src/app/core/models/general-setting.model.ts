/* tslint:disable */
export type GeneralSetting = {
  id?: number;
  reimbursable_expenses_object: string;
  corporate_credit_card_expenses_object: string;
  import_projects?: boolean;
  import_categories: boolean;
  import_tax_codes: boolean;
  change_accounting_period: boolean;
  sync_fyle_to_qbo_payments: boolean;
  sync_qbo_to_fyle_payments: boolean;
  auto_map_employees: string;
  auto_create_destination_entity: boolean;
  employee_field_mapping: string;
  je_single_credit_line: boolean;
  charts_of_accounts: string[];
  memo_structure?: string[];
  map_fyle_cards_qbo_account: boolean;
  skip_cards_mapping?: boolean;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
  import_vendors_as_merchants?: boolean;
};
