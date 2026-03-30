/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

/**
 * Represents a clinical observation or measurement for a patient, including vital signs, lab results, imaging findings, and clinical notes.
 */
export interface Observation {
  /**
   * Fixed resource type identifier for this schema.
   */
  resource_type: "Observation";
  /**
   * Unique identifier for the observation record. UUID recommended.
   */
  id: string;
  /**
   * Reference to the patient this observation belongs to.
   */
  patient_id: string;
  /**
   * Reference to the encounter during which this observation was recorded.
   */
  encounter_id?: string;
  /**
   * The high-level category of the observation.
   */
  category: "vital-signs" | "laboratory" | "imaging" | "clinical-note" | "other";
  code?: Code;
  /**
   * Human-readable name of the observation.
   */
  name: string;
  /**
   * Date and time when the observation was clinically effective or measured.
   */
  effective_date: string;
  /**
   * The observed value. Can be a number, string, boolean, or structured object depending on the observation type.
   */
  value?:
    | number
    | string
    | boolean
    | {
        [k: string]: unknown;
      };
  /**
   * Hint for the semantic type of the value field. Helps LLMs and parsers interpret the value correctly without type inference. 'quantity' = numeric with unit, 'text' = free text or narrative, 'boolean' = yes/no result, 'ratio' = e.g. titer 1:128, 'range' = value expressed as a range, 'coded' = value from a controlled vocabulary, 'attachment' = reference to external data.
   */
  value_type?: "quantity" | "text" | "boolean" | "ratio" | "range" | "coded" | "attachment";
  /**
   * Unit of measurement for the observed value.
   */
  unit?: string;
  reference_range?: ReferenceRange;
  /**
   * Clinical interpretation of the observation value relative to reference ranges.
   */
  interpretation?: "normal" | "abnormal" | "low" | "high" | "critical";
  /**
   * Additional notes or context about the observation.
   */
  notes?: string;
  [k: string]: unknown;
}
/**
 * Coded representation of the observation type using a terminology system.
 *
 * This interface was referenced by `Observation`'s JSON-Schema
 * via the `definition` "code".
 */
export interface Code {
  /**
   * The coding system used (e.g., LOINC, SNOMED, internal).
   */
  system: string;
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
/**
 * The normal or expected range for this observation value.
 *
 * This interface was referenced by `Observation`'s JSON-Schema
 * via the `definition` "reference_range".
 */
export interface ReferenceRange {
  /**
   * Lower bound of the reference range.
   */
  low?: number;
  /**
   * Upper bound of the reference range.
   */
  high?: number;
  /**
   * Human-readable description of the reference range.
   */
  text?: string;
  [k: string]: unknown;
}
