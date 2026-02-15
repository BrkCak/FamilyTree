import type { FamilyLinkData, FamilyNodeData } from "./types";

interface FamilyTreeResponse {
  nodes: FamilyNodeData[];
  links: FamilyLinkData[];
}

interface CreateFamilyNodePayload {
  name: string;
  birthYear: number;
  sex: "M" | "F" | "X";
  city?: string;
  notes?: string;
  parentId?: number;
}

interface CreateFamilyNodeResponse {
  node: FamilyNodeData;
  link?: FamilyLinkData;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as { error?: string };
      throw new Error(payload.error || fallback);
    } catch {
      throw new Error(fallback);
    }
  }
  return (await response.json()) as T;
}

export async function fetchFamilyTree(): Promise<FamilyTreeResponse> {
  const response = await fetch("/api/family/tree");
  return parseJsonResponse<FamilyTreeResponse>(response);
}

export async function createFamilyNode(payload: CreateFamilyNodePayload): Promise<CreateFamilyNodeResponse> {
  const response = await fetch("/api/family/nodes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<CreateFamilyNodeResponse>(response);
}
