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

    model_config = ConfigDict(extra='allow')

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

    model_config = ConfigDict(extra='allow')

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
