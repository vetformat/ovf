# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from enum import Enum
from typing import Annotated, Any, Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field


class Category(Enum):
    """
    The high-level category of the observation.
    """

    vital_signs = 'vital-signs'
    laboratory = 'laboratory'
    imaging = 'imaging'
    clinical_note = 'clinical-note'
    other = 'other'


class ValueType(Enum):
    """
    Hint for the semantic type of the value field. Helps LLMs and parsers interpret the value correctly without type inference. 'quantity' = numeric with unit, 'text' = free text or narrative, 'boolean' = yes/no result, 'ratio' = e.g. titer 1:128, 'range' = value expressed as a range, 'coded' = value from a controlled vocabulary, 'attachment' = reference to external data.
    """

    quantity = 'quantity'
    text = 'text'
    boolean = 'boolean'
    ratio = 'ratio'
    range = 'range'
    coded = 'coded'
    attachment = 'attachment'


class Interpretation(Enum):
    """
    Clinical interpretation of the observation value relative to reference ranges.
    """

    normal = 'normal'
    abnormal = 'abnormal'
    low = 'low'
    high = 'high'
    critical = 'critical'


class Code(BaseModel):
    """
    Coded representation of the observation type using a terminology system.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    system: Annotated[str, Field(examples=['loinc'])]
    """
    The coding system used (e.g., LOINC, SNOMED, internal).
    """
    value: Annotated[str, Field(examples=['2339-0'])]
    """
    The code value within the specified system.
    """
    display: Annotated[str, Field(examples=['Blood Glucose'])]
    """
    Human-readable display text for the code.
    """


class ReferenceRange(BaseModel):
    """
    The normal or expected range for this observation value.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    low: Annotated[float | None, Field(examples=[70])] = None
    """
    Lower bound of the reference range.
    """
    high: Annotated[float | None, Field(examples=[140])] = None
    """
    Upper bound of the reference range.
    """
    text: Annotated[str | None, Field(examples=['70-140 mg/dL'])] = None
    """
    Human-readable description of the reference range.
    """


class Observation(BaseModel):
    """
    Represents a clinical observation or measurement for a patient, including vital signs, lab results, imaging findings, and clinical notes.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    resource_type: Annotated[Literal['Observation'], Field(examples=['Observation'])]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[str, Field(examples=['obs-550e8400-e29b-41d4-a716-446655440000'])]
    """
    Unique identifier for the observation record. UUID recommended.
    """
    patient_id: Annotated[str, Field(examples=['550e8400-e29b-41d4-a716-446655440000'])]
    """
    Reference to the patient this observation belongs to.
    """
    encounter_id: Annotated[
        str | None, Field(examples=['a1b2c3d4-e5f6-7890-abcd-ef1234567890'])
    ] = None
    """
    Reference to the encounter during which this observation was recorded.
    """
    category: Annotated[Category, Field(examples=['laboratory'])]
    """
    The high-level category of the observation.
    """
    code: Code | None = None
    name: Annotated[str, Field(examples=['Blood Glucose'])]
    """
    Human-readable name of the observation.
    """
    effective_date: Annotated[AwareDatetime, Field(examples=['2025-06-15T10:45:00Z'])]
    """
    Date and time when the observation was clinically effective or measured.
    """
    value: Annotated[
        float | str | bool | dict[str, Any] | None,
        Field(examples=[95.5, 'Positive', True]),
    ] = None
    """
    The observed value. Can be a number, string, boolean, or structured object depending on the observation type.
    """
    value_type: Annotated[ValueType | None, Field(examples=['quantity'])] = None
    """
    Hint for the semantic type of the value field. Helps LLMs and parsers interpret the value correctly without type inference. 'quantity' = numeric with unit, 'text' = free text or narrative, 'boolean' = yes/no result, 'ratio' = e.g. titer 1:128, 'range' = value expressed as a range, 'coded' = value from a controlled vocabulary, 'attachment' = reference to external data.
    """
    unit: Annotated[str | None, Field(examples=['mg/dL'])] = None
    """
    Unit of measurement for the observed value.
    """
    reference_range: ReferenceRange | None = None
    interpretation: Annotated[Interpretation | None, Field(examples=['normal'])] = None
    """
    Clinical interpretation of the observation value relative to reference ranges.
    """
    notes: Annotated[
        str | None, Field(examples=['Fasting sample collected at 8:00 AM.'])
    ] = None
    """
    Additional notes or context about the observation.
    """
