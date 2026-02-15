import { useMemo } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import type { FamilyLinkViewData, FamilyNodeViewData } from "../model/types";
import "../styles/FamilyTree.css";

function getThemeColors() {
  if (typeof document === "undefined") {
    return {
      textColor: "#0f172a",
      border: "#cbd5e1",
      link: "#64748b",
      selected: "#ea580c",
      lineage: "#0891b2",
      maleFill: "#dbeafe",
      femaleFill: "#fee2e2",
      neutralFill: "#ede9fe",
      selectedFill: "#fed7aa",
      lineageFill: "#cffafe",
      matchedFill: "#fef3c7",
    };
  }

  const style = getComputedStyle(document.documentElement);

  const cssVar = (name: string, fallback: string) => {
    const v = style.getPropertyValue(name).trim();
    return v || fallback;
  };

  const light = {
    textColor: cssVar("--ft-text", "#0f172a"),
    border: cssVar("--ft-border", "#cbd5e1"),
    link: cssVar("--ft-link", "#64748b"),
    selected: cssVar("--ft-selected", "#ea580c"),
    lineage: cssVar("--ft-lineage", "#0891b2"),
    maleFill: cssVar("--ft-maleFill", "#dbeafe"),
    femaleFill: cssVar("--ft-femaleFill", "#fee2e2"),
    neutralFill: cssVar("--ft-neutralFill", "#ede9fe"),
    selectedFill: cssVar("--ft-selectedFill", "#fed7aa"),
    lineageFill: cssVar("--ft-lineageFill", "#cffafe"),
    matchedFill: cssVar("--ft-matchedFill", "#fef3c7"),
  };

  const dark = {
    textColor: cssVar("--ft-text", "#E6F0FA"),
    border: cssVar("--ft-border", "#25323B"),
    link: cssVar("--ft-link", "#66BFF6"),
    selected: cssVar("--ft-selected", "#FFAB60"),
    lineage: cssVar("--ft-lineage", "#2AD1C6"),
    maleFill: cssVar("--ft-maleFill", "#072F4D"),
    femaleFill: cssVar("--ft-femaleFill", "#4A2030"),
    neutralFill: cssVar("--ft-neutralFill", "#332A45"),
    selectedFill: cssVar("--ft-selectedFill", "#7A4A12"),
    lineageFill: cssVar("--ft-lineageFill", "#0F3E40"),
    matchedFill: cssVar("--ft-matchedFill", "#4A3A08"),
  };

  const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? dark : light;
}

function makeDiagram(onNodeSelect?: (key: number) => void): go.Diagram {
  const $ = go.GraphObject.make;
  const colors = getThemeColors();

  const diagram = $(go.Diagram, {
    "undoManager.isEnabled": false,
    "toolManager.hoverDelay": 120,
    initialAutoScale: go.AutoScale.Uniform,
    contentAlignment: go.Spot.Center,
    layout: $(go.TreeLayout, {
      angle: 90,
      layerSpacing: 58,
      nodeSpacing: 28,
      compaction: go.TreeLayout.CompactionBlock,
      alignment: go.TreeLayout.AlignmentCenterChildren,
      arrangement: go.TreeLayout.ArrangementHorizontal,
    }),
    model: $(go.GraphLinksModel, {
      linkKeyProperty: "key",
      linkFromKeyProperty: "from",
      linkToKeyProperty: "to",
    }),
  });

  diagram.addDiagramListener("ChangedSelection", (event) => {
    if (!onNodeSelect) {
      return;
    }

    const selected = event.diagram.selection.first();
    if (selected instanceof go.Node) {
      onNodeSelect(Number(selected.data.key));
    }
  });

  diagram.nodeTemplate = $(
    go.Node,
    "Auto",
    {
      locationSpot: go.Spot.Center,
      cursor: "pointer",
      selectionAdorned: false,
    },
    $(
      go.Shape,
      "RoundedRectangle",
      {
        strokeWidth: 2,
        stroke: colors.border,
        spot1: new go.Spot(0, 0, 6, 6),
        spot2: new go.Spot(1, 1, -6, -6),
      },
      new go.Binding("fill", "", (data: FamilyNodeViewData) => {
        if (data.isSelected) {
          return colors.selectedFill;
        }
        if (data.isSearchHit) {
          return colors.matchedFill;
        }
        if (data.isDirectLine) {
          return colors.lineageFill;
        }
        if (data.sex === "M") {
          return colors.maleFill;
        }
        if (data.sex === "F") {
          return colors.femaleFill;
        }
        return colors.neutralFill;
      }),
      new go.Binding("stroke", "", (data: FamilyNodeViewData) => {
        if (data.isSelected) {
          return colors.selected;
        }
        if (data.isDirectLine) {
          return colors.lineage;
        }
        return colors.border;
      }),
    ),
    $(
      go.Panel,
      "Vertical",
      { margin: 10, defaultAlignment: go.Spot.Center, minSize: new go.Size(140, 70) },
      $(
        go.TextBlock,
        {
          font: "700 13px 'Avenir Next', 'Trebuchet MS', sans-serif",
          stroke: colors.textColor,
          wrap: go.TextBlock.WrapFit,
          textAlign: "center",
          maxSize: new go.Size(160, NaN),
        },
        new go.Binding("text", "name"),
      ),
      $(
        go.TextBlock,
        {
          margin: new go.Margin(2, 0, 0, 0),
          font: "12px 'Avenir Next', 'Trebuchet MS', sans-serif",
          stroke: colors.textColor,
          opacity: 0.8,
          wrap: go.TextBlock.WrapFit,
          textAlign: "center",
        },
        new go.Binding("text", "lifespanLabel"),
      ),
      $(
        go.TextBlock,
        {
          margin: new go.Margin(2, 0, 0, 0),
          font: "11px 'Avenir Next', 'Trebuchet MS', sans-serif",
          stroke: colors.textColor,
          opacity: 0.68,
          wrap: go.TextBlock.WrapFit,
          textAlign: "center",
        },
        new go.Binding("text", "city", (city) => (city ? `Lives in ${city}` : "")),
      ),
    ),
  );

  diagram.linkTemplate = $(
    go.Link,
    {
      routing: go.Link.Orthogonal,
      corner: 6,
      selectable: false,
      layerName: "Background",
    },
    $(
      go.Shape,
      {
        strokeWidth: 2,
        stroke: colors.link,
        opacity: 0.5,
      },
      new go.Binding("stroke", "isLineage", (isLineage) => (isLineage ? colors.lineage : colors.link)),
      new go.Binding("opacity", "isLineage", (isLineage) => (isLineage ? 0.9 : 0.45)),
    ),
  );

  return diagram;
}

interface FamilyTreeCanvasProps {
  nodeDataArray: FamilyNodeViewData[];
  linkDataArray: FamilyLinkViewData[];
  onNodeSelect?: (key: number) => void;
}

export function FamilyTreeCanvas({ nodeDataArray, linkDataArray, onNodeSelect }: FamilyTreeCanvasProps) {
  const initDiagram = useMemo(() => () => makeDiagram(onNodeSelect), [onNodeSelect]);

  return (
    <div className="family-tree-container">
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="family-tree-diagram"
        nodeDataArray={nodeDataArray}
        linkDataArray={linkDataArray}
      />
    </div>
  );
}
