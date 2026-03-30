# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from datetime import date
from enum import Enum
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field


class ClinicalStatus(Enum):
    """
    The clinical status of the condition.
    """

    active = 'active'
    recurrence = 'recurrence'
    relapse = 'relapse'
    inactive = 'inactive'
    remission = 'remission'
    resolved = 'resolved'


class Severity(Enum):
    """
    Subjective assessment of the condition severity.
    """

    mild = 'mild'
    moderate = 'moderate'
    severe = 'severe'


class System(Enum):
    """
    The coding system used.
    """

    icd_10_vet = 'icd-10-vet'
    snomed_ct_vet = 'snomed-ct-vet'
    internal = 'internal'
    other = 'other'


class Code(BaseModel):
    """
    Coded representation of the condition using a standardized veterinary terminology system.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    system: Annotated[System, Field(examples=['icd-10-vet'])]
    """
    The coding system used.
    """
    value: Annotated[str, Field(examples=['K29.0'])]
    """
    The code value within the specified system.
    """
    display: Annotated[str, Field(examples=['Acute gastritis'])]
    """
    Human-readable display text for the code.
    """


class Condition(BaseModel):
    """
    Represents a clinical condition, diagnosis, or health problem identified for a patient.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    resource_type: Annotated[Literal['Condition'], Field(examples=['Condition'])]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[str, Field(examples=['cond-550e8400-e29b-41d4-a716-446655440000'])]
    """
    Unique identifier for the condition record. UUID recommended.
    """
    patient_id: Annotated[str, Field(examples=['550e8400-e29b-41d4-a716-446655440000'])]
    """
    Reference to the patient this condition belongs to.
    """
    encounter_id: Annotated[
        str | None, Field(examples=['a1b2c3d4-e5f6-7890-abcd-ef1234567890'])
    ] = None
    """
    Reference to the encounter during which this condition was diagnosed.
    """
    code: Code | None = None
    name: Annotated[str, Field(examples=['Acute gastritis'])]
    """
    Human-readable name of the diagnosis or condition.
    """
    clinical_status: Annotated[ClinicalStatus, Field(examples=['active'])]
    """
    The clinical status of the condition.
    """
    severity: Annotated[Severity | None, Field(examples=['moderate'])] = None
    """
    Subjective assessment of the condition severity.
    """
    onset_date: Annotated[date | None, Field(examples=['2025-05-01'])] = None
    """
    Estimated or actual date when the condition first appeared.
    """
    abatement_date: Annotated[date | None, Field(examples=['2025-06-15'])] = None
    """
    Date when the condition resolved or went into remission.
    """
    notes: Annotated[
        str | None,
        Field(
            examples=[
                'Likely caused by dietary indiscretion. Owner reports the dog ate garbage.'
            ]
        ),
    ] = None
    """
    Additional clinical notes about the condition.
    """
