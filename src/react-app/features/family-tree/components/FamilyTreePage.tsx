import { FamilyFilters } from "./FamilyFilters";
import { FamilyStats } from "./FamilyStats";
import { MemberDetails } from "./MemberDetails";
import { AddMemberForm } from "./AddMemberForm";
import { FamilyTreeCanvas } from "./FamilyTreeCanvas";
import { ThemeToggle } from "./ThemeToggle";
import { useFamilyTree } from "../hooks/useFamilyTree";

export function FamilyTreePage() {
  const {
    nodes,
    query,
    setQuery,
    genderFilter,
    setGenderFilter,
    statusFilter,
    setStatusFilter,
    generationFilter,
    setGenerationFilter,
    lineageMode,
    setLineageMode,
    selectedKey,
    setSelectedKey,
    nodeDataArray,
    linkDataArray,
    filteredCount,
    totalMembers,
    maxGeneration,
    livingMembers,
    averageAge,
    selectedMember,
    selectedParents,
    selectedChildren,
    selectedSiblings,
    selectedGeneration,
    newMember,
    updateNewMember,
    addMember,
    formError,
    clearFilters,
  } = useFamilyTree();

  return (
    <div className="family-app min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Family Atlas</h1>
            <p className="text-xs text-muted-foreground">Interactive family tree with lineage insights</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-5 flex-1 grid gap-4 lg:grid-cols-[1.65fr,1fr]">
        <section className="flex flex-col gap-3 min-h-[640px]">
          <FamilyFilters
            query={query}
            genderFilter={genderFilter}
            statusFilter={statusFilter}
            generationFilter={generationFilter}
            maxGeneration={maxGeneration}
            lineageMode={lineageMode}
            hasSelectedMember={Boolean(selectedKey)}
            filteredCount={filteredCount}
            totalMembers={totalMembers}
            onQueryChange={setQuery}
            onGenderChange={setGenderFilter}
            onStatusChange={setStatusFilter}
            onGenerationChange={setGenerationFilter}
            onToggleLineageMode={() => setLineageMode((prev) => !prev)}
            onResetFilters={clearFilters}
          />

          {filteredCount === 0 && (
            <div className="rounded-xl border border-orange-300 bg-orange-50/70 px-4 py-3 text-sm text-orange-900 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-700">
              No members match your active filters. Reset filters or widen your search.
            </div>
          )}

          <FamilyTreeCanvas
            nodeDataArray={nodeDataArray}
            linkDataArray={linkDataArray}
            onNodeSelect={setSelectedKey}
          />
        </section>

        <aside className="flex flex-col gap-4">
          <FamilyStats
            totalMembers={totalMembers}
            generationCount={maxGeneration + 1}
            livingMembers={livingMembers}
            averageAge={averageAge}
          />

          <MemberDetails
            selectedMember={selectedMember}
            selectedGeneration={selectedGeneration}
            selectedParents={selectedParents}
            selectedChildren={selectedChildren}
            selectedSiblings={selectedSiblings}
          />

          <AddMemberForm
            memberInput={newMember}
            nodes={nodes}
            formError={formError}
            onInputChange={updateNewMember}
            onAddMember={addMember}
          />
        </aside>
      </main>
    </div>
  );
}
