# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from enum import Enum
from typing import Annotated, Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field


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


class Cost(BaseModel):
    """
    Cost information for this encounter. Optional — useful for pet owners tracking health expenses.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    amount: Annotated[float, Field(examples=[250.0], ge=0.0)]
    """
    Total cost amount.
    """
    currency: Annotated[str, Field(examples=['PLN'])]
    """
    ISO 4217 currency code.
    """


class Practitioner(BaseModel):
    """
    The veterinary practitioner involved in this encounter.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    name: Annotated[str | None, Field(examples=['Dr. Anna Nowak'])] = None
    """
    Full name of the practitioner.
    """
    license_number: Annotated[str | None, Field(examples=['VET-PL-12345'])] = None
    """
    Professional license or registration number.
    """
    clinic: Annotated[str | None, Field(examples=['Happy Paws Veterinary Clinic'])] = (
        None
    )
    """
    Name of the veterinary clinic or hospital.
    """


class Encounter(BaseModel):
    """
    Represents a clinical encounter or visit between a patient and a veterinary practitioner.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    resource_type: Annotated[Literal['Encounter'], Field(examples=['Encounter'])]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[str, Field(examples=['a1b2c3d4-e5f6-7890-abcd-ef1234567890'])]
    """
    Unique identifier for the encounter. UUID recommended.
    """
    patient_id: Annotated[str, Field(examples=['550e8400-e29b-41d4-a716-446655440000'])]
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
    practitioner: Practitioner | None = None
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
        list[str] | None, Field(examples=[['cond-001', 'cond-002']])
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
