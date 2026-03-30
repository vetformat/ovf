<!-- SPDX-License-Identifier: Apache-2.0 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [SchemaVer](docs/specification.md#versioning).

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
