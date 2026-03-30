/* eslint-disable */
/**
 * This file was automatically generated from the OVF JSON Schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
 * run `npm run generate:typescript` to regenerate.
 */

/**
 * Represents a reference to a clinical document or file associated with a patient, such as lab reports, imaging studies, discharge summaries, or invoices.
 */
export interface DocumentReference {
  /**
   * Fixed resource type identifier for this schema.
   */
  resource_type: "DocumentReference";
  /**
   * Unique identifier for the document reference record. UUID recommended.
   */
  id: string;
  /**
   * Reference to the patient this document is associated with.
   */
  patient_id: string;
  /**
   * Reference to the encounter during which this document was created or obtained.
   */
  encounter_id?: string;
  /**
   * The category or type of document.
   */
  type: "lab-report" | "imaging" | "discharge-summary" | "referral" | "consent" | "invoice" | "other";
  /**
   * Human-readable description of the document.
   */
  description?: string;
  /**
   * Date and time the document was created or obtained.
   */
  date: string;
  /**
   * MIME type of the document content.
   */
  content_type?: string;
  /**
   * URL where the document can be retrieved.
   */
  url?: string;
  /**
   * Base64-encoded content of the document. Use for inline embedding of small documents.
   */
  data?: string;
  /**
   * Size of the document content in bytes.
   */
  size_bytes?: number;
  /**
   * SHA-256 hash of the document content for integrity verification.
   */
  hash?: string;
  author?: Author;
  /**
   * Additional notes about the document.
   */
  notes?: string;
  [k: string]: unknown;
}
/**
 * The person who authored or created the document.
 *
 * This interface was referenced by `DocumentReference`'s JSON-Schema
 * via the `definition` "author".
 */
export interface Author {
  /**
   * Full name of the document author.
   */
  name?: string;
  [k: string]: unknown;
}
