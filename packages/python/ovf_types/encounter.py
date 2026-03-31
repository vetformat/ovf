# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from enum import Enum
from typing import Annotated, Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, RootModel


class Status(Enum):
    """
    Current status of the encounter.
    """

    planned = 'planned'
    in_progress = 'in-progress'
    completed = 'completed'
    cancelled = 'cancelled'


class Type(Enum):
    """
    The category or type of encounter.
    """

    consultation = 'consultation'
    emergency = 'emergency'
    follow_up = 'follow-up'
    vaccination = 'vaccination'
    surgery = 'surgery'
    dental = 'dental'
    grooming = 'grooming'
    telehealth = 'telehealth'
    other = 'other'


class Diagnose(RootModel[str]):
    root: Annotated[str, Field(min_length=1, pattern='^[a-zA-Z0-9._-]+$')]


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


class Encounter(BaseModel):
    """
    Represents a clinical encounter or visit between a patient and a veterinary practitioner.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    resource_type: Annotated[Literal['Encounter'], Field(examples=['Encounter'])]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[
        str,
        Field(
            examples=['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
            min_length=1,
            pattern='^[a-zA-Z0-9._-]+$',
        ),
    ]
    """
    Unique identifier for the encounter. UUID recommended.
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
    Reference to the patient this encounter belongs to.
    """
    status: Annotated[Status, Field(examples=['completed'])]
    """
    Current status of the encounter.
    """
    type: Annotated[Type | None, Field(examples=['consultation'])] = None
    """
    The category or type of encounter.
    """
    date: Annotated[AwareDatetime, Field(examples=['2025-06-15T10:30:00Z'])]
    """
    Start date and time of the encounter in ISO 8601 format.
    """
    end_date: Annotated[
        AwareDatetime | None, Field(examples=['2025-06-15T11:00:00Z'])
    ] = None
    """
    End date and time of the encounter in ISO 8601 format.
    """
    reason: Annotated[
        str | None, Field(examples=['Annual wellness check and vaccination'])
    ] = None
    """
    The chief complaint or reason for the visit.
    """
    practitioner_id: Annotated[
        str | None,
        Field(examples=['pract-001'], min_length=1, pattern='^[a-zA-Z0-9._-]+$'),
    ] = None
    """
    Reference to the practitioner involved in this encounter. Must match an id in the top-level practitioners array.
    """
    notes: Annotated[
        str | None,
        Field(
            examples=[
                'Patient presented in good health. Vaccination administered. Next visit recommended in 12 months.'
            ]
        ),
    ] = None
    """
    Clinical notes or summary of the encounter.
    """
    diagnoses: Annotated[
        list[Diagnose] | None, Field(examples=[['cond-001', 'cond-002']])
    ] = None
    """
    Array of condition IDs diagnosed during this encounter. References entries in the conditions array.
    """
    diagnoses_display: Annotated[
        list[str] | None, Field(examples=[['Atopic dermatitis', 'Otitis externa']])
    ] = None
    """
    Human-readable names of diagnoses for this encounter. Parallel array to diagnoses — same order, same length. Enables standalone readability without cross-referencing the conditions array.
    """
    cost: Cost | None = None
