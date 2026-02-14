export interface FamilyNodeData {
  key: number;
  name: string;
  birthYear: number;
  deathYear?: number;
  sex: "M" | "F" | "X";
  city?: string;
  notes?: string;
}

export interface FamilyLinkData {
  key: number;
  from: number;
  to: number;
}

export interface FamilyNodeViewData extends FamilyNodeData {
  generation: number;
  age: number;
  lifespanLabel: string;
  isSelected?: boolean;
  isDirectLine?: boolean;
  isSearchHit?: boolean;
}

export interface FamilyLinkViewData extends FamilyLinkData {
  isLineage?: boolean;
}

export type GenderFilter = "all" | "M" | "F" | "X";
export type StatusFilter = "all" | "living" | "deceased";

export interface AddMemberInput {
  name: string;
  birthYear: string;
  gender: "M" | "F" | "X";
  city: string;
  parent: string;
}
