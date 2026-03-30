<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Getting Started with Open Vet Format

Get up and running with OVF in under 5 minutes. This guide covers creating, validating, and working with OVF documents.

---

## Prerequisites

- **Node.js 18+** (for the npm package and CLI validator)
- A JSON editor or IDE of your choice

## Installation

```bash
npm install @vetformat/ovf
```

This installs the OVF JSON schemas, TypeScript types, and the `ovf-validate` CLI tool.

---

## Step 1: Create a Minimal Document

Create a file called `minimal.json` with a patient and one encounter:

```json
{
  "format_version": "1.0.0",
  "exported_at": "2026-03-30T12:00:00Z",
  "patient": {
    "resource_type": "Patient",
    "id": "pet-001",
    "name": "Burek",
    "species": "dog"
  },
  "encounters": [
    {
      "resource_type": "Encounter",
      "id": "enc-001",
      "patient_id": "pet-001",
      "status": "completed",
      "date": "2026-03-30T10:00:00Z"
    }
  ]
}
```

This is the smallest valid **OVF Core** document: a patient plus at least one resource array with one entry.

## Step 2: Validate

```bash
npx ovf-validate minimal.json
```

Expected output:

```
minimal.json: valid (OVF Core)
```

---

## Step 3: Add More Resources

Extend the document with an immunization record:

```json
{
  "format_version": "1.0.0",
  "exported_at": "2026-03-30T12:00:00Z",
  "exporter": {
    "name": "MyVetApp",
    "version": "2.1.0"
  },
  "patient": {
    "resource_type": "Patient",
    "id": "pet-001",
    "name": "Burek",
    "species": "dog",
    "breed": "Labrador Retriever",
    "date_of_birth": "2020-03-15",
    "sex": "male",
    "gender_status": "neutered",
    "weight": { "value": 32.5, "unit": "kg" },
    "identifiers": [
      { "system": "iso-microchip-11784", "value": "616000012345678" }
    ],
    "owner": {
      "name": "Jan Kowalski",
      "phone": "+48 600 123 456"
    }
  },
  "practitioners": [
    {
      "resource_type": "Practitioner",
      "id": "pract-001",
      "name": "Dr. Anna Nowak",
      "license_number": "VET-PL-12345",
      "clinic": "Happy Paws Veterinary Clinic"
    }
  ],
  "encounters": [
    {
      "resource_type": "Encounter",
      "id": "enc-001",
      "patient_id": "pet-001",
      "status": "completed",
      "type": "vaccination",
      "date": "2026-03-30T10:00:00Z",
      "reason": "Annual vaccination",
      "practitioner_id": "pract-001"
    }
  ],
  "immunizations": [
    {
      "resource_type": "Immunization",
      "id": "imm-001",
      "patient_id": "pet-001",
      "encounter_id": "enc-001",
      "vaccine_name": "Nobivac DHPPi",
      "occurrence_date": "2026-03-30",
      "expiration_date": "2027-03-30",
      "lot_number": "A123B456",
      "manufacturer": "MSD Animal Health",
      "route": "subcutaneous",
      "site": "Right shoulder",
      "is_primary_course": false,
      "notes": "Annual booster. No adverse reactions."
    }
  ]
}
```

> **Practitioner references:** Practitioners are defined once in the top-level `practitioners` array and referenced by their `id` from encounters, procedures, immunizations, and medication statements using `practitioner_id` (or `prescriber_id` for medications). This avoids duplicating practitioner data across resources.

Validate again:

```bash
npx ovf-validate extended.json
```

```
extended.json: valid (OVF Core)
```

---

## TypeScript Validation Example

Use [ajv](https://ajv.js.org/) to validate OVF documents programmatically:

```typescript
import Ajv from "ajv";
import addFormats from "ajv-formats";
import patientSchema from "@vetformat/ovf/schemas/v1/patient.schema.json";
import encounterSchema from "@vetformat/ovf/schemas/v1/encounter.schema.json";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validatePatient = ajv.compile(patientSchema);
const validateEncounter = ajv.compile(encounterSchema);

const patient = {
  resource_type: "Patient",
  id: "pet-001",
  name: "Burek",
  species: "dog",
};

if (validatePatient(patient)) {
  console.log("Patient is valid");
} else {
  console.error("Validation errors:", validatePatient.errors);
}

const encounter = {
  resource_type: "Encounter",
  id: "enc-001",
  patient_id: "pet-001",
  status: "completed",
  date: "2026-03-30T10:00:00Z",
};

if (validateEncounter(encounter)) {
  console.log("Encounter is valid");
} else {
  console.error("Validation errors:", validateEncounter.errors);
}
```

---

## Python Validation Example

Use [jsonschema](https://python-jsonschema.readthedocs.io/) to validate OVF documents:

```python
import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

schemas_dir = Path("node_modules/@vetformat/ovf/schemas/v1")

patient_schema = json.loads(
    (schemas_dir / "patient.schema.json").read_text()
)

validator = Draft202012Validator(patient_schema, format_checker=FormatChecker())

patient = {
    "resource_type": "Patient",
    "id": "pet-001",
    "name": "Burek",
    "species": "dog",
}

errors = list(validator.iter_errors(patient))
if not errors:
    print("Patient is valid")
else:
    for error in errors:
        print(f"Validation error: {error.message}")
```

To validate a full OVF document, load each resource from the arrays and validate individually against its schema:

```python
import json

def validate_ovf_document(document: dict, schemas_dir: Path) -> list[str]:
    """Validate an OVF document, returning a list of error messages."""
    errors: list[str] = []

    # Validate patient
    patient_schema = json.loads(
        (schemas_dir / "patient.schema.json").read_text()
    )
    patient_validator = Draft202012Validator(
        patient_schema, format_checker=FormatChecker()
    )
    for err in patient_validator.iter_errors(document.get("patient", {})):
        errors.append(f"patient: {err.message}")

    # Validate each resource array
    resource_map = {
        "practitioners": "practitioner.schema.json",
        "encounters": "encounter.schema.json",
        "conditions": "condition.schema.json",
        "observations": "observation.schema.json",
        "immunizations": "immunization.schema.json",
        "procedures": "procedure.schema.json",
        "allergy_intolerances": "allergy-intolerance.schema.json",
        "medication_statements": "medication-statement.schema.json",
        "document_references": "document-reference.schema.json",
    }

    for array_key, schema_file in resource_map.items():
        resources = document.get(array_key, [])
        if not resources:
            continue
        schema = json.loads((schemas_dir / schema_file).read_text())
        res_validator = Draft202012Validator(
            schema, format_checker=FormatChecker()
        )
        for i, resource in enumerate(resources):
            for err in res_validator.iter_errors(resource):
                errors.append(f"{array_key}[{i}]: {err.message}")

    return errors
```

---

## Next Steps

- Read the full [Specification](./specification.md) for detailed field definitions and controlled vocabularies.
- See the [FHIR Mapping Guide](./fhir-mapping.md) if you need interoperability with HL7 FHIR systems.
- Check the [Polish Extensions Guide](./polish-extensions.md) for Poland-specific identifier and breed code systems.
- Browse the `examples/` directory for complete sample documents.
