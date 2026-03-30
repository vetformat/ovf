#!/usr/bin/env node

/**
 * Generates Starlight MDX pages from OVF JSON Schema files.
 *
 * Single source of truth: schemas/v1/*.schema.json → docs-site/src/content/docs/schemas/*.mdx
 * Also generates example pages from examples/*.json.
 *
 * Usage: npx tsx docs-site/scripts/generate-docs.ts
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { resolve, basename, dirname } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "..");
const SCHEMAS_DIR = resolve(ROOT, "schemas", "v1");
const EXAMPLES_DIR = resolve(ROOT, "examples");
const OUT_SCHEMAS = resolve(ROOT, "docs-site", "src", "content", "docs", "schemas");
const OUT_EXAMPLES = resolve(ROOT, "docs-site", "src", "content", "docs", "examples");

// ─── Types ───────────────────────────────────────────────────────────────────

interface SchemaProperty {
  type?: string;
  const?: string;
  enum?: string[];
  format?: string;
  description?: string;
  examples?: unknown[];
  $ref?: string;
  minimum?: number;
  default?: unknown;
  oneOf?: SchemaProperty[];
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

interface Schema {
  $id?: string;
  title?: string;
  description?: string;
  type?: string;
  required?: string[];
  properties?: Record<string, SchemaProperty>;
  $defs?: Record<string, SchemaProperty>;
  additionalProperties?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadSchema(filename: string): Schema {
  return JSON.parse(readFileSync(resolve(SCHEMAS_DIR, filename), "utf-8"));
}

function slugFromFilename(filename: string): string {
  return basename(filename, ".schema.json");
}

function typeString(prop: SchemaProperty): string {
  if (prop.const) return `\`"${prop.const}"\``;
  if (prop.oneOf) {
    return prop.oneOf.map((o) => `\`${o.type}\``).join(" \\| ");
  }
  if (prop.enum) return `enum`;
  if (prop.$ref) {
    const refName = prop.$ref.replace("#/$defs/", "").replace(".schema.json", "");
    return `[${refName}]`;
  }
  if (prop.type === "array" && prop.items) {
    if (prop.items.$ref) {
      const refName = prop.items.$ref.replace("#/$defs/", "").replace(".schema.json", "");
      return `array\\<${refName}\\>`;
    }
    return `array\\<${prop.items.type || "object"}\\>`;
  }
  let t = prop.type || "any";
  if (prop.format) t += ` (${prop.format})`;
  return `\`${t}\``;
}

function exampleValue(prop: SchemaProperty): string {
  if (!prop.examples || prop.examples.length === 0) return "";
  const ex = prop.examples[0];
  if (typeof ex === "string") return `\`"${ex}"\``;
  if (typeof ex === "number" || typeof ex === "boolean") return `\`${ex}\``;
  return "";
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// ─── Schema page generation ─────────────────────────────────────────────────

function generateFieldTable(
  properties: Record<string, SchemaProperty>,
  required: string[],
  defs: Record<string, SchemaProperty>
): string {
  const rows: string[] = [];
  rows.push("| Field | Type | Required | Description |");
  rows.push("|-------|------|----------|-------------|");

  for (const [name, prop] of Object.entries(properties)) {
    const isRequired = required.includes(name) ? "Yes" : "No";
    const desc = prop.description || "";
    const type = typeString(prop);
    rows.push(`| \`${name}\` | ${type} | ${isRequired} | ${desc} |`);
  }

  return rows.join("\n");
}

function generateEnumSection(name: string, prop: SchemaProperty): string {
  if (!prop.enum) return "";
  const items = prop.enum.map((v) => `- \`${v}\``).join("\n");
  return `\n### \`${name}\` values\n\n${items}\n`;
}

function generateDefSection(name: string, def: SchemaProperty): string {
  if (!def.properties) return "";

  const lines: string[] = [];
  lines.push(`\n### \`${name}\` object\n`);
  if (def.description) lines.push(`${def.description}\n`);

  lines.push("| Field | Type | Required | Description |");
  lines.push("|-------|------|----------|-------------|");

  const required = def.required || [];
  for (const [fname, fprop] of Object.entries(def.properties)) {
    const isReq = required.includes(fname) ? "Yes" : "No";
    lines.push(`| \`${fname}\` | ${typeString(fprop)} | ${isReq} | ${fprop.description || ""} |`);
  }

  // Nested enums
  for (const [fname, fprop] of Object.entries(def.properties)) {
    if (fprop.enum) {
      lines.push(generateEnumSection(`${name}.${fname}`, fprop));
    }
  }

  return lines.join("\n");
}

function generateSchemaPage(filename: string): string {
  const schema = loadSchema(filename);
  const slug = slugFromFilename(filename);
  const title = schema.title || slug;
  const required = schema.required || [];
  const properties = schema.properties || {};
  const defs = schema.$defs || {};

  const lines: string[] = [];

  // Frontmatter
  lines.push("---");
  lines.push(`title: "${title}"`);
  lines.push(`description: "${(schema.description || "").replace(/"/g, '\\"')}"`);
  lines.push("---");
  lines.push("");
  lines.push(`{/* Auto-generated from schemas/v1/${filename} — do not edit manually */}`);
  lines.push("");

  // Description
  if (schema.description) {
    lines.push(schema.description);
    lines.push("");
  }

  // Schema ID
  if (schema.$id) {
    lines.push(`**Schema ID:** \`${schema.$id}\`\n`);
  }

  // Fields table
  lines.push("## Fields\n");
  lines.push(generateFieldTable(properties, required, defs));
  lines.push("");

  // Enum sections for top-level properties
  for (const [name, prop] of Object.entries(properties)) {
    const enumMd = generateEnumSection(name, prop);
    if (enumMd) lines.push(enumMd);
  }

  // $defs sections
  if (Object.keys(defs).length > 0) {
    lines.push("## Sub-objects\n");
    for (const [name, def] of Object.entries(defs)) {
      lines.push(generateDefSection(name, def));
    }
  }

  // Full schema JSON
  lines.push("\n## Full Schema\n");
  lines.push("```json");
  lines.push(JSON.stringify(schema, null, 2));
  lines.push("```\n");

  return lines.join("\n");
}

// ─── Example page generation ────────────────────────────────────────────────

function generateExamplePage(filePath: string, name: string): string {
  const content = readFileSync(filePath, "utf-8");
  const data = JSON.parse(content);

  const title = name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const patientName = data.patient?.name || "Unknown";
  const species = data.patient?.species || "unknown";
  const resourceCounts: string[] = [];

  for (const key of ["encounters", "conditions", "observations", "immunizations", "procedures", "allergy_intolerances", "medication_statements", "document_references"]) {
    const arr = data[key];
    if (arr && arr.length > 0) {
      resourceCounts.push(`- **${key.replace(/_/g, " ")}**: ${arr.length}`);
    }
  }

  const lines: string[] = [];
  lines.push("---");
  lines.push(`title: "${title}"`);
  lines.push(`description: "Example OVF document: ${title}"`);
  lines.push("---");
  lines.push("");
  lines.push(`{/* Auto-generated from examples/${basename(filePath)} — do not edit manually */}`);
  lines.push("");
  lines.push(`**Patient:** ${patientName} (${species})\n`);

  if (resourceCounts.length > 0) {
    lines.push("**Resources included:**\n");
    lines.push(resourceCounts.join("\n"));
    lines.push("");
  }

  lines.push("## Full Document\n");
  lines.push("```json");
  lines.push(JSON.stringify(data, null, 2));
  lines.push("```\n");

  return lines.join("\n");
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  ensureDir(OUT_SCHEMAS);
  ensureDir(OUT_EXAMPLES);

  // Generate schema pages
  const schemaFiles = readdirSync(SCHEMAS_DIR).filter((f) =>
    f.endsWith(".schema.json")
  );

  console.log("Generating schema pages...");
  for (const file of schemaFiles) {
    const slug = slugFromFilename(file);
    const content = generateSchemaPage(file);
    const outPath = resolve(OUT_SCHEMAS, `${slug}.mdx`);
    writeFileSync(outPath, content);
    console.log(`  ${slug}.mdx`);
  }

  // Generate overview page
  const overviewLines: string[] = [];
  overviewLines.push("---");
  overviewLines.push('title: "Schema Overview"');
  overviewLines.push('description: "All OVF resource types at a glance"');
  overviewLines.push("---");
  overviewLines.push("");
  overviewLines.push("{/* Auto-generated — do not edit manually */}");
  overviewLines.push("");
  overviewLines.push("The Open Vet Format defines 9 resource types plus a root export schema.\n");
  overviewLines.push("| Resource | Description |");
  overviewLines.push("|----------|-------------|");

  for (const file of schemaFiles) {
    const schema = loadSchema(file);
    const slug = slugFromFilename(file);
    const title = schema.title || slug;
    const desc = schema.description || "";
    const shortDesc = desc.length > 120 ? desc.slice(0, 117) + "..." : desc;
    overviewLines.push(`| [${title}](/schemas/${slug}/) | ${shortDesc} |`);
  }

  overviewLines.push("");
  writeFileSync(resolve(OUT_SCHEMAS, "overview.mdx"), overviewLines.join("\n"));
  console.log("  overview.mdx");

  // Generate example pages
  console.log("\nGenerating example pages...");

  // Top-level examples
  const exampleFiles = readdirSync(EXAMPLES_DIR).filter((f) => f.endsWith(".json"));
  for (const file of exampleFiles) {
    const name = basename(file, ".json");
    const content = generateExamplePage(resolve(EXAMPLES_DIR, file), name);
    writeFileSync(resolve(OUT_EXAMPLES, `${name}.mdx`), content);
    console.log(`  ${name}.mdx`);
  }

  // Edge cases
  const edgeCasesDir = resolve(EXAMPLES_DIR, "edge-cases");
  if (existsSync(edgeCasesDir)) {
    const edgeFiles = readdirSync(edgeCasesDir).filter((f) => f.endsWith(".json"));
    for (const file of edgeFiles) {
      const name = `edge-${basename(file, ".json")}`;
      const content = generateExamplePage(resolve(edgeCasesDir, file), name);
      writeFileSync(resolve(OUT_EXAMPLES, `${name}.mdx`), content);
      console.log(`  ${name}.mdx`);
    }
  }

  // Copy raw schemas to public/ so $id URLs resolve
  const publicSchemas = resolve(ROOT, "docs-site", "public", "schemas", "v1");
  ensureDir(publicSchemas);
  for (const file of schemaFiles) {
    const content = readFileSync(resolve(SCHEMAS_DIR, file), "utf-8");
    writeFileSync(resolve(publicSchemas, file), content);
  }
  console.log(`\nCopied ${schemaFiles.length} schemas to public/schemas/v1/`);

  console.log("Done! Generated pages are in docs-site/src/content/docs/");
}

main();
