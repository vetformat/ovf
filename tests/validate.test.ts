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
        const data = JSON.parse(readFileSync(file, "utf-8"));
        const valid = validate(data);
        expect(valid).toBe(false);
        expect(validate.errors).toBeDefined();
        expect(validate.errors!.length).toBeGreaterThan(0);
        for (const err of validate.errors!) {
          expect(err).toHaveProperty("instancePath");
          expect(err).toHaveProperty("message");
        }
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

  describe("enum validation", () => {
    const minimalPatient = (overrides: Record<string, unknown> = {}) => ({
      format_version: "1.0.0",
      exported_at: new Date().toISOString(),
      patient: {
        resource_type: "Patient",
        id: "test-1",
        name: "Test",
        species: "dog",
        ...overrides,
      },
    });

    it("should reject invalid species", () => {
      const data = minimalPatient({ species: "dinosaur" });
      expect(validate(data)).toBe(false);
    });

    it("should reject invalid sex", () => {
      const data = minimalPatient({ sex: "other" });
      expect(validate(data)).toBe(false);
    });

    it("should reject invalid gender_status", () => {
      const data = minimalPatient({ gender_status: "fixed" });
      expect(validate(data)).toBe(false);
    });

    it("should reject invalid encounter status", () => {
      const data = {
        ...minimalPatient(),
        encounters: [
          {
            resource_type: "Encounter",
            id: "enc-1",
            patient_id: "test-1",
            date: new Date().toISOString(),
            status: "pending",
            type: "consultation",
          },
        ],
      };
      expect(validate(data)).toBe(false);
    });

    it("should reject invalid encounter type", () => {
      const data = {
        ...minimalPatient(),
        encounters: [
          {
            resource_type: "Encounter",
            id: "enc-1",
            patient_id: "test-1",
            date: new Date().toISOString(),
            status: "completed",
            type: "checkup",
          },
        ],
      };
      expect(validate(data)).toBe(false);
    });

    it("should reject invalid condition clinical_status", () => {
      const data = {
        ...minimalPatient(),
        conditions: [
          {
            resource_type: "Condition",
            id: "cond-1",
            patient_id: "test-1",
            name: "Gastritis",
            clinical_status: "archived",
            code: {
              system: "icd-10-vet",
              value: "K29",
              display: "Gastritis",
            },
          },
        ],
      };
      expect(validate(data)).toBe(false);
    });

    it("should reject invalid observation category", () => {
      const data = {
        ...minimalPatient(),
        observations: [
          {
            resource_type: "Observation",
            id: "obs-1",
            patient_id: "test-1",
            name: "Body temperature",
            effective_date: new Date().toISOString(),
            code: {
              system: "loinc",
              value: "8310-5",
              display: "Body temperature",
            },
            category: "lab",
          },
        ],
      };
      expect(validate(data)).toBe(false);
    });
  });

  describe("date format validation", () => {
    it("should reject invalid date_of_birth format", () => {
      const data = {
        format_version: "1.0.0",
        exported_at: new Date().toISOString(),
        patient: {
          resource_type: "Patient",
          id: "test-1",
          name: "Test",
          species: "dog",
          date_of_birth: "not-a-date",
        },
      };
      expect(validate(data)).toBe(false);
    });

    it("should reject invalid encounter date format", () => {
      const data = {
        format_version: "1.0.0",
        exported_at: new Date().toISOString(),
        patient: {
          resource_type: "Patient",
          id: "test-1",
          name: "Test",
          species: "dog",
        },
        encounters: [
          {
            resource_type: "Encounter",
            id: "enc-1",
            patient_id: "test-1",
            date: "not-a-date",
            status: "completed",
            type: "consultation",
          },
        ],
      };
      expect(validate(data)).toBe(false);
    });

    it("should reject invalid condition onset_date format", () => {
      const data = {
        format_version: "1.0.0",
        exported_at: new Date().toISOString(),
        patient: {
          resource_type: "Patient",
          id: "test-1",
          name: "Test",
          species: "dog",
        },
        conditions: [
          {
            resource_type: "Condition",
            id: "cond-1",
            patient_id: "test-1",
            name: "Gastritis",
            clinical_status: "active",
            code: {
              system: "icd-10-vet",
              value: "K29",
              display: "Gastritis",
            },
            onset_date: "2026-13-01",
          },
        ],
      };
      expect(validate(data)).toBe(false);
    });
  });

  describe("boundary values", () => {
    it("should accept zero weight", () => {
      const data = {
        format_version: "1.0.0",
        exported_at: new Date().toISOString(),
        patient: {
          resource_type: "Patient",
          id: "test-1",
          name: "Test",
          species: "dog",
          weight: { value: 0, unit: "kg" },
        },
      };
      expect(validate(data)).toBe(true);
    });

    it("should reject null patient name", () => {
      const data = {
        format_version: "1.0.0",
        exported_at: new Date().toISOString(),
        patient: {
          resource_type: "Patient",
          id: "test-1",
          name: null,
          species: "dog",
        },
      };
      expect(validate(data)).toBe(false);
    });

    it("should reject wrong type for exported_at", () => {
      const data = {
        format_version: "1.0.0",
        exported_at: 12345,
        patient: {
          resource_type: "Patient",
          id: "test-1",
          name: "Test",
          species: "dog",
        },
      };
      expect(validate(data)).toBe(false);
    });

    it("should reject wrong type for conditions (string instead of array)", () => {
      const data = {
        format_version: "1.0.0",
        exported_at: new Date().toISOString(),
        patient: {
          resource_type: "Patient",
          id: "test-1",
          name: "Test",
          species: "dog",
        },
        conditions: "not-an-array",
      };
      expect(validate(data)).toBe(false);
    });
  });
});
