/* tslint:disable */
export type GeneralSetting = {
  id?: number;
  reimbursable_expenses_object: string;
  corporate_credit_card_expenses_object: string;
  import_projects?: boolean;
  import_categories: boolean;
  sync_fyle_to_qbo_payments: boolean;
  sync_qbo_to_fyle_payments: boolean;
  auto_map_employees: string;
  auto_create_destination_entity: boolean;
  employee_field_mapping?: string;
  project_field_mapping?: string;
  cost_center_field_mapping?: string;
  je_single_credit_line: boolean;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
};
