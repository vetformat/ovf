/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

/**
 * A veterinary practitioner — a licensed professional involved in patient care. Referenced by encounters, procedures, immunizations, and medication statements.
 */
export interface Practitioner {
  /**
   * Fixed resource type identifier for this schema.
   */
  resource_type: "Practitioner";
  /**
   * Unique identifier for the practitioner. UUID recommended.
   */
  id: string;
  /**
   * Full name of the practitioner.
   */
  name: string;
  /**
   * Professional license or registration number issued by the veterinary chamber.
   */
  license_number?: string;
  /**
   * Name of the veterinary clinic or hospital where the practitioner works.
   */
  clinic?: string;
  /**
   * Areas of specialization (e.g., surgery, dermatology, dentistry).
   */
  specializations?: string[];
  /**
   * Contact information for the practitioner.
   */
  contact?: {
    /**
     * Phone number.
     */
    phone?: string;
    /**
     * Email address.
     */
    email?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
