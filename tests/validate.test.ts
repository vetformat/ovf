import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, basename } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const SCHEMAS_DIR = resolve(__dirname, "..", "schemas", "v1");
const EXAMPLES_DIR = resolve(__dirname, "..", "examples");
const VALID_DIR = resolve(__dirname, "valid");
const INVALID_DIR = resolve(__dirname, "invalid");

function loadSchema(filename: string): Record<string, unknown> {
  const content = readFileSync(resolve(SCHEMAS_DIR, filename), "utf-8");
  return JSON.parse(content) as Record<string, unknown>;
}

function createValidator(): InstanceType<typeof Ajv2020> {
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

function collectJsonFiles(dir: string): string[] {
  const results: string[] = [];
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return results;
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

function getValidExamples(): string[] {
  return collectJsonFiles(VALID_DIR);
}

function getInvalidFixtures(): string[] {
  return collectJsonFiles(INVALID_DIR);
}

describe("OVF Schema Validation", () => {
  const ajv = createValidator();
  const rootSchema = loadSchema("ovf.schema.json");
  const validate = ajv.compile(rootSchema);

  describe("valid examples", () => {
    const validFiles = getValidExamples();

    if (validFiles.length === 0) {
      it.skip("no valid example files found", () => {});
    }

    for (const file of validFiles) {
      it(`should validate ${basename(file)}`, () => {
        const content = readFileSync(file, "utf-8");
        const data = JSON.parse(content);
        const valid = validate(data);
        if (!valid) {
          console.error("Validation errors:", validate.errors);
        }
        expect(valid).toBe(true);
      });
    }
  });

  describe("invalid fixtures", () => {
    const invalidFiles = getInvalidFixtures();

    if (invalidFiles.length === 0) {
      it.skip("no invalid fixture files found", () => {});
    }

    for (const file of invalidFiles) {
      it(`should reject ${basename(file)}`, () => {
        const content = readFileSync(file, "utf-8");
        const data = JSON.parse(content);
        const valid = validate(data);
        expect(valid).toBe(false);
        expect(validate.errors).toBeDefined();
        expect(validate.errors!.length).toBeGreaterThan(0);
      });
    }
  });

  describe("specific validation errors", () => {
    it("should require format_version", () => {
      const data = {
        exported_at: "2026-03-30T12:00:00Z",
        patient: {
          resource_type: "Patient",
          id: "test",
          name: "Test",
          species: "dog",
        },
      };
      const valid = validate(data);
      expect(valid).toBe(false);
      const paths = validate.errors?.map((e) => e.params);
      expect(paths).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ missingProperty: "format_version" }),
        ])
      );
    });

    it("should require exported_at", () => {
      const data = {
        format_version: "1.0.0",
        patient: {
          resource_type: "Patient",
          id: "test",
          name: "Test",
          species: "dog",
        },
      };
      const valid = validate(data);
      expect(valid).toBe(false);
      const paths = validate.errors?.map((e) => e.params);
      expect(paths).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ missingProperty: "exported_at" }),
        ])
      );
    });

    it("should require patient", () => {
      const data = {
        format_version: "1.0.0",
        exported_at: "2026-03-30T12:00:00Z",
      };
      const valid = validate(data);
      expect(valid).toBe(false);
      const paths = validate.errors?.map((e) => e.params);
      expect(paths).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ missingProperty: "patient" }),
        ])
      );
    });

    it("should reject invalid format_version pattern", () => {
      const data = {
        format_version: "v1",
        exported_at: "2026-03-30T12:00:00Z",
        patient: {
          resource_type: "Patient",
          id: "test",
          name: "Test",
          species: "dog",
        },
      };
      const valid = validate(data);
      expect(valid).toBe(false);
      expect(validate.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            keyword: "pattern",
            instancePath: "/format_version",
          }),
        ])
      );
    });

    it("should reject invalid exported_at format", () => {
      const data = {
        format_version: "1.0.0",
        exported_at: "not-a-date",
        patient: {
          resource_type: "Patient",
          id: "test",
          name: "Test",
          species: "dog",
        },
      };
      const valid = validate(data);
      expect(valid).toBe(false);
      expect(validate.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            keyword: "format",
            instancePath: "/exported_at",
          }),
        ])
      );
    });
  });
});
