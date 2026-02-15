import { useMemo } from "react";
import type { FamilyNodeViewData } from "../model/types";
import "../styles/FamilyTree.css";

interface TimelinePoint extends FamilyNodeViewData {
  leftPercent: number;
  lane: number;
}

interface TimelineRow {
  generation: number;
  points: TimelinePoint[];
  laneCount: number;
}

interface FamilyTimelineProps {
  nodes: FamilyNodeViewData[];
  selectedKey: number | null;
  onNodeSelect?: (key: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function FamilyTimeline({ nodes, selectedKey, onNodeSelect }: FamilyTimelineProps) {
  const years = useMemo(() => {
    if (nodes.length === 0) {
      return { minYear: new Date().getFullYear(), maxYear: new Date().getFullYear() };
    }

    let minYear = Number.POSITIVE_INFINITY;
    let maxYear = Number.NEGATIVE_INFINITY;

    for (const node of nodes) {
      minYear = Math.min(minYear, node.birthYear);
      maxYear = Math.max(maxYear, node.deathYear ?? new Date().getFullYear());
    }

    return { minYear, maxYear };
  }, [nodes]);

  const rows = useMemo<TimelineRow[]>(() => {
    const grouped = new Map<number, FamilyNodeViewData[]>();

    for (const node of nodes) {
      const bucket = grouped.get(node.generation);
      if (bucket) {
        bucket.push(node);
      } else {
        grouped.set(node.generation, [node]);
      }
    }

    const span = Math.max(1, years.maxYear - years.minYear);
    const generations = Array.from(grouped.keys()).sort((a, b) => a - b);

    return generations.map((generation) => {
      const members = (grouped.get(generation) || []).slice().sort((a, b) => {
        if (a.birthYear !== b.birthYear) {
          return a.birthYear - b.birthYear;
        }
        return a.name.localeCompare(b.name);
      });

      const laneLastLeft: number[] = [];
      const points: TimelinePoint[] = members.map((node) => {
        const rawLeft = ((node.birthYear - years.minYear) / span) * 100;
        const leftPercent = clamp(rawLeft, 0, 100);

        let lane = 0;
        for (; lane < laneLastLeft.length; lane += 1) {
          if (Math.abs(leftPercent - laneLastLeft[lane]) >= 12) {
            break;
          }
        }

        if (lane === laneLastLeft.length) {
          laneLastLeft.push(leftPercent);
        } else {
          laneLastLeft[lane] = leftPercent;
        }

        return {
          ...node,
          leftPercent,
          lane,
        };
      });

      return {
        generation,
        points,
        laneCount: Math.max(1, laneLastLeft.length),
      };
    });
  }, [nodes, years.maxYear, years.minYear]);

  if (nodes.length === 0) {
    return (
      <div className="family-timeline-container">
        <div className="family-timeline-empty">No members available for timeline view.</div>
      </div>
    );
  }

  return (
    <div className="family-timeline-container">
      <div className="family-timeline-header">
        <span>{years.minYear}</span>
        <span>{years.maxYear}</span>
      </div>

      <div className="family-timeline-rows">
        {rows.map((row) => (
          <div key={row.generation} className="family-timeline-row">
            <div className="family-timeline-generation">G{row.generation}</div>

            <div
              className="family-timeline-track"
              style={{ minHeight: `${row.laneCount * 52 + 22}px` }}
              role="list"
              aria-label={`Generation ${row.generation}`}
            >
              <div className="family-timeline-base-line" />
              {row.points.map((point) => (
                <button
                  key={point.key}
                  type="button"
                  role="listitem"
                  className={`family-timeline-node ${selectedKey === point.key ? "is-selected" : ""}`}
                  style={{
                    left: `${point.leftPercent}%`,
                    top: `${point.lane * 52 + 6}px`,
                  }}
                  onClick={() => onNodeSelect?.(point.key)}
                  title={`${point.name} (${point.birthYear})`}
                >
                  <span className="family-timeline-year">{point.birthYear}</span>
                  <span className="family-timeline-name">{point.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
