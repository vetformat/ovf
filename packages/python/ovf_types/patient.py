# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from datetime import date
from enum import Enum
from typing import Annotated, Literal

from pydantic import AnyUrl, BaseModel, ConfigDict, Field


class Species(Enum):
    """
    The animal species of the patient.
    """

    dog = 'dog'
    cat = 'cat'
    bird = 'bird'
    rabbit = 'rabbit'
    hamster = 'hamster'
    guinea_pig = 'guinea_pig'
    fish = 'fish'
    reptile = 'reptile'
    horse = 'horse'
    other = 'other'


class Sex(Enum):
    """
    Biological sex of the patient.
    """

    male = 'male'
    female = 'female'
    unknown = 'unknown'


class GenderStatus(Enum):
    """
    Reproductive status of the patient.
    """

    intact = 'intact'
    neutered = 'neutered'
    spayed = 'spayed'
    unknown = 'unknown'


class System(Enum):
    """
    The breed registry system used for classification.
    """

    fci = 'fci'
    fife = 'fife'
    tica = 'tica'
    other = 'other'


class BreedCode(BaseModel):
    """
    Standardized breed classification code from a recognized registry.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    system: Annotated[System, Field(examples=['fci'])]
    """
    The breed registry system used for classification.
    """
    value: Annotated[str, Field(examples=['166'])]
    """
    The breed code value within the specified registry system.
    """


class System1(Enum):
    """
    The taxonomy system used for species classification.
    """

    itis = 'itis'
    ncbi_taxonomy = 'ncbi-taxonomy'
    other = 'other'


class SpeciesCode(BaseModel):
    """
    Standardized species classification code from a recognized taxonomy.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    system: Annotated[System1, Field(examples=['itis'])]
    """
    The taxonomy system used for species classification.
    """
    value: Annotated[str, Field(examples=['180092'])]
    """
    The species code within the specified taxonomy system.
    """


class Unit(Enum):
    """
    Unit of weight measurement.
    """

    kg = 'kg'
    lbs = 'lbs'


class Weight(BaseModel):
    """
    The patient's body weight measurement.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    value: Annotated[float, Field(examples=[12.5], ge=0.0)]
    """
    Numeric weight value. Must be zero or positive.
    """
    unit: Annotated[Unit, Field(examples=['kg'])]
    """
    Unit of weight measurement.
    """


class System2(Enum):
    """
    The identification system or namespace.
    """

    iso_microchip_11784 = 'iso-microchip-11784'
    eu_pet_passport = 'eu-pet-passport'
    safe_animal = 'safe-animal'
    europetnet = 'europetnet'
    national_registry = 'national-registry'
    other = 'other'


class Identifier(BaseModel):
    """
    An external identifier for the patient, such as a microchip or passport number.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    system: Annotated[System2, Field(examples=['iso-microchip-11784'])]
    """
    The identification system or namespace.
    """
    value: Annotated[str, Field(examples=['941000024680135'])]
    """
    The identifier value within the specified system.
    """


class Owner(BaseModel):
    """
    Contact information for the patient's owner or guardian.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    name: Annotated[str | None, Field(examples=['Jan Kowalski'])] = None
    """
    Full name of the owner.
    """
    phone: Annotated[str | None, Field(examples=['+48 600 123 456'])] = None
    """
    Phone number of the owner.
    """
    email: Annotated[str | None, Field(examples=['jan.kowalski@example.com'])] = None
    """
    Email address of the owner.
    """
    address: Annotated[
        str | None, Field(examples=['ul. Zwierzyniecka 10, 31-015 Krakow, Poland'])
    ] = None
    """
    Postal address of the owner.
    """


class Patient(BaseModel):
    """
    Represents an animal patient in a veterinary practice. Contains demographic, identification, and owner information.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    resource_type: Annotated[Literal['Patient'], Field(examples=['Patient'])]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[str, Field(examples=['550e8400-e29b-41d4-a716-446655440000'])]
    """
    Unique identifier for the patient record. UUID recommended.
    """
    name: Annotated[str, Field(examples=['Burek'])]
    """
    The pet's given name.
    """
    species: Annotated[Species, Field(examples=['dog'])]
    """
    The animal species of the patient.
    """
    breed: Annotated[str | None, Field(examples=['Labrador Retriever'])] = None
    """
    Breed or breed mix of the patient in free-text form.
    """
    breed_code: BreedCode | None = None
    species_code: SpeciesCode | None = None
    date_of_birth: Annotated[date | None, Field(examples=['2020-03-15'])] = None
    """
    The patient's date of birth in ISO 8601 format.
    """
    sex: Annotated[Sex | None, Field(examples=['male'])] = None
    """
    Biological sex of the patient.
    """
    gender_status: Annotated[GenderStatus | None, Field(examples=['neutered'])] = None
    """
    Reproductive status of the patient.
    """
    color: Annotated[str | None, Field(examples=['golden'])] = None
    """
    Coat or skin color description of the patient.
    """
    weight: Weight | None = None
    identifiers: Annotated[
        list[Identifier] | None,
        Field(
            examples=[[{'system': 'iso-microchip-11784', 'value': '941000024680135'}]]
        ),
    ] = None
    """
    External identifiers such as microchip numbers or passport IDs.
    """
    owner: Owner | None = None
    is_active: Annotated[bool | None, Field(examples=[True])] = True
    """
    Whether this patient record is currently active in the practice.
    """
    is_deceased: Annotated[bool | None, Field(examples=[False])] = False
    """
    Whether the patient is deceased.
    """
    deceased_date: Annotated[date | None, Field(examples=['2025-12-01'])] = None
    """
    Date of death in ISO 8601 format, if applicable.
    """
    notes: Annotated[
        str | None,
        Field(
            examples=[
                'Friendly but nervous during examinations. Prefers treats as positive reinforcement.'
            ]
        ),
    ] = None
    """
    Free-text notes about the patient.
    """
    photo_url: Annotated[
        AnyUrl | None, Field(examples=['https://example.com/photos/burek.jpg'])
    ] = None
    """
    URL to a photo of the patient.
    """
