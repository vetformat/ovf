# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from datetime import date
from enum import Enum
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field


class Status(Enum):
    """
    Current status of the medication usage.
    """

    active = 'active'
    completed = 'completed'
    stopped = 'stopped'
    on_hold = 'on-hold'


class MedicationCode(BaseModel):
    """
    Coded representation of the medication product.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    system: Annotated[str, Field(examples=['atc-vet'])]
    """
    The coding system used (e.g., ATC-vet, RxNorm, internal).
    """
    value: Annotated[str, Field(examples=['QJ01CA04'])]
    """
    The medication code within the specified system.
    """


class Frequency(Enum):
    """
    How often the medication is administered.
    """

    once_daily = 'once-daily'
    twice_daily = 'twice-daily'
    three_times_daily = 'three-times-daily'
    four_times_daily = 'four-times-daily'
    every_other_day = 'every-other-day'
    once_weekly = 'once-weekly'
    twice_weekly = 'twice-weekly'
    as_needed = 'as-needed'
    other = 'other'


class Route(Enum):
    """
    Route of administration.
    """

    oral = 'oral'
    topical = 'topical'
    injection = 'injection'
    inhalation = 'inhalation'
    other = 'other'


class Dosage(BaseModel):
    """
    Dosage instructions for the medication.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    value: Annotated[float | None, Field(examples=[250])] = None
    """
    Numeric dose amount per administration.
    """
    unit: Annotated[str | None, Field(examples=['mg'])] = None
    """
    Unit of the dose amount.
    """
    frequency: Frequency | None = None
    """
    How often the medication is administered.
    """
    frequency_text: Annotated[
        str | None, Field(examples=['every 8 hours with food', 'before bedtime'])
    ] = None
    """
    Free-text frequency description when 'other' is selected or additional detail is needed.
    """
    route: Annotated[Route | None, Field(examples=['oral'])] = None
    """
    Route of administration.
    """


class MedicationStatement(BaseModel):
    """
    Represents a record of medication being taken by or administered to a patient, including dosage, frequency, and prescriber information.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    resource_type: Annotated[
        Literal['MedicationStatement'], Field(examples=['MedicationStatement'])
    ]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[
        str,
        Field(
            examples=['med-550e8400-e29b-41d4-a716-446655440000'],
            min_length=1,
            pattern='^[a-zA-Z0-9._-]+$',
        ),
    ]
    """
    Unique identifier for the medication statement record. UUID recommended.
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
    Reference to the patient taking or receiving the medication.
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
    Reference to the encounter during which the medication was prescribed or recorded.
    """
    medication_name: Annotated[str, Field(examples=['Amoxicillin'])]
    """
    Name of the medication.
    """
    medication_code: MedicationCode | None = None
    status: Annotated[Status, Field(examples=['active'])]
    """
    Current status of the medication usage.
    """
    date_started: Annotated[date | None, Field(examples=['2025-06-15'])] = None
    """
    Date when the medication was started.
    """
    date_ended: Annotated[date | None, Field(examples=['2025-06-29'])] = None
    """
    Date when the medication was stopped or completed.
    """
    dosage: Dosage | None = None
    reason: Annotated[str | None, Field(examples=['Bacterial skin infection'])] = None
    """
    Clinical reason or indication for the medication.
    """
    prescriber_id: Annotated[
        str | None,
        Field(examples=['pract-001'], min_length=1, pattern='^[a-zA-Z0-9._-]+$'),
    ] = None
    """
    Reference to the practitioner who prescribed the medication. Must match an id in the top-level practitioners array.
    """
    notes: Annotated[
        str | None,
        Field(
            examples=[
                'Administer with food. Complete full 14-day course even if symptoms improve.'
            ]
        ),
    ] = None
    """
    Additional notes about the medication statement.
    """
