# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from datetime import date
from enum import Enum
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field


class Type(Enum):
    """
    Whether this represents a true allergy (immune-mediated) or an intolerance (non-immune).
    """

    allergy = 'allergy'
    intolerance = 'intolerance'


class Category(Enum):
    """
    Category of the causative substance.
    """

    food = 'food'
    medication = 'medication'
    environment = 'environment'
    other = 'other'


class ClinicalStatus(Enum):
    """
    Current clinical status of the allergy or intolerance.
    """

    active = 'active'
    inactive = 'inactive'
    resolved = 'resolved'


class Criticality(Enum):
    """
    Estimate of the potential clinical harm or seriousness of future reactions.
    """

    low = 'low'
    high = 'high'
    unable_to_assess = 'unable-to-assess'


class Severity(Enum):
    """
    Severity of the reaction.
    """

    mild = 'mild'
    moderate = 'moderate'
    severe = 'severe'


class Reaction(BaseModel):
    """
    Details of the adverse reaction caused by the substance.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    manifestation: Annotated[
        str | None, Field(examples=['Urticaria and facial swelling'])
    ] = None
    """
    Clinical manifestation or symptom of the reaction.
    """
    severity: Annotated[Severity | None, Field(examples=['moderate'])] = None
    """
    Severity of the reaction.
    """


class AllergyIntolerance(BaseModel):
    """
    Represents an allergy or intolerance identified for a patient, including the causative substance, reaction details, and clinical status.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    resource_type: Annotated[
        Literal['AllergyIntolerance'], Field(examples=['AllergyIntolerance'])
    ]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[str, Field(examples=['allergy-550e8400-e29b-41d4-a716-446655440000'])]
    """
    Unique identifier for the allergy/intolerance record. UUID recommended.
    """
    patient_id: Annotated[str, Field(examples=['550e8400-e29b-41d4-a716-446655440000'])]
    """
    Reference to the patient who has this allergy or intolerance.
    """
    encounter_id: Annotated[
        str | None, Field(examples=['a1b2c3d4-e5f6-7890-abcd-ef1234567890'])
    ] = None
    """
    Reference to the encounter during which this allergy or intolerance was identified.
    """
    type: Annotated[Type, Field(examples=['allergy'])]
    """
    Whether this represents a true allergy (immune-mediated) or an intolerance (non-immune).
    """
    category: Annotated[Category, Field(examples=['medication'])]
    """
    Category of the causative substance.
    """
    substance: Annotated[str, Field(examples=['Penicillin'])]
    """
    Name of the substance that causes the adverse reaction.
    """
    clinical_status: Annotated[ClinicalStatus, Field(examples=['active'])]
    """
    Current clinical status of the allergy or intolerance.
    """
    criticality: Annotated[Criticality | None, Field(examples=['high'])] = None
    """
    Estimate of the potential clinical harm or seriousness of future reactions.
    """
    onset_date: Annotated[date | None, Field(examples=['2024-03-10'])] = None
    """
    Date when the allergy or intolerance was first identified.
    """
    reaction: Reaction | None = None
    notes: Annotated[
        str | None,
        Field(
            examples=[
                'Confirmed via intradermal skin testing. Avoid all beta-lactam antibiotics.'
            ]
        ),
    ] = None
    """
    Additional notes about the allergy or intolerance.
    """
