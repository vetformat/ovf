# ovf_types

Python Pydantic v2 models for the [Open Vet Format (OVF)](https://vetformat.org) — a FHIR-inspired JSON Schema standard for veterinary medical record exchange.

## Installation

```bash
pip install ovf_types
```

## Usage

```python
from ovf_types import OvfDocument, Patient, Encounter

# Parse an OVF JSON document
import json

with open("export.ovf.json") as f:
    data = json.load(f)

doc = OvfDocument.model_validate(data)
print(doc.patient.name)
print(doc.patient.species)
```

## Available Models

- `OvfDocument` — Root export document
- `Patient` — Animal patient demographics
- `Encounter` — Clinical visits
- `Condition` — Diagnoses and health problems
- `Observation` — Vital signs, lab results
- `Immunization` — Vaccination records
- `Procedure` — Surgeries, dental work
- `AllergyIntolerance` — Allergies and intolerances
- `MedicationStatement` — Medication records
- `DocumentReference` — Attached documents and files

## Links

- [Documentation](https://vetformat.org)
- [JSON Schemas](https://github.com/vetformat/ovf)
- [TypeScript types](https://www.npmjs.com/package/@vetformat/ovf-types)
