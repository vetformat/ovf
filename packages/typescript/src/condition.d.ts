/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

/**
 * Represents a clinical condition, diagnosis, or health problem identified for a patient.
 */
export interface Condition {
  /**
   * Fixed resource type identifier for this schema.
   */
  resource_type: "Condition";
  /**
   * Unique identifier for the condition record. UUID recommended.
   */
  id: string;
  /**
   * Reference to the patient this condition belongs to.
   */
  patient_id: string;
  /**
   * Reference to the encounter during which this condition was diagnosed.
   */
  encounter_id?: string;
  code?: Code;
  /**
   * Human-readable name of the diagnosis or condition.
   */
  name: string;
  /**
   * The clinical status of the condition.
   */
  clinical_status: "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved";
  /**
   * Subjective assessment of the condition severity.
   */
  severity?: "mild" | "moderate" | "severe";
  /**
   * Estimated or actual date when the condition first appeared.
   */
  onset_date?: string;
  /**
   * Date when the condition resolved or went into remission.
   */
  abatement_date?: string;
  /**
   * Additional clinical notes about the condition.
   */
  notes?: string;
  [k: string]: unknown;
}
/**
 * Coded representation of the condition using a standardized veterinary terminology system.
 *
 * This interface was referenced by `Condition`'s JSON-Schema
 * via the `definition` "code".
 */
export interface Code {
  /**
   * The coding system used.
   */
  system: "icd-10-vet" | "snomed-ct-vet" | "internal" | "other";
  /**
   * The code value within the specified system.
   */
  value: string;
  /**
   * Human-readable display text for the code.
   */
  display: string;
  [k: string]: unknown;
}
