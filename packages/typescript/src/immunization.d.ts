/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

/**
 * Represents a vaccination event for an animal patient, including vaccine details, dosage, and scheduling information.
 */
export interface Immunization {
  /**
   * Fixed resource type identifier for this schema.
   */
  resource_type: "Immunization";
  /**
   * Unique identifier for the immunization record. UUID recommended.
   */
  id: string;
  /**
   * Reference to the patient who received the vaccination.
   */
  patient_id: string;
  /**
   * Reference to the encounter during which the vaccination was administered.
   */
  encounter_id?: string;
  /**
   * Name of the vaccine product administered.
   */
  vaccine_name: string;
  vaccine_code?: VaccineCode;
  /**
   * Date the vaccination was administered in ISO 8601 format.
   */
  occurrence_date: string;
  /**
   * Date when the vaccine protection is expected to expire.
   */
  expiration_date?: string;
  /**
   * Recommended date for the next booster or dose.
   */
  next_dose_date?: string;
  /**
   * Manufacturer lot or batch number of the vaccine.
   */
  lot_number?: string;
  /**
   * Name of the vaccine manufacturer.
   */
  manufacturer?: string;
  /**
   * Route of administration for the vaccine.
   */
  route?: "intramuscular" | "subcutaneous" | "oral" | "intranasal" | "other";
  /**
   * Anatomical site where the vaccine was administered.
   */
  site?: string;
  dose_quantity?: DoseQuantity;
  practitioner?: Practitioner;
  /**
   * Whether this vaccination is part of the initial primary immunization course rather than a booster.
   */
  is_primary_course?: boolean;
  /**
   * Additional notes about the vaccination event.
   */
  notes?: string;
  cost?: Cost;
  [k: string]: unknown;
}
/**
 * Coded representation of the vaccine product.
 *
 * This interface was referenced by `Immunization`'s JSON-Schema
 * via the `definition` "vaccine_code".
 */
export interface VaccineCode {
  /**
   * The coding system for the vaccine (e.g., ATC-vet, CVX, internal).
   */
  system: string;
  /**
   * The vaccine code within the specified system.
   */
  value: string;
  [k: string]: unknown;
}
/**
 * The dosage amount administered.
 *
 * This interface was referenced by `Immunization`'s JSON-Schema
 * via the `definition` "dose_quantity".
 */
export interface DoseQuantity {
  /**
   * Numeric dose value.
   */
  value: number;
  /**
   * Unit of the dose (e.g., mL, dose).
   */
  unit: string;
  [k: string]: unknown;
}
/**
 * The veterinary practitioner who administered the vaccination.
 *
 * This interface was referenced by `Immunization`'s JSON-Schema
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
 * Cost information for this vaccination. Optional — useful for pet owners tracking health expenses.
 *
 * This interface was referenced by `Immunization`'s JSON-Schema
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
