import { ExpenseGroup } from './expenseGroups.model';

export interface ExpenseGroupResponse {
    count: number;
    next: string;
    previous: string;
    results: ExpenseGroup[];
}
