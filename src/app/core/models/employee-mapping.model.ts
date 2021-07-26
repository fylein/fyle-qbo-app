import { MappingDestination } from './mapping-destination.model';
import { MappingSource } from './mapping-source.model';

/* tslint:disable */
export type EmployeeMapping = {
  id?: number;
  source_employee: {
    id: number;
    value?: string;
  } | MappingSource;
  destination_employee?: {
    id: number;
    value?: string;
  } | MappingDestination;
  destination_vendor?: {
    id: number;
    value?: string;
  } | MappingDestination;
  destination_card_account?: {
    id: number;
    value?: string;
  } | MappingDestination;
  created_at?: Date;
  updated_at?: Date;
  workspace: number;
};
