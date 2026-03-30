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
