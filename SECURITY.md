<!-- SPDX-License-Identifier: Apache-2.0 -->

# Security Policy

## Scope

This security policy covers the **validator tooling** (TypeScript CLI tool and associated code) shipped in this repository.

JSON Schemas themselves cannot contain vulnerabilities — they are declarative data definitions. However, if you discover a schema design issue that could lead to security problems in consuming applications (e.g., a pattern that enables injection), please report it.

## Reporting a Vulnerability

**Email:** security@vetformat.org

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Do not** open a public GitHub issue for security vulnerabilities.

## Response Timeline

- **Acknowledgment:** Within 48 hours
- **Assessment:** Within 7 days
- **Fix:** Within 30 days for confirmed vulnerabilities
- **Disclosure:** Coordinated disclosure after fix is released

## Bug Bounty

There is currently no bug bounty program for this project.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |
