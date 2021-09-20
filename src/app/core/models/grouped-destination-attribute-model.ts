/* tslint:disable */
import { MappingDestination } from './mapping-destination.model';

export type GroupedDestinationAttributes = {
    BANK_ACCOUNT?: MappingDestination[];
    CREDIT_CARD_ACCOUNT?: MappingDestination[];
    ACCOUNTS_PAYABLE?: MappingDestination[];
    VENDOR?: MappingDestination[];
    ACCOUNT?: MappingDestination[];
    TAX_CODE?: MappingDestination[];
};