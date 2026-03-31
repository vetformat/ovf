/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

/**
 * Represents an allergy or intolerance identified for a patient, including the causative substance, reaction details, and clinical status.
 */
export interface AllergyIntolerance {
  /**
   * Fixed resource type identifier for this schema.
   */
  resource_type: "AllergyIntolerance";
  /**
   * Unique identifier for the allergy/intolerance record. UUID recommended.
   */
  id: string;
  /**
   * Reference to the patient who has this allergy or intolerance.
   */
  patient_id: string;
  /**
   * Reference to the encounter during which this allergy or intolerance was identified.
   */
  encounter_id?: string;
  /**
   * Whether this represents a true allergy (immune-mediated) or an intolerance (non-immune).
   */
  type: "allergy" | "intolerance";
  /**
   * Category of the causative substance.
   */
  category: "food" | "medication" | "environment" | "other";
  /**
   * Name of the substance that causes the adverse reaction.
   */
  substance: string;
  /**
   * Current clinical status of the allergy or intolerance.
   */
  clinical_status: "active" | "inactive" | "resolved";
  /**
   * Estimate of the potential clinical harm or seriousness of future reactions.
   */
  criticality?: "low" | "high" | "unable-to-assess";
  /**
   * Date when the allergy or intolerance was first identified.
   */
  onset_date?: string;
  reaction?: Reaction;
  /**
   * Additional notes about the allergy or intolerance.
   */
  notes?: string;
}
/**
 * Details of the adverse reaction caused by the substance.
 *
 * This interface was referenced by `AllergyIntolerance`'s JSON-Schema
 * via the `definition` "reaction".
 */
export interface Reaction {
  /**
   * Clinical manifestation or symptom of the reaction.
   */
  manifestation?: string;
  /**
   * Severity of the reaction.
   */
  severity?: "mild" | "moderate" | "severe";
}
