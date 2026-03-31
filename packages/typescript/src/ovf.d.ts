/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

import type { AllergyIntolerance } from "./allergy-intolerance.d.ts";
import type { Condition } from "./condition.d.ts";
import type { DocumentReference } from "./document-reference.d.ts";
import type { Encounter } from "./encounter.d.ts";
import type { Immunization } from "./immunization.d.ts";
import type { MedicationStatement } from "./medication-statement.d.ts";
import type { Observation } from "./observation.d.ts";
import type { Patient } from "./patient.d.ts";
import type { Practitioner } from "./practitioner.d.ts";
import type { Procedure } from "./procedure.d.ts";

/**
 * Information about the software that generated this OVF export.
 */
export interface Exporter {
  /**
   * Name of the exporting software or system.
   */
  name?: string;
  /**
   * Version of the exporting software.
   */
  version?: string;
}

/**
 * Root export schema for the Open Vet Format (OVF). Wraps all veterinary medical record resources for a single patient into a portable, interoperable document.
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
  [k: string]: unknown;
}
