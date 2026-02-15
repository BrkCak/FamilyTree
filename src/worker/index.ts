import { Hono } from "hono";

interface Bindings {
  familyStorage: D1Database;
}

interface NodeRow {
  id: number;
  name: string;
  birth_year: number;
  death_year: number | null;
  sex: "M" | "F" | "X" | null;
  city: string | null;
  notes: string | null;
}

interface LinkRow {
  id: number;
  parent_id: number;
  child_id: number;
}

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/family/tree", async (c) => {
  const nodesResult = await c.env.familyStorage
    .prepare(
      "SELECT id, name, birth_year, death_year, sex, city, notes FROM family_nodes ORDER BY birth_year ASC, id ASC",
    )
    .all<NodeRow>();

  const linksResult = await c.env.familyStorage
    .prepare("SELECT id, parent_id, child_id FROM family_links ORDER BY id ASC")
    .all<LinkRow>();

  const nodeRows = (nodesResult.results || []) as NodeRow[];
  const linkRows = (linksResult.results || []) as LinkRow[];

  const nodes = nodeRows.map((row) => ({
    key: row.id,
    name: row.name,
    birthYear: row.birth_year,
    deathYear: row.death_year ?? undefined,
    sex: row.sex ?? "X",
    city: row.city ?? undefined,
    notes: row.notes ?? undefined,
  }));

  const links = linkRows.map((row) => ({
    key: row.id,
    from: row.parent_id,
    to: row.child_id,
  }));

  return c.json({ nodes, links });
});

app.post("/api/family/nodes", async (c) => {
  const payload = (await c.req.json()) as {
    name?: string;
    birthYear?: number;
    sex?: "M" | "F" | "X";
    city?: string;
    notes?: string;
    parentId?: number;
  };

  const name = payload.name?.trim();
  const birthYear = Number(payload.birthYear);
  const sex = payload.sex;
  const city = payload.city?.trim() || null;
  const notes = payload.notes?.trim() || null;
  const parentId = payload.parentId;

  if (!name) {
    return c.json({ error: "Name is required." }, 400);
  }

  if (!Number.isInteger(birthYear) || birthYear < 1850 || birthYear > new Date().getFullYear()) {
    return c.json({ error: "Birth year is invalid." }, 400);
  }

  if (sex !== "M" && sex !== "F" && sex !== "X") {
    return c.json({ error: "Sex must be M, F, or X." }, 400);
  }

  if (parentId !== undefined && !Number.isInteger(parentId)) {
    return c.json({ error: "Parent ID must be a valid integer." }, 400);
  }

  const insertNodeResult = await c.env.familyStorage
    .prepare("INSERT INTO family_nodes (name, birth_year, death_year, sex, city, notes) VALUES (?1, ?2, NULL, ?3, ?4, ?5)")
    .bind(name, birthYear, sex, city, notes)
    .run();

  const newNodeId = Number(insertNodeResult.meta.last_row_id);

  let createdLink: { key: number; from: number; to: number } | undefined;
  if (parentId !== undefined) {
    const parentExists = await c.env.familyStorage
      .prepare("SELECT 1 as present FROM family_nodes WHERE id = ?1 LIMIT 1")
      .bind(parentId)
      .first<{ present: number }>();

    if (!parentExists) {
      await c.env.familyStorage
        .prepare("DELETE FROM family_nodes WHERE id = ?1")
        .bind(newNodeId)
        .run();
      return c.json({ error: "Parent not found." }, 400);
    }

    const insertLinkResult = await c.env.familyStorage
      .prepare("INSERT INTO family_links (parent_id, child_id) VALUES (?1, ?2)")
      .bind(parentId, newNodeId)
      .run();

    createdLink = {
      key: Number(insertLinkResult.meta.last_row_id),
      from: parentId,
      to: newNodeId,
    };
  }

  return c.json(
    {
      node: {
        key: newNodeId,
        name,
        birthYear,
        sex,
        city: city ?? undefined,
        notes: notes ?? undefined,
      },
      link: createdLink,
    },
    201,
  );
});

export default app;
