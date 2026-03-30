# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class Contact(BaseModel):
    """
    Contact information for the practitioner.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    phone: Annotated[str | None, Field(examples=['+48 123 456 789'])] = None
    """
    Phone number.
    """
    email: Annotated[EmailStr | None, Field(examples=['anna.nowak@happypaws.pl'])] = (
        None
    )
    """
    Email address.
    """


class Practitioner(BaseModel):
    """
    A veterinary practitioner — a licensed professional involved in patient care. Referenced by encounters, procedures, immunizations, and medication statements.
    """

    model_config = ConfigDict(
        extra='allow',
    )
    resource_type: Annotated[Literal['Practitioner'], Field(examples=['Practitioner'])]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[str, Field(examples=['pract-001'])]
    """
    Unique identifier for the practitioner. UUID recommended.
    """
    name: Annotated[str, Field(examples=['Dr. Anna Nowak'])]
    """
    Full name of the practitioner.
    """
    license_number: Annotated[str | None, Field(examples=['VET-PL-12345'])] = None
    """
    Professional license or registration number issued by the veterinary chamber.
    """
    clinic: Annotated[str | None, Field(examples=['Happy Paws Veterinary Clinic'])] = (
        None
    )
    """
    Name of the veterinary clinic or hospital where the practitioner works.
    """
    specializations: Annotated[
        list[str] | None, Field(examples=[['surgery', 'orthopedics']])
    ] = None
    """
    Areas of specialization (e.g., surgery, dermatology, dentistry).
    """
    contact: Contact | None = None
    """
    Contact information for the practitioner.
    """
