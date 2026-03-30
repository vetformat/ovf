# Tasks

## Completed (v1.0.0)

- [x] Repository foundation (licenses, README, community files)
- [x] 10 JSON Schemas (draft 2020-12) with full field descriptions
- [x] 8 example documents + 5 invalid test fixtures
- [x] CLI validator, schema meta-validator, example validator
- [x] GitHub Actions CI/CD (validate + release + docs deploy)
- [x] Documentation site (Starlight, auto-generated from schemas)
- [x] TypeScript + Python package generation
- [x] llms.txt / llms-full.txt
- [x] Rebrand to vetformat.org / @vetformat/ovf

---

## Next: Infrastructure

- [ ] Register `vetformat.org` domain, point DNS to GitHub Pages
- [ ] Create `vetformat` GitHub organization, transfer repo as `vetformat/ovf`
- [ ] Publish `@vetformat/ovf` to npm (schemas + validator)
- [ ] Publish `vetformat` to PyPI (Python models)
- [ ] Submit to JSON Schema Store (schemastore.org) — IDE autocompletion
- [ ] Set up GitHub Discussions for RFC process

## Next: Schema Improvements

- [ ] Add `Practitioner` as standalone resource (currently inline object, duplicated across Encounter/Immunization/Procedure)
- [ ] Add `Invoice` resource type — line items, totals, payment status (not just `cost` on individual resources)
- [ ] Add `CarePlan` resource — treatment plans, follow-up schedules, reminders
- [ ] Consider `DiagnosticReport` resource — groups related Observations into a single report (e.g., blood panel)
- [ ] Add `x_locale` extension convention for multi-language field values
- [ ] Validate all enum values against real-world vet software data

## Next: Tooling

- [ ] Online playground on vetformat.org — paste JSON, validate, see errors (client-side, no backend)
- [ ] Schema diff tool — compare two OVF versions, show added/removed/changed fields
- [ ] OVF → FHIR converter (TypeScript library)
- [ ] FHIR → OVF converter (lossy, best-effort)
- [ ] OpenAPI spec for import/export REST API endpoints
- [ ] Postman/Bruno collection with example requests
- [ ] VS Code extension — OVF snippets, inline validation, hover docs

## Next: Adoption & Community

- [ ] LinkedIn article: "Why Polish vet clinics need a data exchange standard"
- [ ] Contact Izba Lekarsko-Weterynaryjna about standard recommendation
- [ ] Reach out to vet software vendors (Klinika XP, Veteris, DrVet) for feedback
- [ ] Present at a local dev meetup (Kraków/Warszawa)
- [ ] Create ecosystem page on vetformat.org — who uses OVF, integrations map
- [ ] Write case study: VetNote OVF implementation

## Next: Documentation

- [ ] Add interactive schema explorer (collapsible tree view of fields)
- [ ] Add "Copy as..." buttons per section (not just code blocks) — copy field table as Markdown, copy example as JSON
- [ ] Translate key docs to Polish (getting-started, specification)
- [ ] Add Mermaid diagrams for resource relationships (Patient → Encounters → Conditions)
- [ ] API reference page for the validator CLI

## Backlog / Future Versions

- [ ] OVF v1.1: `Practitioner` resource, `Invoice` resource, `DiagnosticReport`
- [ ] OVF v2.0: Consider breaking changes — stricter identifier validation, required `encounter_id` on clinical resources
- [ ] MCP server for OVF — serve schemas, validate, generate examples programmatically
- [ ] Vet clinic sandbox — demo app showing import/export with sample data
- [ ] Certification program — "OVF Compatible" badge for vet software vendors
- [ ] EU Digital Pet Passport alignment — track regulation changes, position OVF
