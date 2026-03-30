# Contributing to Open Vet Format

Thank you for your interest in contributing to the Open Vet Format (OVF) specification.

## How to Propose Schema Changes (RFC Process)

1. **Open an Issue** — Use the "Schema Change" issue template to describe the proposed change, affected resources, and rationale.
2. **Discuss** — The community has 14 days to comment. All feedback is considered before a decision is made.
3. **Submit a PR** — Once the proposal is accepted, submit a pull request with the schema changes, updated examples, and tests.
4. **Review** — A maintainer will review the PR. Breaking changes require extra scrutiny and a migration path.

## Coding Standards

All tooling in this repository is written in **TypeScript** with **strict mode** enabled.

- Use `strict: true` in `tsconfig.json`
- No use of `any` type
- Prefer `readonly` where applicable
- Format code with Prettier before committing

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Schema validates against the meta-schema
- [ ] All example documents validate against updated schemas
- [ ] Tests pass (`npm test`)
- [ ] CHANGELOG.md is updated
- [ ] Documentation is updated if the change affects the specification

## Development Setup

```bash
git clone https://github.com/kamilnowak/vetnote-open-vet-format.git
cd vetnote-open-vet-format
npm install
npm test
```

## Licensing

This project uses dual licensing:

- **Apache-2.0** (`SPDX-License-Identifier: Apache-2.0`) for code and schemas
- **CC-BY-4.0** (`SPDX-License-Identifier: CC-BY-4.0`) for documentation

By contributing, you agree that your contributions will be licensed under these terms.
