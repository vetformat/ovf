<!-- SPDX-License-Identifier: Apache-2.0 -->

# Open Vet Format (OVF)

**A FHIR-inspired JSON Schema standard for veterinary medical record exchange.**

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Docs: CC-BY-4.0](https://img.shields.io/badge/Docs-CC--BY--4.0-lightgrey.svg)](LICENSE-DOCS)
[![Schema Version](https://img.shields.io/badge/schema-v1.0.0-green.svg)](schemas/v1/)
[![CI](https://github.com/vetformat/ovf/actions/workflows/validate.yml/badge.svg)](https://github.com/vetformat/ovf/actions/workflows/validate.yml)

The veterinary market — especially in Poland and Central Europe — has no standard for exchanging medical records between clinics, pet owners, and software systems. OVF fills this gap with a pragmatic, JSON-based format designed specifically for veterinary medicine.

## Quick Example

A minimal valid OVF document:

```json
{
  "format_version": "1.0.0",
  "exported_at": "2026-03-30T12:00:00Z",
  "exporter": {
    "name": "VetNote",
    "version": "2.0.0"
  },
  "patient": {
    "resource_type": "Patient",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Luna",
    "species": "dog",
    "breed": "Golden Retriever",
    "date_of_birth": "2023-06-15",
    "sex": "female",
    "gender_status": "spayed",
    "identifiers": [
      {
        "system": "iso-microchip-11784",
        "value": "616093900012345"
      }
    ]
  }
}
```

## Why Not Just Use FHIR?

[HL7 FHIR](https://www.hl7.org/fhir/) is the gold standard for human healthcare interoperability. But it's a poor fit for veterinary MVPs:

| Concern | FHIR | OVF |
|---------|------|-----|
| Complexity | 150+ resource types, deep nesting | 9 resource types, flat structure |
| Format | XML + JSON, heavy tooling | JSON only, any language |
| Veterinary support | Minimal — adapted from human medicine | Purpose-built for vet clinics |
| Adoption in vet market | Near zero | Growing (designed for it) |
| Getting started | Weeks of reading specs | 5 minutes |

OVF maps cleanly to FHIR concepts (see [FHIR Mapping](docs/fhir-mapping.md)), so migration to full FHIR is possible when the market matures.

## Why Not VetXML?

[VetXML](http://vetxml.org/) was a UK-led initiative that never gained adoption outside a handful of UK practice management systems. It's XML-based, poorly documented, and effectively abandoned.

## Resource Types

| Resource | Description |
|----------|-------------|
| **Patient** | Pet with species, breed, microchip, EU passport |
| **Encounter** | Veterinary visit or consultation |
| **Condition** | Diagnosis (active, resolved, chronic) |
| **Observation** | Lab results, vital signs, clinical notes |
| **Immunization** | Vaccinations with batch, expiry, next dose |
| **Procedure** | Surgeries, dental work, grooming |
| **AllergyIntolerance** | Food, medication, environment allergies |
| **MedicationStatement** | Prescribed and active medications |
| **DocumentReference** | Scanned documents, lab report files |

## Installation

```bash
npm install @vetnote/open-vet-format
```

### Validate a document

```bash
npx ovf-validate ./my-record.json
```

### Programmatic usage

```typescript
import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "@vetnote/open-vet-format/schemas/v1/ovf.schema.json";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

const valid = validate(myDocument);
if (!valid) console.error(validate.errors);
```

## Polish Extensions

OVF includes first-class support for the Polish veterinary market:

- **Microchip registries:** SAFE-ANIMAL, EUROPETNET
- **EU Pet Passport** identifier system
- **FCI breed codes** for pedigree dogs
- **ISO 11784/11785** microchip format

See [Polish Extensions](docs/polish-extensions.md) for details.

## Documentation

- [Specification](docs/specification.md) — formal spec with RFC 2119 language
- [Getting Started](docs/getting-started.md) — 5-minute quickstart
- [FHIR Mapping](docs/fhir-mapping.md) — how OVF maps to FHIR resources
- [Polish Extensions](docs/polish-extensions.md) — Poland-specific fields
- [Examples](examples/) — real-world example documents

## Adopters

See [ADOPTERS.md](ADOPTERS.md) for organizations using OVF.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Schema changes follow an RFC process: open an issue using the [Schema Change template](.github/ISSUE_TEMPLATE/schema_change.yml), discuss for 14 days, then submit a PR.

## License

- **Schemas and code:** [Apache License 2.0](LICENSE)
- **Documentation** (`docs/` directory): [CC-BY-4.0](LICENSE-DOCS)

This dual-licensing ensures schemas can be freely used in commercial products while documentation attribution is maintained.

## AI / LLM Integration

This repository is AI-friendly by design:

- Every schema field has `description` and `examples`
- [`llms.txt`](llms.txt) provides a structured project summary
- [`llms-full.txt`](llms-full.txt) provides full context for LLM consumption
- Schemas are self-documenting — an LLM can generate valid OVF documents from the schemas alone
