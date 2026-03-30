#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SCHEMAS_DIR="$ROOT_DIR/schemas/v1"
OUTPUT_DIR="$ROOT_DIR/packages/python/ovf_types"

HEADER="# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run \`npm run generate:python\` to regenerate."

if ! command -v datamodel-codegen &> /dev/null; then
  echo "Error: datamodel-codegen not found."
  echo "Install it with: pipx install datamodel-code-generator"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

INIT_IMPORTS=""

# Generate individual resource schemas (skip ovf.schema.json — it has cross-file $refs)
for schema in "$SCHEMAS_DIR"/*.schema.json; do
  filename=$(basename "$schema" .schema.json)

  # Skip root schema — generated as a hand-crafted wrapper
  if [ "$filename" = "ovf" ]; then
    continue
  fi

  # Convert kebab-case to snake_case
  module_name=$(echo "$filename" | tr '-' '_')

  echo "  Generating ${module_name}.py"

  datamodel-codegen \
    --input "$schema" \
    --input-file-type jsonschema \
    --output "$OUTPUT_DIR/${module_name}.py" \
    --output-model-type pydantic_v2.BaseModel \
    --use-annotated \
    --field-constraints \
    --target-python-version 3.10 \
    --use-schema-description \
    --use-field-description \
    --collapse-root-models \
    --custom-file-header "$HEADER"

  # Extract class names for __init__.py (BSD-compatible sed)
  classes=$(sed -n 's/^class \([A-Za-z_][A-Za-z0-9_]*\).*/\1/p' "$OUTPUT_DIR/${module_name}.py")
  if [ -n "$classes" ]; then
    for cls in $classes; do
      INIT_IMPORTS="${INIT_IMPORTS}from .${module_name} import ${cls}\n"
    done
  fi
done

# Generate OVF root model manually (cross-file $ref not supported in single-file mode)
echo "  Generating ovf.py"
cat > "$OUTPUT_DIR/ovf.py" << 'PYEOF'
# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from typing import Annotated, Optional

from pydantic import BaseModel, Field

from .allergy_intolerance import AllergyIntolerance
from .condition import Condition
from .document_reference import DocumentReference
from .encounter import Encounter
from .immunization import Immunization
from .medication_statement import MedicationStatement
from .observation import Observation
from .patient import Patient
from .practitioner import Practitioner
from .procedure import Procedure


class Exporter(BaseModel):
    """Information about the software that generated this OVF export."""

    class Config:
        extra = "allow"

    name: Annotated[
        Optional[str],
        Field(None, description="Name of the exporting software or system."),
    ]
    version: Annotated[
        Optional[str],
        Field(None, description="Version of the exporting software."),
    ]


class OvfDocument(BaseModel):
    """Root export schema for the Open Vet Format (OVF).

    Wraps all veterinary medical record resources for a single patient
    into a portable, interoperable document.
    """

    class Config:
        extra = "allow"

    format_version: Annotated[
        str,
        Field(
            ...,
            pattern=r"^\d+\.\d+\.\d+$",
            description="Semantic version of the OVF format used in this export.",
        ),
    ]
    exported_at: Annotated[
        str,
        Field(
            ...,
            description="Timestamp when this export was generated in ISO 8601 format.",
        ),
    ]
    exporter: Optional[Exporter] = None
    patient: Patient
    practitioners: Annotated[
        Optional[list[Practitioner]],
        Field(None, description="Veterinary practitioners referenced by clinical resources in this export."),
    ]
    encounters: Annotated[
        Optional[list[Encounter]],
        Field(None, description="Clinical encounters or visits for the patient."),
    ]
    conditions: Annotated[
        Optional[list[Condition]],
        Field(None, description="Diagnosed conditions or health problems for the patient."),
    ]
    observations: Annotated[
        Optional[list[Observation]],
        Field(None, description="Clinical observations and measurements for the patient."),
    ]
    immunizations: Annotated[
        Optional[list[Immunization]],
        Field(None, description="Vaccination records for the patient."),
    ]
    procedures: Annotated[
        Optional[list[Procedure]],
        Field(None, description="Clinical procedures performed on the patient."),
    ]
    allergy_intolerances: Annotated[
        Optional[list[AllergyIntolerance]],
        Field(None, description="Allergies and intolerances identified for the patient."),
    ]
    medication_statements: Annotated[
        Optional[list[MedicationStatement]],
        Field(None, description="Medication records for the patient."),
    ]
    document_references: Annotated[
        Optional[list[DocumentReference]],
        Field(None, description="Documents and files associated with the patient."),
    ]
PYEOF

INIT_IMPORTS="${INIT_IMPORTS}from .ovf import Exporter\n"
INIT_IMPORTS="${INIT_IMPORTS}from .ovf import OvfDocument\n"

# Build __all__ list
ALL_CLASSES=$(echo -e "$INIT_IMPORTS" | sed -n 's/.*import \(.*\)/    "\1",/p' | sort -u)

# Write __init__.py
cat > "$OUTPUT_DIR/__init__.py" << EOF
$HEADER

$(echo -e "$INIT_IMPORTS" | sort -u | grep -v '^$')

__all__ = [
$ALL_CLASSES
]
EOF

echo "  Generated __init__.py"
echo ""
echo "Python models generated successfully."
