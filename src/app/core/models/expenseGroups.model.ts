export interface ExpenseGroup {
    id: number;
    fyle_group_id: string;
    fund_source: string;
    description: {
      claim_number: string,
      employee_email: string
    };
    created_at: Date;
    updated_at: Date;
    workspace: number;
    expenses: number[];
}
