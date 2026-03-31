# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from enum import Enum
from typing import Annotated, Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field


class Status(Enum):
    """
    Current status of the procedure.
    """

    planned = 'planned'
    in_progress = 'in-progress'
    completed = 'completed'
    cancelled = 'cancelled'


class Category(Enum):
    """
    The high-level category of the procedure.
    """

    surgery = 'surgery'
    dental = 'dental'
    diagnostic = 'diagnostic'
    therapeutic = 'therapeutic'
    grooming = 'grooming'
    other = 'other'


class System(Enum):
    """
    Coding system identifier.
    """

    icd_10_vet = 'icd-10-vet'
    snomed_ct_vet = 'snomed-ct-vet'
    loinc = 'loinc'
    atc_vet = 'atc-vet'
    internal = 'internal'
    other = 'other'


class Code(BaseModel):
    """
    A coded clinical concept with system, value, and display text.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    system: System
    """
    Coding system identifier.
    """
    value: str
    """
    Code value within the system.
    """
    display: str | None = None
    """
    Human-readable display text for the code.
    """


class Exporter(BaseModel):
    """
    Information about the software that generated this OVF export.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    name: Annotated[str | None, Field(examples=['VetNote'])] = None
    """
    Name of the exporting software or system.
    """
    version: Annotated[str | None, Field(examples=['2.4.1'])] = None
    """
    Version of the exporting software.
    """


class Cost(BaseModel):
    """
    Cost information with amount and ISO 4217 currency code.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    amount: Annotated[float, Field(ge=0.0)]
    """
    Total cost amount.
    """
    currency: Annotated[str, Field(examples=['PLN', 'USD', 'EUR'])]
    """
    ISO 4217 currency code.
    """


class Type(Enum):
    """
    Type of anesthesia administered.
    """

    general = 'general'
    local = 'local'
    sedation = 'sedation'
    none = 'none'


class Anesthesia(BaseModel):
    """
    Anesthesia details for the procedure.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    type: Annotated[Type | None, Field(examples=['general'])] = None
    """
    Type of anesthesia administered.
    """
    agent: Annotated[str | None, Field(examples=['Isoflurane'])] = None
    """
    Name of the anesthetic agent used.
    """


class Procedure(BaseModel):
    """
    Represents a clinical procedure performed on a patient, including surgeries, dental work, diagnostics, and therapeutic interventions.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    resource_type: Annotated[Literal['Procedure'], Field(examples=['Procedure'])]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[
        str,
        Field(
            examples=['proc-550e8400-e29b-41d4-a716-446655440000'],
            min_length=1,
            pattern='^[a-zA-Z0-9._-]+$',
        ),
    ]
    """
    Unique identifier for the procedure record. UUID recommended.
    """
    patient_id: Annotated[
        str,
        Field(
            examples=['550e8400-e29b-41d4-a716-446655440000'],
            min_length=1,
            pattern='^[a-zA-Z0-9._-]+$',
        ),
    ]
    """
    Reference to the patient on whom the procedure was performed.
    """
    encounter_id: Annotated[
        str | None,
        Field(
            examples=['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
            min_length=1,
            pattern='^[a-zA-Z0-9._-]+$',
        ),
    ] = None
    """
    Reference to the encounter during which the procedure was performed.
    """
    name: Annotated[str, Field(examples=['Ovariohysterectomy (Spay)'])]
    """
    Human-readable name of the procedure.
    """
    code: Code | None = None
    status: Annotated[Status, Field(examples=['completed'])]
    """
    Current status of the procedure.
    """
    category: Annotated[Category | None, Field(examples=['surgery'])] = None
    """
    The high-level category of the procedure.
    """
    performed_date: Annotated[AwareDatetime, Field(examples=['2025-06-15T09:00:00Z'])]
    """
    Date and time when the procedure was performed or started.
    """
    end_date: Annotated[
        AwareDatetime | None, Field(examples=['2025-06-15T10:30:00Z'])
    ] = None
    """
    Date and time when the procedure ended.
    """
    practitioner_id: Annotated[
        str | None,
        Field(examples=['pract-001'], min_length=1, pattern='^[a-zA-Z0-9._-]+$'),
    ] = None
    """
    Reference to the practitioner who performed the procedure. Must match an id in the top-level practitioners array.
    """
    anesthesia: Anesthesia | None = None
    outcome: Annotated[
        str | None,
        Field(examples=['Successful. Patient recovered well from anesthesia.']),
    ] = None
    """
    Description of the procedure outcome.
    """
    complications: Annotated[
        str | None, Field(examples=['Minor bleeding controlled with cauterization.'])
    ] = None
    """
    Any complications that occurred during or after the procedure.
    """
    notes: Annotated[
        str | None,
        Field(examples=['E-collar to be worn for 10 days. Suture removal in 14 days.']),
    ] = None
    """
    Additional notes about the procedure.
    """
    cost: Cost | None = None
