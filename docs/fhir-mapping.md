<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# FHIR Mapping Guide

This document describes the mapping between Open Vet Format (OVF) resources and HL7 FHIR R4 resources. OVF was designed with FHIR alignment in mind but simplifies many structures for the veterinary domain.

---

## Resource Mapping Overview

| OVF Resource | FHIR Resource | Key Differences |
|---|---|---|
| Patient | Patient | OVF adds `species`, `breed`, `breed_code` as top-level fields; FHIR uses extensions. OVF has flat `owner` object; FHIR uses separate `RelatedPerson` resource. |
| Encounter | Encounter | OVF uses simplified status values (4 vs FHIR's 9). Flat `practitioner` object instead of `participant` array with role coding. |
| Condition | Condition | Nearly identical structure. OVF uses simpler code systems (`icd-10-vet`, `snomed-ct-vet`) instead of full CodeableConcept with multiple codings. |
| Observation | Observation | OVF uses a flexible `value` field (number/string/boolean/object); FHIR uses typed `value[x]` (valueQuantity, valueString, valueCodeableConcept, etc.). |
| Immunization | Immunization | OVF adds `next_dose_date` and `expiration_date` as first-class fields. FHIR handles these via `protocolApplied` and vaccine product info. |
| Procedure | Procedure | OVF adds a dedicated `anesthesia` sub-object (type + agent). FHIR would model this as a separate Procedure or via extensions. |
| AllergyIntolerance | AllergyIntolerance | Nearly identical. OVF simplifies `reaction` to a single object; FHIR allows an array of reactions each with multiple manifestations. |
| MedicationStatement | MedicationStatement | OVF simplifies dosage to a flat object (value, unit, frequency, route); FHIR uses the complex `Dosage` backbone element with `timing`, `doseAndRate`, etc. |
| DocumentReference | DocumentReference | OVF uses a simplified content model with direct `url`, `data`, `content_type` fields; FHIR nests content in `content[].attachment`. |

---

## Detailed Conversion Notes

### OVF to FHIR

#### Patient

OVF Patient maps to FHIR Patient with the following considerations:

- **Species and breed**: FHIR does not have native species/breed fields on Patient. Use the [FHIR Species extension](http://hl7.org/fhir/StructureDefinition/patient-animal) or the `Patient.animal` backbone element (available in some veterinary FHIR profiles):
  ```json
  {
    "resourceType": "Patient",
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/patient-animal",
        "extension": [
          {
            "url": "species",
            "valueCodeableConcept": {
              "coding": [{ "system": "http://snomed.info/sct", "code": "448771007", "display": "Canis lupus familiaris" }]
            }
          },
          {
            "url": "breed",
            "valueCodeableConcept": {
              "coding": [{ "system": "http://fci.be", "code": "166", "display": "Labrador Retriever" }]
            }
          }
        ]
      }
    ]
  }
  ```
- **Identifiers**: OVF `identifiers[]` maps directly to FHIR `identifier[]`. The OVF `system` enum values should be expanded to full URIs:
  | OVF System | FHIR Identifier System URI |
  |---|---|
  | `iso-microchip-11784` | `urn:oid:2.16.840.1.113883.4.3xx` or `http://hl7.org/fhir/sid/microchip` |
  | `eu-pet-passport` | `http://ec.europa.eu/food/animals/pet-movement/eu-pet-passport` |
  | `safe-animal` | `https://www.safe-animal.eu` |
  | `europetnet` | `https://www.europetnet.com` |
- **Owner**: OVF `owner` maps to a FHIR `RelatedPerson` resource linked via `Patient.link` or `Patient.contact`.
- **Weight**: Map to a FHIR Observation with LOINC code `29463-7` (Body weight).
- **Gender status**: Map `neutered`/`spayed` to FHIR extensions or Procedure records.

#### Encounter

- **Status**: OVF uses 4 status values. FHIR has additional statuses (`arrived`, `triaged`, `onleave`, `entered-in-error`, `unknown`). Map directly where values overlap.
- **Type**: OVF uses a simple enum. Convert to FHIR `type` CodeableConcept with an appropriate coding system.
- **Practitioner**: OVF's flat `practitioner` object maps to FHIR `Encounter.participant[]` with `individual` reference to a `Practitioner` resource.
- **Diagnoses**: OVF `diagnoses` (array of condition IDs) maps to `Encounter.diagnosis[].condition` as Reference(Condition).

#### Condition

- **Code**: OVF `code` (system + value + display) maps to FHIR `Condition.code` as a CodeableConcept. Expand `system` enum values to URIs:
  | OVF System | FHIR Code System URI |
  |---|---|
  | `icd-10-vet` | `http://hl7.org/fhir/sid/icd-10` (with vet qualifier) |
  | `snomed-ct-vet` | `http://snomed.info/sct` |
  | `internal` | Use a practice-specific URI |
- **Clinical status**: Maps directly to `Condition.clinicalStatus` CodeableConcept.

#### Observation

- **Value**: OVF's polymorphic `value` must be mapped to the appropriate FHIR `value[x]` type:
  | OVF value type | FHIR field |
  |---|---|
  | number | `valueQuantity` (with `unit`) |
  | string | `valueString` |
  | boolean | `valueBoolean` |
  | object | `valueCodeableConcept` or `valueQuantity` depending on structure |
- **Reference range**: Maps to `Observation.referenceRange[]`.

#### Immunization

- **Vaccine code**: OVF `vaccine_code` maps to `Immunization.vaccineCode` CodeableConcept.
- **next_dose_date**: No direct FHIR field. Map to `ImmunizationRecommendation.recommendation[].dateCriterion` or use an extension.
- **expiration_date**: Map to `Immunization.expirationDate`.
- **is_primary_course**: Map to `Immunization.isSubpotent` or `protocolApplied.doseNumber`.

#### Procedure

- **Anesthesia**: FHIR has no native anesthesia sub-object on Procedure. Options:
  - Create a separate FHIR Procedure for the anesthesia administration.
  - Use an extension on the Procedure resource.
  - Record as a MedicationAdministration resource linked to the Procedure.

#### MedicationStatement

- **Dosage**: OVF's flat dosage maps to FHIR `MedicationStatement.dosage[]` Dosage backbone element:
  - `value` + `unit` -> `dosage[].doseAndRate[].doseQuantity`
  - `frequency` -> `dosage[].timing.code` or `timing.repeat`
  - `route` -> `dosage[].route` CodeableConcept

#### DocumentReference

- **Content**: OVF's flat `url`, `data`, `content_type` map to FHIR `DocumentReference.content[].attachment`:
  ```json
  {
    "content": [
      {
        "attachment": {
          "contentType": "application/pdf",
          "url": "https://example.com/report.pdf",
          "data": "base64...",
          "size": 524288,
          "hash": "sha256hash..."
        }
      }
    ]
  }
  ```

---

### FHIR to OVF

#### General Approach

1. Map FHIR resource types to their OVF equivalents using the table above.
2. Flatten complex FHIR structures (CodeableConcept, Reference, Dosage) into OVF's simpler fields.
3. Use the first coding from any CodeableConcept array as the OVF code value.
4. Drop FHIR metadata fields that have no OVF equivalent (`meta`, `text`, `contained`, `extension` unless mapped).

#### Data Loss Considerations (FHIR to OVF)

The following FHIR data may be lost or simplified when converting to OVF:

- **Multiple codings**: FHIR CodeableConcept can have multiple codings per concept. OVF retains only one system + value + display.
- **Complex timing**: FHIR Dosage timing with repeat patterns (e.g. "every 8 hours on Mon/Wed/Fri") simplifies to a free-text `frequency` string.
- **Participant roles**: FHIR Encounter participants have typed roles. OVF captures only a single practitioner.
- **Multiple reactions**: FHIR AllergyIntolerance supports multiple reaction entries with multiple manifestations. OVF supports a single reaction object.
- **Resource references**: FHIR uses typed references (`Reference(Practitioner)`). OVF uses flat objects or string IDs.
- **Provenance and audit**: FHIR `meta.lastUpdated`, `meta.source`, provenance chains have no OVF equivalent.
- **Narrative text**: FHIR `text` (human-readable XHTML narrative) is not preserved in OVF.

#### Data Loss Considerations (OVF to FHIR)

The following OVF data may require special handling when converting to FHIR:

- **Species/breed**: Must be mapped to FHIR extensions; no native field exists.
- **Anesthesia sub-object**: Must be modeled as a separate resource or extension.
- **next_dose_date**: Must be mapped to ImmunizationRecommendation or an extension.
- **Owner as nested object**: Must be extracted into a separate RelatedPerson resource.
- **`x_` extensions**: Custom OVF fields should be mapped to FHIR extensions with appropriate URIs.

---

### Date Format Compatibility

Both OVF and FHIR use ISO 8601 for date and datetime values. No conversion is needed for temporal fields, with one caveat:

- OVF date fields use `YYYY-MM-DD` format (JSON Schema `format: "date"`).
- OVF datetime fields use `YYYY-MM-DDThh:mm:ssZ` format (JSON Schema `format: "date-time"`).
- FHIR `dateTime` type is more flexible, supporting partial dates (`2025`, `2025-06`). These MUST be expanded to full precision when converting to OVF date fields.

---

## Conversion Libraries

Community conversion libraries are tracked in the main repository. If you build an OVF-to-FHIR or FHIR-to-OVF converter, please open a pull request to add it.
