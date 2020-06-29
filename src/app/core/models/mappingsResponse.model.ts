import { Mapping } from './mappings.model';

export class MappingsResponse {
    count: number;
    next: string;
    previous: string;
    results: Mapping[];
}
