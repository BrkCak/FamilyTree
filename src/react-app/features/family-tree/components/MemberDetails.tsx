import type { FamilyNodeData } from "../model/types";
import { getAge } from "../model/selectors";

interface MemberDetailsProps {
  selectedMember: FamilyNodeData | null;
  selectedGeneration: number | null;
  selectedParents: FamilyNodeData[];
  selectedChildren: FamilyNodeData[];
  selectedSiblings: FamilyNodeData[];
}

function joinNames(nodes: FamilyNodeData[]) {
  return nodes.length ? nodes.map((node) => node.name).join(", ") : "-";
}

export function MemberDetails({
  selectedMember,
  selectedGeneration,
  selectedParents,
  selectedChildren,
  selectedSiblings,
}: MemberDetailsProps) {
  return (
    <div className="panel-card rounded-xl border p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Selected Member</h2>

      {selectedMember ? (
        <div className="mt-3 space-y-2 text-sm">
          <p className="text-xl font-bold leading-tight">{selectedMember.name}</p>
          <p>Generation: G{selectedGeneration || 0}</p>
          <p>Age: {getAge(selectedMember)} years</p>
          <p>City: {selectedMember.city || "Unknown"}</p>
          <p className="text-muted-foreground">{selectedMember.notes || "No notes"}</p>
          <p><strong>Parents:</strong> {joinNames(selectedParents)}</p>
          <p><strong>Children:</strong> {joinNames(selectedChildren)}</p>
          <p><strong>Siblings:</strong> {joinNames(selectedSiblings)}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Click a node to inspect lineage and profile details.</p>
      )}
    </div>
  );
}
