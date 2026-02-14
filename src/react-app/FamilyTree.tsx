import { useEffect, useMemo } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import "./FamilyTree.css";

export interface FamilyNodeData {
	key: number;
	name: string;
	birth?: string;
	sex?: "M" | "F";
}

export interface FamilyLinkData {
	key: number;
	from: number;
	to: number;
}

const NODE_DATA: FamilyNodeData[] = [
	{ key: 0, name: "Emma Weber", birth: "1920", sex: "F" },
	{ key: 1, name: "Hans Weber", birth: "1918", sex: "M" },
	{ key: 2, name: "Maria Weber", birth: "1945", sex: "F" },
	{ key: 3, name: "Thomas Weber", birth: "1942", sex: "M" },
	{ key: 4, name: "Sophie Weber", birth: "1970", sex: "F" },
	{ key: 5, name: "Michael Weber", birth: "1968", sex: "M" },
	{ key: 6, name: "Lisa Schmidt", birth: "1972", sex: "F" },
	{ key: 7, name: "Anna Weber", birth: "1995", sex: "F" },
	{ key: 8, name: "Felix Weber", birth: "1998", sex: "M" },
	{ key: 9, name: "Julia Weber", birth: "2001", sex: "F" },
];

const LINK_DATA: FamilyLinkData[] = [
	{ key: -1, from: 0, to: 1 },
	{ key: -2, from: 0, to: 2 },
	{ key: -3, from: 1, to: 3 },
	{ key: -4, from: 1, to: 4 },
	{ key: -5, from: 2, to: 5 },
	{ key: -6, from: 2, to: 6 },
	{ key: -7, from: 3, to: 7 },
	{ key: -8, from: 3, to: 8 },
	{ key: -9, from: 4, to: 9 },
];

function getThemeColors() {
	if (typeof document === "undefined") {
		return {
			nodeFill: "#f8fafc",
			nodeStroke: "#e2e8f0",
			textColor: "#0f172a",
			linkStroke: "#64748b",
		};
	}
	const root = document.documentElement;
	const style = getComputedStyle(root);
	return {
		nodeFill: style.getPropertyValue("--card").trim() || "#f8fafc",
		nodeStroke: style.getPropertyValue("--border").trim() || "#e2e8f0",
		textColor: style.getPropertyValue("--card-foreground").trim() || "#0f172a",
		linkStroke:
			style.getPropertyValue("--muted-foreground").trim() || "#64748b",
	};
}

function initDiagram(): go.Diagram {
	const $ = go.GraphObject.make;
	const colors = getThemeColors();

	const diagram = $(
		go.Diagram,
		{
			"undoManager.isEnabled": true,
			"undoManager.maxHistoryLength": 0,
			layout: $(
				go.TreeLayout,
				{
					angle: 90,
					layerSpacing: 36,
					nodeSpacing: 24,
					compaction: go.TreeLayout.CompactionBlock,
					alignment: go.TreeLayout.AlignmentCenterChildren,
				},
			),
			model: $(
				go.GraphLinksModel,
				{
					linkKeyProperty: "key",
					linkFromKeyProperty: "from",
					linkToKeyProperty: "to",
				},
				),
		},
	);

	diagram.nodeTemplate = $(
		go.Node,
		"Vertical",
		{
			selectionAdorned: true,
			locationSpot: go.Spot.Center,
			fromSpot: go.Spot.Bottom,
			toSpot: go.Spot.Top,
		},
		$(
			go.Panel,
			"Auto",
			$(
				go.Shape,
				"RoundedRectangle",
				{
					fill: colors.nodeFill,
					stroke: colors.nodeStroke,
					strokeWidth: 1.5,
					portId: "",
					fromLinkable: true,
					toLinkable: true,
					cursor: "pointer",
				}
			),
			$(
				go.Panel,
				"Vertical",
				{ margin: 12, minSize: new go.Size(100, 0) },
				$(
					go.TextBlock,
					{
						font: "600 14px system-ui, sans-serif",
						stroke: colors.textColor,
						wrap: go.TextBlock.WrapFit,
						textAlign: "center",
					},
					new go.Binding("text", "name")
				),
				$(
					go.TextBlock,
					{
						font: "12px system-ui, sans-serif",
						stroke: colors.textColor,
						opacity: 0.85,
						wrap: go.TextBlock.WrapFit,
						textAlign: "center",
					},
					new go.Binding("text", "birth", (b) => (b ? `* ${b}` : ""))
				)
			)
		)
	);

	diagram.linkTemplate = $(
		go.Link,
		{
			routing: go.Link.Orthogonal,
			corner: 4,
			selectable: false,
		},
		$(go.Shape, {
			stroke: colors.linkStroke,
			strokeWidth: 1.5,
			opacity: 0.6,
		})
	);

	return diagram;
}

export function FamilyTree({ sortByGender, focusName, onNotFound }: { sortByGender?: 'male'|'female'|'all'; focusName?: string; onNotFound?: (name?: string) => void }) {
	const { nodeDataArray, notFound } = useMemo(() => {
		let baseNodes = NODE_DATA;
		let notFoundLocal = false;

		if (focusName && focusName.trim() !== '') {
			const needle = focusName.trim().toLowerCase();
			const found = NODE_DATA.find((n) => n.name.toLowerCase().includes(needle));
			if (!found) {
				notFoundLocal = true;
				return { nodeDataArray: NODE_DATA, notFound: notFoundLocal };
			}

			// Statt nur den direkten Parent zu nehmen, klettere iterativ hoch
			let rootKey = found.key;
			let parentLink = LINK_DATA.find((l) => l.to === rootKey);
			while (parentLink) {
				rootKey = parentLink.from;
				parentLink = LINK_DATA.find((l) => l.to === rootKey);
			}

			const included = new Set<number>();
			const queue = [rootKey];
			while (queue.length) {
				const k = queue.shift()!;
				if (included.has(k)) continue;
				included.add(k);
				for (const l of LINK_DATA) {
					if (l.from === k && !included.has(l.to)) queue.push(l.to);
				}
			}

			baseNodes = NODE_DATA.filter((n) => included.has(n.key));
		}

		if (sortByGender && sortByGender !== 'all') {
			const wanted = sortByGender === 'male' ? 'M' : 'F';
			baseNodes = baseNodes.filter((n) => n.sex === wanted);
		}

		return { nodeDataArray: baseNodes, notFound: notFoundLocal };
	}, [sortByGender, focusName]);

	useEffect(() => {
		if (notFound) {
			onNotFound?.(focusName);
		}
	}, [notFound, focusName, onNotFound]);

	const linkDataArray = useMemo(() => {
		const nodeKeys = new Set(nodeDataArray.map((n) => n.key));
		return LINK_DATA.filter((l) => nodeKeys.has(l.from) && nodeKeys.has(l.to));
	}, [nodeDataArray]);

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
