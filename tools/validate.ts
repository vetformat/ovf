#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = resolve(__dirname, "..", "schemas", "v1");

function loadSchema(filename: string): Record<string, unknown> {
  const content = readFileSync(resolve(SCHEMAS_DIR, filename), "utf-8");
  return JSON.parse(content) as Record<string, unknown>;
}

function createValidator(): Ajv {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    loadSchema: async (uri: string) => {
      const filename = uri.split("/").pop()!;
      return loadSchema(filename);
    },
  });
  addFormats(ajv);

  const schemaFiles = [
    "patient.schema.json",
    "encounter.schema.json",
    "condition.schema.json",
    "observation.schema.json",
    "immunization.schema.json",
    "procedure.schema.json",
    "allergy-intolerance.schema.json",
    "medication-statement.schema.json",
    "document-reference.schema.json",
  ];

  for (const file of schemaFiles) {
    const schema = loadSchema(file);
    ajv.addSchema(schema);
  }

  return ajv;
}

function main(): void {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Usage: ovf-validate <file.json>");
    process.exit(1);
  }

  const absolutePath = resolve(filePath);

  let rawContent: string;
  try {
    rawContent = readFileSync(absolutePath, "utf-8");
  } catch {
    console.error(`\x1b[31mERROR:\x1b[0m File not found: ${absolutePath}`);
    process.exit(1);
  }

  let data: unknown;
  try {
    data = JSON.parse(rawContent);
  } catch (err) {
    console.error(
      `\x1b[31mERROR:\x1b[0m Invalid JSON in ${absolutePath}: ${err instanceof Error ? err.message : err}`
    );
    process.exit(1);
  }

  const ajv = createValidator();
  const rootSchema = loadSchema("ovf.schema.json");
  const validate = ajv.compile(rootSchema);
  const valid = validate(data);

  if (valid) {
    console.log(`\x1b[32mPASS\x1b[0m ${absolutePath}`);
    process.exit(0);
  } else {
    console.error(`\x1b[31mFAIL\x1b[0m ${absolutePath}`);
    for (const error of validate.errors ?? []) {
      console.error(
        `  - ${error.instancePath || "/"}: ${error.message}${error.params ? ` (${JSON.stringify(error.params)})` : ""}`
      );
    }
    process.exit(1);
  }
}

main();
