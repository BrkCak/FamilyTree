import type { FamilyLinkData, FamilyNodeData } from "./types";

export const INITIAL_NODES: FamilyNodeData[] = [
  { key: 1, name: "Nora Weber", birthYear: 1932, deathYear: 2001, sex: "F", city: "Munich", notes: "Family archivist" },
  { key: 2, name: "Karl Weber", birthYear: 1930, deathYear: 1998, sex: "M", city: "Munich", notes: "Mechanical engineer" },
  { key: 3, name: "Marta Weber", birthYear: 1955, sex: "F", city: "Berlin" },
  { key: 4, name: "Jonas Weber", birthYear: 1958, sex: "M", city: "Berlin" },
  { key: 5, name: "Clara Weber", birthYear: 1981, sex: "F", city: "Hamburg" },
  { key: 6, name: "David Weber", birthYear: 1984, sex: "M", city: "Hamburg" },
  { key: 7, name: "Lea Weber", birthYear: 1986, sex: "F", city: "Cologne" },
  { key: 8, name: "Noah Weber", birthYear: 2005, sex: "M", city: "Cologne" },
  { key: 9, name: "Elena Weber", birthYear: 2008, sex: "F", city: "Cologne" },
  { key: 10, name: "Milan Weber", birthYear: 2012, sex: "M", city: "Hamburg" },
  { key: 11, name: "Aylin Weber", birthYear: 2015, sex: "F", city: "Hamburg" },
  { key: 12, name: "Robin Weber", birthYear: 2020, sex: "X", city: "Berlin", notes: "Youngest generation" },
];

export const INITIAL_LINKS: FamilyLinkData[] = [
  { key: 1, from: 1, to: 3 },
  { key: 2, from: 2, to: 4 },
  { key: 3, from: 3, to: 5 },
  { key: 4, from: 3, to: 6 },
  { key: 5, from: 4, to: 7 },
  { key: 6, from: 6, to: 10 },
  { key: 7, from: 6, to: 11 },
  { key: 8, from: 7, to: 8 },
  { key: 9, from: 7, to: 9 },
  { key: 10, from: 9, to: 12 },
];
