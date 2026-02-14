import { Button } from "@/components/ui/button";
import type { AddMemberInput, FamilyNodeData } from "../model/types";

interface AddMemberFormProps {
  memberInput: AddMemberInput;
  nodes: FamilyNodeData[];
  formError: string | null;
  onInputChange: <K extends keyof AddMemberInput>(field: K, value: AddMemberInput[K]) => void;
  onAddMember: () => void;
}

export function AddMemberForm({ memberInput, nodes, formError, onInputChange, onAddMember }: AddMemberFormProps) {
  return (
    <div className="panel-card rounded-xl border p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Add New Member</h2>

      <div className="mt-3 space-y-2">
        <input
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Full name"
          value={memberInput.name}
          onChange={(event) => onInputChange("name", event.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Birth year"
            value={memberInput.birthYear}
            onChange={(event) => onInputChange("birthYear", event.target.value)}
          />
          <select
            className="w-full rounded-md border bg-background px-2 py-2 text-sm"
            value={memberInput.gender}
            onChange={(event) => onInputChange("gender", event.target.value as AddMemberInput["gender"])}
          >
            <option value="F">Female</option>
            <option value="M">Male</option>
            <option value="X">Non-binary</option>
          </select>
        </div>

        <input
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="City (optional)"
          value={memberInput.city}
          onChange={(event) => onInputChange("city", event.target.value)}
        />

        <select
          className="w-full rounded-md border bg-background px-2 py-2 text-sm"
          value={memberInput.parent}
          onChange={(event) => onInputChange("parent", event.target.value)}
        >
          <option value="none">No parent link</option>
          {nodes.map((node) => (
            <option key={node.key} value={String(node.key)}>{node.name}</option>
          ))}
        </select>

        {formError && <p className="text-xs text-red-600 dark:text-red-400">{formError}</p>}

        <Button className="w-full" onClick={onAddMember}>Add Member</Button>
      </div>
    </div>
  );
}
