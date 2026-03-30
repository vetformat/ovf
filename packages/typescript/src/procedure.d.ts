/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

/**
 * Represents a clinical procedure performed on a patient, including surgeries, dental work, diagnostics, and therapeutic interventions.
 */
export interface Procedure {
  /**
   * Fixed resource type identifier for this schema.
   */
  resource_type: "Procedure";
  /**
   * Unique identifier for the procedure record. UUID recommended.
   */
  id: string;
  /**
   * Reference to the patient on whom the procedure was performed.
   */
  patient_id: string;
  /**
   * Reference to the encounter during which the procedure was performed.
   */
  encounter_id?: string;
  /**
   * Human-readable name of the procedure.
   */
  name: string;
  code?: Code;
  /**
   * Current status of the procedure.
   */
  status: "planned" | "in-progress" | "completed" | "cancelled";
  /**
   * The high-level category of the procedure.
   */
  category?: "surgery" | "dental" | "diagnostic" | "therapeutic" | "grooming" | "other";
  /**
   * Date and time when the procedure was performed or started.
   */
  performed_date: string;
  /**
   * Date and time when the procedure ended.
   */
  end_date?: string;
  practitioner?: Practitioner;
  anesthesia?: Anesthesia;
  /**
   * Description of the procedure outcome.
   */
  outcome?: string;
  /**
   * Any complications that occurred during or after the procedure.
   */
  complications?: string;
  /**
   * Additional notes about the procedure.
   */
  notes?: string;
  cost?: Cost;
  [k: string]: unknown;
}
/**
 * Coded representation of the procedure using a standardized terminology system.
 *
 * This interface was referenced by `Procedure`'s JSON-Schema
 * via the `definition` "code".
 */
export interface Code {
  /**
   * The coding system used (e.g., SNOMED-CT-vet, CPT-vet, internal).
   */
  system: string;
  /**
   * The procedure code within the specified system.
   */
  value: string;
  /**
   * Human-readable display text for the code.
   */
  display: string;
  [k: string]: unknown;
}
/**
 * The veterinary practitioner who performed the procedure.
 *
 * This interface was referenced by `Procedure`'s JSON-Schema
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
  [k: string]: unknown;
}
/**
 * Anesthesia details for the procedure.
 *
 * This interface was referenced by `Procedure`'s JSON-Schema
 * via the `definition` "anesthesia".
 */
export interface Anesthesia {
  /**
   * Type of anesthesia administered.
   */
  type?: "general" | "local" | "sedation" | "none";
  /**
   * Name of the anesthetic agent used.
   */
  agent?: string;
  [k: string]: unknown;
}
/**
 * Cost information for this procedure. Optional — useful for pet owners tracking health expenses.
 *
 * This interface was referenced by `Procedure`'s JSON-Schema
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
