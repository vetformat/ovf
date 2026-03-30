import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCHEMAS_DIR = resolve(ROOT, "schemas", "v1");
const EXAMPLES_DIR = resolve(ROOT, "examples");

function loadSchema(filename: string): Record<string, unknown> {
  const content = readFileSync(resolve(SCHEMAS_DIR, filename), "utf-8");
  return JSON.parse(content) as Record<string, unknown>;
}

function collectJsonFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...collectJsonFiles(fullPath));
    } else if (entry.endsWith(".json")) {
      results.push(fullPath);
    }
  }
  return results;
}

function createValidator(): InstanceType<typeof Ajv2020> {
  // strict: false is required because OVF schemas use relative file $ref
  // references which AJV strict mode rejects as unknown format
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  const schemaFiles = readdirSync(SCHEMAS_DIR).filter(
    (f) => f.endsWith(".schema.json") && f !== "ovf.schema.json"
  );

  for (const file of schemaFiles) {
    ajv.addSchema(loadSchema(file));
  }

  return ajv;
}

function main(): void {
  const ajv = createValidator();
  const rootSchema = loadSchema("ovf.schema.json");
  const validate = ajv.compile(rootSchema);

  const files = collectJsonFiles(EXAMPLES_DIR);

  if (files.length === 0) {
    console.log("No example files found.");
    process.exit(0);
  }

  let failures = 0;

  for (const file of files) {
    const relPath = relative(ROOT, file);
    const content = readFileSync(file, "utf-8");

    let data: unknown;
    try {
      data = JSON.parse(content);
    } catch (err) {
      console.error(
        `\x1b[31mFAIL\x1b[0m ${relPath} - Invalid JSON: ${err instanceof Error ? err.message : err}`
      );
      failures++;
      continue;
    }

    const valid = validate(data);

    if (valid) {
      console.log(`\x1b[32mPASS\x1b[0m ${relPath}`);
    } else {
      console.error(`\x1b[31mFAIL\x1b[0m ${relPath}`);
      for (const error of validate.errors ?? []) {
        console.error(
          `  - ${error.instancePath || "/"}: ${error.message}${error.params ? ` (${JSON.stringify(error.params)})` : ""}`
        );
      }
      failures++;
    }
  }

  console.log(
    `\n${files.length - failures}/${files.length} examples passed validation.`
  );

  if (failures > 0) {
    process.exit(1);
  }
}

main();
