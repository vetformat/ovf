<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Open Vet Format (OVF) Specification

**Version:** 1.0.0
**Status:** Draft
**Date:** 2026-03-30

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

---

## 1. Document Structure

An OVF document is a JSON object that represents a veterinary patient record with associated clinical data.

### 1.1 Top-Level Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `format_version` | string (semver) | MUST | The OVF schema version this document conforms to, e.g. `"1.0.0"`. |
| `exported_at` | string (ISO 8601 datetime) | MUST | Timestamp when this document was generated, e.g. `"2026-03-30T12:00:00Z"`. |
| `patient` | Patient | MUST | The patient resource this document describes. |
| `exporter` | object | SHOULD | Information about the software that produced this document. |
| `exporter.name` | string | SHOULD | Name of the exporting application. |
| `exporter.version` | string | SHOULD | Version of the exporting application. |
| `encounters` | Encounter[] | MAY | Array of encounter resources. MAY be omitted or empty. |
| `conditions` | Condition[] | MAY | Array of condition resources. MAY be omitted or empty. |
| `observations` | Observation[] | MAY | Array of observation resources. MAY be omitted or empty. |
| `immunizations` | Immunization[] | MAY | Array of immunization resources. MAY be omitted or empty. |
| `procedures` | Procedure[] | MAY | Array of procedure resources. MAY be omitted or empty. |
| `practitioners` | Practitioner[] | MAY | Array of practitioner resources referenced by clinical resources. MAY be omitted or empty. |
| `allergy_intolerances` | AllergyIntolerance[] | MAY | Array of allergy/intolerance resources. MAY be omitted or empty. |
| `medication_statements` | MedicationStatement[] | MAY | Array of medication statement resources. MAY be omitted or empty. |
| `document_references` | DocumentReference[] | MAY | Array of document reference resources. MAY be omitted or empty. |

### 1.2 Encoding

- An OVF document MUST be encoded as UTF-8 JSON.
- An OVF document MUST use the `.json` file extension.
- An OVF document SHOULD be pretty-printed with 2-space indentation for human readability.

---

## 2. Conformance Levels

### 2.1 OVF Core

A conforming **OVF Core** document MUST satisfy all of the following:

1. Contains `format_version`, `exported_at`, and `patient` at the top level.
2. The `patient` resource passes validation against the Patient schema.
3. Contains at least one additional resource array (e.g. `encounters`, `conditions`) with at least one valid entry.

### 2.2 OVF Complete

A conforming **OVF Complete** document MUST satisfy all of the following:

1. Meets all OVF Core requirements.
2. Contains all 10 resource types: `patient`, `practitioners`, `encounters`, `conditions`, `observations`, `immunizations`, `procedures`, `allergy_intolerances`, `medication_statements`, and `document_references`.
3. Each resource array contains at least one valid entry.

---

## 3. Resource Types

### 3.1 Patient

Represents an animal patient in a veterinary practice.

**Required fields:** `resource_type`, `id`, `name`, `species`

| Field | Type | Required | Description |
|---|---|---|---|
| `resource_type` | const `"Patient"` | MUST | Fixed resource type identifier. |
| `id` | string | MUST | Unique identifier for the patient. UUID recommended. |
| `name` | string | MUST | The pet's given name. |
| `species` | string (enum) | MUST | Animal species. See [Species Enum](#41-species). |
| `breed` | string | MAY | Breed or breed mix in free-text form. |
| `breed_code` | object | MAY | Standardized breed code. See [Breed Code](#311-breed-code). |
| `date_of_birth` | string (date) | MAY | Date of birth in ISO 8601 format (`YYYY-MM-DD`). |
| `sex` | string (enum) | MAY | Biological sex: `male`, `female`, `unknown`. |
| `gender_status` | string (enum) | MAY | Reproductive status: `intact`, `neutered`, `spayed`, `unknown`. |
| `color` | string | MAY | Coat or skin color description. |
| `weight` | object | MAY | Body weight. See [Weight](#312-weight). |
| `identifiers` | Identifier[] | MAY | External identifiers (microchip, passport, etc.). See [Identifier](#313-identifier). |
| `owner` | object | MAY | Owner contact information. See [Owner](#314-owner). |
| `is_active` | boolean | MAY | Whether the patient record is active. Default: `true`. |
| `is_deceased` | boolean | MAY | Whether the patient is deceased. Default: `false`. |
| `deceased_date` | string (date) | MAY | Date of death in ISO 8601 format. |
| `notes` | string | MAY | Free-text notes about the patient. |
| `photo_url` | string (uri) | MAY | URL to a photo of the patient. |

#### 3.1.1 Breed Code

| Field | Type | Required | Description |
|---|---|---|---|
| `system` | string (enum) | MUST | Breed registry system: `fci`, `fife`, `tica`, `other`. |
| `value` | string | MUST | Breed code value within the registry. |

#### 3.1.2 Weight

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | number (>= 0) | MUST | Numeric weight value. |
| `unit` | string (enum) | MUST | Unit: `kg`, `lbs`. |

#### 3.1.3 Identifier

| Field | Type | Required | Description |
|---|---|---|---|
| `system` | string (enum) | MUST | Identification system. See [Identifier Systems](#8-identifiers). |
| `value` | string | MUST | Identifier value within the system. |

#### 3.1.4 Owner

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | MAY | Full name of the owner. |
| `phone` | string | MAY | Phone number. |
| `email` | string | MAY | Email address. |
| `address` | string | MAY | Postal address. |

---

### 3.2 Encounter

Represents a clinical encounter or visit between a patient and a veterinary practitioner.

**Required fields:** `resource_type`, `id`, `patient_id`, `status`, `date`

| Field | Type | Required | Description |
|---|---|---|---|
| `resource_type` | const `"Encounter"` | MUST | Fixed resource type identifier. |
| `id` | string | MUST | Unique identifier. UUID recommended. |
| `patient_id` | string | MUST | Reference to the patient. |
| `status` | string (enum) | MUST | Encounter status. See [Encounter Status](#42-encounter-status). |
| `type` | string (enum) | MAY | Encounter type. See [Encounter Type](#43-encounter-type). |
| `date` | string (date-time) | MUST | Start date/time in ISO 8601. |
| `end_date` | string (date-time) | MAY | End date/time in ISO 8601. |
| `reason` | string | MAY | Chief complaint or reason for the visit. |
| `practitioner_id` | string | MAY | Reference to a practitioner in the top-level `practitioners` array. |
| `notes` | string | MAY | Clinical notes or summary. |
| `diagnoses` | string[] | MAY | Array of condition IDs diagnosed during this encounter. |
| `diagnoses_display` | string[] | MAY | Human-readable names of diagnoses, parallel to `diagnoses`. |
| `cost` | object | MAY | Cost information (amount + currency). |

---

### 3.3 Condition

Represents a clinical condition, diagnosis, or health problem.

**Required fields:** `resource_type`, `id`, `patient_id`, `name`, `clinical_status`

| Field | Type | Required | Description |
|---|---|---|---|
| `resource_type` | const `"Condition"` | MUST | Fixed resource type identifier. |
| `id` | string | MUST | Unique identifier. UUID recommended. |
| `patient_id` | string | MUST | Reference to the patient. |
| `encounter_id` | string | MAY | Reference to the diagnosing encounter. |
| `code` | object | MAY | Coded condition. See [Condition Code](#331-condition-code). |
| `name` | string | MUST | Human-readable condition name. |
| `clinical_status` | string (enum) | MUST | See [Condition Clinical Status](#44-condition-clinical-status). |
| `severity` | string (enum) | MAY | Severity: `mild`, `moderate`, `severe`. |
| `onset_date` | string (date) | MAY | Date condition first appeared. |
| `abatement_date` | string (date) | MAY | Date condition resolved or entered remission. |
| `notes` | string | MAY | Additional clinical notes. |

#### 3.3.1 Condition Code

| Field | Type | Required | Description |
|---|---|---|---|
| `system` | string (enum) | MUST | Coding system: `icd-10-vet`, `snomed-ct-vet`, `internal`, `other`. |
| `value` | string | MUST | Code value. |
| `display` | string | MUST | Human-readable display text. |

---

### 3.4 Observation

Represents a clinical observation or measurement.

**Required fields:** `resource_type`, `id`, `patient_id`, `category`, `name`, `effective_date`

| Field | Type | Required | Description |
|---|---|---|---|
| `resource_type` | const `"Observation"` | MUST | Fixed resource type identifier. |
| `id` | string | MUST | Unique identifier. UUID recommended. |
| `patient_id` | string | MUST | Reference to the patient. |
| `encounter_id` | string | MAY | Reference to the encounter. |
| `category` | string (enum) | MUST | See [Observation Category](#45-observation-category). |
| `code` | object | MAY | Coded observation type (system + value + display). |
| `name` | string | MUST | Human-readable observation name. |
| `effective_date` | string (date-time) | MUST | Date/time the observation was measured. |
| `value` | number, string, boolean, or object | MAY | The observed value. |
| `unit` | string | MAY | Unit of measurement. |
| `reference_range` | object | MAY | Expected range. See [Reference Range](#341-reference-range). |
| `interpretation` | string (enum) | MAY | Interpretation: `normal`, `abnormal`, `low`, `high`, `critical`. |
| `notes` | string | MAY | Additional notes. |

#### 3.4.1 Reference Range

| Field | Type | Required | Description |
|---|---|---|---|
| `low` | number | MAY | Lower bound. |
| `high` | number | MAY | Upper bound. |
| `text` | string | MAY | Human-readable range description. |

---

### 3.5 Immunization

Represents a vaccination event.

**Required fields:** `resource_type`, `id`, `patient_id`, `vaccine_name`, `occurrence_date`

| Field | Type | Required | Description |
|---|---|---|---|
| `resource_type` | const `"Immunization"` | MUST | Fixed resource type identifier. |
| `id` | string | MUST | Unique identifier. UUID recommended. |
| `patient_id` | string | MUST | Reference to the patient. |
| `encounter_id` | string | MAY | Reference to the encounter. |
| `vaccine_name` | string | MUST | Name of the vaccine product. |
| `vaccine_code` | object | MAY | Coded vaccine (system + value). |
| `occurrence_date` | string (date) | MUST | Date the vaccination was administered. |
| `expiration_date` | string (date) | MAY | Date vaccine protection expires. |
| `next_dose_date` | string (date) | MAY | Recommended date for next booster. |
| `lot_number` | string | MAY | Manufacturer lot/batch number. |
| `manufacturer` | string | MAY | Vaccine manufacturer name. |
| `route` | string (enum) | MAY | Route: `intramuscular`, `subcutaneous`, `oral`, `intranasal`, `other`. |
| `site` | string | MAY | Anatomical site of administration. |
| `dose_quantity` | object | MAY | Dosage amount (value + unit). |
| `practitioner_id` | string | MAY | Reference to the administering practitioner in the top-level `practitioners` array. |
| `is_primary_course` | boolean | MAY | Whether this is part of the initial immunization course. |
| `notes` | string | MAY | Additional notes. |

---

### 3.6 Procedure

Represents a clinical procedure performed on a patient.

**Required fields:** `resource_type`, `id`, `patient_id`, `name`, `status`, `performed_date`

| Field | Type | Required | Description |
|---|---|---|---|
| `resource_type` | const `"Procedure"` | MUST | Fixed resource type identifier. |
| `id` | string | MUST | Unique identifier. UUID recommended. |
| `patient_id` | string | MUST | Reference to the patient. |
| `encounter_id` | string | MAY | Reference to the encounter. |
| `name` | string | MUST | Human-readable procedure name. |
| `code` | object | MAY | Coded procedure (system + value + display). |
| `status` | string (enum) | MUST | Status: `planned`, `in-progress`, `completed`, `cancelled`. |
| `category` | string (enum) | MAY | See [Procedure Category](#46-procedure-category). |
| `performed_date` | string (date-time) | MUST | Date/time the procedure was performed. |
| `end_date` | string (date-time) | MAY | Date/time the procedure ended. |
| `practitioner_id` | string | MAY | Reference to the performing practitioner in the top-level `practitioners` array. |
| `anesthesia` | object | MAY | Anesthesia details. See [Anesthesia](#361-anesthesia). |
| `outcome` | string | MAY | Description of procedure outcome. |
| `complications` | string | MAY | Complications during or after the procedure. |
| `notes` | string | MAY | Additional notes. |

#### 3.6.1 Anesthesia

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string (enum) | MAY | Anesthesia type: `general`, `local`, `sedation`, `none`. |
| `agent` | string | MAY | Anesthetic agent used. |

---

### 3.7 AllergyIntolerance

Represents an allergy or intolerance identified for a patient.

**Required fields:** `resource_type`, `id`, `patient_id`, `type`, `category`, `substance`, `clinical_status`

| Field | Type | Required | Description |
|---|---|---|---|
| `resource_type` | const `"AllergyIntolerance"` | MUST | Fixed resource type identifier. |
| `id` | string | MUST | Unique identifier. UUID recommended. |
| `patient_id` | string | MUST | Reference to the patient. |
| `encounter_id` | string | MAY | Reference to the identifying encounter. |
| `type` | string (enum) | MUST | `allergy` (immune-mediated) or `intolerance` (non-immune). |
| `category` | string (enum) | MUST | Substance category: `food`, `medication`, `environment`, `other`. |
| `substance` | string | MUST | Name of the causative substance. |
| `clinical_status` | string (enum) | MUST | Status: `active`, `inactive`, `resolved`. |
| `criticality` | string (enum) | MAY | Criticality: `low`, `high`, `unable-to-assess`. |
| `onset_date` | string (date) | MAY | Date first identified. |
| `reaction` | object | MAY | Reaction details. See [Reaction](#371-reaction). |
| `notes` | string | MAY | Additional notes. |

#### 3.7.1 Reaction

| Field | Type | Required | Description |
|---|---|---|---|
| `manifestation` | string | MAY | Clinical manifestation or symptom. |
| `severity` | string (enum) | MAY | Severity: `mild`, `moderate`, `severe`. |

---

### 3.8 MedicationStatement

Represents a medication being taken by or administered to a patient.

**Required fields:** `resource_type`, `id`, `patient_id`, `medication_name`, `status`

| Field | Type | Required | Description |
|---|---|---|---|
| `resource_type` | const `"MedicationStatement"` | MUST | Fixed resource type identifier. |
| `id` | string | MUST | Unique identifier. UUID recommended. |
| `patient_id` | string | MUST | Reference to the patient. |
| `encounter_id` | string | MAY | Reference to the encounter. |
| `medication_name` | string | MUST | Name of the medication. |
| `medication_code` | object | MAY | Coded medication (system + value). |
| `status` | string (enum) | MUST | Status: `active`, `completed`, `stopped`, `on-hold`. |
| `date_started` | string (date) | MAY | Date medication was started. |
| `date_ended` | string (date) | MAY | Date medication was stopped. |
| `dosage` | object | MAY | Dosage instructions. See [Dosage](#381-dosage). |
| `reason` | string | MAY | Clinical reason for the medication. |
| `prescriber_id` | string | MAY | Reference to the prescribing practitioner in the top-level `practitioners` array. |
| `notes` | string | MAY | Additional notes. |

#### 3.8.1 Dosage

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | number | MAY | Dose amount per administration. |
| `unit` | string | MAY | Unit of the dose. |
| `frequency` | string | MAY | Administration frequency (e.g. "twice daily"). |
| `route` | string (enum) | MAY | Route: `oral`, `topical`, `injection`, `inhalation`, `other`. |

---

### 3.9 DocumentReference

Represents a reference to a clinical document or file.

**Required fields:** `resource_type`, `id`, `patient_id`, `type`, `date`

| Field | Type | Required | Description |
|---|---|---|---|
| `resource_type` | const `"DocumentReference"` | MUST | Fixed resource type identifier. |
| `id` | string | MUST | Unique identifier. UUID recommended. |
| `patient_id` | string | MUST | Reference to the patient. |
| `encounter_id` | string | MAY | Reference to the encounter. |
| `type` | string (enum) | MUST | Document type. See [Document Type](#47-document-type). |
| `description` | string | MAY | Human-readable description. |
| `date` | string (date-time) | MUST | Date/time the document was created. |
| `content_type` | string | MAY | MIME type (e.g. `application/pdf`). |
| `url` | string (uri) | MAY | URL where the document can be retrieved. |
| `data` | string | MAY | Base64-encoded document content for inline embedding. |
| `size_bytes` | integer | MAY | Document size in bytes. |
| `hash` | string | MAY | SHA-256 hash for integrity verification. |
| `author` | object | MAY | Document author (name). |
| `notes` | string | MAY | Additional notes. |

---

### 3.10 Practitioner

Represents a veterinary practitioner — a licensed professional involved in patient care. Practitioners are defined once in the top-level `practitioners` array and referenced by ID from encounters, procedures, immunizations, and medication statements.

**Required fields:** `resource_type`, `id`, `name`

| Field | Type | Required | Description |
|---|---|---|---|
| `resource_type` | const `"Practitioner"` | MUST | Fixed resource type identifier. |
| `id` | string | MUST | Unique identifier. UUID recommended. |
| `name` | string | MUST | Full name of the practitioner. |
| `license_number` | string | MAY | Professional license or registration number issued by the veterinary chamber. |
| `clinic` | string | MAY | Name of the veterinary clinic or hospital. |
| `specializations` | string[] | MAY | Areas of specialization (e.g. `"surgery"`, `"dermatology"`, `"dentistry"`). |
| `contact` | object | MAY | Contact information. See [Practitioner Contact](#3101-practitioner-contact). |

#### 3.10.1 Practitioner Contact

| Field | Type | Required | Description |
|---|---|---|---|
| `phone` | string | MAY | Phone number. |
| `email` | string (email) | MAY | Email address. |

---

## 4. Controlled Vocabularies

### 4.1 Species

| Value | Description |
|---|---|
| `dog` | Domestic dog (Canis lupus familiaris) |
| `cat` | Domestic cat (Felis catus) |
| `bird` | Avian species |
| `rabbit` | Domestic rabbit (Oryctolagus cuniculus) |
| `hamster` | Hamster species (Cricetinae) |
| `guinea_pig` | Guinea pig (Cavia porcellus) |
| `fish` | Aquatic fish species |
| `reptile` | Reptilian species (snakes, lizards, turtles, etc.) |
| `horse` | Domestic horse (Equus ferus caballus) |
| `other` | Any species not listed above |

### 4.2 Encounter Status

| Value | Description |
|---|---|
| `planned` | The encounter is scheduled but has not started. |
| `in-progress` | The encounter is currently underway. |
| `completed` | The encounter has finished. |
| `cancelled` | The encounter was cancelled before completion. |

### 4.3 Encounter Type

| Value | Description |
|---|---|
| `consultation` | General consultation or office visit. |
| `emergency` | Emergency or urgent care visit. |
| `follow-up` | Follow-up visit for a previous condition or procedure. |
| `vaccination` | Visit primarily for vaccination. |
| `surgery` | Surgical procedure visit. |
| `dental` | Dental examination or procedure. |
| `grooming` | Grooming services. |
| `telehealth` | Remote consultation via video/phone. |
| `other` | Encounter type not listed above. |

### 4.4 Condition Clinical Status

| Value | Description |
|---|---|
| `active` | The condition is currently active and being managed. |
| `recurrence` | The condition has returned after a period of resolution. |
| `relapse` | The condition has worsened after a period of improvement. |
| `inactive` | The condition is no longer active but not formally resolved. |
| `remission` | The condition is in remission. |
| `resolved` | The condition has been fully resolved. |

### 4.5 Observation Category

| Value | Description |
|---|---|
| `vital-signs` | Vital sign measurements (temperature, heart rate, respiratory rate, etc.). |
| `laboratory` | Laboratory test results (blood work, urinalysis, etc.). |
| `imaging` | Imaging study findings (X-ray, ultrasound, etc.). |
| `clinical-note` | Clinical observation recorded as a note. |
| `other` | Observation category not listed above. |

### 4.6 Procedure Category

| Value | Description |
|---|---|
| `surgery` | Surgical procedure. |
| `dental` | Dental procedure. |
| `diagnostic` | Diagnostic procedure (e.g. biopsy, endoscopy). |
| `therapeutic` | Therapeutic procedure (e.g. fluid therapy, wound care). |
| `grooming` | Grooming procedure. |
| `other` | Procedure category not listed above. |

### 4.7 Document Type

| Value | Description |
|---|---|
| `lab-report` | Laboratory test report. |
| `imaging` | Imaging study (X-ray, ultrasound, MRI, etc.). |
| `discharge-summary` | Discharge summary from hospitalization. |
| `referral` | Referral letter to a specialist. |
| `consent` | Owner consent form. |
| `invoice` | Billing invoice. |
| `other` | Document type not listed above. |

### 4.8 Observation Interpretation

| Value | Description |
|---|---|
| `normal` | Value is within the normal reference range. |
| `abnormal` | Value is outside the normal reference range. |
| `low` | Value is below the reference range. |
| `high` | Value is above the reference range. |
| `critical` | Value is critically abnormal and requires immediate attention. |

### 4.9 Immunization Route

| Value | Description |
|---|---|
| `intramuscular` | Injection into muscle tissue. |
| `subcutaneous` | Injection under the skin. |
| `oral` | Administered by mouth. |
| `intranasal` | Administered through the nose. |
| `other` | Route not listed above. |

### 4.10 Medication Dosage Route

| Value | Description |
|---|---|
| `oral` | Administered by mouth. |
| `topical` | Applied to the skin surface. |
| `injection` | Administered by injection (any route). |
| `inhalation` | Administered by inhalation. |
| `other` | Route not listed above. |

### 4.11 Anesthesia Type

| Value | Description |
|---|---|
| `general` | General anesthesia (full unconsciousness). |
| `local` | Local anesthesia (regional numbing). |
| `sedation` | Sedation without full anesthesia. |
| `none` | No anesthesia administered. |

### 4.12 AllergyIntolerance Type

| Value | Description |
|---|---|
| `allergy` | Immune-mediated adverse reaction. |
| `intolerance` | Non-immune adverse reaction. |

### 4.13 AllergyIntolerance Category

| Value | Description |
|---|---|
| `food` | Food substance. |
| `medication` | Pharmaceutical substance. |
| `environment` | Environmental substance (pollen, dust, etc.). |
| `other` | Category not listed above. |

### 4.14 AllergyIntolerance Clinical Status

| Value | Description |
|---|---|
| `active` | The allergy/intolerance is currently active. |
| `inactive` | The allergy/intolerance is no longer active. |
| `resolved` | The allergy/intolerance has been resolved. |

### 4.15 Criticality

| Value | Description |
|---|---|
| `low` | Low risk of serious harm from future exposure. |
| `high` | High risk of serious harm from future exposure. |
| `unable-to-assess` | Criticality cannot be determined. |

### 4.16 Severity (Condition / Reaction)

| Value | Description |
|---|---|
| `mild` | Mild severity; minimal impact on daily function. |
| `moderate` | Moderate severity; noticeable impact on daily function. |
| `severe` | Severe; significant impact, may be life-threatening. |

### 4.17 Sex

| Value | Description |
|---|---|
| `male` | Male biological sex. |
| `female` | Female biological sex. |
| `unknown` | Sex is unknown or not recorded. |

### 4.18 Gender Status

| Value | Description |
|---|---|
| `intact` | Not surgically altered. |
| `neutered` | Male castration performed. |
| `spayed` | Female ovariohysterectomy performed. |
| `unknown` | Reproductive status unknown. |

### 4.19 Breed Code System

| Value | Description |
|---|---|
| `fci` | Federation Cynologique Internationale (dogs). |
| `fife` | Federation Internationale Feline (cats). |
| `tica` | The International Cat Association (cats). |
| `other` | Other breed registry not listed above. |

### 4.20 Condition Code System

| Value | Description |
|---|---|
| `icd-10-vet` | ICD-10 adapted for veterinary use. |
| `snomed-ct-vet` | SNOMED CT adapted for veterinary use. |
| `internal` | Practice-internal coding system. |
| `other` | Other coding system. |

### 4.21 Medication Status

| Value | Description |
|---|---|
| `active` | The patient is currently taking the medication. |
| `completed` | The medication course has been completed. |
| `stopped` | The medication was stopped before completion. |
| `on-hold` | The medication is temporarily paused. |

---

## 5. Extension Mechanism

OVF allows custom fields to support practice-specific or regional data needs.

### 5.1 Rules

- Custom fields MUST use the `x_` prefix (e.g. `x_clinic_internal_id`, `x_insurance_provider`).
- Extensions MUST NOT change the meaning or semantics of any standard field defined in this specification.
- All OVF objects have `additionalProperties: true` in their JSON Schema, allowing extensions on any resource.
- Consumers that do not recognize an `x_`-prefixed field SHOULD preserve it during round-trip processing and MUST NOT reject the document.

### 5.2 Example

```json
{
  "resource_type": "Patient",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Burek",
  "species": "dog",
  "x_insurance_provider": "PetPlan Poland",
  "x_insurance_policy_number": "PP-2025-123456"
}
```

---

## 6. Versioning Policy

OVF follows **SchemaVer** (Semantic Versioning for schemas): `MAJOR.MINOR.PATCH`.

| Change Type | Version Bump | Examples |
|---|---|---|
| **MAJOR** | Breaking changes | Removing a required field, changing a field type, renaming a field, removing an enum value. |
| **MINOR** | Backward-compatible additions | Adding a new optional field, adding a new enum value, adding a new resource type. |
| **PATCH** | Non-functional changes | Fixing descriptions, updating examples, correcting typos. |

### 6.1 Compatibility Guarantees

- A consumer supporting version `1.x` MUST be able to read any `1.y` document where `y >= x`, ignoring unknown fields.
- A producer SHOULD generate documents at the highest MINOR version it supports.
- The `format_version` field in the document MUST reflect the schema version the document was validated against.

---

## 7. Data Types

### 7.1 Date and DateTime

- Date fields use ISO 8601 date format: `YYYY-MM-DD` (e.g. `2025-06-15`).
- DateTime fields use ISO 8601 date-time format: `YYYY-MM-DDThh:mm:ssZ` (e.g. `2025-06-15T10:30:00Z`).
- DateTime values SHOULD include a timezone offset or use UTC (`Z`).

### 7.2 Identifiers

All identifiers (`id` fields) SHOULD be UUIDs (RFC 4122) but MAY be any unique string. Producers MUST ensure uniqueness within a document.

---

## 8. Identifiers

OVF uses a `system` + `value` pair pattern for external identifiers on the Patient resource.

### 8.1 Supported Systems

| System | Description | Value Format |
|---|---|---|
| `iso-microchip-11784` | ISO 11784/11785 compliant microchip. | 15-digit numeric string (e.g. `616000012345678`). Country code prefix per ISO 3166. |
| `eu-pet-passport` | EU Pet Passport number. | Country code + alphanumeric (e.g. `PL-1234567`). |
| `safe-animal` | SAFE-ANIMAL registry (Poland). | Registry-assigned identifier. |
| `europetnet` | EUROPETNET European pet identification network. | Network-assigned identifier. |
| `national-registry` | Country-specific national pet registry. | Varies by country. |
| `other` | Any identification system not listed above. | Free-form string. |

### 8.2 Example

```json
{
  "identifiers": [
    {
      "system": "iso-microchip-11784",
      "value": "616000012345678"
    },
    {
      "system": "eu-pet-passport",
      "value": "PL-1234567"
    },
    {
      "system": "safe-animal",
      "value": "SAFE-2025-98765"
    }
  ]
}
```

---

## 9. References

- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core)
- [RFC 2119 — Key words for use in RFCs](https://www.rfc-editor.org/rfc/rfc2119)
- [ISO 8601 — Date and time format](https://www.iso.org/iso-8601-date-and-time-format.html)
- [ISO 11784/11785 — Radio frequency identification of animals](https://www.iso.org/standard/25881.html)
- [HL7 FHIR R4](https://hl7.org/fhir/R4/)
