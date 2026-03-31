/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

/**
 * Represents an animal patient in a veterinary practice. Contains demographic, identification, and owner information.
 */
export interface Patient {
  /**
   * Fixed resource type identifier for this schema.
   */
  resource_type: "Patient";
  /**
   * Unique identifier for the patient record. UUID recommended.
   */
  id: string;
  /**
   * The pet's given name.
   */
  name: string;
  /**
   * The animal species of the patient.
   */
  species:
    | "dog"
    | "cat"
    | "bird"
    | "rabbit"
    | "hamster"
    | "guinea_pig"
    | "ferret"
    | "fish"
    | "reptile"
    | "amphibian"
    | "horse"
    | "cattle"
    | "sheep"
    | "goat"
    | "pig"
    | "poultry"
    | "other";
  /**
   * Breed or breed mix of the patient in free-text form.
   */
  breed?: string;
  breed_code?: BreedCode;
  species_code?: SpeciesCode;
  /**
   * The patient's date of birth in ISO 8601 format.
   */
  date_of_birth?: string;
  /**
   * Biological sex of the patient.
   */
  sex?: "male" | "female" | "unknown";
  /**
   * Reproductive status of the patient.
   */
  gender_status?: "intact" | "neutered" | "spayed" | "unknown";
  /**
   * Coat or skin color description of the patient.
   */
  color?: string;
  weight?: Weight;
  /**
   * External identifiers such as microchip numbers or passport IDs.
   */
  identifiers?: Identifier[];
  owner?: Owner;
  /**
   * Whether this patient record is currently active in the practice.
   */
  is_active?: boolean;
  /**
   * Whether the patient is deceased.
   */
  is_deceased?: boolean;
  /**
   * Date of death in ISO 8601 format, if applicable.
   */
  deceased_date?: string;
  /**
   * Free-text notes about the patient.
   */
  notes?: string;
  /**
   * URL to a photo of the patient.
   */
  photo_url?: string;
}
/**
 * Standardized breed classification code from a recognized registry.
 *
 * This interface was referenced by `Patient`'s JSON-Schema
 * via the `definition` "breed_code".
 */
export interface BreedCode {
  /**
   * The breed registry system used for classification.
   */
  system: "fci" | "fife" | "tica" | "akc" | "the-kennel-club" | "other";
  /**
   * The breed code value within the specified registry system.
   */
  value: string;
}
/**
 * Standardized species classification code from a recognized taxonomy.
 *
 * This interface was referenced by `Patient`'s JSON-Schema
 * via the `definition` "species_code".
 */
export interface SpeciesCode {
  /**
   * The taxonomy system used for species classification.
   */
  system: "itis" | "ncbi-taxonomy" | "other";
  /**
   * The species code within the specified taxonomy system.
   */
  value: string;
}
/**
 * The patient's body weight measurement.
 *
 * This interface was referenced by `Patient`'s JSON-Schema
 * via the `definition` "weight".
 */
export interface Weight {
  /**
   * Numeric weight value. Must be zero or positive.
   */
  value: number;
  /**
   * Unit of weight measurement.
   */
  unit: "kg" | "lbs";
}
/**
 * An external identifier for the patient, such as a microchip or passport number.
 *
 * This interface was referenced by `Patient`'s JSON-Schema
 * via the `definition` "identifier".
 */
export interface Identifier {
  /**
   * The identification system or namespace.
   */
  system: "iso-microchip-11784" | "eu-pet-passport" | "safe-animal" | "europetnet" | "national-registry" | "other";
  /**
   * The identifier value within the specified system.
   */
  value: string;
}
/**
 * Contact information for the patient's owner or guardian.
 *
 * This interface was referenced by `Patient`'s JSON-Schema
 * via the `definition` "owner".
 */
export interface Owner {
  /**
   * Full name of the owner.
   */
  name?: string;
  /**
   * Phone number of the owner.
   */
  phone?: string;
  /**
   * Email address of the owner.
   */
  email?: string;
  /**
   * Postal address of the owner.
   */
  address?: string;
}
