/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

/**
 * Represents a clinical encounter or visit between a patient and a veterinary practitioner.
 */
export interface Encounter {
  /**
   * Fixed resource type identifier for this schema.
   */
  resource_type: "Encounter";
  /**
   * Unique identifier for the encounter. UUID recommended.
   */
  id: string;
  /**
   * Reference to the patient this encounter belongs to.
   */
  patient_id: string;
  /**
   * Current status of the encounter.
   */
  status: "planned" | "in-progress" | "completed" | "cancelled";
  /**
   * The category or type of encounter.
   */
  type?:
    | "consultation"
    | "emergency"
    | "follow-up"
    | "vaccination"
    | "surgery"
    | "dental"
    | "grooming"
    | "telehealth"
    | "other";
  /**
   * Start date and time of the encounter in ISO 8601 format.
   */
  date: string;
  /**
   * End date and time of the encounter in ISO 8601 format.
   */
  end_date?: string;
  /**
   * The chief complaint or reason for the visit.
   */
  reason?: string;
  practitioner?: Practitioner;
  /**
   * Clinical notes or summary of the encounter.
   */
  notes?: string;
  /**
   * Array of condition IDs diagnosed during this encounter. References entries in the conditions array.
   */
  diagnoses?: string[];
  /**
   * Human-readable names of diagnoses for this encounter. Parallel array to diagnoses — same order, same length. Enables standalone readability without cross-referencing the conditions array.
   */
  diagnoses_display?: string[];
  cost?: Cost;
  [k: string]: unknown;
}
/**
 * The veterinary practitioner involved in this encounter.
 *
 * This interface was referenced by `Encounter`'s JSON-Schema
 * via the `definition` "practitioner".
 */
export interface Practitioner {
  /**
   * Full name of the practitioner.
   */
  name?: string;
  /**
   * Professional license or registration number.
   */
  license_number?: string;
  /**
   * Name of the veterinary clinic or hospital.
   */
  clinic?: string;
  [k: string]: unknown;
}
/**
 * Cost information for this encounter. Optional — useful for pet owners tracking health expenses.
 *
 * This interface was referenced by `Encounter`'s JSON-Schema
 * via the `definition` "cost".
 */
export interface Cost {
  /**
   * Total cost amount.
   */
  amount: number;
  /**
   * ISO 4217 currency code.
   */
  currency: string;
  [k: string]: unknown;
}
