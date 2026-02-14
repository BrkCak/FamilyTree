import { Button } from "@/components/ui/button";
import type { GenderFilter, StatusFilter } from "../model/types";

interface FamilyFiltersProps {
  query: string;
  genderFilter: GenderFilter;
  statusFilter: StatusFilter;
  generationFilter: string;
  maxGeneration: number;
  lineageMode: boolean;
  hasSelectedMember: boolean;
  filteredCount: number;
  totalMembers: number;
  onQueryChange: (value: string) => void;
  onGenderChange: (value: GenderFilter) => void;
  onStatusChange: (value: StatusFilter) => void;
  onGenerationChange: (value: string) => void;
  onToggleLineageMode: () => void;
  onResetFilters: () => void;
}

export function FamilyFilters({
  query,
  genderFilter,
  statusFilter,
  generationFilter,
  maxGeneration,
  lineageMode,
  hasSelectedMember,
  filteredCount,
  totalMembers,
  onQueryChange,
  onGenderChange,
  onStatusChange,
  onGenerationChange,
  onToggleLineageMode,
  onResetFilters,
}: FamilyFiltersProps) {
  return (
    <div className="panel-card rounded-xl border p-3 grid gap-3 md:grid-cols-5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide md:col-span-2">
        Search member
        <input
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Try: Clara, Noah, Marta"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>

      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Gender
        <select
          className="mt-1 w-full rounded-md border bg-background px-2 py-2 text-sm"
          value={genderFilter}
          onChange={(event) => onGenderChange(event.target.value as GenderFilter)}
        >
          <option value="all">All</option>
          <option value="F">Female</option>
          <option value="M">Male</option>
          <option value="X">Non-binary</option>
        </select>
      </label>

      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Status
        <select
          className="mt-1 w-full rounded-md border bg-background px-2 py-2 text-sm"
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
        >
          <option value="all">All</option>
          <option value="living">Living</option>
          <option value="deceased">Deceased</option>
        </select>
      </label>

      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Generation
        <select
          className="mt-1 w-full rounded-md border bg-background px-2 py-2 text-sm"
          value={generationFilter}
          onChange={(event) => onGenerationChange(event.target.value)}
        >
          <option value="all">All</option>
          {Array.from({ length: maxGeneration + 1 }, (_, index) => (
            <option key={index} value={String(index)}>
              G{index}
            </option>
          ))}
        </select>
      </label>

      <div className="md:col-span-5 flex flex-wrap items-center gap-2">
        <Button
          variant={lineageMode ? "default" : "outline"}
          onClick={onToggleLineageMode}
          disabled={!hasSelectedMember}
        >
          {lineageMode ? "Lineage Focus On" : "Lineage Focus Off"}
        </Button>
        <Button variant="outline" onClick={onResetFilters}>Reset Filters</Button>
        <span className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalMembers} members
        </span>
      </div>
    </div>
  );
}
