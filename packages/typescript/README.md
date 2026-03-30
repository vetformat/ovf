# @vetformat/ovf-types

TypeScript type definitions for the [Open Vet Format (OVF)](https://vetformat.org) — a FHIR-inspired JSON Schema standard for veterinary medical record exchange.

## Installation

```bash
npm install @vetformat/ovf-types
```

## Usage

```typescript
import type { OvfDocument, Patient, Encounter } from "@vetformat/ovf-types";

const doc: OvfDocument = JSON.parse(rawJson);
console.log(doc.patient.name);
console.log(doc.patient.species);
```

## Available Types

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
- [Python models](https://pypi.org/project/ovf_types/)
