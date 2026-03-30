<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Governance

## Current Model: Benevolent Dictator

The Open Vet Format (OVF) project is currently maintained by a single maintainer:

- **Kamil Nowak** ([@kamilnowak](https://github.com/kamilnowak)) — Project Lead

All final decisions on schema changes, releases, and project direction rest with the project lead.

## Decision Process for Schema Changes

1. **Proposal** — Open an issue using the Schema Change template
2. **Comment Period** — 14-day public comment period for community feedback
3. **Decision** — The project lead reviews all feedback and makes a final decision
4. **Implementation** — Accepted changes are implemented via pull request

Breaking changes (MAJOR version bumps) require:
- A clear migration path documented in the proposal
- Extended comment period (30 days)
- A deprecation notice in the preceding MINOR release when possible

## Transition Plan

When the project reaches **3 or more active contributors** (defined as having submitted 5+ merged PRs in the past 6 months), the governance model will transition to a **Core Team** model:

- **Core Team** — 3-5 members with merge rights and schema change approval authority
- **Consensus** — Schema changes require approval from at least 2 Core Team members
- **Voting** — In case of disagreement, simple majority among Core Team members decides
- **Lead** — The project lead retains a tie-breaking vote

## Versioning

OVF uses **SchemaVer** (MAJOR.MINOR.PATCH):

- **MAJOR** — Breaking changes (removed fields, changed types, removed enum values)
- **MINOR** — New optional fields, new enum values, new resource types
- **PATCH** — Description fixes, example updates, documentation corrections

## Code of Conduct

All participants are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
