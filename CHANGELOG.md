<!-- SPDX-License-Identifier: Apache-2.0 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [SchemaVer](docs/specification.md#versioning).

## [1.3.0] - 2026-03-31

### Changed (BREAKING)

- `additionalProperties` set to `false` across all schemas
- Centralized `code` and `cost` `$defs` in `ovf.schema.json`
- ID fields require `minLength: 1` and pattern `^[a-zA-Z0-9._-]+$`
- Dosage `frequency` changed from free-text to enum with `frequency_text` for custom values
- Species enum expanded: ferret, amphibian, cattle, sheep, goat, pig, poultry
- Breed code systems expanded: akc, the-kennel-club

### Added

- Privacy & Data Protection section to specification
- Date format convention documentation

---

## [1.2.1] - 2026-03-31

### Fixed

- Synced docs with schemas (correct field names, practitioner_id refs)
- Python SDK: fixed 9 naming collisions with qualified aliases, Pydantic v2 migration
- TypeScript SDK: fixed re-export deduplication with qualified aliases
- Build: replaced deprecated --loader ts-node/esm with tsx, cross-platform version sync
- CI/CD: pinned Actions to SHA, added tsc --noEmit and docs generation to CI
- Tests: added 14 new tests (enum, date, boundary)

---

## [1.2.0] - 2026-03-30

### Added

- Extracted Practitioner as standalone resource
- Added npm publish with provenance
- Added Python/TypeScript SDK examples

---

## [1.0.0] - 2026-03-30

### Added

- Initial release of Open Vet Format v1.0.0
- 9 resource schemas: Patient, Encounter, Condition, Observation, Immunization, Procedure, AllergyIntolerance, MedicationStatement, DocumentReference
- Root OVF export schema with metadata (format_version, exported_at, exporter)
- CLI validator tool (`ovf-validate`)
- Schema meta-validation and example validation scripts
- Complete documentation: specification, getting started, FHIR mapping, Polish extensions
- Example documents: minimal, complete dog, complete cat, vaccination-only, lab results
- Edge case examples: deceased pet, multiple conditions, empty arrays
- Test fixtures: valid and invalid documents
- GitHub Actions CI/CD (validate + release workflows)
- AI-consumable files (llms.txt, llms-full.txt)
- Polish market extensions: SAFE-ANIMAL, EU Pet Passport, FCI/FIFe/TICA breed codes, ISO 11784/11785
