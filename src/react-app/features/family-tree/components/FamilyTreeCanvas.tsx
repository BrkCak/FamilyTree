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
  return {
    textColor: style.getPropertyValue("--card-foreground").trim() || "#0f172a",
    border: style.getPropertyValue("--border").trim() || "#cbd5e1",
    link: style.getPropertyValue("--muted-foreground").trim() || "#64748b",
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
