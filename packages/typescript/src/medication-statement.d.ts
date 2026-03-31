/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

/**
 * Represents a record of medication being taken by or administered to a patient, including dosage, frequency, and prescriber information.
 */
export interface MedicationStatement {
  /**
   * Fixed resource type identifier for this schema.
   */
  resource_type: "MedicationStatement";
  /**
   * Unique identifier for the medication statement record. UUID recommended.
   */
  id: string;
  /**
   * Reference to the patient taking or receiving the medication.
   */
  patient_id: string;
  /**
   * Reference to the encounter during which the medication was prescribed or recorded.
   */
  encounter_id?: string;
  /**
   * Name of the medication.
   */
  medication_name: string;
  medication_code?: MedicationCode;
  /**
   * Current status of the medication usage.
   */
  status: "active" | "completed" | "stopped" | "on-hold";
  /**
   * Date when the medication was started.
   */
  date_started?: string;
  /**
   * Date when the medication was stopped or completed.
   */
  date_ended?: string;
  dosage?: Dosage;
  /**
   * Clinical reason or indication for the medication.
   */
  reason?: string;
  /**
   * Reference to the practitioner who prescribed the medication. Must match an id in the top-level practitioners array.
   */
  prescriber_id?: string;
  /**
   * Additional notes about the medication statement.
   */
  notes?: string;
}
/**
 * Coded representation of the medication product.
 *
 * This interface was referenced by `MedicationStatement`'s JSON-Schema
 * via the `definition` "medication_code".
 */
export interface MedicationCode {
  /**
   * The coding system used (e.g., ATC-vet, RxNorm, internal).
   */
  system: string;
  /**
   * The medication code within the specified system.
   */
  value: string;
}
/**
 * Dosage instructions for the medication.
 *
 * This interface was referenced by `MedicationStatement`'s JSON-Schema
 * via the `definition` "dosage".
 */
export interface Dosage {
  /**
   * Numeric dose amount per administration.
   */
  value?: number;
  /**
   * Unit of the dose amount.
   */
  unit?: string;
  /**
   * How often the medication is administered.
   */
  frequency?:
    | "once-daily"
    | "twice-daily"
    | "three-times-daily"
    | "four-times-daily"
    | "every-other-day"
    | "once-weekly"
    | "twice-weekly"
    | "as-needed"
    | "other";
  /**
   * Free-text frequency description when 'other' is selected or additional detail is needed.
   */
  frequency_text?: string;
  /**
   * Route of administration.
   */
  route?: "oral" | "topical" | "injection" | "inhalation" | "other";
}
