# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from datetime import date
from enum import Enum
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field


class Route(Enum):
    """
    Route of administration for the vaccine.
    """

    intramuscular = 'intramuscular'
    subcutaneous = 'subcutaneous'
    oral = 'oral'
    intranasal = 'intranasal'
    other = 'other'


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


class VaccineCode(BaseModel):
    """
    Coded representation of the vaccine product.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    system: Annotated[str, Field(examples=['atc-vet'])]
    """
    The coding system for the vaccine (e.g., ATC-vet, CVX, internal).
    """
    value: Annotated[str, Field(examples=['QI07AA01'])]
    """
    The vaccine code within the specified system.
    """


class DoseQuantity(BaseModel):
    """
    The dosage amount administered.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    value: Annotated[float, Field(examples=[1.0])]
    """
    Numeric dose value.
    """
    unit: Annotated[str, Field(examples=['mL'])]
    """
    Unit of the dose (e.g., mL, dose).
    """


class Immunization(BaseModel):
    """
    Represents a vaccination event for an animal patient, including vaccine details, dosage, and scheduling information.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    resource_type: Annotated[Literal['Immunization'], Field(examples=['Immunization'])]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[
        str,
        Field(
            examples=['imm-550e8400-e29b-41d4-a716-446655440000'],
            min_length=1,
            pattern='^[a-zA-Z0-9._-]+$',
        ),
    ]
    """
    Unique identifier for the immunization record. UUID recommended.
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
    Reference to the patient who received the vaccination.
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
    Reference to the encounter during which the vaccination was administered.
    """
    vaccine_name: Annotated[str, Field(examples=['Nobivac DHPPi'])]
    """
    Name of the vaccine product administered.
    """
    vaccine_code: VaccineCode | None = None
    occurrence_date: Annotated[date, Field(examples=['2025-06-15'])]
    """
    Date the vaccination was administered in ISO 8601 format.
    """
    expiration_date: Annotated[date | None, Field(examples=['2026-06-15'])] = None
    """
    Date when the vaccine protection is expected to expire.
    """
    next_dose_date: Annotated[date | None, Field(examples=['2025-07-15'])] = None
    """
    Recommended date for the next booster or dose.
    """
    lot_number: Annotated[str | None, Field(examples=['A123B456'])] = None
    """
    Manufacturer lot or batch number of the vaccine.
    """
    manufacturer: Annotated[str | None, Field(examples=['MSD Animal Health'])] = None
    """
    Name of the vaccine manufacturer.
    """
    route: Annotated[Route | None, Field(examples=['subcutaneous'])] = None
    """
    Route of administration for the vaccine.
    """
    site: Annotated[str | None, Field(examples=['Right shoulder'])] = None
    """
    Anatomical site where the vaccine was administered.
    """
    dose_quantity: DoseQuantity | None = None
    practitioner_id: Annotated[
        str | None,
        Field(examples=['pract-001'], min_length=1, pattern='^[a-zA-Z0-9._-]+$'),
    ] = None
    """
    Reference to the practitioner who administered the vaccination. Must match an id in the top-level practitioners array.
    """
    is_primary_course: Annotated[bool | None, Field(examples=[True])] = None
    """
    Whether this vaccination is part of the initial primary immunization course rather than a booster.
    """
    notes: Annotated[
        str | None,
        Field(
            examples=[
                'No adverse reactions observed during 15-minute post-vaccination monitoring.'
            ]
        ),
    ] = None
    """
    Additional notes about the vaccination event.
    """
    cost: Cost | None = None
