import type { FamilyLinkData, FamilyNodeData } from "./types";

export function getAge(node: FamilyNodeData) {
  const currentYear = new Date().getFullYear();
  return (node.deathYear || currentYear) - node.birthYear;
}

export function getGenerationMap(nodes: FamilyNodeData[], links: FamilyLinkData[]) {
  const nodeKeys = new Set(nodes.map((node) => node.key));
  const incoming = new Map<number, number>();
  const childrenByParent = new Map<number, number[]>();

  for (const link of links) {
    if (!nodeKeys.has(link.from) || !nodeKeys.has(link.to)) {
      continue;
    }

    incoming.set(link.to, (incoming.get(link.to) || 0) + 1);
    childrenByParent.set(link.from, [...(childrenByParent.get(link.from) || []), link.to]);
  }

  const generationMap = new Map<number, number>();
  const queue: number[] = [];

  for (const key of nodeKeys) {
    if (!incoming.get(key)) {
      generationMap.set(key, 0);
      queue.push(key);
    }
  }

  while (queue.length > 0) {
    const parentKey = queue.shift();
    if (parentKey === undefined) {
      continue;
    }

    const parentGeneration = generationMap.get(parentKey) || 0;
    for (const childKey of childrenByParent.get(parentKey) || []) {
      const nextGeneration = parentGeneration + 1;
      const currentGeneration = generationMap.get(childKey);

      if (currentGeneration === undefined || nextGeneration < currentGeneration) {
        generationMap.set(childKey, nextGeneration);
        queue.push(childKey);
      }
    }
  }

  for (const key of nodeKeys) {
    if (!generationMap.has(key)) {
      generationMap.set(key, 0);
    }
  }

  return generationMap;
}

export function getParentMap(links: FamilyLinkData[]) {
  const parentMap = new Map<number, number[]>();
  for (const link of links) {
    parentMap.set(link.to, [...(parentMap.get(link.to) || []), link.from]);
  }
  return parentMap;
}

export function getChildrenMap(links: FamilyLinkData[]) {
  const childrenMap = new Map<number, number[]>();
  for (const link of links) {
    childrenMap.set(link.from, [...(childrenMap.get(link.from) || []), link.to]);
  }
  return childrenMap;
}
