# Tasks

## Completed (v1.0.0)

- [x] Repository foundation (licenses, README, community files)
- [x] 10 JSON Schemas (draft 2020-12) with full field descriptions
- [x] 8 example documents + 5 invalid test fixtures
- [x] CLI validator, schema meta-validator, example validator
- [x] GitHub Actions CI/CD (validate + release + docs deploy)
- [x] Documentation site (Starlight, auto-generated from schemas)
- [x] llms.txt / llms-full.txt
- [x] Rebrand to vetformat.org / @vetformat/ovf

## Completed (v1.1.0)

- [x] Register `vetformat.org` domain, point DNS to GitHub Pages
- [x] Deploy docs site to vetformat.org (custom domain + GitHub Pages workflow)
- [x] TypeScript type generation from schemas (`json-schema-to-typescript`)
- [x] Python Pydantic v2 model generation from schemas (`datamodel-code-generator`)
- [x] Publish `@vetformat/ovf-types` to npm
- [x] Publish `ovf_types` to PyPI (Trusted Publishers / OIDC)
- [x] CI: generation freshness check in validate.yml
- [x] CI: auto-publish npm + PyPI on release tags
- [x] Add typed SDK docs to installation page

---

## Next: Infrastructure

- [x] Publish `@vetformat/ovf` to npm (schemas + validator CLI) — release.yml updated, publishes on next tag
- [ ] Submit to JSON Schema Store (schemastore.org) — catalog entry prepared in `.github/schemastore-entry.json`
- [x] Set up GitHub Discussions for RFC process — enable in repo Settings → Features
- [x] Add npm provenance (`--provenance` flag) for supply chain transparency
- [ ] Set up Trusted Publisher for npm (like PyPI) when npm supports OIDC

## Next: Schema Improvements (v1.2+)

- [x] Extract `Practitioner` as standalone resource (previously inline, now `practitioner_id` references)
- [ ] Add `Invoice` resource — line items, totals, payment status (beyond `cost` on individual resources)
- [ ] Add `CarePlan` resource — treatment plans, follow-up schedules, reminders
- [ ] Add `DiagnosticReport` resource — groups related Observations into a report (e.g., blood panel)
- [ ] Add `x_locale` extension convention for multi-language field values
- [ ] Validate all enum values against real-world vet software data
- [x] Update `$id` URLs from `open-vet-format.vetnote.app` to `vetformat.org`

## Next: Tooling

- [ ] Online playground on vetformat.org — paste JSON, validate in browser (no backend)
- [ ] OVF → FHIR converter (TypeScript library)
- [ ] FHIR → OVF converter (lossy, best-effort)
- [ ] VS Code extension — `.ovf.json` snippets, inline validation, hover docs
- [ ] Schema diff tool — compare two OVF versions, show added/removed/changed fields
- [ ] OpenAPI spec for import/export REST API endpoints

## Next: Adoption & Community

- [ ] LinkedIn article: "Why Polish vet clinics need a data exchange standard"
- [ ] Contact Izba Lekarsko-Weterynaryjna about standard recommendation
- [ ] Reach out to vet software vendors (Klinika XP, Veteris, DrVet) for feedback
- [ ] Present at a local dev meetup (Kraków/Warszawa)
- [ ] Create ecosystem page on vetformat.org — who uses OVF, integrations map
- [ ] Write case study: VetNote OVF implementation

## Next: Documentation

- [ ] Add interactive schema explorer (collapsible tree view of fields)
- [ ] Add "Copy as..." buttons per section — copy field table as Markdown, copy example as JSON (useful for feeding docs to AI agents)
- [ ] Translate key docs to Polish (getting-started, specification)
- [ ] Add Mermaid diagrams for resource relationships (Patient → Encounters → Conditions)
- [ ] API reference page for the validator CLI

## Backlog / Future Versions

- [ ] OVF v2.0: stricter identifier validation, required `encounter_id` on clinical resources
- [ ] MCP server for OVF — serve schemas, validate, generate examples programmatically
- [ ] Vet clinic sandbox — demo app showing import/export with sample data
- [ ] Certification program — "OVF Compatible" badge for vet software vendors
- [ ] EU Digital Pet Passport alignment — track regulation changes, position OVF
