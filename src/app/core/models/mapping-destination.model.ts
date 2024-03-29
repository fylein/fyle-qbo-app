/* tslint:disable */

import { DestinationAttributeDetail } from "./destination-attribute-detail.model";

// TODO: Use something for serialization / deserialization
export type MappingDestination = {
  id: number;
  attribute_type?: string;
  display_name?: string;
  value?: string;
  destination_id?: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
  detail?: DestinationAttributeDetail;
};