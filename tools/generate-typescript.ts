import { compile } from "json-schema-to-typescript";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, basename } from "node:path";

const SCHEMAS_DIR = resolve(import.meta.dirname!, "../schemas/v1");
const OUTPUT_DIR = resolve(import.meta.dirname!, "../packages/typescript/src");

const BANNER = `/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run \`npm run generate:typescript\` to regenerate.
 */`;

function toTypeName(filename: string): string {
  return filename
    .replace(".schema.json", "")
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
}

// Mapping from schema $ref filenames to their exported top-level type
const REF_MAP: Record<string, { module: string; typeName: string }> = {};

async function main() {
  const schemaFiles = readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith(".schema.json") && f !== "ovf.schema.json")
    .sort();

  // Phase 1: Generate individual resource types
  for (const file of schemaFiles) {
    const schemaPath = resolve(SCHEMAS_DIR, file);
    let schema;
    try {
      schema = JSON.parse(readFileSync(schemaPath, "utf-8"));
    } catch (err) {
      console.error(`Failed to parse schema ${schemaPath}: ${err}`);
      process.exit(1);
    }
    const name = basename(file, ".schema.json");
    const typeName = schema.title
      ? schema.title.replace(/[^a-zA-Z0-9]/g, "")
      : toTypeName(file);

    const ts = await compile(schema, typeName, {
      cwd: SCHEMAS_DIR,
      bannerComment: BANNER,
      additionalProperties: false,
      unreachableDefinitions: true,
      style: { semi: true, singleQuote: false },
    });

    const outFile = `${name}.d.ts`;
    writeFileSync(resolve(OUTPUT_DIR, outFile), ts);
    console.log(`  Generated ${outFile}`);

    REF_MAP[file] = { module: `./${name}.d.ts`, typeName };
  }

  // Phase 2: Generate OVF root type manually with imports
  let ovfSchema;
  try {
    ovfSchema = JSON.parse(
      readFileSync(resolve(SCHEMAS_DIR, "ovf.schema.json"), "utf-8")
    );
  } catch (err) {
    console.error(`Failed to parse OVF schema: ${err}`);
    process.exit(1);
  }

  const imports: string[] = [];
  const seenTypes = new Set<string>();

  for (const [refFile, { module, typeName }] of Object.entries(REF_MAP)) {
    if (!seenTypes.has(typeName)) {
      imports.push(`import type { ${typeName} } from "${module}";`);
      seenTypes.add(typeName);
    }
  }

  // Also generate Exporter from $defs
  const exporterTs = await compile(
    ovfSchema.$defs.exporter,
    "Exporter",
    {
      bannerComment: "",
      additionalProperties: false,
      style: { semi: true, singleQuote: false },
    }
  );
  // Extract just the interface body (skip any extra banner)
  const exporterInterface = exporterTs.trim();

  const ovfContent = `${BANNER}

${imports.join("\n")}

${exporterInterface}

/**
 * ${ovfSchema.description}
 */
export interface OvfDocument {
  /** Semantic version of the OVF format used in this export. */
  format_version: string;
  /** Timestamp when this export was generated in ISO 8601 format. */
  exported_at: string;
  exporter?: Exporter;
  /** The patient whose medical records are contained in this export. */
  patient: Patient;
  /** Veterinary practitioners referenced by clinical resources in this export. */
  practitioners?: Practitioner[];
  /** Clinical encounters or visits for the patient. */
  encounters?: Encounter[];
  /** Diagnosed conditions or health problems for the patient. */
  conditions?: Condition[];
  /** Clinical observations and measurements for the patient. */
  observations?: Observation[];
  /** Vaccination records for the patient. */
  immunizations?: Immunization[];
  /** Clinical procedures performed on the patient. */
  procedures?: Procedure[];
  /** Allergies and intolerances identified for the patient. */
  allergy_intolerances?: AllergyIntolerance[];
  /** Medication records for the patient. */
  medication_statements?: MedicationStatement[];
  /** Documents and files associated with the patient. */
  document_references?: DocumentReference[];

}
`;

  writeFileSync(resolve(OUTPUT_DIR, "ovf.d.ts"), ovfContent);
  console.log("  Generated ovf.d.ts");

  // Phase 3: Generate barrel index
  const exportLines = [
    ...schemaFiles.map((file) => {
      const { module, typeName } = REF_MAP[file];
      return `export type { ${typeName} } from "${module}";`;
    }),
    `export type { OvfDocument, Exporter } from "./ovf.d.ts";`,
  ];

  // Re-export sub-types that consumers might need
  const reExports = schemaFiles.flatMap((file) => {
    const name = basename(file, ".schema.json");
    const schemaPath = resolve(SCHEMAS_DIR, file);
    let schema;
    try {
      schema = JSON.parse(readFileSync(schemaPath, "utf-8"));
    } catch (err) {
      console.error(`Failed to parse schema ${schemaPath}: ${err}`);
      process.exit(1);
    }
    if (!schema.$defs) return [];
    return Object.keys(schema.$defs).map((def) => {
      const defTypeName = toTypeName(def.replace(/_/g, "-"));
      return { module: `./${name}.d.ts`, typeName: defTypeName, schemaName: name };
    });
  });

  // Also collect types from centralized $defs in ovf.schema.json
  // that get inlined into resource schemas via $ref
  const ovfSchemaPath = resolve(SCHEMAS_DIR, "ovf.schema.json");
  let ovfSchemaForRefs;
  try {
    ovfSchemaForRefs = JSON.parse(readFileSync(ovfSchemaPath, "utf-8"));
  } catch (err) {
    console.error(`Failed to parse ${ovfSchemaPath}: ${err}`);
    process.exit(1);
  }

  if (ovfSchemaForRefs.$defs) {
    const centralizedTypes = ["code", "cost"]; // Types that are $ref'd by resource schemas
    for (const defName of centralizedTypes) {
      if (!ovfSchemaForRefs.$defs[defName]) continue;
      const defTypeName = toTypeName(defName.replace(/_/g, "-"));
      // Find which resource schemas reference this centralized type
      for (const file of schemaFiles) {
        const name = basename(file, ".schema.json");
        const schemaPath = resolve(SCHEMAS_DIR, file);
        let schema;
        try {
          schema = JSON.parse(readFileSync(schemaPath, "utf-8"));
        } catch { continue; }
        // Check if this schema references the centralized type
        const schemaStr = JSON.stringify(schema);
        if (schemaStr.includes(`ovf.schema.json#/$defs/${defName}`)) {
          reExports.push({
            module: `./${name}.d.ts`,
            typeName: defTypeName,
            schemaName: name,
          });
        }
      }
    }
  }

  // Group by typeName to find duplicates
  const byName = new Map<string, typeof reExports>();
  for (const entry of reExports) {
    const list = byName.get(entry.typeName) || [];
    list.push(entry);
    byName.set(entry.typeName, list);
  }

  // Generate exports with deduplication
  const seenInExportLines = new Set(
    exportLines.map((l) => l.match(/\{ (.+?) \}/)?.[1])
  );

  for (const [typeName, entries] of byName) {
    // Sort entries alphabetically by schema name for deterministic output
    entries.sort((a, b) => a.schemaName.localeCompare(b.schemaName));

    for (let i = 0; i < entries.length; i++) {
      const { module, schemaName } = entries[i];
      if (i === 0 && !seenInExportLines.has(typeName)) {
        // First occurrence: export without alias
        exportLines.push(`export type { ${typeName} } from "${module}";`);
        seenInExportLines.add(typeName);
      } else {
        // Duplicate: export with qualified alias
        const prefix = toTypeName(schemaName);
        const alias = `${prefix}${typeName}`;
        if (!seenInExportLines.has(alias)) {
          exportLines.push(`export type { ${typeName} as ${alias} } from "${module}";`);
          seenInExportLines.add(alias);
        }
      }
    }
  }

  const indexContent = `${BANNER}\n\n${exportLines.join("\n")}\n`;
  writeFileSync(resolve(OUTPUT_DIR, "index.d.ts"), indexContent);
  console.log("  Generated index.d.ts");

  console.log("\nTypeScript types generated successfully.");
}

main().catch((err) => {
  console.error("Failed to generate TypeScript types:", err);
  process.exit(1);
});
