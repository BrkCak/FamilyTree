import { useCallback, useEffect, useMemo, useState } from "react";
import { createFamilyNode, fetchFamilyTree } from "../model/api";
import { getAge, getChildrenMap, getGenerationMap, getParentMap } from "../model/selectors";
import type {
  AddMemberInput,
  FamilyLinkData,
  FamilyLinkViewData,
  FamilyNodeData,
  FamilyNodeViewData,
  GenderFilter,
  StatusFilter,
} from "../model/types";

function findNodesByKeys(nodes: FamilyNodeData[], keys: number[]) {
  return keys
    .map((key) => nodes.find((node) => node.key === key))
    .filter((node): node is FamilyNodeData => Boolean(node));
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unexpected error";
}

export function useFamilyTree() {
  const [nodes, setNodes] = useState<FamilyNodeData[]>([]);
  const [links, setLinks] = useState<FamilyLinkData[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [generationFilter, setGenerationFilter] = useState<string>("all");
  const [lineageMode, setLineageMode] = useState(false);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [newMember, setNewMember] = useState<AddMemberInput>({
    name: "",
    birthYear: "",
    gender: "F",
    city: "",
    parent: "none",
  });

  const refreshTree = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const tree = await fetchFamilyTree();
      setNodes(tree.nodes);
      setLinks(tree.links);
      setSelectedKey((prev) =>
        prev && tree.nodes.some((node) => node.key === prev) ? prev : null,
      );
    } catch (error) {
      setLoadError(normalizeError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshTree();
  }, [refreshTree]);

  const generationMap = useMemo(() => getGenerationMap(nodes, links), [nodes, links]);
  const maxGeneration = useMemo(() => Math.max(...Array.from(generationMap.values()), 0), [generationMap]);

  const parentMap = useMemo(() => getParentMap(links), [links]);
  const childrenMap = useMemo(() => getChildrenMap(links), [links]);

  const lineageSet = useMemo(() => {
    if (!selectedKey) {
      return new Set<number>();
    }

    const result = new Set<number>([selectedKey]);
    const upQueue = [selectedKey];
    while (upQueue.length > 0) {
      const key = upQueue.shift();
      if (key === undefined) {
        continue;
      }
      for (const parent of parentMap.get(key) || []) {
        if (!result.has(parent)) {
          result.add(parent);
          upQueue.push(parent);
        }
      }
    }

    const downQueue = [selectedKey];
    while (downQueue.length > 0) {
      const key = downQueue.shift();
      if (key === undefined) {
        continue;
      }
      for (const child of childrenMap.get(key) || []) {
        if (!result.has(child)) {
          result.add(child);
          downQueue.push(child);
        }
      }
    }

    return result;
  }, [selectedKey, parentMap, childrenMap]);

  const filteredNodes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return nodes.filter((node) => {
      if (normalizedQuery && !node.name.toLowerCase().includes(normalizedQuery)) {
        return false;
      }

      if (genderFilter !== "all" && node.sex !== genderFilter) {
        return false;
      }

      if (statusFilter === "living" && node.deathYear) {
        return false;
      }

      if (statusFilter === "deceased" && !node.deathYear) {
        return false;
      }

      if (generationFilter !== "all" && generationMap.get(node.key) !== Number(generationFilter)) {
        return false;
      }

      if (lineageMode && selectedKey && !lineageSet.has(node.key)) {
        return false;
      }

      return true;
    });
  }, [nodes, query, genderFilter, statusFilter, generationFilter, generationMap, lineageMode, selectedKey, lineageSet]);

  const visibleNodeKeys = useMemo(() => new Set(filteredNodes.map((node) => node.key)), [filteredNodes]);

  const nodeDataArray: FamilyNodeViewData[] = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return filteredNodes.map((node) => ({
      ...node,
      age: getAge(node),
      generation: generationMap.get(node.key) || 0,
      lifespanLabel: node.deathYear
        ? `${node.birthYear} - ${node.deathYear} (${getAge(node)} yrs)`
        : `${node.birthYear} - present (${getAge(node)} yrs)`,
      isSelected: selectedKey === node.key,
      isDirectLine: lineageSet.has(node.key) && selectedKey !== node.key,
      isSearchHit: normalizedQuery.length > 0 && node.name.toLowerCase().includes(normalizedQuery),
    }));
  }, [filteredNodes, query, generationMap, selectedKey, lineageSet]);

  const linkDataArray: FamilyLinkViewData[] = useMemo(
    () =>
      links
        .filter((link) => visibleNodeKeys.has(link.from) && visibleNodeKeys.has(link.to))
        .map((link) => ({
          ...link,
          isLineage: lineageSet.has(link.from) && lineageSet.has(link.to),
        })),
    [links, visibleNodeKeys, lineageSet],
  );

  const selectedMember = useMemo(
    () => nodes.find((node) => node.key === selectedKey) || null,
    [nodes, selectedKey],
  );

  const selectedParents = useMemo(
    () => (selectedMember ? findNodesByKeys(nodes, parentMap.get(selectedMember.key) || []) : []),
    [nodes, parentMap, selectedMember],
  );

  const selectedChildren = useMemo(
    () => (selectedMember ? findNodesByKeys(nodes, childrenMap.get(selectedMember.key) || []) : []),
    [nodes, childrenMap, selectedMember],
  );

  const selectedSiblings = useMemo(() => {
    if (!selectedMember) {
      return [];
    }

    const siblingKeys = new Set<number>();
    for (const parentKey of parentMap.get(selectedMember.key) || []) {
      for (const childKey of childrenMap.get(parentKey) || []) {
        if (childKey !== selectedMember.key) {
          siblingKeys.add(childKey);
        }
      }
    }

    return findNodesByKeys(nodes, Array.from(siblingKeys));
  }, [nodes, parentMap, childrenMap, selectedMember]);

  const totalMembers = nodes.length;
  const livingMembers = nodes.filter((node) => !node.deathYear).length;
  const averageAge = nodes.length
    ? Math.round(nodes.reduce((total, node) => total + getAge(node), 0) / nodes.length)
    : 0;

  const updateNewMember = <K extends keyof AddMemberInput>(field: K, value: AddMemberInput[K]) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
  };

  const addMember = async () => {
    setFormError(null);
    const trimmedName = newMember.name.trim();
    const birthYear = Number(newMember.birthYear);
    const currentYear = new Date().getFullYear();

    if (!trimmedName) {
      setFormError("Name is required.");
      return;
    }

    if (!Number.isFinite(birthYear) || birthYear < 1850 || birthYear > currentYear) {
      setFormError(`Birth year must be between 1850 and ${currentYear}.`);
      return;
    }

    try {
      const created = await createFamilyNode({
        name: trimmedName,
        birthYear,
        sex: newMember.gender,
        city: newMember.city.trim() || undefined,
        parentId: newMember.parent !== "none" ? Number(newMember.parent) : undefined,
      });

      setNewMember({
        name: "",
        birthYear: "",
        gender: "F",
        city: "",
        parent: "none",
      });

      await refreshTree();
      setSelectedKey(created.node.key);
    } catch (error) {
      setFormError(normalizeError(error));
    }
  };

  const clearFilters = () => {
    setQuery("");
    setGenderFilter("all");
    setStatusFilter("all");
    setGenerationFilter("all");
    setLineageMode(false);
  };

  return {
    nodes,
    isLoading,
    loadError,
    refreshTree,
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
    filteredCount: filteredNodes.length,
    totalMembers,
    maxGeneration,
    livingMembers,
    averageAge,
    selectedMember,
    selectedParents,
    selectedChildren,
    selectedSiblings,
    selectedGeneration: selectedMember ? generationMap.get(selectedMember.key) || 0 : null,
    newMember,
    updateNewMember,
    addMember,
    formError,
    clearFilters,
  };
}
