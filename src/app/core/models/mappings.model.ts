/* tslint:disable */
// TODO: Use something for serialization / deserialization
export class Mapping {
  id: number;
  source: {
    id: number;
    attribute_type: string;
    display_name: string;
    value: string;
    source_id: number;
    created_at: Date;
    updated_at: Date;
    workspace: number
  };

  destination: {
    id: number;
    attribute_type: string;
    display_name: string;
    value: string;
    destination_id: number;
    created_at: Date;
    updated_at: Date;
    workspace: number
  };

  source_type: string;
  destination_type: string;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}
