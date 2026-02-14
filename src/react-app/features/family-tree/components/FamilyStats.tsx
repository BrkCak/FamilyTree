interface FamilyStatsProps {
  totalMembers: number;
  generationCount: number;
  livingMembers: number;
  averageAge: number;
}

export function FamilyStats({ totalMembers, generationCount, livingMembers, averageAge }: FamilyStatsProps) {
  return (
    <div className="panel-card rounded-xl border p-4 grid grid-cols-2 gap-3">
      <div className="metric-block rounded-lg border p-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Members</p>
        <p className="text-2xl font-bold">{totalMembers}</p>
      </div>
      <div className="metric-block rounded-lg border p-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Generations</p>
        <p className="text-2xl font-bold">{generationCount}</p>
      </div>
      <div className="metric-block rounded-lg border p-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Living</p>
        <p className="text-2xl font-bold">{livingMembers}</p>
      </div>
      <div className="metric-block rounded-lg border p-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg. Age</p>
        <p className="text-2xl font-bold">{averageAge}</p>
      </div>
    </div>
  );
}
