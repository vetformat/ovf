# This file was automatically generated from the OVF JSON Schema.
# DO NOT MODIFY IT BY HAND. Instead, modify the source schema and
# run `npm run generate:python` to regenerate.

from __future__ import annotations

from enum import Enum
from typing import Annotated, Literal

from pydantic import AnyUrl, AwareDatetime, BaseModel, ConfigDict, Field


class Type(Enum):
    """
    The category or type of document.
    """

    lab_report = 'lab-report'
    imaging = 'imaging'
    discharge_summary = 'discharge-summary'
    referral = 'referral'
    consent = 'consent'
    invoice = 'invoice'
    other = 'other'


class Author(BaseModel):
    """
    The person who authored or created the document.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    name: Annotated[str | None, Field(examples=['Dr. Anna Nowak'])] = None
    """
    Full name of the document author.
    """


class DocumentReference(BaseModel):
    """
    Represents a reference to a clinical document or file associated with a patient, such as lab reports, imaging studies, discharge summaries, or invoices.
    """

    model_config = ConfigDict(
        extra='forbid',
    )
    resource_type: Annotated[
        Literal['DocumentReference'], Field(examples=['DocumentReference'])
    ]
    """
    Fixed resource type identifier for this schema.
    """
    id: Annotated[
        str,
        Field(
            examples=['doc-550e8400-e29b-41d4-a716-446655440000'],
            min_length=1,
            pattern='^[a-zA-Z0-9._-]+$',
        ),
    ]
    """
    Unique identifier for the document reference record. UUID recommended.
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
    Reference to the patient this document is associated with.
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
    Reference to the encounter during which this document was created or obtained.
    """
    type: Annotated[Type, Field(examples=['lab-report'])]
    """
    The category or type of document.
    """
    description: Annotated[
        str | None,
        Field(examples=['Complete blood count results from annual wellness exam']),
    ] = None
    """
    Human-readable description of the document.
    """
    date: Annotated[AwareDatetime, Field(examples=['2025-06-15T11:00:00Z'])]
    """
    Date and time the document was created or obtained.
    """
    content_type: Annotated[str | None, Field(examples=['application/pdf'])] = None
    """
    MIME type of the document content.
    """
    url: Annotated[
        AnyUrl | None,
        Field(examples=['https://example.com/documents/cbc-report-2025-06-15.pdf']),
    ] = None
    """
    URL where the document can be retrieved.
    """
    data: Annotated[
        str | None, Field(examples=['JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKExhYiBS...'])
    ] = None
    """
    Base64-encoded content of the document. Use for inline embedding of small documents.
    """
    size_bytes: Annotated[int | None, Field(examples=[524288])] = None
    """
    Size of the document content in bytes.
    """
    hash: Annotated[
        str | None,
        Field(
            examples=[
                'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
            ]
        ),
    ] = None
    """
    SHA-256 hash of the document content for integrity verification.
    """
    author: Author | None = None
    notes: Annotated[
        str | None,
        Field(examples=['Results reviewed and discussed with owner on 2025-06-16.']),
    ] = None
    """
    Additional notes about the document.
    """
