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

datamodel-codegen --version &> /dev/null || { echo "Error: datamodel-codegen not executable"; exit 1; }

mkdir -p "$OUTPUT_DIR"

[ -w "$OUTPUT_DIR" ] || { echo "Error: Output directory not writable: $OUTPUT_DIR"; exit 1; }

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

  # Filter out centralized $defs types inlined by datamodel-codegen but not referenced by this schema
  if ! grep -q 'ovf.schema.json#/\$defs/cost' "$SCHEMAS_DIR/$filename.schema.json"; then
    classes=$(echo "$classes" | grep -v '^Cost$')
  fi
  if ! grep -q 'ovf.schema.json#/\$defs/code' "$SCHEMAS_DIR/$filename.schema.json"; then
    classes=$(echo "$classes" | grep -v '^Code$')
  fi
  # Exporter is only defined in ovf.py — filter from all resource modules
  classes=$(echo "$classes" | grep -v '^Exporter$')

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

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

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

    model_config = ConfigDict(extra='forbid')

    name: Annotated[
        str | None,
        Field(None, description="Name of the exporting software or system."),
    ]
    version: Annotated[
        str | None,
        Field(None, description="Version of the exporting software."),
    ]


class OvfDocument(BaseModel):
    """Root export schema for the Open Vet Format (OVF).

    Wraps all veterinary medical record resources for a single patient
    into a portable, interoperable document.
    """

    model_config = ConfigDict(extra='forbid')

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
    exporter: Exporter | None = None
    patient: Patient
    practitioners: Annotated[
        list[Practitioner] | None,
        Field(None, description="Veterinary practitioners referenced by clinical resources in this export."),
    ]
    encounters: Annotated[
        list[Encounter] | None,
        Field(None, description="Clinical encounters or visits for the patient."),
    ]
    conditions: Annotated[
        list[Condition] | None,
        Field(None, description="Diagnosed conditions or health problems for the patient."),
    ]
    observations: Annotated[
        list[Observation] | None,
        Field(None, description="Clinical observations and measurements for the patient."),
    ]
    immunizations: Annotated[
        list[Immunization] | None,
        Field(None, description="Vaccination records for the patient."),
    ]
    procedures: Annotated[
        list[Procedure] | None,
        Field(None, description="Clinical procedures performed on the patient."),
    ]
    allergy_intolerances: Annotated[
        list[AllergyIntolerance] | None,
        Field(None, description="Allergies and intolerances identified for the patient."),
    ]
    medication_statements: Annotated[
        list[MedicationStatement] | None,
        Field(None, description="Medication records for the patient."),
    ]
    document_references: Annotated[
        list[DocumentReference] | None,
        Field(None, description="Documents and files associated with the patient."),
    ]
PYEOF

INIT_IMPORTS="${INIT_IMPORTS}from .ovf import Exporter\n"
INIT_IMPORTS="${INIT_IMPORTS}from .ovf import OvfDocument\n"

# Build __all__ list
ALL_CLASSES=$(echo -e "$INIT_IMPORTS" | sed -n 's/.*import \(.*\)/    "\1",/p' | sort -u)

# Detect duplicate class names across modules and generate aliased imports
ALIASED_IMPORTS=""
ALIASED_ALL=""

# Get sorted unique imports
SORTED_IMPORTS=$(echo -e "$INIT_IMPORTS" | sort -u | grep -v '^$')

# Find duplicate class names (classes that appear in more than one module)
DUPLICATE_CLASSES=$(echo -e "$INIT_IMPORTS" | grep -v '^$' | sed 's/.*import //' | sort | uniq -d)

if [ -n "$DUPLICATE_CLASSES" ]; then
  for dup_cls in $DUPLICATE_CLASSES; do
    # Find all modules that export this class
    modules=$(echo -e "$INIT_IMPORTS" | grep -v '^$' | grep "import ${dup_cls}$" | sed 's/from \.\(.*\) import .*/\1/')
    for mod in $modules; do
      # Convert snake_case module name to PascalCase prefix
      prefix=$(echo "$mod" | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1' | tr -d ' ')
      alias="${prefix}${dup_cls}"
      ALIASED_IMPORTS="${ALIASED_IMPORTS}from .${mod} import ${dup_cls} as ${alias}\n"
      ALIASED_ALL="${ALIASED_ALL}    \"${alias}\",\n"
    done
  done
fi

# Build final __all__ with aliases
ALL_WITH_ALIASES="$ALL_CLASSES"
if [ -n "$ALIASED_ALL" ]; then
  ALL_WITH_ALIASES="${ALL_CLASSES}
$(echo -e "$ALIASED_ALL" | sort -u | grep -v '^$')"
fi

# Write __init__.py
cat > "$OUTPUT_DIR/__init__.py" << EOF
$HEADER

$(echo -e "$SORTED_IMPORTS")
$(if [ -n "$ALIASED_IMPORTS" ]; then echo ""; echo -e "$ALIASED_IMPORTS" | sort -u | grep -v '^$'; fi)

__all__ = [
$ALL_WITH_ALIASES
]
EOF

echo "  Generated __init__.py"
echo ""
echo "Python models generated successfully."
