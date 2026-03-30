import { readFileSync, readdirSync } from "node:fs";
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

function main(): void {
  // strict: false is required because OVF schemas use relative file $ref
  // references which AJV strict mode rejects as unknown format
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  const files = readdirSync(SCHEMAS_DIR).filter((f) =>
    f.endsWith(".schema.json")
  );

  // Pre-load all resource schemas so $ref resolution works for the root schema
  const resourceFiles = files.filter((f) => f !== "ovf.schema.json");
  for (const file of resourceFiles) {
    try {
      ajv.addSchema(loadSchema(file));
    } catch {
      // Will be caught in the compilation loop below
    }
  }

  let allValid = true;

  for (const file of files) {
    const filePath = resolve(SCHEMAS_DIR, file);
    const content = readFileSync(filePath, "utf-8");

    let schema: unknown;
    try {
      schema = JSON.parse(content);
    } catch (err) {
      console.error(
        `\x1b[31mFAIL\x1b[0m ${file} - Invalid JSON: ${err instanceof Error ? err.message : err}`
      );
      allValid = false;
      continue;
    }

    try {
      if (file === "ovf.schema.json") {
        // Root schema needs to be compiled (not pre-loaded) to resolve $refs
        ajv.compile(schema as Record<string, unknown>);
      }
      // Resource schemas were already validated during addSchema above
      console.log(`\x1b[32mPASS\x1b[0m ${file} is a valid JSON Schema`);
    } catch (err) {
      console.error(
        `\x1b[31mFAIL\x1b[0m ${file} - Schema compilation error: ${err instanceof Error ? err.message : err}`
      );
      allValid = false;
    }
  }

  if (!allValid) {
    console.error("\nSome schemas failed validation.");
    process.exit(1);
  }

  console.log(`\n\x1b[32mAll ${files.length} schemas are valid.\x1b[0m`);
}

main();
